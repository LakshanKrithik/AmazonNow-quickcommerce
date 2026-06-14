# smart_cart_builder.py - Builds cart suggestions based on weather and time
from weather_intelligence import get_real_weather
from datetime import datetime


def get_weather_cart(city: str = "Chennai") -> dict:
    """Build a cart based on current real weather."""
    weather = get_real_weather(city)
    condition = weather["condition"].lower()
    temp = weather["temp"]

    items = []

    # Cold / Rainy weather
    if weather["is_rainy"] or temp < 22:
        items = [
            {"name": "Maggi 12 Pack", "price": 120, "delivery": "8 mins", "rating": 4.6, "reason": "Comfort food for cold/rainy weather"},
            {"name": "Hot Chocolate Mix", "price": 149, "delivery": "10 mins", "rating": 4.5, "reason": "Warm drink for the weather"},
            {"name": "Umbrella Auto-open", "price": 299, "delivery": "12 mins", "rating": 4.3, "reason": "It's raining outside"},
            {"name": "Raincoat Adults", "price": 499, "delivery": "15 mins", "rating": 4.1, "reason": "Stay dry outdoors"},
            {"name": "Blanket Fleece", "price": 599, "delivery": "15 mins", "rating": 4.4, "reason": "Cozy up in cold weather"},
            {"name": "Soup Knorr Tomato", "price": 45, "delivery": "8 mins", "rating": 4.2, "reason": "Hot soup for the rainy evening"},
        ]
        reasoning = f"It's {weather['condition']} and {temp}°C — perfect for warm food and rain gear"

    # Hot weather
    elif temp > 35:
        items = [
            {"name": "Bisleri Water 5L", "price": 55, "delivery": "8 mins", "rating": 4.2, "reason": "Stay hydrated in heat"},
            {"name": "Real Mango Juice 1L", "price": 99, "delivery": "10 mins", "rating": 4.4, "reason": "Cool refreshing drink"},
            {"name": "Ice Cream Tub 500ml", "price": 199, "delivery": "10 mins", "rating": 4.6, "reason": "Beat the heat"},
            {"name": "ORS Sachets Pack", "price": 30, "delivery": "8 mins", "rating": 4.5, "reason": "Prevent dehydration"},
            {"name": "Coconut Water 1L", "price": 60, "delivery": "8 mins", "rating": 4.4, "reason": "Natural cooling drink"},
            {"name": "Sunscreen SPF 50", "price": 350, "delivery": "12 mins", "rating": 4.3, "reason": "Sun protection for hot day"},
        ]
        reasoning = f"It's {temp}°C and hot — hydration and cooling essentials"

    # Normal / Warm weather
    else:
        items = [
            {"name": "Amul Taaza Milk 1L", "price": 72, "delivery": "8 mins", "rating": 4.5, "reason": "Daily essential"},
            {"name": "Britannia Bread", "price": 45, "delivery": "8 mins", "rating": 4.3, "reason": "Breakfast staple"},
            {"name": "Eggs (6 pack)", "price": 55, "delivery": "10 mins", "rating": 4.4, "reason": "Protein for the day"},
            {"name": "Fruits Combo Pack", "price": 120, "delivery": "10 mins", "rating": 4.5, "reason": "Healthy snacking"},
            {"name": "Coca-Cola 750ml", "price": 40, "delivery": "8 mins", "rating": 4.4, "reason": "Evening refreshment"},
            {"name": "Lays Magic Masala", "price": 20, "delivery": "8 mins", "rating": 4.5, "reason": "Light snack"},
        ]
        reasoning = f"Pleasant {temp}°C weather — your daily essentials"

    return {
        "items": items,
        "reasoning": reasoning,
        "weather": weather
    }


def get_time_cart() -> dict:
    """Build a cart based on current time of day."""
    hour = datetime.now().hour

    # Early morning (5-9)
    if 5 <= hour < 9:
        items = [
            {"name": "Amul Taaza Milk 1L", "price": 72, "delivery": "8 mins", "rating": 4.5, "reason": "Morning tea/coffee"},
            {"name": "Britannia Bread", "price": 45, "delivery": "8 mins", "rating": 4.3, "reason": "Breakfast toast"},
            {"name": "Eggs (6 pack)", "price": 55, "delivery": "10 mins", "rating": 4.4, "reason": "Breakfast protein"},
            {"name": "Amul Butter 100g", "price": 56, "delivery": "8 mins", "rating": 4.6, "reason": "Butter toast"},
            {"name": "Cornflakes 500g", "price": 170, "delivery": "10 mins", "rating": 4.3, "reason": "Quick cereal breakfast"},
            {"name": "Fresh Juice 1L", "price": 80, "delivery": "10 mins", "rating": 4.4, "reason": "Morning vitamin boost"},
        ]
        reasoning = "Good morning! Here's your breakfast essentials"
        label = "Breakfast"

    # Late morning (9-12)
    elif 9 <= hour < 12:
        items = [
            {"name": "Green Tea 25 bags", "price": 120, "delivery": "10 mins", "rating": 4.4, "reason": "Mid-morning boost"},
            {"name": "Dry Fruits Mix 200g", "price": 250, "delivery": "10 mins", "rating": 4.5, "reason": "Healthy snack"},
            {"name": "Dark Fantasy Biscuit", "price": 40, "delivery": "8 mins", "rating": 4.7, "reason": "Tea-time snack"},
            {"name": "Bisleri Water 5L", "price": 55, "delivery": "8 mins", "rating": 4.2, "reason": "Stay hydrated"},
            {"name": "Protein Bar", "price": 80, "delivery": "10 mins", "rating": 4.3, "reason": "Pre-lunch energy"},
            {"name": "Banana (6 pcs)", "price": 40, "delivery": "8 mins", "rating": 4.5, "reason": "Quick fruit snack"},
        ]
        reasoning = "Mid-morning — time for a healthy snack and hydration"
        label = "Mid-Morning Snacks"

    # Lunch time (12-15)
    elif 12 <= hour < 15:
        items = [
            {"name": "Rice 1kg Basmati", "price": 120, "delivery": "10 mins", "rating": 4.5, "reason": "Lunch staple"},
            {"name": "Dal Tadka Ready", "price": 65, "delivery": "10 mins", "rating": 4.2, "reason": "Quick lunch"},
            {"name": "Curd 400g", "price": 40, "delivery": "8 mins", "rating": 4.4, "reason": "Goes with rice"},
            {"name": "Pickle Mango 200g", "price": 55, "delivery": "10 mins", "rating": 4.3, "reason": "Lunch accompaniment"},
            {"name": "Papad Pack", "price": 30, "delivery": "8 mins", "rating": 4.1, "reason": "Side dish"},
            {"name": "Buttermilk 1L", "price": 35, "delivery": "8 mins", "rating": 4.4, "reason": "Post-lunch digestion"},
        ]
        reasoning = "Lunch time — quick meal staples delivered in minutes"
        label = "Lunch Essentials"

    # Evening snacks (15-19)
    elif 15 <= hour < 19:
        items = [
            {"name": "Samosa (4 pcs)", "price": 60, "delivery": "10 mins", "rating": 4.5, "reason": "Evening chai snack"},
            {"name": "Chai Premix 500g", "price": 150, "delivery": "10 mins", "rating": 4.3, "reason": "Evening chai time"},
            {"name": "Kurkure Masala Munch", "price": 20, "delivery": "8 mins", "rating": 4.3, "reason": "Crunchy snack"},
            {"name": "Coca-Cola 750ml", "price": 40, "delivery": "8 mins", "rating": 4.4, "reason": "Evening refreshment"},
            {"name": "Haldirams Bhujia 200g", "price": 65, "delivery": "10 mins", "rating": 4.6, "reason": "Namkeen for guests"},
            {"name": "Hide & Seek Biscuit", "price": 35, "delivery": "8 mins", "rating": 4.5, "reason": "Sweet with tea"},
        ]
        reasoning = "Evening chai time — snacks and refreshments"
        label = "Evening Snacks"

    # Dinner (19-22)
    elif 19 <= hour < 22:
        items = [
            {"name": "Maggi 12 Pack", "price": 120, "delivery": "8 mins", "rating": 4.6, "reason": "Quick dinner fix"},
            {"name": "Paneer 200g", "price": 80, "delivery": "10 mins", "rating": 4.4, "reason": "Dinner protein"},
            {"name": "Roti Ready Pack 10", "price": 60, "delivery": "10 mins", "rating": 4.2, "reason": "No time to cook"},
            {"name": "Ice Cream Tub 500ml", "price": 199, "delivery": "10 mins", "rating": 4.6, "reason": "After dinner dessert"},
            {"name": "Lays Magic Masala", "price": 20, "delivery": "8 mins", "rating": 4.5, "reason": "Late night munchies"},
            {"name": "Thums Up 2L", "price": 90, "delivery": "10 mins", "rating": 4.5, "reason": "Dinner drink"},
        ]
        reasoning = "Dinner time — quick meals and comfort food"
        label = "Dinner & Night Snacks"

    # Late night (22-5)
    else:
        items = [
            {"name": "Cup Noodles Masala", "price": 45, "delivery": "8 mins", "rating": 4.3, "reason": "Late night hunger"},
            {"name": "Maggi 4 Pack", "price": 48, "delivery": "8 mins", "rating": 4.6, "reason": "Midnight snack"},
            {"name": "Chocolate Bar Pack", "price": 60, "delivery": "8 mins", "rating": 4.5, "reason": "Sweet craving"},
            {"name": "Cold Coffee 200ml", "price": 35, "delivery": "8 mins", "rating": 4.3, "reason": "Stay awake drink"},
            {"name": "Chips Combo 3 packs", "price": 60, "delivery": "8 mins", "rating": 4.4, "reason": "Netflix munchies"},
            {"name": "Water Bottle 1L", "price": 20, "delivery": "8 mins", "rating": 4.5, "reason": "Hydrate before bed"},
        ]
        reasoning = "Late night cravings — quick bites delivered fast"
        label = "Midnight Munchies"

    return {
        "items": items,
        "reasoning": reasoning,
        "label": label,
        "hour": hour
    }
