from .schemas import RecommendationInput, RecommendationOutput, Recommendation
from .pipelines.spoilage_pipeline import predict_spoilage
from .schemas import SpoilageInput

def generate_recommendations(input_data: RecommendationInput) -> RecommendationOutput:
    # 1. Get spoilage risk
    spoilage_in = SpoilageInput(
        crop=input_data.crop,
        temperature=input_data.temperature,
        humidity=input_data.humidity,
        storage_days=input_data.storage_days,
        shelf_life=input_data.shelf_life,
        quality_grade=input_data.quality_grade
    )
    spoilage_out = predict_spoilage(spoilage_in)
    
    recommendations = []
    
    # Simple logic simulating AI Decision Engine
    if spoilage_out.risk_category == "HIGH":
        recommendations.append(Recommendation(
            action="SELL",
            confidence=0.92,
            reason=f"High risk of spoilage ({spoilage_out.spoilage_probability:.2f}). Sell immediately.",
            priority="CRITICAL"
        ))
    elif spoilage_out.risk_category == "MEDIUM":
        recommendations.append(Recommendation(
            action="PROCESS",
            confidence=0.75,
            reason="Moderate spoilage risk. Consider processing to extend value.",
            priority="HIGH"
        ))
        recommendations.append(Recommendation(
            action="PARTIAL_SELL",
            confidence=0.60,
            reason="Sell a portion to mitigate risk while holding remainder.",
            priority="MEDIUM"
        ))
    else:
        recommendations.append(Recommendation(
            action="STORE",
            confidence=0.88,
            reason="Low spoilage risk. Conditions are optimal for storage.",
            priority="LOW"
        ))
        
    best_action = sorted(recommendations, key=lambda x: x.confidence, reverse=True)[0]
    
    return RecommendationOutput(
        recommendations=recommendations,
        best_action=best_action
    )
