import boto3
import os
from dotenv import load_dotenv

load_dotenv()

dynamodb = boto3.resource(
    'dynamodb',
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

table = dynamodb.Table('cart-oracle-users')


def save_cart(user_id: str, cart_data: dict):
    table.put_item(Item={
        'user_id': user_id,
        'cart': str(cart_data),
        'timestamp': 'now'
    })
    return {"saved": True}


def get_user_history(user_id: str):
    response = table.get_item(Key={'user_id': user_id})
    return response.get('Item', {})
