# TradeSim Code Architecture Q&A

## Table of Contents
1. [Overall Architecture](#overall-architecture)
2. [State Management](#state-management)
3. [Component Structure](#component-structure)
4. [Financial Engine](#financial-engine)
5. [Game Modes & Branching Logic](#game-modes--branching-logic)
6. [Data Flow & State Updates](#data-flow--state-updates)
7. [Error Handling & Resilience](#error-handling--resilience)
8. [Performance & Optimization](#performance--optimization)
9. [Extensibility & Scalability](#extensibility--scalability)

---

## Overall Architecture

### Q1: Why did you choose a client-side React architecture instead of a full-stack solution?

**Answer:**
We chose a client-side React architecture for several reasons:

1. **Zero Backend Costs**: The MVP deploys as a static site (Vercel/Netlify) with no server infrastructure, reducing operational costs to near-zero.

2. **Fast Deployment**: Static sites deploy in <60 seconds, enabling rapid iteration and updates.

3. **Privacy-First**: No user data is sent to servers, making it compliant with privacy regulations and reducing security attack surface.

4. **Scalability**: Client-side rendering means unlimited concurrent users without server load concerns.

5. **Educational Focus**: The game is deterministic and educational—all calculations happen client-side, making the code transparent and auditable.

**Trade-offs:**
- No persistent user accounts (can be added later with localStorage or a simple backend)
- No real-time multiplayer (not needed for this educational use case)
- All game logic must be client-validated (acceptable for educational content)

---

### Q2: Why is the codebase organized into `core/`, `components/`, `modes/`, `utils/`, and `knowledge/` directories?

**Answer:**
This modular structure follows **separation of concerns** and **domain-driven design**:

```
src/
├── core/           # Core business logic (finance calculations, game rules)
├── components/      # Reusable UI components
├── modes/          # Game mode implementations (battle, story)
├── utils/          # Helper functions and utilities
└── knowledge/      # Educational content (terms, lessons, facts)
```

**Benefits:**
- **Maintainability**: Each directory has a clear purpose, making code easy to locate
- **Testability**: Core logic is isolated from UI, enabling unit tests
- **Reusability**: Components and utilities can be shared across modes
- **Scalability**: New game modes can be added in `modes/` without touching core logic
- **Educational Content Separation**: Knowledge content is decoupled from game logic, making it easy to update without code changes

**Example:** When we added the Kcoin Story mode, we only created `modes/story/kcoinScenario.js` and `components/KcoinStory.jsx`—no changes to `core/financeEngine.js` were needed.

---

## State Management

### Q3: Why use React's `useState` instead of Redux or Context API for global state?

**Answer:**
We use **local component state (`useState`)** with **prop drilling** for these reasons:

1. **Simplicity**: The app has a clear component hierarchy (`App.jsx` → `ModeSelect` → `BattleMode`/`KcoinStory`), so prop drilling is manageable.

2. **No Global State Complexity**: We don't have deeply nested components or multiple independent features that need shared state.

3. **Performance**: `useState` triggers re-renders only for the component and its children, avoiding unnecessary global re-renders.

4. **Debugging**: Local state is easier to trace—you can see all state in one component's scope.

**When we'd use Context API:**
- If we add user authentication/profiles
- If we need theme/settings shared across many components
- If component tree becomes deeply nested

**Current Pattern:**
```javascript
// App.jsx holds top-level state
const [portfolio, setPortfolio] = useState({ cash: 5000, stocks: 0, debt: 0 });
const [gameState, setGameState] = useState('input');


// Passed down as props
<SimulatorDashboard portfolio={portfolio} />
```

---

### Q4: Why do you track `lastFeedbackIdx` in KcoinStory to segment feedback by level?

**Answer:**
This prevents **feedback contamination** between levels:

**Problem:**
- Level 1 feedback was showing Level 2 choices
- Full path array `['A', 'A1', 'A1b']` included all previous choices
- `buildLevelFeedback(2, fullPath)` analyzed choices from Level 1, making Level 2 feedback inaccurate

**Solution:**
```javascript
const [lastFeedbackIdx, setLastFeedbackIdx] = React.useState(0);

// When ending a level, only analyze choices since last feedback
const choicesSinceLast = newPath.slice(lastFeedbackIdx);
setFeedbackItems(buildLevelFeedback(level, choicesSinceLast));

// After continuing, mark the boundary
if (typeof pendingAdvance.afterPathLen === 'number') {
  setLastFeedbackIdx(pendingAdvance.afterPathLen);
}
```

**Why this works:**
- Each level's feedback only considers choices made in that level
- Feedback is contextually accurate and actionable
- Players see relevant advice for their current decisions

---

## Component Structure

### Q5: Why is `KcoinStory.jsx` a separate component instead of being part of `App.jsx`?

**Answer:**
**Separation of concerns** and **code organization**:

1. **Single Responsibility**: `App.jsx` orchestrates game flow (mode selection, state transitions). `KcoinStory.jsx` handles only the Kcoin Story gameplay logic.

2. **Complexity Isolation**: Kcoin Story has its own state machine (levels, branches, nodes, feedback), which would bloat `App.jsx` if combined.

3. **Reusability**: `KcoinStory` can be used independently or in different contexts (e.g., embedded in tutorials).

4. **Maintainability**: Changes to Kcoin Story don't risk breaking other game modes.

**Component Hierarchy:**
```
App.jsx (orchestrator)
├── ModeSelect.jsx
├── BattleMode.jsx (battle mode logic)
└── KcoinStory.jsx (story mode logic)
    ├── CharacterAvatar.jsx
    └── (internal state for branching)
```

**Alternative (not chosen):**
- One giant `App.jsx` with conditional rendering → harder to maintain, test, and debug

---

### Q6: Why do you use `ErrorBoundary` component?

**Answer:**
**Graceful error handling** and **user experience**:

```javascript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Benefits:**
1. **Prevents White Screen of Death**: If a component crashes, `ErrorBoundary` catches it and shows a friendly error message instead of a blank screen.

2. **Development Feedback**: In development, errors still show in console, but production users see a helpful message.

3. **Isolation**: Errors in one component don't crash the entire app.

**Why React needs this:**
- React 16+ doesn't catch errors in event handlers, async code, or during rendering of child components
- `ErrorBoundary` uses `componentDidCatch` lifecycle to catch rendering errors

**Example scenario:**
- If `kcoinScenario.js` has a typo causing `undefined.choices.map()` to crash
- Without `ErrorBoundary`: entire app crashes
- With `ErrorBoundary`: user sees "Something went wrong" message, can refresh

---

## Financial Engine

### Q7: Why separate financial calculations into `core/financeEngine.js`?

**Answer:**
**Separation of business logic from UI**:

**Structure:**
```javascript
// core/financeEngine.js (re-exports from utils/gameLogic.js)
export { calculateCompoundInterest, calculatePortfolioGrowth };

// Used in App.jsx
import { calculateCompoundInterest } from './core/financeEngine';
```

**Benefits:**
1. **Testability**: Financial logic can be unit tested independently of React components
2. **Reusability**: Same calculations used in Story Mode, Battle Mode, and Dashboard
3. **Maintainability**: If calculation formulas change (e.g., tax rules), only one file needs updating
4. **Clarity**: `core/` directory signals "this is critical business logic"

**Why re-export from `utils/gameLogic.js`?**
- Historical: calculations were in `utils/` first
- Migration path: gradually moving to `core/` for better organization
- Backward compatibility: other files still import from `utils/`, so we re-export

---

### Q8: Why do you use `Math.round()` extensively for cash and stock calculations?

**Answer:**
**Precision and display consistency**:

```javascript
setCash(prev => Math.round((prev - amt) * 100) / 100); // Round to cents
setKcoinUnits(prev => Math.round((prev + unitsBought) * 1000000) / 1000000); // Round to 6 decimals
```

**Reasons:**
1. **Floating Point Errors**: JavaScript's `0.1 + 0.2 = 0.30000000000000004` can cause display issues
2. **Currency Display**: Cash should show as `$1,234.56`, not `$1,234.5600001`
3. **User Expectations**: Players expect whole numbers or standard decimal places
4. **Performance**: Rounding prevents unnecessary precision that slows calculations

**Precision Levels:**
- **Cash**: 2 decimals (cents) - `Math.round(value * 100) / 100`
- **Stock units**: 6 decimals (for crypto-like precision) - `Math.round(value * 1000000) / 1000000`
- **Percentages**: 1-2 decimals for display

---

## Game Modes & Branching Logic

### Q9: Why is the Kcoin Story branching logic stored in a separate data file (`kcoinScenario.js`) instead of hardcoded in the component?

**Answer:**
**Data-driven design** and **content-authoring workflow**:

**Structure:**
```javascript
// modes/story/kcoinScenario.js (data)
export const KCOIN_INTRO = {
  levels: [
    {
      id: 'L1',
      nodes: [
        {
          id: 'L1a',
          text: 'Kcoin surges +70%...',
          choices: [
            { id: 'A', label: 'Go all-in...', impact: { cashDelta: -5000, stockDelta: 5000 } }
          ]
        }
      ]
    }
  ]
};

// components/KcoinStory.jsx (logic)
import { KCOIN_INTRO } from '../modes/story/kcoinScenario';
```

**Benefits:**
1. **Non-developers can edit**: Content writers can update questions/choices without touching React code
2. **Easy to extend**: Adding new levels/nodes is just adding JSON-like objects
3. **Testability**: Branching logic can be tested independently
4. **Version control**: Content changes show up clearly in git diffs
5. **A/B testing ready**: Can swap different scenario files for testing

**Alternative (not chosen):**
- Hardcode questions in JSX → requires developer for every content change

---

### Q10: Why does each choice have an `impact` object with `cashDelta`, `stockDelta`, and `stockFactor`?

**Answer:**
**Realistic financial modeling** and **transparent consequences**:

```javascript
{
  id: 'A',
  label: 'Go all-in ($5,000 into Kcoin) [Heavy]',
  impact: {
    cashDelta: -5000,      // Direct cash change
    stockDelta: 5000,        // Direct stock units change
    stockFactor: 1.7         // Multiplicative change (price movement)
  }
}
```

**Why three types of impacts?**
1. **`cashDelta`**: Direct spending/receiving (e.g., buying stock, paying debt)
2. **`stockDelta`**: Direct stock purchases/sales (e.g., buying 100 shares)
3. **`stockFactor`**: Market movement effects (e.g., price drops 10% = `0.9`, price rises 20% = `1.2`)

**Application order:**
```javascript
// 1. Apply direct changes
setKcoinHoldings(prev => prev + stockDelta);
setCurrentCash(prev => prev + cashDelta);

// 2. Apply multiplicative change (simulates price movement)
setKcoinHoldings(prev => prev * stockFactor);
```

**Why this design?**
- **Realistic**: Mirrors real investing (you buy shares, then price moves)
- **Educational**: Players see immediate consequences of decisions
- **Flexible**: Can model complex scenarios (e.g., buy + price crash = `cashDelta: -2000, stockFactor: 0.8`)

---

### Q11: Why do you use `[Heavy]` and `[Light]` tags in choice labels?

**Answer:**
**Risk communication** and **feedback generation**:

```javascript
{ id: 'A', label: 'Go all-in ($5,000 into Kcoin) [Heavy]' }
{ id: 'B', label: 'Wait a week and watch [Light]' }
```

**Benefits:**
1. **Player Awareness**: Players immediately see risk level before choosing
2. **Feedback Generation**: `buildLevelFeedback()` analyzes choices:
   ```javascript
   const heavy = recent.filter(t => /\[Heavy\]/.test(t)).length;
   if (heavy > 0) {
     improvements.push('Consider setting stop-losses...');
   }
   ```
3. **Pattern Recognition**: Tracks if player consistently takes high-risk choices
4. **Educational**: Teaches players to identify risky decisions

**Why in the label, not a separate field?**
- **Visibility**: Players see it in the UI without extra parsing
- **Simplicity**: One field instead of `{ label: '...', risk: 'heavy' }`
- **Backward compatible**: Can parse existing choices with regex

---

## Data Flow & State Updates

### Q12: Why do you use atomic state updates in `KcoinStory.jsx` to prevent random restarts?

**Answer:**
**Race condition prevention**:

**Problem (before fix):**
```javascript
// Multiple setState calls could interleave
setLevelIdx(1);
setNodeIdx(0);
setBranchKey(null);
// If React batches these, intermediate states could trigger re-renders
// causing the component to "restart" mid-transition
```

**Solution (atomic updates):**
```javascript
const next = (choiceId) => {
  const newPath = [...path, choiceId];
  setPath(newPath);
  
  // All state updates happen in one functional update
  if (levelIdx === 0 && nodeIdx === 0) {
    setBranchKey(choiceId);
    setNodeIdx(1);
    return; // Early return prevents further execution
  }
  // ... rest of logic
};
```

**Why this works:**
- **Single render cycle**: All related state changes happen together
- **Early returns**: Prevent cascading updates that could cause loops
- **Functional updates**: `setState(prev => ...)` ensures we use latest state

**Alternative (not chosen):**
- `useEffect` dependencies → can cause infinite loops if not careful
- Multiple `setState` calls → race conditions

---

### Q13: Why do you hide questions when feedback is shown?

**Answer:**
**Prevent double-click bugs** and **clear user flow**:

```javascript
{showFeedback ? (
  <FeedbackPanel />
) : (
  <QuestionPanel choices={currentNode.choices} />
)}
```

**Problem (before fix):**
- User clicks choice → feedback appears
- User accidentally clicks same question again → choice processed twice
- Portfolio updated incorrectly

**Solution:**
- Conditional rendering: questions hidden when `showFeedback === true`
- User must click "Continue" to proceed, ensuring single-choice processing

**Why not disable buttons instead?**
- **Visual clarity**: Hidden UI is clearer than disabled buttons
- **Prevents confusion**: User can't even attempt to click
- **Simpler logic**: No need to track "isProcessing" state for buttons

---

## Error Handling & Resilience

### Q14: Why do you use defensive checks like `B?.choices?.map()` in KcoinStory?

**Answer:**
**Graceful degradation** and **data validation**:

```javascript
// Instead of: currentNode.choices.map(...)
// Use: currentNode?.choices?.map(...) || []
```

**Why needed:**
1. **Data integrity**: If `kcoinScenario.js` has a typo or missing field, app doesn't crash
2. **Development safety**: During development, incomplete data structures won't break the app
3. **User experience**: Shows empty state instead of white screen

**Example scenario:**
```javascript
// If branch structure is:
branches: {
  A1: { text: '...', choices: [...] },  // ✅ Valid
  A2: 'some string',                     // ❌ Missing choices
  A3: null                               // ❌ Null
}

// Without defensive checks: crashes on A2 or A3
// With defensive checks: shows "No choices available" or skips invalid nodes
```

**Pattern used:**
- Optional chaining: `obj?.prop`
- Nullish coalescing: `value ?? defaultValue`
- Array checks: `Array.isArray(branch) ? branch[nodeIdx] : branch`

---

### Q15: Why do you have an "anti-ghost-cash" check in App.jsx?

**Answer:**
**Data integrity debugging** and **transparent financial tracking**:

```javascript
// Track all cash changes with explicit notes
const cashNotes = [];
cashNotes.push(`Salary deposit +$${salaryAmount}`);
cashNotes.push(`Random event -$${eventCost}`);

// Anti-ghost-cash check
const unexplainedCash = newCash - (cashBefore + sumOfAllNotes);
if (Math.abs(unexplainedCash) > 0.01) {
  console.warn(`⚠️ Ghost cash detected: $${unexplainedCash}`);
  // Auto-correct and label it
  newCash = cashBefore + sumOfAllNotes;
  cashNotes.push(`[AUTO-CORRECTED] Removed unexplained cash: $${unexplainedCash}`);
}
```

**Why needed:**
- **Bug detection**: Catches cases where cash changes without explicit reason
- **User trust**: Players see exactly why their cash changed
- **Development aid**: Helps identify calculation bugs during development

**What it prevents:**
- Accidental cash additions from legacy code
- Race conditions causing double deposits
- Calculation errors in financial engine

---

## Performance & Optimization

### Q16: Why do you use `Chart.js` for the Kcoin price chart instead of a simpler solution?

**Answer:**
**Professional visualization** and **extensibility**:

```javascript
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);
```

**Benefits:**
1. **Smooth animations**: Chart.js handles transitions smoothly
2. **Interactive tooltips**: Users can hover to see exact values
3. **Responsive**: Automatically adapts to container size
4. **Extensible**: Easy to add more chart types (candlestick, volume, etc.)

**Alternative (not chosen):**
- SVG/Canvas manual drawing → more code, less features
- Simple `<div>` bars → not as visually appealing or informative

**Trade-off:**
- Larger bundle size (~50KB), but acceptable for the visual value provided

---

### Q17: Why do you use `useEffect` with dependency arrays for side effects?

**Answer:**
**Controlled re-renders** and **prevent infinite loops**:

```javascript
useEffect(() => {
  // Update price chart when price array changes
  updateChart();
}, [price]); // Only run when price changes
```

**Why dependency arrays matter:**
- **Without deps `[]`**: Runs once on mount (good for initialization)
- **With deps `[price]`**: Runs when `price` changes (good for reactive updates)
- **Without deps (missing)**: Runs on every render → can cause infinite loops

**Example of correct usage:**
```javascript
// ✅ Good: Only updates when feedbackItems change
useEffect(() => {
  if (feedbackItems.length > 0) {
    setShowFeedback(true);
  }
}, [feedbackItems]);

// ❌ Bad: Missing dependency
useEffect(() => {
  setShowFeedback(feedbackItems.length > 0); // Missing [feedbackItems]
}, []); // This would only check once on mount
```

---

## Extensibility & Scalability

### Q18: Why is the price engine "pluggable" for real market data?

**Answer:**
**Future-proofing** and **realistic simulation**:

**Current (synthetic):**
```javascript
const [price, setPrice] = React.useState([100, 170]); // Hardcoded
```

**Future (real data):**
```javascript
// Can swap to:
import { getRealTimePrice } from './api/finnhub';
const price = await getRealTimePrice('BTC-USD');
```

**Why this design:**
1. **MVP first**: Synthetic data lets us build and test without API keys/costs
2. **Easy migration**: Price source is isolated, so swapping is one file change
3. **Educational flexibility**: Can use historical data for "what if" scenarios
4. **Partner integration**: Trading platforms can provide their own price feeds

**Architecture:**
- Price calculation is in one function: `getCurrentPrice()`
- Changing price source = update one function
- Rest of code doesn't care if price is synthetic or real

---

### Q19: Why do you use a modular `modes/` directory structure?

**Answer:**
**Easy addition of new game modes**:

```
modes/
├── battle/
│   └── config.js          # Battle mode questions
└── story/
    ├── index.js           # Story mode exports
    └── kcoinScenario.js    # Kcoin Story content
```

**Benefits:**
1. **Isolated modes**: Each mode is self-contained
2. **Shared core**: Both modes use `core/financeEngine.js` and `core/gameRules.js`
3. **Easy to add**: New mode = new directory + component
4. **No conflicts**: Battle mode changes don't affect Story mode

**Example: Adding a new mode:**
```
modes/
└── tutorial/
    └── tutorialScenario.js

components/
└── TutorialMode.jsx
```

**In App.jsx:**
```javascript
{mode === 'tutorial' && <TutorialMode />}
```

**Why not one giant file?**
- Would become unmaintainable with 3+ modes
- Harder to test individual modes
- Team members can work on different modes simultaneously

---

### Q20: Why do you re-export from `core/` and `modes/` instead of direct imports?

**Answer:**
**Stable public API** and **refactoring flexibility**:

```javascript
// core/gameRules.js
import { BADGES, getRandomEvent } from '../utils/gameLogic';
export { BADGES, getRandomEvent, generateFeedback };

// components/App.jsx
import { BADGES } from './core/gameRules'; // ✅ Stable import
// Not: import { BADGES } from './utils/gameLogic'; // ❌ Internal implementation
```

**Benefits:**
1. **Refactoring safety**: Can move code from `utils/` to `core/` without breaking imports
2. **Clear API**: `core/` exports signal "this is the public API"
3. **Versioning**: Can change internal implementation while keeping exports stable
4. **Documentation**: Re-exports serve as documentation of what's "public"

**Example:**
- If we move `gameLogic.js` → `core/calculations.js`
- Only need to update `core/gameRules.js` re-export
- All components still work: `import { BADGES } from './core/gameRules'`

---

## Summary

**Key Architectural Principles:**
1. **Separation of Concerns**: UI, logic, and data are separated
2. **Data-Driven Design**: Game content is in JSON-like structures, not hardcoded
3. **Defensive Programming**: Extensive null checks and error boundaries
4. **Modularity**: Easy to add new modes, scenarios, or features
5. **Educational Transparency**: All calculations are visible and auditable
6. **Performance-Conscious**: Optimized re-renders, efficient state updates
7. **Future-Proof**: Designed for API integration, real data, and scaling

**Trade-offs Made:**
- **Simplicity over complexity**: useState over Redux (sufficient for current needs)
- **Client-side over server**: Faster iteration, lower costs (can add backend later)
- **Modular over monolithic**: More files, but easier to maintain
- **Defensive over optimistic**: More checks, but fewer production bugs

