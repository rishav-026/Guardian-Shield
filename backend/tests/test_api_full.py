"""Comprehensive integration-style checks against the running GuardianShield backend.
Run while uvicorn is live: `python -m unittest tests.test_api_full`
Set API_BASE_URL to point at a different host/port if needed.
"""
import os
import time
import unittest
from typing import Any, Dict

import requests

BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")


def _url(path: str) -> str:
    return f"{BASE_URL.rstrip('/')}{path}"


def _json(resp: requests.Response, expected_status: int = 200) -> Dict[str, Any]:
    if resp.status_code != expected_status:
        raise AssertionError(f"HTTP {resp.status_code}: {resp.text}")
    return resp.json()


class TestGuardianShieldAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        # Warm up root to ensure service is reachable.
        resp = requests.get(_url("/"), timeout=5)
        data = _json(resp)
        cls.assertTrue(cls, data.get("status"))

    def test_root(self) -> None:
        resp = requests.get(_url("/"), timeout=5)
        data = _json(resp)
        self.assertIn("status", data)
        self.assertIn("version", data)

    def test_predict_safe_like(self) -> None:
        payload = {
            "user_id": "test_safe_user",
            "amount": 1500,
            "merchant": "amazon",
            "time_hour": 14,
            "phone_activity": False,
        }
        start = time.time()
        resp = requests.post(_url("/api/predict"), json=payload, timeout=10)
        data = _json(resp)
        latency_ms = int((time.time() - start) * 1000)
        self.assertIn("risk_score", data)
        self.assertIn("decision", data)
        self.assertTrue(0 <= data["risk_score"] <= 100)
        # Allow some headroom for cold start/model load on constrained systems.
        self.assertLess(latency_ms, 3000)

    def test_predict_high_risk_shape(self) -> None:
        payload = {
            "user_id": "test_risk_user",
            "amount": 75000,
            "merchant": "kyc update services",
            "time_hour": 1,
            "phone_activity": True,
        }
        resp = requests.post(_url("/api/predict"), json=payload, timeout=10)
        data = _json(resp)
        self.assertIn("fraud_probability", data)
        self.assertIn("reasons", data)
        self.assertTrue(0 <= data["risk_score"] <= 100)

    def test_predict_validation_error(self) -> None:
        bad_payload = {
            "user_id": "missing_fields",
            "amount": 1000,
            # missing merchant/time_hour/phone_activity
        }
        resp = requests.post(_url("/api/predict"), json=bad_payload, timeout=5)
        self.assertEqual(resp.status_code, 422)

    def test_transactions_endpoint(self) -> None:
        resp = requests.get(_url("/api/transactions?limit=2"), timeout=5)
        data = _json(resp)
        self.assertIn("transactions", data)
        self.assertIn("total", data)

    def test_transactions_bad_limit(self) -> None:
        resp = requests.get(_url("/api/transactions?limit=0"), timeout=5)
        self.assertEqual(resp.status_code, 400)

    def test_baseline(self) -> None:
        resp = requests.get(_url("/api/user/test_user/baseline"), timeout=5)
        data = _json(resp)
        self.assertIn("avg_amount", data)
        self.assertIn("common_merchants", data)

    def test_dashboard_keys(self) -> None:
        resp = requests.get(_url("/api/analytics/dashboard"), timeout=10)
        data = _json(resp)
        for key in ["total_transactions", "fraud_blocked", "decision_distribution"]:
            self.assertIn(key, data)

    def test_stats_keys(self) -> None:
        resp = requests.get(_url("/api/analytics/stats"), timeout=5)
        data = _json(resp)
        self.assertIn("today", data)
        self.assertIn("total", data["today"])


if __name__ == "__main__":
    unittest.main()
