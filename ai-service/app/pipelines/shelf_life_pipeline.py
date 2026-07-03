from ..models.model_loader import ModelLoader
from ..schemas import ShelfLifeInput, ShelfLifeOutput

def predict_shelf_life(input_data: ShelfLifeInput) -> ShelfLifeOutput:
    model = ModelLoader.load_model("shelf_life_model")
    
    if model:
        import numpy as np
        features = np.array([[input_data.temperature, input_data.humidity, input_data.storage_days]])
        remaining = int(model.predict(features)[0])
    else:
        # Heuristic fallback
        base_life = 30 # standard days
        degradation = (input_data.temperature / 20.0) * (input_data.humidity / 50.0)
        remaining = max(int(base_life - input_data.storage_days * degradation), 0)
        
    return ShelfLifeOutput(
        remaining_shelf_life=remaining,
        confidence=0.78,
        factors={
            "temperature_impact": 0.4,
            "humidity_impact": 0.3,
            "storage_duration_impact": 0.3
        }
    )
