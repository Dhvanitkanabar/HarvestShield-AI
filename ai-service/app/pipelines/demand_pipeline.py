from ..models.model_loader import ModelLoader
from ..schemas import DemandInput, DemandOutput

def predict_demand(input_data: DemandInput) -> DemandOutput:
    model = ModelLoader.load_model("demand_model")
    
    if model:
        pass # Placeholder for model inference
        
    # Heuristic fallback
    season_multiplier = 1.2 if input_data.season.lower() in ["summer", "festive"] else 0.9
    score = 75.0 * season_multiplier
    
    category = "HIGH" if score >= 80 else "MODERATE" if score >= 50 else "LOW"
    
    return DemandOutput(
        demand_score=min(score, 100.0),
        demand_category=category,
        seasonality="PEAK" if season_multiplier > 1 else "OFF_PEAK"
    )
