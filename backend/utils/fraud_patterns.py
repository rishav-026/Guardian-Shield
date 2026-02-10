import logging
from typing import Dict

from dateutil import tz

logger = logging.getLogger(__name__)


def velocity_check(recent_velocity: int) -> bool:
    return recent_velocity > 5


def impossible_travel(last_location: Dict[str, float] | None, current_location: Dict[str, float]) -> bool:
    # Simplified placeholder; real impl would compute geodesic distance and time delta.
    if not last_location:
        return False
    return False


def social_engineering_keywords(merchant: str) -> bool:
    keywords = ["kyc", "verification", "lottery", "reward", "refund", "support"]
    merchant_lower = merchant.lower()
    return any(k in merchant_lower for k in keywords)


def benford_anomaly(amount: float) -> bool:
    # Quick heuristic: leading digit frequency deviation
    leading = str(int(amount))[0]
    return leading in {"7", "8", "9"}
