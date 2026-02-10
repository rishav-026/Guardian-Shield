import json
import logging
from pathlib import Path
import time

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)

FEATURE_ORDER = [
    "amount",
    "amount_deviation",
    "is_unusual_time",
    "time_deviation",
    "is_new_merchant",
    "phone_activity",
] + [f"V{i}" for i in range(1, 24)]


def generate_synthetic_data(n_samples: int = 10_000, fraud_ratio: float = 0.05) -> pd.DataFrame:
    """Generate synthetic transaction data with class imbalance."""
    n_fraud = int(n_samples * fraud_ratio)
    n_normal = n_samples - n_fraud

    base_merchants = [
        "swiggy",
        "amazon",
        "bigbasket",
        "zara",
        "flipkart",
        "uber",
        "ola",
        "zomato",
    ]
    risky_merchants = [
        "kyc update services",
        "lottery claims",
        "crypto quick",
        "random recharge",
        "unknown vendor",
        "overnight gains",
    ]
    healthcare_merchants = ["apollo hospital", "max hospital", "fortis", "manipal hospital"]
    education_merchants = ["university", "college", "school", "iit", "nit"]
    merchant_pool = base_merchants + healthcare_merchants + education_merchants + risky_merchants

    baseline_amount = 2500.0
    baseline_time = 14

    rows = []
    for is_fraud in [0] * n_normal + [1] * n_fraud:
        if is_fraud:
            amount = np.random.lognormal(mean=np.log(baseline_amount * 6), sigma=0.7)
            time_hour = int(np.clip(np.random.normal(loc=2, scale=3), 0, 23))
            merchant = np.random.choice(risky_merchants)
            phone_activity = np.random.rand() < 0.55
        else:
            amount = np.random.lognormal(mean=np.log(baseline_amount), sigma=0.5)
            time_hour = int(np.clip(np.random.normal(loc=baseline_time, scale=3), 0, 23))
            merchant = np.random.choice(merchant_pool)
            phone_activity = np.random.rand() < 0.08

        amount_deviation = amount / baseline_amount
        time_deviation = abs(time_hour - baseline_time)
        is_unusual_time = int(time_hour < 6 or time_hour > 22)
        is_new_merchant = int(merchant not in base_merchants + healthcare_merchants + education_merchants)

        # Generate 23 random features (V1-V23) with slight correlations
        v_features = np.random.normal(loc=0.0, scale=1.0, size=23)
        v_features[:3] += 0.3 * amount_deviation  # tie some to amount deviation
        v_features[3:6] += 0.2 * is_unusual_time
        v_features[6:9] += 0.2 * is_new_merchant
        v_features[9:12] += 0.15 * phone_activity

        row = [
            amount,
            amount_deviation,
            is_unusual_time,
            time_deviation,
            is_new_merchant,
            int(phone_activity),
            *v_features.tolist(),
            is_fraud,
        ]
        rows.append(row)

    columns = FEATURE_ORDER + ["label"]
    df = pd.DataFrame(rows, columns=columns)
    return df


def train_models():
    logging.info("Generating synthetic data...")
    df = generate_synthetic_data()
    X = df[FEATURE_ORDER]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=RANDOM_STATE
    )

    logging.info("Training XGBoost classifier...")
    xgb = XGBClassifier(
        max_depth=4,
        n_estimators=100,
        learning_rate=0.1,
        subsample=0.9,
        colsample_bytree=0.9,
        scale_pos_weight=19,
        random_state=RANDOM_STATE,
        eval_metric="logloss",
    )
    xgb.fit(X_train, y_train)

    logging.info("Evaluating classifier...")
    y_pred = xgb.predict(X_test)
    y_proba = xgb.predict_proba(X_test)[:, 1]
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    roc = roc_auc_score(y_test, y_proba)
    logging.info(
        "Accuracy: %.4f | Precision: %.4f | Recall: %.4f | F1: %.4f | ROC-AUC: %.4f",
        acc,
        prec,
        rec,
        f1,
        roc,
    )

    logging.info("Training Isolation Forest on normal data...")
    normal_data = df[df["label"] == 0][FEATURE_ORDER]
    iso = IsolationForest(
        n_estimators=200,
        contamination=0.05,
        random_state=RANDOM_STATE,
    )
    iso.fit(normal_data)

    models_dir = Path(__file__).parent / "models"
    models_dir.mkdir(parents=True, exist_ok=True)

    fraud_model_path = models_dir / "fraud_model.pkl"
    anomaly_model_path = models_dir / "anomaly_model.pkl"
    metadata_path = models_dir / "model_metadata.json"
    fi_path = models_dir / "feature_importance.csv"
    report_path = models_dir / "performance_report.txt"

    joblib.dump(xgb, fraud_model_path)
    joblib.dump(iso, anomaly_model_path)

    # Save feature importance
    importances = xgb.feature_importances_
    fi_df = pd.DataFrame({"feature": FEATURE_ORDER, "importance": importances})
    fi_df.to_csv(fi_path, index=False)

    # Save metadata
    metadata = {
        "version": "2.0.0",
        "training_date": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "accuracy": float(acc),
        "precision": float(prec),
        "recall": float(rec),
        "f1": float(f1),
        "roc_auc": float(roc),
        "n_samples": int(len(df)),
        "n_features": len(FEATURE_ORDER),
    }
    metadata_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    # Performance report
    report_lines = [
        "GuardianShield Model Performance Report",
        f"Samples: {len(df)}",
        f"Accuracy: {acc:.4f}",
        f"Precision: {prec:.4f}",
        f"Recall: {rec:.4f}",
        f"F1: {f1:.4f}",
        f"ROC-AUC: {roc:.4f}",
    ]
    report_path.write_text("\n".join(report_lines), encoding="utf-8")

    logging.info("Saved models: %s, %s", fraud_model_path, anomaly_model_path)
    logging.info("Saved metadata: %s", metadata_path)
    logging.info("Saved feature importance: %s", fi_path)
    logging.info("Saved performance report: %s", report_path)


def main():
    start = time.time()
    train_models()
    logging.info("Training completed in %.2f seconds", time.time() - start)


if __name__ == "__main__":
    main()
