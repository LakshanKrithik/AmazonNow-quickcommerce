from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from context_engine import get_context_and_cart
from review_synthesis import synthesize_reviews
from nudge_engine import generate_nudge_from_context, send_nudge
from dynamo_client import save_cart, get_user_history
from mock_data import MOCK_PRODUCTS
from ranking_engine import get_matched_products, fetch_inventory_by_category
from prediction_engine import predict_usuals
from intent_classifier import classify_intent
from seed_data_extended import EXTENDED_INVENTORY, USER_PROFILE, PURCHASE_HISTORY

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ORIGINAL PROJECT A ENDPOINTS (preserved)
# ============================================================

@app.get("/")
def root():
    return {"status": "Cart Oracle + IntentOS is running"}


@app.get("/context")
def get_context():
    return get_context_and_cart()


@app.post("/context/switch")
def switch_context(payload: dict):
    from mock_data import MOCK_WEATHER, MOCK_CALENDAR
    scenario = payload.get("scenario", "HOST_GUESTS")

    scenarios = {
        "RAIN": {"weather": "Heavy Rain", "calendar": "No events"},
        "HOST_GUESTS": {"weather": "Clear", "calendar": "Friends coming over tonight"},
        "TRAVEL": {"weather": "Clear", "calendar": "Flight to Bangalore tomorrow 9am"},
    }

    return {
        "switched_to": scenario,
        "context": scenarios.get(scenario),
        "products": MOCK_PRODUCTS.get(scenario, [])
    }


@app.get("/reviews/{product_name}")
def get_reviews(product_name: str):
    products_flat = []
    for items in MOCK_PRODUCTS.values():
        products_flat.extend(items)

    product = next((p for p in products_flat if product_name.lower() in p["name"].lower()), None)

    if not product:
        return {"error": "Product not found"}

    synthesis = synthesize_reviews(
        product["name"],
        product["reviews"],
        product["price"]
    )
    return {"product": product, "synthesis": synthesis}


@app.get("/nudge")
def get_nudge():
    data = get_context_and_cart()
    nudge = generate_nudge_from_context(data["cart_prediction"])
    send_nudge(nudge["body"])
    return nudge


@app.get("/products/{intent}")
def get_products(intent: str):
    return MOCK_PRODUCTS.get(intent.upper(), [])


@app.post("/cart/save")
def save_user_cart(payload: dict):
    data = get_context_and_cart()
    save_cart(payload.get("user_id", "u_001"), data["cart_prediction"])
    return {"status": "saved"}


@app.get("/cart/history/{user_id}")
def get_history(user_id: str):
    return get_user_history(user_id)


# ============================================================
# NEW ENDPOINTS FROM PROJECT B (IntentOS) - ported to FastAPI
# ============================================================

@app.post("/api/intent")
def process_intent(payload: dict):
    """
    AI-powered intent classification from user text.
    Maps natural language to a crisis category and target product category.
    (Replaces Project B's /api/intent Next.js route)
    """
    transcript = payload.get("transcript", "")

    if not transcript or len(transcript.strip()) < 2:
        return {"success": False, "error": "Transcript too short"}

    if len(transcript) > 200:
        return {"success": False, "error": "Transcript too long"}

    result = classify_intent(transcript)

    return {
        "success": True,
        "macro_crisis": result["macro_crisis"],
        "target_category": result["target_category"]
    }


@app.post("/api/inventory/match")
def inventory_match(payload: dict):
    """
    Product matchmaking with algorithmic scoring.
    Returns ranked and scored products for a given crisis/category.
    (Replaces Project B's /api/inventory/match Next.js route)
    """
    target_category = payload.get("target_category", "")
    macro_crisis = payload.get("macro_crisis", "")
    is_search = payload.get("isSearch", False)

    if not target_category and not macro_crisis:
        return {"success": False, "error": "Missing target_category or macro_crisis"}

    ranked_items = get_matched_products(target_category, macro_crisis, is_search)

    return {
        "success": True,
        "items": ranked_items
    }


@app.post("/api/system/trigger")
def system_trigger(payload: dict):
    """
    System event simulation for demo purposes.
    (Replaces Project B's /api/system/trigger Next.js route)
    """
    event_type = payload.get("eventType", "")

    if event_type == "WEATHER_ALERT":
        print("\n🌩️  [SYSTEM EVENT] WEATHER CRISIS DETECTED: Heavy Rain inbound for Thane region.")
        print("📦  [DARK STORE ALLOCATION] Automatically buffering +40% Umbrella & Raincoat stock.\n")

    return {"success": True, "message": "Webhook processed"}


@app.get("/api/predictions/{user_id}")
def get_predictions(user_id: str):
    """
    Get 'Your Usuals' predictions based on purchase history.
    (New endpoint combining Project B's prediction engine)
    """
    predictions = predict_usuals(user_id)
    return {
        "success": True,
        "items": predictions
    }


@app.get("/api/inventory/full")
def get_full_inventory():
    """Return the full extended inventory catalog."""
    return {
        "success": True,
        "items": EXTENDED_INVENTORY
    }


@app.get("/api/user/profile")
def get_user_profile():
    """Return the mock user profile."""
    return USER_PROFILE


@app.get("/api/cart/weather")
def get_weather_based_cart():
    """Get a cart built from real-time weather data."""
    from smart_cart_builder import get_weather_cart
    return get_weather_cart("Chennai")


@app.get("/api/cart/time")
def get_time_based_cart():
    """Get a cart built from current time of day."""
    from smart_cart_builder import get_time_cart
    return get_time_cart()


@app.post("/api/voice-cart")
def voice_cart(payload: dict):
    """
    Generate a shopping cart from a natural language voice request.
    Uses Claude Sonnet 4.5 to understand the request and suggest products.
    """
    transcript = payload.get("transcript", "")
    if not transcript or len(transcript.strip()) < 3:
        return {"success": False, "error": "Transcript too short"}

    from bedrock_client import invoke_bedrock_json

    prompt = f"""You are a grocery shopping assistant for a quick commerce delivery app in India (like Zepto/Blinkit).

The user said: "{transcript}"

Generate a shopping cart with ONLY the products that are directly relevant to what the user asked for. Do NOT add random unrelated items.

Guidelines:
- ONLY suggest items that directly relate to what the user said
- If they ask for umbrella and coffee, give umbrella, coffee, milk, sugar — NOT chips, cold drinks, or snacks unless they asked
- If they mention a party, then include party items (drinks, snacks, ice, cups, plates)
- If they mention cooking a dish, include only the ingredients for that dish
- If they mention number of people, scale quantities
- Think: "Would this item make sense given EXACTLY what they said?"

Return ONLY a JSON object:
{{
    "products": [
        {{"name": "Product Name with brand", "quantity": 2, "price": 99, "reason": "brief reason directly tied to their request", "delivery": "8 mins"}},
        ...
    ],
    "summary": "one line summary of what you understood",
    "total_items": 8
}}

Rules:
- Indian brands and realistic INR prices
- Delivery times 8-15 mins
- Generate 5-12 products — fewer is better if the request is simple
- Be specific with names: "Nescafe Classic 200g" not "coffee"
- Every item MUST have a clear reason tied to the user's request
- Do NOT pad the list with unrelated items

Return only valid JSON, no other text."""

    try:
        result = invoke_bedrock_json(prompt)
        return {"success": True, **result}
    except Exception as e:
        print(f"[VOICE CART] Error: {e}")
        # Fallback
        return {
            "success": True,
            "products": [
                {"name": "Amul Taaza Milk 1L", "price": 72, "quantity": 2, "reason": "Daily essential", "delivery": "8 mins"},
                {"name": "Britannia Bread", "price": 45, "quantity": 1, "reason": "Breakfast staple", "delivery": "8 mins"},
                {"name": "Eggs (6 pack)", "price": 55, "quantity": 2, "reason": "Protein source", "delivery": "10 mins"},
            ],
            "summary": "Basic grocery essentials",
            "total_items": 3
        }
