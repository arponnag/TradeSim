# TradeSim Frontend & Backend Architecture

## Executive Summary

**TradeSim is a client-side only application** with no traditional backend server. All game logic, calculations, and state management happen in the browser using React. This document explains the frontend architecture, why we chose this approach, and what would be needed if we add a backend later.

---

## Frontend Architecture

### Technology Stack

#### Core Framework
- **React 18.2.0** - UI library for building component-based interfaces
- **Vite 5.0.8** - Build tool and development server (faster than Create React App)

#### UI & Styling
- **Tailwind CSS 3.3.6** - Utility-first CSS framework for rapid styling
- **PostCSS** - CSS processing and autoprefixing
- **Custom CSS** (`index.css`) - Retro pixel-art aesthetic styling

#### Data Visualization
- **Chart.js 4.4.0** - Professional charting library
- **react-chartjs-2 5.2.0** - React wrapper for Chart.js

#### Additional Libraries
- **react-confetti 6.1.0** - Celebration animations for achievements

### Frontend Structure

```
src/
├── main.jsx                    # Application entry point
├── App.jsx                     # Root component, game orchestration
├── index.css                   # Global styles, retro theme
│
├── components/                 # React UI components
│   ├── InputScreen.jsx         # Initial player setup
│   ├── ModeSelect.jsx          # Game mode selection
│   ├── BattleMode.jsx         # Battle mode gameplay
│   ├── KcoinStory.jsx         # Story mode gameplay
│   ├── SimulatorDashboard.jsx  # Main game dashboard
│   ├── EventScreen.jsx        # Random event handling
│   ├── EndScreen.jsx          # Game completion screen
│   ├── CharacterAvatar.jsx    # Player character display
│   ├── ErrorBoundary.jsx      # Error handling wrapper
│   └── [15+ more components]  # Specialized UI components
│
├── core/                       # Core business logic
│   ├── financeEngine.js        # Financial calculations
│   └── gameRules.js            # Game rules, badges, events
│
├── modes/                      # Game mode implementations
│   ├── battle/
│   │   └── config.js          # Battle mode questions
│   └── story/
│       ├── index.js           # Story mode exports
│       └── kcoinScenario.js   # Kcoin Story branching data
│
├── utils/                      # Helper functions
│   ├── gameLogic.js           # Financial calculations, events
│   ├── gameLevels.js          # Level definitions
│   ├── backgrounds.js         # Background image management
│   ├── funFacts.js            # Educational facts
│   └── [more utilities]
│
└── knowledge/                  # Educational content
    └── index.js               # Financial terms, lessons
```

### Frontend Responsibilities

#### 1. **State Management**
- **React Hooks (`useState`, `useEffect`)**: Manage all game state locally
- **Component State**: Each component manages its own UI state
- **Prop Drilling**: State passed down from `App.jsx` to child components

**Example:**
```javascript
// App.jsx - Top-level state
const [portfolio, setPortfolio] = useState({ cash: 5000, stocks: 0, debt: 0 });
const [gameState, setGameState] = useState('input');
const [age, setAge] = useState(22);

// Passed to child components
<SimulatorDashboard portfolio={portfolio} age={age} />
```

#### 2. **Financial Calculations**
- **Client-Side Calculations**: All math happens in the browser
- **Real-time Updates**: Portfolio values update instantly on user actions
- **Deterministic Logic**: Same inputs always produce same outputs

**Location:** `core/financeEngine.js`, `utils/gameLogic.js`

**Example:**
```javascript
// Calculate compound interest client-side
export function calculateCompoundInterest(principal, rate, years) {
  return principal * Math.pow(1 + rate / 100, years);
}

// Used in components
const futureValue = calculateCompoundInterest(5000, 7, 30);
```

#### 3. **Game Logic & Rules**
- **Scenario Branching**: Story mode branching logic (`kcoinScenario.js`)
- **Question Pools**: Battle mode questions (`battle/config.js`)
- **Badge System**: Achievement tracking (`core/gameRules.js`)
- **Random Events**: Event generation and handling

**Location:** `core/gameRules.js`, `modes/`, `utils/gameLogic.js`

#### 4. **UI Rendering**
- **Component-Based**: Modular, reusable React components
- **Responsive Design**: Tailwind CSS for mobile/desktop compatibility
- **Real-time Charts**: Chart.js for portfolio visualization
- **Error Handling**: ErrorBoundary for graceful error display

#### 5. **Data Persistence (Client-Side Only)**
- **Session Storage**: Game state lost on page refresh (intentional for MVP)
- **No Database**: All data exists only in browser memory
- **Future**: Can add `localStorage` for save/load functionality

---

## Backend Architecture

### Current Status: **No Backend**

TradeSim currently has **zero backend infrastructure**. There is no:
- ❌ Server (Node.js, Python, etc.)
- ❌ Database (PostgreSQL, MongoDB, etc.)
- ❌ API endpoints
- ❌ Authentication system
- ❌ User accounts
- ❌ Data persistence
- ❌ Real-time features

### Why No Backend?

#### 1. **MVP Philosophy: Start Simple**
- **Goal**: Build a working educational game quickly
- **Reality**: Backend adds complexity, cost, and deployment overhead
- **Decision**: Prove the concept client-side first, add backend later if needed

#### 2. **Cost Efficiency**
- **Static Hosting**: Free/cheap (Vercel, Netlify offer free tiers)
- **No Server Costs**: $0/month for hosting
- **No Database Costs**: $0/month for data storage
- **Scales Automatically**: CDN handles traffic spikes

#### 3. **Privacy & Compliance**
- **No Data Collection**: User data never leaves their browser
- **GDPR Compliant**: No user data = no privacy concerns
- **No Security Risks**: No server = no attack surface for data breaches

#### 4. **Performance**
- **Instant Load**: No API calls = faster initial load
- **Offline Capable**: Works without internet (after initial load)
- **No Latency**: All calculations happen instantly in browser

#### 5. **Educational Transparency**
- **Auditable Code**: All game logic is visible in browser DevTools
- **Deterministic**: Same inputs always produce same outputs
- **No "Black Box"**: Players can inspect calculations if curious

### What We're Missing (Trade-offs)

#### 1. **User Accounts & Progress Tracking**
- **Current**: Game resets on page refresh
- **Future Need**: Save progress, track learning over time
- **Solution**: Add backend with user authentication

#### 2. **Leaderboards & Social Features**
- **Current**: No way to compare scores
- **Future Need**: Competitive elements, sharing achievements
- **Solution**: Backend API for score storage and retrieval

#### 3. **Analytics & Learning Insights**
- **Current**: No data on how players learn
- **Future Need**: Track which questions are hardest, where players struggle
- **Solution**: Backend to collect anonymized usage data

#### 4. **Real Market Data**
- **Current**: Synthetic Kcoin prices
- **Future Need**: Real stock/crypto prices from APIs (Finnhub, Alpha Vantage)
- **Solution**: Backend proxy to avoid CORS, cache data, manage API keys

#### 5. **Content Management**
- **Current**: Questions hardcoded in JavaScript files
- **Future Need**: Non-developers updating questions/content
- **Solution**: Backend CMS or admin panel

---

## Deployment Architecture

### Current: Static Site Hosting

```
User's Browser
    ↓
CDN (Vercel/Netlify)
    ↓
Static Files (HTML, CSS, JS)
    ↓
React App Runs in Browser
    ↓
All Logic Executes Client-Side
```

**Deployment Process:**
1. `npm run build` → Creates `dist/` folder with static files
2. Upload `dist/` to Vercel/Netlify
3. CDN serves files globally
4. **Deploy time: <60 seconds**

### Future: Hybrid Architecture (If Needed)

```
User's Browser
    ↓
CDN (Static Files)
    ↓
React App
    ↓
API Calls → Backend Server
    ↓
Database (User Data, Scores)
    ↓
External APIs (Market Data)
```

**When to Add Backend:**
- User accounts needed
- Real-time multiplayer features
- Complex analytics requirements
- Partner integrations requiring server-side logic

---

## Technical Details

### Build Process (Vite)

**Development:**
```bash
npm run dev
# Starts Vite dev server on port 7971
# Hot Module Replacement (HMR) for instant updates
# Fast refresh for React components
```

**Production Build:**
```bash
npm run build
# Bundles React app into optimized static files
# Minifies JavaScript and CSS
# Tree-shakes unused code
# Output: dist/ folder (ready for deployment)
```

**Vite Configuration:**
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 7971,        // Custom port
    host: true,         // Accessible on network
    hmr: { overlay: true } // Error overlay
  }
});
```

### State Management Flow

```
App.jsx (Root State)
    ├── portfolio: { cash, stocks, debt }
    ├── gameState: 'input' | 'playing' | 'ended'
    ├── age, badges, netWorthHistory
    │
    ├──→ ModeSelect (mode selection)
    │
    ├──→ BattleMode (battle gameplay)
    │   └── Uses: portfolio, updates via callbacks
    │
    ├──→ KcoinStory (story gameplay)
    │   └── Own state: path, levelIdx, branchKey
    │   └── Updates: portfolio via onFinish callback
    │
    └──→ SimulatorDashboard (displays portfolio)
        └── Receives: portfolio as prop
```

### Data Flow Example: Making a Choice

```
1. User clicks choice in KcoinStory.jsx
   ↓
2. next(choiceId) function called
   ↓
3. Apply financial impact:
   - Update local state (cash, kcoinHoldings)
   - Calculate new price
   - Update path array
   ↓
4. Check if level complete
   ↓
5. If yes: buildLevelFeedback()
   - Analyze choices
   - Generate personalized advice
   ↓
6. Show feedback UI
   ↓
7. User clicks "Continue"
   ↓
8. Advance to next level
   ↓
9. onFinish() callback to App.jsx
   - Updates global portfolio state
```

### File Size & Performance

**Bundle Analysis:**
- **React + React DOM**: ~130 KB (gzipped)
- **Chart.js**: ~50 KB (gzipped)
- **Tailwind CSS**: ~10 KB (purged, only used classes)
- **Application Code**: ~200 KB (unminified)
- **Total**: ~400 KB (gzipped) - Loads in <2 seconds on 3G

**Optimizations:**
- Code splitting (can be added for lazy loading)
- Tree shaking (removes unused code)
- Minification (reduces file size)
- Gzip compression (CDN handles automatically)

---

## Why This Architecture Works

### For MVP (Minimum Viable Product)

✅ **Fast to Build**: No backend setup, just React components
✅ **Fast to Deploy**: Static site deploys in seconds
✅ **Low Cost**: Free hosting, no server maintenance
✅ **Easy to Iterate**: Change code, redeploy, done
✅ **Privacy-Friendly**: No data collection concerns
✅ **Educational Focus**: All logic visible and auditable

### For Scaling (Future)

✅ **Easy to Add Backend**: Frontend already structured for API calls
✅ **Modular Design**: Can add backend features incrementally
✅ **API-Ready**: Components can easily call REST/GraphQL APIs
✅ **Database-Ready**: State structure maps well to database schema

---

## Migration Path: Adding a Backend (If Needed)

### Phase 1: User Accounts
```javascript
// Add authentication
import { auth } from './api/auth';

// Login component
<LoginScreen onLogin={(user) => setUser(user)} />
```

### Phase 2: Progress Saving
```javascript
// Save game state to backend
const saveProgress = async () => {
  await fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify({ portfolio, badges, path })
  });
};
```

### Phase 3: Real Market Data
```javascript
// Backend proxy for market data
const getPrice = async (symbol) => {
  const res = await fetch(`/api/market/${symbol}`);
  return res.json();
};
```

### Phase 4: Analytics
```javascript
// Track user behavior
const trackEvent = async (event) => {
  await fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(event)
  });
};
```

**Backend Technology Options:**
- **Node.js + Express**: Same language as frontend
- **Python + FastAPI**: Good for data analysis
- **Firebase**: Serverless, easy to add
- **Supabase**: Open-source Firebase alternative

---

## Summary

### Frontend: **Comprehensive & Modern**
- React 18 for UI
- Vite for fast development
- Tailwind CSS for styling
- Chart.js for visualizations
- Modular, maintainable architecture

### Backend: **Intentionally None (For Now)**
- Zero server infrastructure
- Zero database
- Zero API endpoints
- All logic client-side

### Why: **MVP Strategy**
- Build fast, iterate quickly
- Prove concept before scaling
- Minimize costs and complexity
- Focus on educational value

### Future: **Easy to Extend**
- Architecture supports adding backend
- Components ready for API integration
- State structure maps to database
- Can add features incrementally

**Bottom Line:** TradeSim is a **frontend-only application** by design, optimized for rapid development, zero operational costs, and educational transparency. A backend can be added later if user accounts, persistence, or real-time features are needed.

