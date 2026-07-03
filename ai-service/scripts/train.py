import os
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression, LinearRegression

def generate_mock_spoilage_data():
    # Features: [temperature, humidity, storage_days, shelf_life]
    np.random.seed(42)
    N = 1000
    temp = np.random.normal(25, 5, N)
    humidity = np.random.normal(60, 15, N)
    storage_days = np.random.randint(1, 30, N)
    shelf_life = np.random.randint(15, 60, N)
    
    # Label: 1 if spoiled, 0 if good
    risk = (temp / 30) * (humidity / 100) * (storage_days / shelf_life)
    y = (risk + np.random.normal(0, 0.1, N) > 0.8).astype(int)
    
    X = np.column_stack((temp, humidity, storage_days, shelf_life))
    return X, y

def generate_mock_shelf_life_data():
    # Features: [temperature, humidity, storage_days]
    np.random.seed(42)
    N = 1000
    temp = np.random.normal(25, 5, N)
    humidity = np.random.normal(60, 15, N)
    storage_days = np.random.randint(1, 30, N)
    
    base_life = 30
    y = np.maximum(base_life - storage_days * (temp/20) * (humidity/50) + np.random.normal(0, 2, N), 0)
    
    X = np.column_stack((temp, humidity, storage_days))
    return X, y

def train_and_save():
    os.makedirs("app/models/bin", exist_ok=True)
    
    print("Training Spoilage Model...")
    X_spoil, y_spoil = generate_mock_spoilage_data()
    spoilage_model = LogisticRegression()
    spoilage_model.fit(X_spoil, y_spoil)
    joblib.dump(spoilage_model, "app/models/bin/spoilage_model.joblib")
    
    print("Training Shelf Life Model...")
    X_shelf, y_shelf = generate_mock_shelf_life_data()
    shelf_model = LinearRegression()
    shelf_model.fit(X_shelf, y_shelf)
    joblib.dump(shelf_model, "app/models/bin/shelf_life_model.joblib")
    
    print("Models saved successfully in app/models/bin/")

if __name__ == "__main__":
    train_and_save()
