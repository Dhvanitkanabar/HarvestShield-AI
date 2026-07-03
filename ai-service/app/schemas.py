from pydantic import BaseModel
from typing import List, Optional, Dict

class SpoilageInput(BaseModel):
    crop: str
    temperature: float
    humidity: float
    storage_days: int
    shelf_life: int
    quality_grade: str

class SpoilageOutput(BaseModel):
    spoilage_probability: float
    risk_category: str
    confidence_score: float

class ShelfLifeInput(BaseModel):
    crop: str
    temperature: float
    humidity: float
    storage_days: int

class ShelfLifeOutput(BaseModel):
    remaining_shelf_life: int
    confidence: float
    factors: Dict[str, float]

class PriceInput(BaseModel):
    crop: str
    market: str
    current_price: float

class PriceOutput(BaseModel):
    expected_market_price: float
    forecast_7_day: float
    forecast_30_day: float
    trend: str
    confidence: float

class DemandInput(BaseModel):
    crop: str
    market: str
    season: str

class DemandOutput(BaseModel):
    demand_score: float
    demand_category: str
    seasonality: str

class RecommendationInput(BaseModel):
    batch_id: str
    crop: str
    quantity: float
    storage_days: int
    shelf_life: int
    temperature: float
    humidity: float
    quality_grade: str
    current_price: float

class Recommendation(BaseModel):
    action: str
    confidence: float
    reason: str
    priority: str

class RecommendationOutput(BaseModel):
    recommendations: List[Recommendation]
    best_action: Recommendation
