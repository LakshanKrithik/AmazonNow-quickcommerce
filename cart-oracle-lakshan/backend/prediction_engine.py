# prediction_engine.py - Ported from Project B's predictionEngine.ts
# Predicts "Your Usuals" based on purchase history and time-of-day matching

from datetime import datetime, timezone
from seed_data_extended import EXTENDED_INVENTORY, PURCHASE_HISTORY


def predict_usuals(user_id: str = "ajendra_001", current_hour: int = None) -> list:
    """
    Predict routine purchases for a user based on:
    - Purchase frequency (how often they buy it)
    - Time-of-day match (if they usually buy at this hour, boost score 2.5x)
    """
    if current_hour is None:
        current_hour = datetime.now(timezone.utc).hour

    # Filter purchase history for this user
    user_history = [h for h in PURCHASE_HISTORY if h["user_id"] == user_id]

    # Build stats per ASIN
    item_stats = {}
    for record in user_history:
        asin = record["asin"]
        if asin not in item_stats:
            item_stats[asin] = {"frequency": 0, "hours": []}
        item_stats[asin]["frequency"] += record["quantity"]
        try:
            hour = datetime.fromisoformat(record["timestamp"].replace("Z", "+00:00")).hour
            item_stats[asin]["hours"].append(hour)
        except (ValueError, KeyError):
            pass

    # Score predictions
    predictions = []
    for asin, stats in item_stats.items():
        product = next((p for p in EXTENDED_INVENTORY if p["asin"] == asin), None)
        if not product or product["stock_count"] == 0:
            continue

        # Check time-of-day match (within 2 hours)
        time_match_boost = any(
            abs(h - current_hour) <= 2 or abs(h - current_hour) >= 22
            for h in stats["hours"]
        )

        prediction_score = stats["frequency"] * 10
        if time_match_boost:
            prediction_score *= 2.5

        predictions.append({
            **product,
            "prediction_score": prediction_score,
            "frequency": stats["frequency"],
            "time_match_boost": time_match_boost
        })

    # Sort by prediction score descending, return top 4
    predictions.sort(key=lambda x: x["prediction_score"], reverse=True)
    return predictions[:4]
