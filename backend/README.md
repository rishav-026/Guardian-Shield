# GuardianShield Backend

FastAPI backend providing fraud detection endpoints for the GuardianShield demo. Includes synthetic model training and Supabase integration.

## Files
- `requirements.txt` — pinned dependencies
- `.env.example` — template environment variables
- `ml_training.py` — synthetic data generation and model training
- `main.py` — FastAPI app with prediction and history endpoints
- `models/` — trained artifacts saved by `ml_training.py`

## Quick Start
1. Create and activate a virtualenv.
2. Install deps: `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and fill Supabase values; set `FRONTEND_URL` if different.
4. In Supabase SQL editor run the provided schema/seed queries for users, user_baselines, transactions.
5. Train models: `python ml_training.py` (creates `models/fraud_model.pkl` and `models/anomaly_model.pkl`).
6. Run API: `uvicorn main:app --reload --host 0.0.0.0 --port 8000`.

## Endpoints
- `GET /` — health check
- `POST /api/predict` — fraud prediction
- `GET /api/transactions/{user_id}?limit=10` — recent transactions
- `GET /api/user/{user_id}/baseline` — user baseline

## Notes
- Feature order is fixed: `[amount, amount_deviation, is_unusual_time, time_deviation, is_new_merchant, phone_activity, V1..V23]`.
- If Supabase is not configured, defaults are used and transaction logging is skipped.
