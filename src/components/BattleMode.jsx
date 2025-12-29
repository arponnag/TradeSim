import React from 'react';
import { LEVELS, BATTLE_POOLS } from '../modes/battle/config';


export default function BattleMode({ onExit }) {
  const [p1, setP1] = React.useState({ name: 'Player 1', score: 0 });
  const [p2, setP2] = React.useState({ name: 'Player 2', score: 0 });
  const [turn, setTurn] = React.useState(0); // 0 = P1, 1 = P2
  const [levelIdx, setLevelIdx] = React.useState(0); // 0..2
  const [idx, setIdx] = React.useState(0); // 0..4 per level
  const [timeLeft, setTimeLeft] = React.useState(20);
  const [done, setDone] = React.useState(false);
  const [deck, setDeck] = React.useState(LEVELS);

  React.useEffect(() => {
    // Build random deck from pools: pick 5 unique per level
    const sample = (arr, n) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a.slice(0, n);
    };
    if (BATTLE_POOLS) {
      const l1 = sample(BATTLE_POOLS.L1 || [], 5);
      const l2 = sample(BATTLE_POOLS.L2 || [], 5);
      const l3 = sample(BATTLE_POOLS.L3 || [], 5);
      setDeck([l1.length ? l1 : LEVELS[0], l2.length ? l2 : LEVELS[1], l3.length ? l3 : LEVELS[2]]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (done) return;
    const t = setInterval(() => setTimeLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    if (timeLeft === 0) {
      // Auto-advance without score if no answer
      nextTurn();
    }
    return () => clearInterval(t);
  }, [timeLeft, done]);

  const answer = (choiceIdx) => {
    if (done) return;
    const q = deck[levelIdx][idx];
    const correct = choiceIdx === q.correct;
    if (turn === 0) {
      setP1((s) => ({ ...s, score: s.score + (correct ? 1 : 0) }));
    } else {
      setP2((s) => ({ ...s, score: s.score + (correct ? 1 : 0) }));
    }
    nextTurn();
  };

  const nextTurn = () => {
    let nextIdx = idx + 1;
    let nextLevel = levelIdx;
    // Each level has 5 questions
    if (nextIdx >= 5) {
      nextIdx = 0;
      nextLevel = levelIdx + 1;
    }
    if (nextLevel >= LEVELS.length) {
      setDone(true);
      return;
    }
    setIdx(nextIdx);
    setLevelIdx(nextLevel);
    setTurn((t) => (t === 0 ? 1 : 0));
    setTimeLeft(20);
  };

  if (done) {
    const winner = p1.score === p2.score ? 'Tie' : (p1.score > p2.score ? p1.name : p2.name);
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="retro-card scanlines p-8 max-w-md w-full text-center">
          <h2 className="retro-font text-retro-cyan retro-glow mb-4">Battle Over</h2>
          <p className="text-retro-green mb-2">{p1.name}: {p1.score}</p>
          <p className="text-retro-green mb-4">{p2.name}: {p2.score}</p>
          <p className="text-retro-yellow font-bold mb-6">Winner: {winner}</p>
          <button className="retro-button py-3 w-full" onClick={onExit}>Back to Menu</button>
        </div>
      </div>
    );
  }

  const q = deck[levelIdx][idx];
  const active = turn === 0 ? p1.name : p2.name;
  const story = q.story || (() => {
    const levelNames = ['rookie stage', 'career climb', 'market master'];
    const scene = levelNames[levelIdx] || 'your journey';
    return `In the ${scene}, you face a choice: ${q.q}`;
  })();

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="retro-card scanlines p-8 max-w-xl w-full">
        <div className="flex justify-between items-center mb-4">
          <span className="text-retro-cyan">Turn: {active}</span>
          <span className="text-retro-yellow">Time: {timeLeft}s</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-retro-cyan">Level {levelIdx + 1} / 3</span>
          <span className="text-retro-cyan">Question {idx + 1} / 5</span>
        </div>
        <h3 className="retro-font text-retro-green retro-glow mb-2">Story</h3>
        <p className="text-retro-cyan mb-4">{story}</p>
        <div className="grid gap-3">
          {q.a.map((opt, i) => (
            <button key={i} className="retro-button py-3" onClick={() => answer(i)}>{opt}</button>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div className="border border-cyan-500 p-3 rounded">
            <p className="text-retro-cyan">{p1.name}</p>
            <p className="text-retro-yellow text-xl font-bold">{p1.score}</p>
          </div>
          <div className="border border-cyan-500 p-3 rounded">
            <p className="text-retro-cyan">{p2.name}</p>
            <p className="text-retro-yellow text-xl font-bold">{p2.score}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


