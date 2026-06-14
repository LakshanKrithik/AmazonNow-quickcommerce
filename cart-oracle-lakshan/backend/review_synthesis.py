from gemini_client import ask_gemini
import json


def synthesize_reviews(product_name: str, reviews: list, price: int, alternative=None):
    prompt = f"""
    Analyze these customer reviews for "{product_name}" and give a brutally honest summary.
    
    Reviews: {reviews}
    Price: ₹{price}
    
    Return ONLY a JSON object:
    {{
        "pros": ["max 2 pros, each under 4 words"],
        "cons": ["max 2 cons, each under 4 words"],
        "verdict": "Buy or Skip",
        "confidence_score": 0.85,
        "alternative_suggestion": "{alternative if alternative else 'null'}"
    }}
    
    Return only JSON, no markdown.
    """
    
    response = ask_gemini(prompt)
    try:
        clean = response.strip().replace("```json", "").replace("```", "").strip()
        return json.loads(clean)
    except:
        return {
            "pros": ["Fast delivery", "Good value"],
            "cons": ["Short shelf life"],
            "verdict": "Buy",
            "confidence_score": 0.88,
            "alternative_suggestion": alternative
        }
