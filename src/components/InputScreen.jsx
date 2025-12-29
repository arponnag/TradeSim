import { useState } from 'react';
import { getRandomStartingScenario } from '../utils/startingScenarios';

export default function InputScreen({ onStart }) {
  const [scenario, setScenario] = useState(() => getRandomStartingScenario());

  const handleStart = () => {
    onStart({
      name: 'Player',
      gender: 'Player',
      initialAmount: scenario.initialAmount,
      age: scenario.age,
      yearlyIncome: scenario.yearlyIncome,
      yearlyExpenses: scenario.yearlyExpenses,
      scenario: scenario
    });
  };

  const handleRerollScenario = () => {
    setScenario(getRandomStartingScenario());
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-20">
      <div className="retro-card scanlines p-8 max-w-md w-full relative z-20">
        <div className="text-center mb-8">
          <h1 className="retro-font text-retro-cyan mb-4 retro-glow">TradeSim</h1>
          <p className="text-retro-green">Live 30 years of financial decisions in 3 minutes</p>
        </div>

        <div className="space-y-6">

          <div className="bg-black border-2 border-cyan-500 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-retro-green font-semibold">{scenario.title}</p>
              <button type="button" onClick={handleRerollScenario} className="text-xs text-retro-cyan hover:text-retro-yellow transition-colors">[Reroll]</button>
            </div>
            <p className="text-xs text-retro-cyan mb-2">{scenario.description}</p>
            <div className="space-y-1 text-xs text-retro-green">
              <p><span className="font-semibold">Starting Capital:</span> <span className="text-retro-yellow">${scenario.initialAmount.toLocaleString()}</span></p>
              <p><span className="font-semibold">Age:</span> <span className="text-retro-yellow">{scenario.age}</span></p>
              {scenario.yearlyIncome > 0 && (
                <p><span className="font-semibold">Income:</span> <span className="text-retro-yellow">${scenario.yearlyIncome.toLocaleString()}/year</span></p>
              )}
            </div>
          </div>
          <button type="button" onClick={handleStart} className="retro-button w-full py-4 uppercase tracking-wider">Play</button>
        </div>
      </div>
    </div>
  );
}

