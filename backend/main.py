import json
import logging
import os
import time
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import joblib
import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from fastapi import Depends
from supabase import Client, create_client

# -----------------------------------------------------------------------------
# Environment & config
# -----------------------------------------------------------------------------
load_dotenv()

API_VERSION = "2.0.0"
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
API_PORT = int(os.getenv("API_PORT", "8000"))

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("guardianshield")

supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Supabase client initialized")
    except Exception as exc:  # noqa: BLE001
        logger.error("Supabase init failed: %s", exc)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
FRAUD_MODEL_PATH = os.path.join(MODELS_DIR, "fraud_model.pkl")
ANOMALY_MODEL_PATH = os.path.join(MODELS_DIR, "anomaly_model.pkl")
METADATA_PATH = os.path.join(MODELS_DIR, "model_metadata.json")

fraud_model = None
anomaly_model = None
model_metadata: Dict[str, Any] = {
    "version": "unknown",
    "training_date": None,
    "accuracy": None,
    "precision": None,
    "recall": None,
}

try:
    fraud_model = joblib.load(FRAUD_MODEL_PATH)
    logger.info("Fraud model loaded from %s", FRAUD_MODEL_PATH)
except Exception as exc:  # noqa: BLE001
    logger.warning("Fraud model missing, fallback to heuristic: %s", exc)

try:
    anomaly_model = joblib.load(ANOMALY_MODEL_PATH)
    logger.info("Anomaly model loaded from %s", ANOMALY_MODEL_PATH)
except Exception as exc:  # noqa: BLE001
    logger.warning("Anomaly model missing: %s", exc)

try:
    with open(METADATA_PATH, "r", encoding="utf-8") as f:
        model_metadata = json.load(f)
except Exception:
    logger.warning("Model metadata not found; using defaults")

# -----------------------------------------------------------------------------
# FastAPI app
# -----------------------------------------------------------------------------
app = FastAPI(title="GuardianShield API", version=API_VERSION)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------------------------------------------------
# Models
# -----------------------------------------------------------------------------
class TransactionRequest(BaseModel):
    user_id: str
    amount: float
    merchant: str
    time_hour: int = Field(ge=0, le=23)
    phone_activity: bool


class PredictionResponse(BaseModel):
    risk_score: int
    decision: str
    reasons: List[str]
    fraud_probability: float
    amount_deviation: float
    adjustments: List[str]
    processing_time_ms: int


# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------

baseline_cache: Dict[str, Dict[str, Any]] = {}
CACHE_TTL_SECONDS = 300


def get_verified_merchants() -> Dict[str, List[str]]:
    return {
        "healthcare": ["apollo hospital", "max hospital", "fortis", "manipal hospital", "hospital"],
        "education": ["university", "college", "school", "iit", "nit"],
    }


def merchant_in_verified(merchant: str) -> bool:
    m = merchant.lower()
    vm = get_verified_merchants()
    return any(v in m for v in vm["healthcare"] + vm["education"])


def merchant_in_category(merchant: str, category: str) -> bool:
    m = merchant.lower()
    return any(v in m for v in get_verified_merchants().get(category, []))


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


async def get_user_baseline(user_id: str) -> Dict[str, Any]:
    now = datetime.utcnow()
    cached = baseline_cache.get(user_id)
    if cached and (now - cached["ts"]).total_seconds() < CACHE_TTL_SECONDS:
        return cached["data"]

    default = {
        "user_id": user_id,
        "avg_amount": 2500.0,
        "std_amount": 1200.0,
        "avg_time": 14,
        "total_transactions": 67,
        "common_merchants": ["swiggy", "amazon", "bigbasket", "zara", "flipkart"],
        "last_updated": now.isoformat() + "Z",
    }

    if not supabase:
        baseline_cache[user_id] = {"data": default, "ts": now}
        return default

    try:
        res = supabase.table("user_baselines").select("*").eq("user_id", user_id).limit(1).execute()
        data = (res.data or [])
        if data:
            baseline = data[0]
            baseline_cache[user_id] = {"data": baseline, "ts": now}
            return baseline
    except Exception as exc:  # noqa: BLE001
        logger.error("Baseline fetch failed: %s", exc)

    baseline_cache[user_id] = {"data": default, "ts": now}
    return default


def extract_features(tx: TransactionRequest, baseline: Dict[str, Any]) -> Dict[str, Any]:
    avg = float(baseline.get("avg_amount", 1.0))
    std = float(baseline.get("std_amount", 1.0)) or 1.0
    amount_deviation = (tx.amount - avg) / std
    time_deviation = abs(tx.time_hour - int(baseline.get("avg_time", 14)))
    is_unusual_time = int(tx.time_hour < 6 or tx.time_hour > 22)
    common_merchants = [m.lower() for m in baseline.get("common_merchants", [])]
    is_new_merchant = int(tx.merchant.lower() not in common_merchants)

    v_features = np.zeros(23, dtype=float)
    features = np.array([
        tx.amount,
        amount_deviation,
        is_unusual_time,
        time_deviation,
        is_new_merchant,
        int(tx.phone_activity),
        *v_features,
    ], dtype=float).reshape(1, -1)

    return {
        "array": features,
        "amount_deviation": amount_deviation,
        "is_unusual_time": bool(is_unusual_time),
        "is_new_merchant": bool(is_new_merchant),
        "time_deviation": time_deviation,
    }


def generate_reasons(features: Dict[str, Any], tx: TransactionRequest) -> List[str]:
    reasons: List[str] = []
    amt_dev = features["amount_deviation"]
    if tx.phone_activity:
        reasons.append("Phone call detected recently - possible social engineering")
    if amt_dev > 50:
        reasons.append(f"Amount {int(amt_dev)}x above your 30-day baseline")
    elif amt_dev > 10:
        reasons.append(f"Amount {int(amt_dev * 100)}% above your 30-day baseline")
    if features["is_unusual_time"]:
        meridiem = "AM" if tx.time_hour < 12 else "PM"
        reasons.append(f"Unusual transaction time ({tx.time_hour}:00 {meridiem} - outside your active hours)")
    if features["is_new_merchant"]:
        reasons.append("New merchant you've never used before")
    return reasons


def generate_adjustments(features: Dict[str, Any], tx: TransactionRequest, baseline: Dict[str, Any]) -> List[str]:
    adjustments: List[str] = []
    merchant_lower = tx.merchant.lower()
    common_merchants = [m.lower() for m in baseline.get("common_merchants", [])]
    if merchant_lower in common_merchants:
        adjustments.append("Merchant in your trusted list (-20 points)")
    if merchant_in_category(merchant_lower, "healthcare"):
        adjustments.append("Verified healthcare provider (-15 points)")
    if merchant_in_category(merchant_lower, "education"):
        adjustments.append("Verified education institution (-10 points)")
    if not tx.phone_activity and features["amount_deviation"] > 0.4:
        adjustments.append("No phone scam signals detected")
    if not features["is_unusual_time"]:
        adjustments.append("Normal transaction time")
    return adjustments


def determine_decision(risk_score: int, merchant: str, baseline: Dict[str, Any]) -> str:
    merchant_lower = merchant.lower()
    common_merchants = [m.lower() for m in baseline.get("common_merchants", [])]
    verified = merchant_in_verified(merchant_lower)
    if risk_score >= 90:
        return "BLOCK"
    if risk_score >= 71:
        return "CHALLENGE" if verified else "BLOCK"
    if risk_score >= 41:
        return "SAFE" if merchant_lower in common_merchants else "CAUTION"
    return "SAFE"


def calculate_risk_score(fraud_prob: float, tx: TransactionRequest, features: Dict[str, Any], baseline: Dict[str, Any]):
    adjustments: List[str] = []
    risk_score = fraud_prob * 100
    # penalties
    if tx.phone_activity:
        risk_score += 20
    if features["is_unusual_time"]:
        risk_score += 10
    if features["is_new_merchant"]:
        risk_score += 8
    # reductions
    if merchant_in_category(tx.merchant, "healthcare"):
        risk_score -= 15
        adjustments.append("Verified healthcare provider (-15 points)")
    if merchant_in_category(tx.merchant, "education"):
        risk_score -= 10
        adjustments.append("Verified education institution (-10 points)")
    common_merchants = [m.lower() for m in baseline.get("common_merchants", [])]
    if tx.merchant.lower() in common_merchants:
        risk_score -= 20
        adjustments.append("Merchant in your trusted list (-20 points)")
    if not tx.phone_activity and risk_score > 40:
        adjustments.append("No phone scam signals detected")
    if not features["is_unusual_time"]:
        adjustments.append("Normal transaction time")

    risk_score = int(round(clamp(risk_score, 0, 100)))
    decision = determine_decision(risk_score, tx.merchant, baseline)
    return risk_score, decision, adjustments


def infer(tx: TransactionRequest, baseline: Dict[str, Any]):
    features = extract_features(tx, baseline)
    fraud_prob = 0.2
    if fraud_model is not None:
        try:
            fraud_prob = float(fraud_model.predict_proba(features["array"])[0][1])
        except Exception as exc:  # noqa: BLE001
            logger.error("Model inference failed: %s", exc)
    risk_score, decision, adjustments = calculate_risk_score(fraud_prob, tx, features, baseline)
    reasons = generate_reasons(features, tx)
    if risk_score <= 20 and not reasons:
        reasons = []
    result = {
        "risk_score": risk_score,
        "decision": decision,
        "reasons": reasons,
        "fraud_probability": round(fraud_prob, 4),
        "amount_deviation": round(features["amount_deviation"], 2),
        "adjustments": adjustments,
    }
    return result


async def log_transaction(tx: TransactionRequest, prediction: Dict[str, Any]) -> None:
    if not supabase:
        return
    try:
        record = {
            "user_id": tx.user_id,
            "amount": tx.amount,
            "merchant": tx.merchant,
            "time_hour": tx.time_hour,
            "risk_score": prediction["risk_score"],
            "decision": prediction["decision"],
            "fraud_probability": prediction["fraud_probability"],
            "phone_activity": tx.phone_activity,
            "reasons": prediction.get("reasons", []),
            "adjustments": prediction.get("adjustments", []),
            "created_at": datetime.utcnow().isoformat() + "Z",
        }
        supabase.table("transactions").insert(record).execute()
    except Exception as exc:  # noqa: BLE001
        logger.error("Transaction log failed: %s", exc)


# -----------------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------------
@app.get("/")
async def root():
    return {
        "status": "GuardianShield API Running",
        "version": API_VERSION,
        "model_loaded": fraud_model is not None,
        "database_connected": supabase is not None,
    }


@app.post("/api/predict", response_model=PredictionResponse)
async def predict(payload: TransactionRequest):
    start = time.time()
    baseline = await get_user_baseline(payload.user_id)
    prediction = infer(payload, baseline)
    processing_time_ms = int((time.time() - start) * 1000)
    prediction["processing_time_ms"] = processing_time_ms
    await log_transaction(payload, prediction)
    return prediction


@app.get("/api/analytics/dashboard")
async def analytics_dashboard():
    try:
        if supabase:
            today = datetime.utcnow().date()
            yesterday = today - timedelta(days=1)
            today_res = supabase.table("transactions").select("amount, decision, created_at, risk_score").gte("created_at", today.isoformat()).execute()
            yesterday_res = supabase.table("transactions").select("amount, decision, created_at, risk_score").gte("created_at", yesterday.isoformat()).lt("created_at", today.isoformat()).execute()
            today_rows = today_res.data or []
            yesterday_rows = yesterday_res.data or []
            def count_decision(rows, name):
                return sum(1 for r in rows if r.get("decision") == name)
            total_today = len(today_rows)
            total_yesterday = len(yesterday_rows) or 1
            amount_saved = sum(float(r.get("amount", 0)) for r in today_rows if r.get("decision") == "BLOCK")
            amount_saved_y = sum(float(r.get("amount", 0)) for r in yesterday_rows if r.get("decision") == "BLOCK") or 1
            fraud_blocked = count_decision(today_rows, "BLOCK")
            fraud_blocked_y = count_decision(yesterday_rows, "BLOCK") or 1
            success_rate = (count_decision(today_rows, "SAFE") / total_today * 100) if total_today else 0
            def pct(cur, prev):
                return round(((cur - prev) / prev) * 100, 1) if prev else 0
            risk_trend = []
            for i in range(7):
                day = today - timedelta(days=6 - i)
                res = supabase.table("transactions").select("risk_score, created_at").gte("created_at", day.isoformat()).lt("created_at", (day + timedelta(days=1)).isoformat()).execute()
                rows = res.data or []
                avg = round(sum(r.get("risk_score", 0) for r in rows) / len(rows), 2) if rows else 0
                risk_trend.append({"date": day.isoformat(), "avg_risk": avg})
            hourly_res = supabase.rpc("hourly_volume", {}).execute() if hasattr(supabase, "rpc") else None
            hourly = hourly_res.data if hourly_res and hourly_res.data else []
            if not hourly:
                hourly = [{"hour": f"{h}:00", "count": sum(1 for r in today_rows if r.get("created_at", "")[11:13] == str(h).zfill(2))} for h in range(8, 20)]
            decisions = {
                "SAFE": count_decision(today_rows, "SAFE"),
                "CAUTION": count_decision(today_rows, "CAUTION"),
                "CHALLENGE": count_decision(today_rows, "CHALLENGE"),
                "BLOCK": count_decision(today_rows, "BLOCK"),
            }
            return {
                "total_transactions": total_today,
                "total_transactions_change": pct(total_today, total_yesterday),
                "fraud_blocked": fraud_blocked,
                "fraud_blocked_change": pct(fraud_blocked, fraud_blocked_y),
                "amount_saved": round(amount_saved),
                "amount_saved_change": pct(amount_saved, amount_saved_y),
                "success_rate": round(success_rate, 1),
                "success_rate_change": pct(success_rate, 1),
                "risk_trend_7days": risk_trend,
                "transaction_volume_hourly": hourly,
                "decision_distribution": decisions,
            }
    except Exception as exc:  # noqa: BLE001
        logger.error("Analytics dashboard failed: %s", exc)

    # Fallback demo data
    return {
        "total_transactions": 1523,
        "total_transactions_change": 12,
        "fraud_blocked": 87,
        "fraud_blocked_change": -3,
        "amount_saved": 4230000,
        "amount_saved_change": 15,
        "success_rate": 94.3,
        "success_rate_change": 2,
        "risk_trend_7days": [
            {"date": (datetime.utcnow().date() - timedelta(days=i)).isoformat(), "avg_risk": v}
            for i, v in enumerate([26, 29, 27, 31, 25, 28, 23][::-1])
        ],
        "transaction_volume_hourly": [
            {"hour": h, "count": c}
            for h, c in zip(
                ["8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"],
                [105,122,98,135,88,76,12,45,67,89,124,156],
            )
        ],
        "decision_distribution": {"SAFE": 1289, "CAUTION": 98, "CHALLENGE": 49, "BLOCK": 87},
    }


@app.get("/api/transactions")
async def recent_transactions(user_id: Optional[str] = None, limit: int = 10):
    if limit <= 0:
        raise HTTPException(status_code=400, detail="limit must be positive")
    if supabase:
        try:
            query = supabase.table("transactions").select("*").order("created_at", desc=True).limit(limit)
            if user_id:
                query = query.eq("user_id", user_id)
            res = query.execute()
            return {"transactions": res.data or [], "total": len(res.data or [])}
        except Exception as exc:  # noqa: BLE001
            logger.error("Transactions fetch failed: %s", exc)
    return {"transactions": [], "total": 0}


@app.get("/api/user/{user_id}/baseline")
async def user_baseline(user_id: str):
    baseline = await get_user_baseline(user_id)
    return baseline


@app.get("/api/analytics/stats")
async def analytics_stats():
    try:
        if supabase:
            today = datetime.utcnow().date()
            yesterday = today - timedelta(days=1)
            week_ago = today - timedelta(days=7)
            def count_range(start: datetime.date, end: datetime.date):
                res = supabase.table("transactions").select("decision, created_at").gte("created_at", start.isoformat()).lt("created_at", end.isoformat()).execute()
                rows = res.data or []
                def cnt(name):
                    return sum(1 for r in rows if r.get("decision") == name)
                return {
                    "total": len(rows),
                    "safe": cnt("SAFE"),
                    "blocked": cnt("BLOCK"),
                    "challenge": cnt("CHALLENGE"),
                    "caution": cnt("CAUTION"),
                }
            return {
                "today": count_range(today, today + timedelta(days=1)),
                "yesterday": count_range(yesterday, today),
                "week": count_range(week_ago, today + timedelta(days=1)),
            }
    except Exception as exc:  # noqa: BLE001
        logger.error("Analytics stats failed: %s", exc)

    return {
        "today": {"total": 156, "safe": 132, "blocked": 12, "challenge": 8, "caution": 4},
        "yesterday": {"total": 142, "safe": 120, "blocked": 14, "challenge": 6, "caution": 2},
        "week": {"total": 1523, "safe": 1289, "blocked": 87, "challenge": 98, "caution": 49},
    }


if __name__ == "__main__":
    import uvicorn

    logger.info("GuardianShield Backend Running on port %s", API_PORT)
    uvicorn.run("main:app", host="0.0.0.0", port=API_PORT, reload=True)

