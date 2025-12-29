import React from 'react';
import CharacterAvatar from './CharacterAvatar';
import { FINANCIAL_TERMS } from '../knowledge';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
import { KCOIN_INTRO, resolveKcoinOutcome } from '../modes/story/kcoinScenario';
import { BADGES } from '../core/gameRules';

export default function KcoinStory({ onExit, onFinish }) {
  const [path, setPath] = React.useState([]);
  const [levelIdx, setLevelIdx] = React.useState(0);
  const [branchKey, setBranchKey] = React.useState(null);
  const [nodeIdx, setNodeIdx] = React.useState(0);
  const [price, setPrice] = React.useState([100, 170]); // L1: +70%
  const [cash, setCash] = React.useState(5000);
  const [kcoinUnits, setKcoinUnits] = React.useState(0);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [feedbackItems, setFeedbackItems] = React.useState([]);
  const [pendingAdvance, setPendingAdvance] = React.useState(null); // { toLevel: number }
  const [microFeedback, setMicroFeedback] = React.useState(null); // transient per-choice
  const [lastFeedbackIdx, setLastFeedbackIdx] = React.useState(0); // index in path after last feedback
  const intro = KCOIN_INTRO;

  const getCurrentPrice = () => (price[price.length - 1] || 100);

  const applyChoiceEffects = (choiceId) => {
    const p = getCurrentPrice();
    const spend = (amount) => {
      const amt = Math.max(0, amount);
      const unitsBought = amt / p;
      setCash(prev => Math.round((prev - amt) * 100) / 100);
      setKcoinUnits(prev => Math.round((prev + unitsBought) * 1000000) / 1000000);
    };
    const sellFraction = (fraction) => {
      setKcoinUnits(prevUnits => {
        const unitsToSell = Math.max(0, Math.min(prevUnits, prevUnits * fraction));
        const proceeds = unitsToSell * p;
        setCash(prev => Math.round((prev + proceeds) * 100) / 100);
        return Math.round((prevUnits - unitsToSell) * 1000000) / 1000000;
      });
    };
    const sellAll = () => { sellFraction(1.0); };

    // L1
    if (choiceId === 'A') { // all-in $5000
      spend(Math.min(5000, cash));
      return;
    }
    if (choiceId === 'B' || choiceId === 'C') { return; }

    // L2 primary decisions
    if (choiceId === 'A1') { spend(Math.min(2000, cash)); return; }
    if (choiceId === 'A2') { sellAll(); return; }
    if (choiceId === 'A3') { sellFraction(0.5); return; }

    if (choiceId === 'B1') { spend(Math.min(5000, cash)); return; }
    if (choiceId === 'B2') { // diversify: invest 40% of cash
      spend(Math.round(cash * 0.4)); return;
    }
    if (choiceId === 'B3') { return; }

    if (choiceId === 'C1') { spend(Math.min(2500, cash)); return; }
    if (choiceId === 'C2' || choiceId === 'C3') { return; }

    // L2 secondary nodes (x/s variants): adjust positioning slightly
    if (/^[ABC][123]x$/.test(choiceId)) { // execution/tax behavior
      // small execution slippage cost for heavy choices
      if (/[AB]1x|C1x/.test(choiceId)) {
        setCash(prev => Math.round((prev - Math.min(25, Math.max(0, prev))) * 100) / 100);
      }
      return;
    }
    if (/^[ABC][123]s$/.test(choiceId)) { // sizing/stops discipline
      if (/[ABC]1s/.test(choiceId)) { // overly aggressive sizing -> no immediate cash effect
        return;
      }
      if (/[ABC][23]s/.test(choiceId)) { // prudent sizing/hedge
        sellFraction(0.1); // trim 10%
        return;
      }
    }

    // L3 actions
    if (/^A1[abc]$/.test(choiceId)) {
      if (choiceId === 'A1a') sellFraction(1.0);
      if (choiceId === 'A1b') {/* hold */}
      if (choiceId === 'A1c') sellFraction(0.5);
      return;
    }
    if (/^A2[abc]$/.test(choiceId)) {
      if (choiceId === 'A2a') spend(Math.min(1000, cash));
      if (choiceId === 'A2b') {/* ignore, no change */}
      if (choiceId === 'A2c') sellFraction(0.25);
      return;
    }
    if (/^A3[abc]$/.test(choiceId)) {
      if (choiceId === 'A3a') spend(Math.min(500, cash));
      if (choiceId === 'A3b') {/* maintain */}
      if (choiceId === 'A3c') sellAll();
      return;
    }
    if (/^B1[abc]$/.test(choiceId)) {
      if (choiceId === 'B1a') spend(Math.min(500, cash));
      if (choiceId === 'B1b') sellAll();
      if (choiceId === 'B1c') {/* hold */}
      return;
    }
    if (/^B2[abc]$/.test(choiceId)) {
      if (choiceId === 'B2a') spend(Math.min(300, cash));
      if (choiceId === 'B2b') spend(Math.min(200, cash));
      if (choiceId === 'B2c') {/* passive */}
      return;
    }
    if (/^B3[abc]$/.test(choiceId)) {
      return; // research/report: no immediate capital move
    }
    if (/^C1[abc]$/.test(choiceId)) {
      if (choiceId === 'C1a') spend(Math.min(500, cash));
      if (choiceId === 'C1b') sellFraction(0.2);
      if (choiceId === 'C1c') {/* hold */}
      return;
    }
    if (/^C2[abc]$/.test(choiceId)) {
      if (choiceId === 'C2a') spend(Math.min(1000, cash));
      if (choiceId === 'C2b') {/* none */}
      if (choiceId === 'C2c') {/* research */}
      return;
    }
    if (/^C3[abc]$/.test(choiceId)) {
      if (choiceId === 'C3a') spend(Math.min(400, cash));
      if (choiceId === 'C3b') sellAll();
      if (choiceId === 'C3c') {/* paper trade */}
      return;
    }
  };

  const next = (choiceId) => {
    const newPath = [...path, choiceId];
    setPath(newPath);
    // Capture before state for deltas
    const beforeCash = cash;
    const beforeUnits = kcoinUnits;
    // Apply money/stock effects BEFORE price moves
    applyChoiceEffects(choiceId);
    // Build per-round micro-feedback
    const afterCash = (() => cash)();
    const afterUnits = (() => kcoinUnits)();
    // Note: state updates above are async; compute deltas approximately from intent
    // We compute expected deltas based on choice type to provide actionable feedback
    const mf = buildMicroFeedback(choiceId, beforeCash, beforeUnits, getCurrentPrice());
    setMicroFeedback(mf);
    setTimeout(() => setMicroFeedback(null), 2200);
    if (levelIdx === 0) {
      if (nodeIdx === 0) {
        setBranchKey(choiceId);
        setNodeIdx(1); // second node in L1
        return;
      }
      // end of L1 → show feedback before advancing
      const choicesSinceLast = newPath.slice(lastFeedbackIdx);
      setFeedbackItems(buildLevelFeedback(1, choicesSinceLast));
      setShowFeedback(true);
      setPendingAdvance({ toLevel: 1, afterPathLen: newPath.length });
      return;
    } else if (levelIdx === 1) {
      const branchNodes = intro.levels[1].branches[branchKey] || [];
      if (nodeIdx + 1 < branchNodes.length) {
        setNodeIdx(nodeIdx + 1);
        return;
      }
      // end of L2 → show feedback before advancing
      const choicesSinceLast = newPath.slice(lastFeedbackIdx);
      setFeedbackItems(buildLevelFeedback(2, choicesSinceLast));
      setShowFeedback(true);
      setPendingAdvance({ toLevel: 2, afterPathLen: newPath.length });
    } else {
      // resolve outcome
      const outcome = resolveKcoinOutcome(newPath);
      onFinish(outcome, newPath);
    }
    // Update simulated Kcoin price based on choice
    setPrice(prev => {
      const last = prev[prev.length - 1] || 100;
      const factor = getFactor(choiceId, branchKey);
      return [...prev, Math.max(1, Math.round(last * factor))];
    });
  };

  const buildMicroFeedback = (choiceId, beforeCash, beforeUnits, priceNow) => {
    const buyMsg = (amt) => ({ title: 'Position Added', type: 'success', msg: `You allocated $${amt} into Kcoin at ~$${priceNow}. Track sizing and avoid over-concentration.` });
    const sellMsg = (frac) => ({ title: 'Trimmed Exposure', type: 'info', msg: `You sold ${Math.round(frac*100)}% of your Kcoin. Trimming during rallies can lock gains and reduce drawdowns.` });
    const warnMsg = (txt) => ({ title: 'Caution', type: 'warning', msg: txt });

    if (choiceId === 'A') return buyMsg(Math.min(5000, beforeCash));
    if (choiceId === 'B' || choiceId === 'C') return { title: 'Patience', type: 'info', msg: 'You held back for now. Use this time to refine thesis and size.' };
    if (choiceId === 'A1') return buyMsg(Math.min(2000, beforeCash));
    if (choiceId === 'A2') return sellMsg(1.0);
    if (choiceId === 'A3') return sellMsg(0.5);
    if (choiceId === 'B1') return buyMsg(Math.min(5000, beforeCash));
    if (choiceId === 'B2') return buyMsg(Math.round(beforeCash * 0.4));
    if (choiceId === 'C1') return buyMsg(Math.min(2500, beforeCash));
    if (/^[ABC][123]x$/.test(choiceId)) return warnMsg('Execution costs and taxes add up. Prefer limit orders and lower churn.');
    if (/^[ABC][23]s$/.test(choiceId)) return { title: 'Risk Controls', type: 'success', msg: 'Sizing discipline helps survive volatility. Consider caps and stops.' };
    if (choiceId === 'A1a') return sellMsg(1.0);
    if (choiceId === 'A1c') return sellMsg(0.5);
    if (choiceId === 'A2a') return buyMsg(Math.min(1000, beforeCash));
    if (choiceId === 'A2c') return sellMsg(0.25);
    if (choiceId === 'A3a') return buyMsg(Math.min(500, beforeCash));
    if (choiceId === 'A3c') return sellMsg(1.0);
    if (choiceId === 'B1a') return buyMsg(Math.min(500, beforeCash));
    if (choiceId === 'B1b') return sellMsg(1.0);
    if (choiceId === 'B2a') return buyMsg(Math.min(300, beforeCash));
    if (choiceId === 'B2b') return buyMsg(Math.min(200, beforeCash));
    if (choiceId === 'C1a') return buyMsg(Math.min(500, beforeCash));
    if (choiceId === 'C1b') return sellMsg(0.2);
    if (choiceId === 'C2a') return buyMsg(Math.min(1000, beforeCash));
    if (choiceId === 'C3a') return buyMsg(Math.min(400, beforeCash));
    if (choiceId === 'C3b') return sellMsg(1.0);
    return { title: 'Recorded', type: 'info', msg: 'Choice applied.' };
  };

  const continueAfterFeedback = () => {
    if (!pendingAdvance) { setShowFeedback(false); return; }
    const nextLevel = pendingAdvance.toLevel;
    if (nextLevel === 1) {
      setNodeIdx(0);
      setLevelIdx(1);
    } else if (nextLevel === 2) {
      setNodeIdx(0);
      setLevelIdx(2);
    }
    // mark feedback boundary to ensure next feedback excludes earlier choices
    if (typeof pendingAdvance.afterPathLen === 'number') {
      setLastFeedbackIdx(pendingAdvance.afterPathLen);
    }
    setPendingAdvance(null);
    setShowFeedback(false);
  };

  const buildLevelFeedback = (level, choicesSinceLast) => {
    const items = [];
    const improvements = [];
    const recent = (choicesSinceLast || []).slice(-3);
    const heavyPicks = recent.filter(t => /\[Heavy\]/.test(t)).length;
    const lightPicks = recent.filter(t => /\[Light\]/.test(t)).length;
    if (heavyPicks > 0) items.push({ type: 'error', title: 'Risky Calls', msg: `You made ${heavyPicks} high-risk decision(s). This increases drawdown probability.` });
    if (lightPicks > 0) items.push({ type: 'success', title: 'Prudent Choices', msg: `You made ${lightPicks} lower-risk decision(s). This reduces tail risk.` });

    // Price trend implication
    const last = price[price.length - 1];
    const prev = price[price.length - 2] || last;
    const pct = prev ? Math.round(((last / prev) - 1) * 100) : 0;
    if (pct >= 10) items.push({ type: 'info', title: 'Momentum', msg: `Kcoin moved +${pct}% into the next stage. Beware mean reversion and position sizing.` });
    if (pct <= -10) items.push({ type: 'warning', title: 'Drawdown', msg: `Kcoin dropped ${pct}%. Consider risk caps, diversification, or waiting for confirmation.` });
    if (items.length === 0) items.push({ type: 'info', title: 'Neutral Round', msg: 'No major risks taken; continue monitoring fundamentals and liquidity.' });

    // Tailored improvements
    const totalValue = cash + kcoinUnits * last;
    const kcoinValue = kcoinUnits * last;
    const kcoinAlloc = totalValue > 0 ? (kcoinValue / totalValue) : 0;
    
    // Position sizing
    if (kcoinAlloc > 0.5) {
      improvements.push({ type: 'improve', title: 'Position Sizing', msg: 'Cap any single bet at 10–20% of your portfolio. Consider trimming your Kcoin allocation to reduce tail risk.' });
    } else if (kcoinAlloc > 0.25) {
      improvements.push({ type: 'improve', title: 'Risk Budget', msg: 'You are concentrated. Define a risk budget (e.g., max 25% in high-vol assets) and stick to it.' });
    }

    // Emergency fund
    if (cash < 1000) {
      improvements.push({ type: 'improve', title: 'Emergency Fund', msg: 'Target 3–6 months of expenses in cash before aggressive bets. This prevents forced selling during dips.' });
    }

    // FOMO/regret patterns
    const pathStr = (choicesSinceLast || []).join(' ');
    if (/\bB1\b|\bA2a\b|\bC2a\b/.test(pathStr)) {
      improvements.push({ type: 'improve', title: 'Behavioral Discipline', msg: 'Set rules to avoid FOMO/regret trades: wait 24 hours, require a checklist (thesis, risk, size), and predefine exits.' });
    }

    // Execution/tax inefficiency
    if (/[ABC][123]x/.test(pathStr)) {
      improvements.push({ type: 'improve', title: 'Execution & Costs', msg: 'Use limit orders in thin books and avoid frequent churn that increases fees and taxes.' });
    }

    // Drawdown response
    if (pct <= -10 || heavyPicks > 0) {
      improvements.push({ type: 'improve', title: 'Protect the Downside', msg: 'Consider a stop-loss or trailing stop, and rebalance into diversified assets after large rallies or selloffs.' });
    }

    // DCA suggestion
    improvements.push({ type: 'improve', title: 'Process Over Prediction', msg: 'Automate with small, regular contributions (DCA) and a periodic rebalance policy to reduce decision stress.' });

    return [...items, ...improvements];
  };

  const getFactor = (choiceId, currentBranch) => {
    // L2 impacts (based on L1 branch)
    if (levelIdx === 0) return 1.0; // already added +70%
    if (levelIdx === 1) {
      if (branchKey === 'A') return 0.75; // -25%
      if (branchKey === 'B') return 1.0;  // flat
      if (branchKey === 'C') return 1.0;  // uncertainty
    }
    // L3 impacts by L2 choiceId
    const map = {
      A1: 1.3, A2: 1.2, A3: 1.2,
      B1: 0.9, B2: 1.15, B3: 0.9,
      C1: 1.1, C2: 1.5, C3: 0.975,
      A1a: 0.95, A1b: 1.05, A1c: 1.0,
      A2a: 1.05, A2b: 1.0, A2c: 1.02,
      A3a: 1.05, A3b: 1.0, A3c: 0.9,
      B1a: 0.95, B1b: 0.9, B1c: 1.02,
      B2a: 1.04, B2b: 1.03, B2c: 1.0,
      B3a: 0.95, B3b: 0.92, B3c: 1.0,
      C1a: 1.05, C1b: 0.98, C1c: 1.0,
      C2a: 0.9, C2b: 1.0, C2c: 1.03,
      C3a: 1.02, C3b: 0.95, C3c: 1.0,
    };
    return map[choiceId] || 1.0;
  };

  const chartData = {
    labels: price.map((_, i) => `Step ${i}`),
    datasets: [
      {
        label: 'Kcoin (Simulated)'
        , data: price
        , borderColor: '#ffcc00'
        , backgroundColor: 'rgba(255, 204, 0, 0.12)'
        , fill: true
        , tension: 0.25
        , pointRadius: price.length > 20 ? 1 : 3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        ticks: { color: '#ffcc00', font: { size: 10 } },
        grid: { color: 'rgba(255, 204, 0, 0.1)' }
      },
      x: {
        ticks: { color: '#00ffff', font: { size: 9 } },
        grid: { display: false }
      }
    }
  };

  const KnowledgeCard = () => (
    <div className="mt-4 border-2 border-yellow-600 p-3 rounded bg-black/50">
      <p className="text-retro-yellow font-bold mb-1">Knowledge Card</p>
      <p className="text-cyan-200 text-sm whitespace-pre-line">{intro.knowledgeCard}</p>
    </div>
  );

  const renderLevel = () => {
    if (levelIdx === 0) {
      const L = intro.levels[0];
      const N = L.nodes[nodeIdx];
      return (
        <div>
          <h3 className="retro-font text-retro-green retro-glow mb-2">{L.heading}</h3>
          <p className="text-retro-cyan mb-4">{N.text}</p>
          <div className="grid gap-3">
            {(N?.choices || []).map(c => (
              <button key={c.id} className="retro-button py-3" onClick={() => next(c.id)}>{c.label}</button>
            ))}
          </div>
          {renderDefinitions([N?.text || '', ...((N?.choices || []).map(c => c.label))])}
          <KnowledgeCard />
        </div>
      );
    }
    if (levelIdx === 1) {
      const L = intro.levels[1];
      const seq = L.branches[branchKey] || L.branches['A'] || [];
      const B = seq[nodeIdx] || seq[0] || { text: 'Make your move.', choices: [] };
      return (
        <div>
          <h3 className="retro-font text-retro-green retro-glow mb-2">{intro.levels[1].heading}</h3>
          <p className="text-retro-cyan mb-4">{B?.text || 'Make your move.'}</p>
          <div className="grid gap-3">
            {(B?.choices || []).map(c => (
              <button key={c.id} className="retro-button py-3" onClick={() => next(c.id)}>{c.label}</button>
            ))}
          </div>
          {renderDefinitions([B?.text || '', ...((B?.choices || []).map(c => c.label))])}
          <KnowledgeCard />
        </div>
      );
    }
    const L = intro.levels[2];
    // Normalize branch key (map A1x/B2x -> A1/B2 for L3)
    let key = branchKey || 'A1';
    const m = typeof key === 'string' ? key.match(/^[ABC][123]/) : null;
    if (m) key = m[0];
    const branch = L.branches[key] || L.branches.A1;
    const B = Array.isArray(branch) ? branch[0] : branch;
    return (
      <div>
        <h3 className="retro-font text-retro-green retro-glow mb-2">{intro.levels[2].heading}</h3>
        <p className="text-retro-cyan mb-4">{B?.text || 'Make your next move.'}</p>
        <div className="grid gap-3">
          {(B?.choices || []).map(c => (
            <button key={c.id} className="retro-button py-3" onClick={() => next(c.id)}>{c.label}</button>
          ))}
        </div>
        {renderDefinitions([B?.text || '', ...((B?.choices || []).map(c => c.label))])}
        <KnowledgeCard />
      </div>
    );
  };

  const renderDefinitions = (texts) => {
    try {
      const content = (texts || []).join(' ').toLowerCase();
      const matches = Object.keys(FINANCIAL_TERMS || {}).filter(term => content.includes(term.toLowerCase())).slice(0, 6);
      if (!matches.length) return null;
      return (
        <div className="mt-4 border-2 border-yellow-500 p-3 rounded">
          <p className="text-retro-yellow font-bold mb-2">Definitions & Terms</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-cyan-200">
            {matches.map(k => (
              <li key={k}><span className="text-retro-cyan font-semibold">{k}:</span> {FINANCIAL_TERMS[k]}</li>
            ))}
          </ul>
        </div>
      );
    } catch {}
    return null;
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="retro-card scanlines p-8 max-w-2xl w-full">
        <h2 className="retro-font text-retro-cyan retro-glow mb-4">{intro.title}</h2>
        <p className="text-retro-yellow mb-2">You start with ${intro.startCash.toLocaleString()} at age {intro.startAge}.</p>
        <div className="text-sm text-cyan-200 mb-4">
          <div>Cash: ${cash.toLocaleString()}</div>
          <div>Kcoin units: {kcoinUnits.toFixed(4)} (value ${(Math.round(kcoinUnits * getCurrentPrice() * 100) / 100).toLocaleString()})</div>
          <div>Total: ${(Math.round((cash + kcoinUnits * getCurrentPrice()) * 100) / 100).toLocaleString()}</div>
        </div>
        <div className="flex items-start gap-4 mb-6">
          <CharacterAvatar scenario={{ title: 'Kcoin Explorer' }} />
          <div className="h-24 flex-1">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        {microFeedback && !showFeedback && (
          <div className={`mt-2 p-3 rounded border-2 ${microFeedback.type === 'success' ? 'border-green-500 text-green-300' : microFeedback.type === 'warning' ? 'border-yellow-500 text-yellow-300' : 'border-cyan-500 text-cyan-300' }`}>
            <span className="font-semibold">{microFeedback.title}:</span> {microFeedback.msg}
          </div>
        )}
        {!showFeedback && renderLevel()}
        {showFeedback && (
          <div className="mt-6 border-2 border-cyan-500 p-4 rounded bg-black/60">
            <h4 className="retro-font text-retro-cyan mb-2">Level Feedback</h4>
            <ul className="space-y-1 text-sm">
              {feedbackItems.map((f, i) => (
                <li key={i} className={
                  f.type === 'error' ? 'text-red-300' : f.type === 'warning' ? 'text-yellow-300' : f.type === 'success' ? 'text-green-300' : 'text-cyan-300'
                }>
                  <span className="font-semibold">{f.title}:</span> {f.msg}
                </li>
              ))}
            </ul>
            {feedbackItems.some(f => f.type === 'improve') && (
              <div className="mt-4">
                <h5 className="retro-font text-retro-yellow mb-2">What you can do better</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm text-cyan-200">
                  {feedbackItems.filter(f => f.type === 'improve').map((f, i) => (
                    <li key={`imp-${i}`}><span className="text-retro-cyan font-semibold">{f.title}:</span> {f.msg}</li>
                  ))}
                </ul>
              </div>
            )}
            <button className="retro-button py-2 px-4 mt-3" onClick={continueAfterFeedback}>Continue</button>
          </div>
        )}
        <div className="mt-6 flex justify-between">
          <button className="retro-button py-2 px-4" onClick={onExit}>Back</button>
          <div className="text-xs text-retro-cyan">Path: [{path.join(' → ')}]</div>
        </div>
      </div>
    </div>
  );
}






