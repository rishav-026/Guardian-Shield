import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)

# Placeholder in-memory structures
MERCHANT_BLACKLIST = {"kyc update services", "lottery claims", "crypto quick"}
MERCHANT_WHITELIST = set()


def merchant_risk_score(merchant: str) -> Dict[str, Any]:
    name = merchant.lower()
    base_score = 50
    if name in MERCHANT_BLACKLIST:
        base_score = 95
    if name in MERCHANT_WHITELIST:
        base_score = 10
    return {
        "merchant_name": merchant,
        "risk_score": base_score,
        "category": "suspected_scam" if name in MERCHANT_BLACKLIST else "general",
        "blacklisted": name in MERCHANT_BLACKLIST,
        "whitelisted": name in MERCHANT_WHITELIST,
        "similar_merchants": [],
    }


def add_to_whitelist(user_id: str, merchant: str) -> Dict[str, str]:
    MERCHANT_WHITELIST.add(merchant.lower())
    return {"status": "added", "merchant": merchant}


def remove_from_whitelist(user_id: str, merchant: str) -> Dict[str, str]:
    MERCHANT_WHITELIST.discard(merchant.lower())
    return {"status": "removed", "merchant": merchant}


def list_whitelist(user_id: str) -> Dict[str, Any]:
    return {"whitelist": list(MERCHANT_WHITELIST)}
