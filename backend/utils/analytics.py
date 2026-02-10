import logging
from datetime import datetime
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


def aggregate_summary(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
    total = len(transactions)
    safe = sum(1 for t in transactions if t.get("decision") == "SAFE")
    blocked = sum(1 for t in transactions if t.get("decision") == "BLOCK")
    challenge = sum(1 for t in transactions if t.get("decision") in {"CHALLENGE", "CAUTION"})
    total_amount_at_risk = sum(float(t.get("amount", 0)) for t in transactions if t.get("decision") != "SAFE")
    return {
        "total": total,
        "safe": safe,
        "blocked": blocked,
        "challenge": challenge,
        "total_amount_at_risk": total_amount_at_risk,
    }


def risk_distribution(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
    dist = {"safe": 0, "caution": 0, "block": 0}
    for t in transactions:
        if t.get("decision") == "SAFE":
            dist["safe"] += 1
        elif t.get("decision") in {"CHALLENGE", "CAUTION"}:
            dist["caution"] += 1
        else:
            dist["block"] += 1
    return dist


def current_status(transactions_today: List[Dict[str, Any]]) -> Dict[str, Any]:
    return {
        "total_transactions_today": len(transactions_today),
        "fraud_blocked_today": sum(1 for t in transactions_today if t.get("decision") == "BLOCK"),
        "amount_saved_today": sum(float(t.get("amount", 0)) for t in transactions_today if t.get("decision") == "BLOCK"),
        "current_risk_level": "moderate",
        "recent_transactions": transactions_today[-5:],
        "risk_distribution": risk_distribution(transactions_today),
    }
