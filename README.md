# AmazonNow QuickCommerce: Cart Oracle & IntentOS 🛒⚡

Welcome to **AmazonNow**, a next-generation predictive quick commerce engine. 

Most quick-commerce apps make you search for what you want. **AmazonNow predicts what you need before you even search.** By synthesizing real-world context (time of day, live weather, Google Calendar events, and purchase history), the Smart Cart proactively builds your checkout basket so you only need to confirm and pay.

## 🌟 Key Features

### 1. 🧠 Predictive Smart Cart
- **Contextual Intelligence:** Automatically builds your cart based on the time of day, current weather, and your upcoming Google Calendar events.
- **"Your Usuals":** Uses algorithms to identify your frequent purchases based on the time of day.
- **One-Tap Checkout:** Why search for 15 items when the AI has already curated them for you?

### 2. 🎙️ Voice Assistant Cart Builder
- **Natural Language Shopping:** Tap the floating orb and say, "I'm hosting a party for 10 people tonight."
- **AI Reasoning:** The AI uses Claude/Llama via AWS Bedrock to instantly curate a cart with soft drinks, ice, snacks, and paper plates, scaling quantities automatically.

### 3. 🚨 IntentOS Crisis Routing
- **NLP Intent Classification:** Types "power cut" and the system automatically routes you to flashlights and candles, applying surge pricing and identifying the fastest delivery routes.
- **Dynamic Substitutions:** If a recommended item is out of stock, the ranking engine automatically suggests the next best substitute.

### 4. 💬 AI Review Synthesis
- Pulls hundreds of mock product reviews and uses AI to distill them into **Pros**, **Cons**, and a clear **Buy/Skip** verdict.

---

## 🏗️ Architecture

This repository is divided into two main sections:

1. **`cart-oracle-lakshan/backend`**: A high-performance Python **FastAPI** backend that acts as the intelligence layer. It integrates with AWS Bedrock for AI, DynamoDB for user history, and Google Calendar for context.
2. **`cart-oracle-lakshan/frontend`**: A gorgeous, animated **React + Vite + TailwindCSS** frontend that interfaces with the Oracle. It uses `zustand` for state management and `framer-motion` for micro-animations.

*(Note: The `amazon-intent-os-main` folder contains the legacy Next.js boilerplate that was successfully ported into the FastAPI backend.)*

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- An AWS Account (for Bedrock and DynamoDB)
- Google Cloud Console Project (for Calendar API)

### 1. Backend Setup

```bash
cd cart-oracle-lakshan/backend

# Create a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Configure Environment Variables:**
Create a `.env` file in the `backend` directory:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```

**Run the Backend:**
```bash
fastapi dev main.py
```
*The backend will run on `http://localhost:8000`.*

### 2. Frontend Setup

```bash
cd cart-oracle-lakshan/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The frontend will run on `http://localhost:5173` (or `5174`).*

---

## 🛡️ Security & Privacy Note
This codebase interacts with real user Google Calendars and AWS infrastructure. 
- **Never commit `.env`, `credentials.json`, or `token.json` to version control.** These are explicitly ignored via `.gitignore` to protect your privacy.
- The DynamoDB integration includes resilient fallback logic in case your cloud infrastructure is not yet fully configured.

---

*Built for the future of Quick Commerce.*
