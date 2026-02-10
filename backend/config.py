import os
from functools import lru_cache
from typing import Dict, List

from pydantic import Field
from pydantic_settings import BaseSettings


class ModelConfig(BaseSettings):
    version: str = "1.0"
    default_threshold_block: int = 90
    default_threshold_challenge: int = 71
    default_threshold_caution: int = 41
    feature_order: List[str] = [
        "amount",
        "amount_deviation",
        "is_unusual_time",
        "time_deviation",
        "is_new_merchant",
        "phone_activity",
        *[f"V{i}" for i in range(1, 24)],
    ]


class SecurityConfig(BaseSettings):
    api_keys: List[str] = Field(default_factory=lambda: os.getenv("API_KEYS", "demo-key").split(","))
    rate_limit_per_minute: int = 100
    ip_whitelist: List[str] = Field(default_factory=list)
    ip_blacklist: List[str] = Field(default_factory=list)
    signature_secret: str = Field(default_factory=lambda: os.getenv("SIGNATURE_SECRET", "sig-secret"))


class CacheConfig(BaseSettings):
    redis_url: str = Field(default_factory=lambda: os.getenv("REDIS_URL", "redis://localhost:6379/0"))
    baseline_ttl_seconds: int = 300
    merchant_ttl_seconds: int = 3600
    patterns_ttl_seconds: int = 1800


class Settings(BaseSettings):
    api_port: int = Field(default=8000)
    frontend_url: str = Field(default_factory=lambda: os.getenv("FRONTEND_URL", "http://localhost:5173"))
    supabase_url: str = Field(default_factory=lambda: os.getenv("SUPABASE_URL", ""))
    supabase_key: str = Field(default_factory=lambda: os.getenv("SUPABASE_KEY", ""))
    model_config: ModelConfig = ModelConfig()
    security: SecurityConfig = SecurityConfig()
    cache: CacheConfig = CacheConfig()
    feature_flags: Dict[str, bool] = Field(
        default_factory=lambda: {
            "use_anomaly_model": True,
            "enable_webhooks": True,
            "enable_realtime_ws": True,
        }
    )
    thresholds: Dict[str, int] = Field(
        default_factory=lambda: {
            "block": 90,
            "challenge": 71,
            "caution": 41,
        }
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()
