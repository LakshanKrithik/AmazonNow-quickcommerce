# context_engine.py - Builds real context from weather, calendar, and time
from mock_data import MOCK_USER, MOCK_PRODUCTS
from weather_intelligence import get_real_weather
from calendar_intelligence import get_calendar_events, get_most_urgent_event
from datetime import datetime
import json


def build_context():
    """Build real context using live weather, calendar, and current time."""
    now = datetime.now()
    weather = get_real_weather("Chennai")
    calendar_event = get_most_urgent_event()
    all_events = get_calendar_events()

    context = {
        "user": MOCK_USER,
        "weather": weather,
        "calendar": calendar_event,
        "all_events": all_events,
        "time": now.strftime("%H:%M"),
        "day": now.strftime("%A"),
        "date": now.strftime("%d %B %Y")
    }
    return context


FALLBACK_CART = {
    "predicted_intent": "HOST_GUESTS",
    "confidence": 0.92,
    "reasoning": "Calendar shows guests arriving tonight",
    "cart_items": [
        {"item": "Maggi 12pack", "quantity": 2, "reason": "Quick meal for guests"},
        {"item": "Paper Plates", "quantity": 1, "reason": "Guests arriving tonight"},
        {"item": "Soft Drinks", "quantity": 1, "reason": "Party essential"}
    ],
    "nudge_message": "Guests tonight. Hosting kit ready. Confirm?"
}


def generate_smart_cart(context: dict):
    """Use Gemini to predict cart based on real context signals."""
    prompt = f"""
    You are Cart Oracle, an AI that predicts what a user needs before they search.
    
    User context:
    - Purchase history: {context['user']['purchase_history']}
    - Upcoming calendar event: {context['calendar']}
    - All events: {context.get('all_events', [])}
    - Current weather: {context['weather']}
    - Time: {context['time']}
    - Day: {context['day']}
    
    Based on this context, generate a smart cart prediction.
    
    Return ONLY a JSON object with this exact structure:
    {{
        "predicted_intent": "HOST_GUESTS or RAIN or TRAVEL or ROUTINE",
        "confidence": 0.95,
        "reasoning": "one sentence explaining why",
        "cart_items": [
            {{"item": "item name", "quantity": 1, "reason": "why this item"}}
        ],
        "nudge_message": "short push notification text under 10 words"
    }}
    
    Return only JSON, no markdown, no explanation.
    """

    try:
        from gemini_client import ask_gemini
        response = ask_gemini(prompt)
        clean = response.strip().replace("```json", "").replace("```", "").strip()
        return json.loads(clean)
    except Exception as e:
        print(f"[CONTEXT ENGINE] Gemini call failed, using fallback: {e}")
        # Smart fallback based on real context
        weather = context.get("weather", {})
        calendar = context.get("calendar", {})
        
        if weather.get("is_rainy"):
            return {
                "predicted_intent": "RAIN",
                "confidence": 0.90,
                "reasoning": f"It's currently {weather.get('condition', 'rainy')} in {weather.get('city', 'your area')}",
                "cart_items": [
                    {"item": "Umbrella", "quantity": 1, "reason": "Rain protection"},
                    {"item": "Hot Chocolate", "quantity": 1, "reason": "Comfort drink for rainy weather"},
                    {"item": "Maggi 6pack", "quantity": 1, "reason": "Rainy day comfort food"}
                ],
                "nudge_message": "It's raining. Stay dry kit ready."
            }
        elif calendar.get("intent") == "TRAVEL":
            return {
                "predicted_intent": "TRAVEL",
                "confidence": 0.88,
                "reasoning": f"You have '{calendar.get('title', 'a trip')}' scheduled {calendar.get('time', 'soon')}",
                "cart_items": [
                    {"item": "Travel Pillow", "quantity": 1, "reason": "Comfort for your flight"},
                    {"item": "Snack Pack", "quantity": 1, "reason": "Travel snacks"},
                    {"item": "Power Bank", "quantity": 1, "reason": "Keep devices charged"}
                ],
                "nudge_message": "Trip tomorrow. Travel kit ready."
            }
        else:
            return FALLBACK_CART


def get_context_and_cart():
    """Main function: build context + generate AI cart prediction."""
    context = build_context()
    cart = generate_smart_cart(context)
    intent = cart.get("predicted_intent", "HOST_GUESTS")
    products = MOCK_PRODUCTS.get(intent, MOCK_PRODUCTS["HOST_GUESTS"])

    return {
        "context": context,
        "cart_prediction": cart,
        "recommended_products": products
    }
