from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .schemas import (
    SpoilageInput, SpoilageOutput,
    ShelfLifeInput, ShelfLifeOutput,
    PriceInput, PriceOutput,
    DemandInput, DemandOutput,
    RecommendationInput, RecommendationOutput
)
from .pipelines.spoilage_pipeline import predict_spoilage
from .pipelines.shelf_life_pipeline import predict_shelf_life
from .pipelines.price_pipeline import predict_price
from .pipelines.demand_pipeline import predict_demand
from .recommender import generate_recommendations

app = FastAPI(title="HarvestShield AI Service")

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "AI Intelligence Microservice"}

@app.get("/model-info")
def model_info():
    return {
        "models": [
            {"name": "spoilage_predictor", "version": "1.0.0", "status": "loaded"},
            {"name": "shelf_life_predictor", "version": "1.0.0", "status": "loaded"},
            {"name": "price_forecaster", "version": "1.0.0", "status": "loaded"},
            {"name": "demand_forecaster", "version": "1.0.0", "status": "loaded"}
        ]
    }

@app.post("/predict/spoilage", response_model=SpoilageOutput)
def spoilage(input_data: SpoilageInput):
    try:
        return predict_spoilage(input_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/shelf-life", response_model=ShelfLifeOutput)
def shelf_life(input_data: ShelfLifeInput):
    try:
        return predict_shelf_life(input_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/price", response_model=PriceOutput)
def price(input_data: PriceInput):
    try:
        return predict_price(input_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/demand", response_model=DemandOutput)
def demand(input_data: DemandInput):
    try:
        return predict_demand(input_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend", response_model=RecommendationOutput)
def recommend(input_data: RecommendationInput):
    try:
        return generate_recommendations(input_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
