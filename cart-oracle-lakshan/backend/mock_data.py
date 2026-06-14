MOCK_USER = {
    "user_id": "u_001",
    "name": "Lakshan",
    "location": "Chennai",
    "purchase_history": [
        {"item": "Maggi", "count": 8, "last_bought": "2 days ago", "frequency": "weekly"},
        {"item": "Bread", "count": 12, "last_bought": "5 days ago", "frequency": "6 days"},
        {"item": "Milk", "count": 20, "last_bought": "1 day ago", "frequency": "3 days"},
        {"item": "Coffee", "count": 6, "last_bought": "3 days ago", "frequency": "5 days"},
        {"item": "Eggs", "count": 4, "last_bought": "7 days ago", "frequency": "weekly"},
    ]
}

MOCK_CALENDAR = [
    {"event": "Friends coming over", "time": "Tonight 8pm", "intent": "HOST_GUESTS"},
    {"event": "Birthday party", "time": "Tomorrow 6pm", "intent": "PARTY"},
    {"event": "Flight to Bangalore", "time": "Tomorrow 9am", "intent": "TRAVEL"},
]

MOCK_WEATHER = {
    "condition": "Heavy Rain",
    "temp": 24,
    "city": "Chennai",
    "intent": "RAIN"
}

MOCK_PRODUCTS = {
    "HOST_GUESTS": [
        {"name": "Maggi 12pack", "price": 120, "delivery": "8 mins", "rating": 4.5, "reviews": ["Quick to cook", "Kids love it", "Stock up essential"]},
        {"name": "Paper Plates 50pc", "price": 89, "delivery": "10 mins", "rating": 4.2, "reviews": ["Good quality", "Sturdy enough", "Value for money"]},
        {"name": "Soft Drinks 6pack", "price": 180, "delivery": "12 mins", "rating": 4.6, "reviews": ["Chilled fast", "Party essential", "Good variety"]},
    ],
    "RAIN": [
        {"name": "Umbrella", "price": 299, "delivery": "15 mins", "rating": 4.3, "reviews": ["Sturdy build", "Windproof", "Good size"]},
        {"name": "Hot Chocolate", "price": 149, "delivery": "8 mins", "rating": 4.7, "reviews": ["Comforting", "Rich taste", "Perfect for rain"]},
        {"name": "Maggi 6pack", "price": 65, "delivery": "8 mins", "rating": 4.5, "reviews": ["Rainy day staple", "Quick meal", "Always stock this"]},
    ],
    "TRAVEL": [
        {"name": "Travel Pillow", "price": 349, "delivery": "20 mins", "rating": 4.4, "reviews": ["Comfortable", "Compact", "Good for flights"]},
        {"name": "Snack Pack", "price": 199, "delivery": "10 mins", "rating": 4.5, "reviews": ["Good variety", "Filling", "Travel essential"]},
        {"name": "Power Bank 10000mah", "price": 899, "delivery": "25 mins", "rating": 4.6, "reviews": ["Fast charging", "Lightweight", "Reliable"]},
    ]
}
