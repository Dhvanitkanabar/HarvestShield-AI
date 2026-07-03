# HarvestShield AI Intelligence Microservice

This service provides AI-powered predictions for the HarvestShield ecosystem.

## Setup

1. Create a virtual environment: `python -m venv venv`
2. Activate it: `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
3. Install dependencies: `pip install -r requirements.txt`
4. Train placeholder models: `python scripts/train.py`
5. Run server: `uvicorn app.main:app --reload --port 8000`

## Endpoints

- `GET /health`
- `GET /model-info`
- `POST /predict/spoilage`
- `POST /predict/shelf-life`
- `POST /predict/price`
- `POST /predict/demand`
- `POST /recommend`

See `/docs` for Swagger UI.
