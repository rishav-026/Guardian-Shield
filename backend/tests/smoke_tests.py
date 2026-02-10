"""Lightweight smoke tests against the running GuardianShield backend.
Run: `python tests/smoke_tests.py` while uvicorn is running.
"""
import os
import sys
import time
from typing import Any, Dict

import requests

BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")


def _url(path: str) -> str:
    return f"{BASE_URL.rstrip('/')}{path}"


def _check_status(resp: requests.Response, expected: int = 200) -> Dict[str, Any]:
    if resp.status_code != expected:
        raise SystemExit(f"Expected HTTP {expected}, got {resp.status_code}: {resp.text}")
    return resp.json()


def test_root() -> None:
    resp = requests.get(_url("/"), timeout=5)
    data = _check_status(resp)
    assert data.get("status"), "Root status missing"
    print("✓ Root ok", data)


def test_predict() -> None:
    payload = {
        "user_id": "smoke_user",
        "amount": 4200,
        "merchant": "apollo hospital",
        "time_hour": 10,
        "phone_activity": False,
    }
    start = time.time()
    resp = requests.post(_url("/api/predict"), json=payload, timeout=10)
    data = _check_status(resp)
    latency_ms = int((time.time() - start) * 1000)
    for key in ["risk_score", "decision", "fraud_probability", "amount_deviation"]:
        assert key in data, f"Predict response missing {key}"
    print(f"✓ Predict ok (latency {latency_ms} ms) risk={data['risk_score']} decision={data['decision']}")


def test_dashboard() -> None:
    resp = requests.get(_url("/api/analytics/dashboard"), timeout=10)
    data = _check_status(resp)
    for key in ["total_transactions", "fraud_blocked", "decision_distribution"]:
        assert key in data, f"Dashboard missing {key}"
    print("✓ Dashboard ok")


def test_baseline() -> None:
    resp = requests.get(_url("/api/user/smoke_user/baseline"), timeout=5)
    data = _check_status(resp)
    assert "avg_amount" in data, "Baseline missing avg_amount"
    print("✓ Baseline ok")


def test_stats() -> None:
    resp = requests.get(_url("/api/analytics/stats"), timeout=5)
    data = _check_status(resp)
    assert "today" in data and "total" in data["today"], "Stats missing today/total"
    print("✓ Stats ok")


def test_transactions() -> None:
    resp = requests.get(_url("/api/transactions?limit=3"), timeout=5)
    data = _check_status(resp)
    assert "transactions" in data, "Transactions missing list"
    print("✓ Transactions ok (count: %s)" % len(data.get("transactions", [])))


def main() -> None:
    try:
        test_root()
        test_predict()
        test_dashboard()
        test_baseline()
        test_stats()
        test_transactions()
    except Exception as exc:  # noqa: BLE001
        print(f"Smoke tests failed: {exc}")
        sys.exit(1)
    print("All smoke tests passed")


if __name__ == "__main__":
    main()
