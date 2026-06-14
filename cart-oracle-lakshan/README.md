# Amazon Now — Smart Cart

A quick commerce application that predicts what you need before you search. Uses real-time weather, calendar events, and time of day to build intelligent shopping carts.

## Features

- **Smart Cart** — AI-predicted cart based on context (weather + calendar + time)
- **Weather Cart** — Real-time weather-based suggestions (rain gear for rain, cold drinks for heat)
- **Time-Based Cart** — Breakfast items in the morning, snacks in the evening, dinner at night
- **Voice Search** — Speak your need, AI classifies and finds products
- **Crisis Bundles** — Quick one-tap bundles for urgent situations (party, baby, travel, medicine)
- **Product Ranking** — Algorithmic scoring with brand preference, delivery time, and surge pricing
- **Review Synthesis** — AI-generated product review summaries
- **Add/Remove Items** — Full cart editing with quantity controls
- **Browse Catalog** — Zepto-style product browsing with category filters

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + Zustand + Framer Motion
- **Backend:** FastAPI (Python)
- **AI:** Google Gemini 2.5 Flash
- **Database:** DynamoDB
- **Weather:** wttr.in (free, no API key required)

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env     # Fill in your API keys
python -m uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key |
| `AWS_ACCESS_KEY_ID` | AWS access key (for DynamoDB) |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `AWS_REGION` | AWS region (default: ap-south-1) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/context` | AI-predicted context + cart |
| GET | `/api/cart/weather` | Weather-based cart |
| GET | `/api/cart/time` | Time-based cart |
| POST | `/api/intent` | Voice/text intent classification |
| POST | `/api/inventory/match` | Product ranking + matching |
| GET | `/api/predictions/{user_id}` | Your Usuals predictions |
| GET | `/reviews/{product_name}` | AI review synthesis |
| POST | `/api/system/trigger` | System event simulation |
