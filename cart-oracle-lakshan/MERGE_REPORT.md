# Merge Report: Cart Oracle + Amazon IntentOS

## Project A (Primary): cart-oracle-lakshan
**Stack:** React (Vite) + FastAPI + DynamoDB + Gemini AI

### Features Found:
1. **Context Engine** - Builds user context from calendar, weather, time, purchase history
2. **Smart Cart Prediction** - Gemini AI predicts what user needs before they search
3. **Review Synthesis** - AI-powered review summarization (pros/cons/verdict)
4. **Nudge Engine** - Push notification generation from context
5. **Scenario Switching** - Demo mode to switch between HOST_GUESTS, RAIN, TRAVEL
6. **DynamoDB Integration** - Save/retrieve cart history
7. **Frontend Components:**
   - ContextDashboard (weather, calendar, time, intent display)
   - SmartCart (pre-built cart with one-tap checkout)
   - NudgeNotification (push notification banner)
   - ReviewCard (empty placeholder)

### Backend API Routes:
- `GET /` - Health check
- `GET /context` - Get context + cart prediction
- `POST /context/switch` - Switch demo scenario
- `GET /reviews/{product_name}` - AI review synthesis
- `GET /nudge` - Generate nudge notification
- `GET /products/{intent}` - Get products by intent
- `POST /cart/save` - Save cart to DynamoDB
- `GET /cart/history/{user_id}` - Get user history

### Environment Variables:
- `GEMINI_API_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`

---

## Project B (Secondary): amazon-intent-os-main
**Stack:** Next.js 16 (TypeScript) + Bedrock AI + Zustand + Framer Motion

### Features Found:
1. **Crisis Grid** - 8 crisis category tiles (Party, Baby, Travel, Medicine, Rain, Power Cut, Cooking, Pet)
2. **Voice Transcriber** - Speech-to-text search with AI intent routing
3. **Showdown Drawer** - Product comparison bottom sheet with scored items
4. **Product Ranking Engine** - Algorithmic scoring with brand preference, ETA, surge pricing
5. **Alternative Flagging** - Out-of-stock detection with smart alternative suggestion
6. **Swipe to Resolve** - Gesture-based checkout (framer-motion drag)
7. **NudgeModal** - Weather alert overlay modal
8. **Your Usuals** - Purchase history-based prediction (time-of-day matching)
9. **Prediction Engine** - Frequency + time-match scoring for routine purchases
10. **Admin Control Panel** - Judge demo panel to trigger system events
11. **Zustand Stores** - Cart, Crisis, System state management
12. **Speech-to-Text Hook** - Browser SpeechRecognition API
13. **Polling Hook** - Interval-based data polling
14. **Massive Seed Data** - 50+ products across 8 crisis categories
15. **Bedrock AI Integration** - Llama 3.1 for intent classification
16. **Zod Validation** - Input/output schema validation
17. **Amazon-style Header/BottomNav** - Mobile-first layout

### Frontend Routes:
- `/` (customer) - Main consumer dashboard
- `/admin` - Judge control panel

### API Routes (Next.js):
- `POST /api/intent` - AI intent classification from text
- `POST /api/inventory/match` - Product matchmaking with scoring
- `POST /api/system/trigger` - System event simulation

### Dependencies Unique to Project B:
- `@aws-sdk/client-bedrock-runtime`
- `framer-motion`
- `lucide-react`
- `zustand`
- `zod`
- `next`

---

## Conflicts Detected

### 1. Frontend Framework Conflict (MAJOR)
- **Project A:** React + Vite (SPA, JSX, no routing)
- **Project B:** Next.js 16 (App Router, TypeScript, file-based routing)
- **Resolution:** Keep Project A's Vite+React setup as primary. Port Project B's components as new pages/views within the Vite app using react-router-dom.

### 2. AI Provider Conflict
- **Project A:** Google Gemini (gemini-2.5-flash)
- **Project B:** AWS Bedrock (Llama 3.1 8B)
- **Resolution:** Per instructions, do NOT switch AI providers. Keep Gemini as primary. Port Project B's intent classification to work via Gemini on the FastAPI backend.

### 3. Backend Architecture Conflict (MAJOR)
- **Project A:** Standalone FastAPI (Python)
- **Project B:** Next.js API routes (TypeScript, server-side)
- **Resolution:** Port all Project B API logic into FastAPI endpoints. The scoring/ranking logic will be rewritten in Python.

### 4. State Management
- **Project A:** React useState/useEffect
- **Project B:** Zustand stores
- **Resolution:** Add Zustand to Project A for the new crisis/cart features.

### 5. Product Data Model
- **Project A:** Simple `{name, price, delivery, rating, reviews}`
- **Project B:** Rich `{asin, brand, product_name, category, macro_crisis, stock_count, base_price, surge_multiplier, eta_mins, ...}`
- **Resolution:** Extend Project A's mock data to use Project B's richer model.

### 6. Environment Variables
- Both use `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` (compatible)
- Project A uniquely uses `GEMINI_API_KEY`
- No actual conflict, just merge into one .env

---

## Merge Strategy

### Phase 1: Backend Integration (FastAPI)
1. Add Project B's seed data as a new Python module
2. Add intent classification endpoint (using Gemini instead of Bedrock)
3. Add inventory match endpoint with ranking engine (ported to Python)
4. Add system trigger endpoint
5. Keep all existing Project A endpoints intact

### Phase 2: Frontend Integration
1. Install new dependencies: `zustand`, `framer-motion`, `lucide-react`, `react-router-dom`
2. Port Zustand stores from Project B
3. Port TypeScript types (convert to JSDoc or keep as reference)
4. Add new pages: Crisis Dashboard, Admin Panel
5. Add components: CrisisGrid, VoiceTranscriber, ShowdownDrawer, ProductCard, etc.
6. Add react-router-dom for navigation between views
7. Keep existing Cart Oracle UI as one view

### Phase 3: Verification
1. Backend starts and all endpoints respond
2. Frontend builds successfully
3. Navigation between views works
4. Crisis flow works end-to-end

---

## Files to Create/Modify

### Backend (New Files):
- `backend/seed_data_extended.py` - Project B's 50+ product catalog
- `backend/ranking_engine.py` - Scoring/ranking logic ported from TS
- `backend/prediction_engine.py` - Your Usuals prediction logic
- `backend/intent_classifier.py` - Gemini-based intent classification

### Backend (Modified):
- `backend/main.py` - Add new API endpoints

### Frontend (New Files):
- `frontend/src/stores/useCrisisStore.js` - Crisis state
- `frontend/src/stores/useCartStore.js` - Cart state  
- `frontend/src/stores/useSystemStore.js` - System state
- `frontend/src/components/crisis/CrisisGrid.jsx`
- `frontend/src/components/crisis/VoiceTranscriber.jsx`
- `frontend/src/components/showdown/ShowdownDrawer.jsx`
- `frontend/src/components/showdown/ProductCard.jsx`
- `frontend/src/components/showdown/TrustBadge.jsx`
- `frontend/src/components/showdown/AlternativeFlag.jsx`
- `frontend/src/components/shared/NudgeModal.jsx`
- `frontend/src/components/shared/SwipeToResolve.jsx`
- `frontend/src/components/suggestions/YourUsuals.jsx`
- `frontend/src/components/layout/Header.jsx`
- `frontend/src/components/layout/BottomNav.jsx`
- `frontend/src/pages/CrisisPage.jsx`
- `frontend/src/pages/AdminPage.jsx`
- `frontend/src/hooks/useSpeechToText.js`

### Frontend (Modified):
- `frontend/package.json` - New dependencies
- `frontend/src/App.jsx` - Add router
- `frontend/src/index.css` - Add Project B styles
