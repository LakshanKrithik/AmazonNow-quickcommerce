# weather_intelligence.py - Real weather data using wttr.in (no API key needed)
import urllib.request
import json


def get_real_weather(city: str = "Chennai") -> dict:
    """Fetch real weather data from wttr.in (free, no API key)."""
    try:
        url = f"https://wttr.in/{city}?format=j1"
        req = urllib.request.Request(url, headers={"User-Agent": "curl/7.68.0"})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())

        current = data["current_condition"][0]
        return {
            "condition": current["weatherDesc"][0]["value"],
            "temp": int(current["temp_C"]),
            "feels_like": int(current["FeelsLikeC"]),
            "humidity": int(current["humidity"]),
            "city": city,
            "is_rainy": any(
                w in current["weatherDesc"][0]["value"].lower()
                for w in ["rain", "drizzle", "shower", "thunder", "storm"]
            )
        }
    except Exception as e:
        print(f"[WEATHER] Failed to fetch real weather: {e}")
        return {
            "condition": "Clear",
            "temp": 30,
            "feels_like": 33,
            "humidity": 70,
            "city": city,
            "is_rainy": False
        }
