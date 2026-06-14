# bedrock_client.py - Centralized Amazon Bedrock AI service layer
# Uses Claude Sonnet 4.5 via AWS Bedrock Runtime

import boto3
import json
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration from environment
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "")
BEDROCK_MODEL_ID = os.getenv("BEDROCK_MODEL_ID", "us.anthropic.claude-sonnet-4-20250514-v1:0")

# Initialize Bedrock client
_client = None


def _get_client():
    """Lazy initialization of Bedrock Runtime client."""
    global _client
    if _client is None:
        if not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY:
            raise Exception("AWS credentials not configured. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env")
        _client = boto3.client(
            "bedrock-runtime",
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )
    return _client


def invoke_bedrock(prompt: str, max_tokens: int = 1024, temperature: float = 0.2) -> str:
    """
    Core function to invoke Amazon Nova Pro on Bedrock.
    Returns the raw text response.
    """
    client = _get_client()

    response = client.converse(
        modelId=BEDROCK_MODEL_ID,
        messages=[
            {
                "role": "user",
                "content": [{"text": prompt}]
            }
        ],
        inferenceConfig={
            "maxTokens": max_tokens,
            "temperature": temperature,
        }
    )

    output = response.get("output", {})
    message = output.get("message", {})
    content = message.get("content", [])

    if content and len(content) > 0:
        return content[0].get("text", "")

    raise Exception("Empty response from Bedrock")


def invoke_bedrock_json(prompt: str, max_tokens: int = 1024) -> dict:
    """
    Invoke Bedrock and parse response as JSON.
    Handles markdown code blocks that models sometimes add.
    """
    raw = invoke_bedrock(prompt, max_tokens=max_tokens, temperature=0.1)
    cleaned = raw.strip().replace("```json", "").replace("```", "").strip()
    return json.loads(cleaned)


# ============================================================
# Reusable AI functions
# ============================================================

def get_recommendations(context: dict) -> dict:
    """
    Generate product recommendations based on user context.
    Used by the smart cart prediction engine.
    """
    prompt = f"""You are a quick commerce recommendation engine for an Amazon-like grocery delivery app.

User context:
- Purchase history: {context.get('user', {}).get('purchase_history', [])}
- Upcoming calendar event: {context.get('calendar', {})}
- All events: {context.get('all_events', [])}
- Current weather: {context.get('weather', {})}
- Time: {context.get('time', '')}
- Day: {context.get('day', '')}

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

Return only valid JSON, no other text."""

    try:
        return invoke_bedrock_json(prompt)
    except Exception as e:
        print(f"[BEDROCK] get_recommendations failed: {e}")
        return None


def analyze_purchase_history(product_name: str, reviews: list, price: int) -> dict:
    """
    Analyze product reviews and generate a synthesis.
    Used by the review summary feature.
    """
    prompt = f"""Analyze these customer reviews for "{product_name}" and give a concise honest summary.

Reviews: {reviews}
Price: ₹{price}

Return ONLY a JSON object:
{{
    "pros": ["max 2 pros, each under 5 words"],
    "cons": ["max 2 cons, each under 5 words"],
    "verdict": "Buy or Skip",
    "confidence_score": 0.85
}}

Return only valid JSON, no other text."""

    try:
        return invoke_bedrock_json(prompt, max_tokens=256)
    except Exception as e:
        print(f"[BEDROCK] analyze_purchase_history failed: {e}")
        return None


def generate_event_based_suggestions(transcript: str) -> dict:
    """
    Classify user intent from natural language text.
    Used by the voice search / intent classification feature.
    """
    prompt = f"""You are an NLP routing engine for a quick commerce grocery delivery app.
Map the user's situation into exactly one crisis category and identify the target product category.

Valid categories: POWER_CUT_CRISIS, PARTY_CRISIS, BABY_CRISIS, TRAVEL_CRISIS, MEDICINE_CRISIS, RAIN_CRISIS, COOKING_CRISIS, PET_CRISIS.

User input: "{transcript}"

Return ONLY a JSON object:
{{"macro_crisis": "CATEGORY_NAME", "target_category": "product_category"}}

Return only valid JSON, no other text."""

    try:
        return invoke_bedrock_json(prompt, max_tokens=128)
    except Exception as e:
        print(f"[BEDROCK] generate_event_based_suggestions failed: {e}")
        return None


def classify_calendar_event(event_summary: str, event_time: str) -> dict:
    """
    Classify a calendar event into one of the supported intents.
    Used by the new Google Calendar integration for Smart Cart context.
    """
    prompt = f"""You are an intelligent scheduling assistant for a quick commerce grocery delivery app.
Classify the following calendar event into exactly one of these intent categories:
HOST_GUESTS (e.g. dinner, friends over, hosting)
PARTY (e.g. birthday, celebration, house party)
TRAVEL (e.g. flight, train, packing, trip)
ROUTINE (e.g. meeting, work, gym, standard events)

Event Title: "{event_summary}"
Event Time: "{event_time}"

Return ONLY a JSON object:
{{"intent": "CATEGORY_NAME", "confidence": 0.95}}

Return only valid JSON, no other text."""

    try:
        result = invoke_bedrock_json(prompt, max_tokens=128)
        if result and "intent" in result:
            # Ensure it falls back to ROUTINE if output is weird
            if result["intent"] not in ["HOST_GUESTS", "PARTY", "TRAVEL", "ROUTINE"]:
                result["intent"] = "ROUTINE"
            return result
        return {"intent": "ROUTINE", "confidence": 0.0}
    except Exception as e:
        print(f"[BEDROCK] classify_calendar_event failed: {e}")
        return {"intent": "ROUTINE", "confidence": 0.0}
