# ranking_engine.py - Ported from Project B's rankingEngine.ts
# Scores and ranks products, flags alternatives when items are out of stock

from seed_data_extended import EXTENDED_INVENTORY, USER_PROFILE


def rank_and_flag_alternatives(inventory: list, user_profile: dict, is_search: bool = False) -> list:
    """
    Rank products using algorithmic scoring:
    - purchase_frequency_rank contributes positively
    - eta_mins penalizes slow delivery
    - current price (base * surge) penalizes expensive items
    - Brand preference gives a large boost
    
    Also flags alternatives when top item is out of stock.
    """
    scored_items = []

    for item in inventory:
        current_price = item["base_price"] * item["surge_multiplier"]
        base_score = (item["purchase_frequency_rank"] * 0.8) - (item["eta_mins"] * 3) - (current_price * 0.05)
        score = max(0, base_score)

        # Personalization boost
        if item["brand"] in user_profile.get("preferred_brands", []):
            score += 75

        scored_items.append({**item, "score": score, "is_alternative": False})

    # Sort by highest score
    scored_items.sort(key=lambda x: x["score"], reverse=True)

    # Process stock checks and dynamic alternative flags
    final_items = []
    is_alternative_triggered = False
    original_brand = ""

    for current_item in scored_items:
        if current_item["stock_count"] == 0:
            if is_search and len(final_items) == 0:
                is_alternative_triggered = True
                original_brand = current_item["brand"]
            continue

        processed_item = {**current_item}

        # Apply alternative banner to next best item
        if is_search and is_alternative_triggered and len(final_items) == 0:
            processed_item["is_alternative"] = True
            processed_item["alternative_message"] = f"{original_brand} is out. Suggested Substitute: {processed_item['brand']}"

        final_items.append(processed_item)

        # Return only top 3 for direct search
        if is_search and len(final_items) == 3:
            break

    return final_items


def fetch_inventory_by_category(category: str, macro_crisis: str = None) -> list:
    """Filter extended inventory by category or crisis type."""
    normalized_category = category.lower().strip().replace(" ", "_") if category else ""
    normalized_crisis = macro_crisis.lower().strip().replace(" ", "_") if macro_crisis else ""

    results = [
        item for item in EXTENDED_INVENTORY
        if (normalized_category and item["category"].lower() == normalized_category)
        or (normalized_crisis and item["macro_crisis"].lower() == normalized_crisis)
    ]
    return results


def get_matched_products(target_category: str, macro_crisis: str, is_search: bool = False) -> list:
    """Full pipeline: fetch inventory -> rank -> flag alternatives."""
    inventory = fetch_inventory_by_category(target_category, macro_crisis)
    ranked = rank_and_flag_alternatives(inventory, USER_PROFILE, is_search)
    return ranked
