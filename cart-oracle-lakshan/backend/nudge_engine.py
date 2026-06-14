import boto3
import os
from dotenv import load_dotenv

load_dotenv()


def send_nudge(message: str, phone_number: str = None):
    # For demo purposes we'll just return the nudge
    # Real SNS would need a verified phone number
    nudge = {
        "message": message,
        "sent": True,
        "channel": "push_notification",
        "timestamp": "now"
    }
    return nudge


def generate_nudge_from_context(cart_prediction: dict):
    return {
        "title": "Cart Oracle",
        "body": cart_prediction.get("nudge_message", "Your smart cart is ready"),
        "action": "OPEN_CART",
        "urgency": "high"
    }
