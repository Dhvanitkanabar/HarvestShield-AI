from ..models.model_loader import ModelLoader
from ..schemas import SpoilageInput, SpoilageOutput

def predict_spoilage(input_data: SpoilageInput) -> SpoilageOutput:
    model = ModelLoader.load_model("spoilage_model")
    
    # Feature engineering simulation
    # Risk increases with higher temp, humidity, and storage days relative to shelf life.
    risk_factor = (input_data.temperature / 30.0) * (input_data.humidity / 100.0) * (input_data.storage_days / max(input_data.shelf_life, 1))
    
    if model:
        # Dummy inference using model
        import numpy as np
        features = np.array([[input_data.temperature, input_data.humidity, input_data.storage_days, input_data.shelf_life]])
        prob = model.predict_proba(features)[0][1]
    else:
        # Heuristic fallback if model not trained
        prob = min(risk_factor, 0.99)
        
    category = "HIGH" if prob > 0.7 else "MEDIUM" if prob > 0.4 else "LOW"
    
    return SpoilageOutput(
        spoilage_probability=round(prob, 4),
        risk_category=category,
        confidence_score=0.85
    )
