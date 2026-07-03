from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "AI Intelligence Microservice"}

def test_spoilage_predict():
    response = client.post("/predict/spoilage", json={
        "crop": "Tomato",
        "temperature": 25.5,
        "humidity": 65.0,
        "storage_days": 10,
        "shelf_life": 14,
        "quality_grade": "A"
    })
    assert response.status_code == 200
    data = response.json()
    assert "spoilage_probability" in data
    assert "risk_category" in data

def test_recommend():
    response = client.post("/recommend", json={
        "batch_id": "b123",
        "crop": "Tomato",
        "quantity": 1000,
        "storage_days": 12,
        "shelf_life": 14,
        "temperature": 28.0,
        "humidity": 70.0,
        "quality_grade": "B",
        "current_price": 50.0
    })
    assert response.status_code == 200
    data = response.json()
    assert "best_action" in data
    assert "recommendations" in data
