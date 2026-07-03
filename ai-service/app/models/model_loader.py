import joblib
import os

class ModelLoader:
    _models = {}

    @classmethod
    def load_model(cls, model_name: str):
        if model_name in cls._models:
            return cls._models[model_name]
        
        model_path = f"app/models/bin/{model_name}.joblib"
        if os.path.exists(model_path):
            model = joblib.load(model_path)
            cls._models[model_name] = model
            return model
        
        # If model doesn't exist (e.g. not trained yet), return None
        return None
