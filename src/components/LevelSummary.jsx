import React from 'react';

export default function LevelSummary({ levelName = 'Level Complete', netWorth = 0, age = 0, badges = [], onContinue }) {
  return (
    <div className="retro-card scanlines p-8 relative z-20">
      <h2 className="retro-font text-retro-cyan mb-4 retro-glow">{levelName}</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black border-2 border-green-500 p-4 rounded">
          <p className="text-retro-green text-sm">Net Worth</p>
          <p className="text-2xl font-bold text-retro-yellow retro-glow">${netWorth.toLocaleString()}</p>
        </div>
        <div className="bg-black border-2 border-cyan-500 p-4 rounded">
          <p className="text-retro-cyan text-sm">Age</p>
          <p className="text-2xl font-bold text-retro-green retro-glow">{age}</p>
        </div>
      </div>
      {badges && badges.length > 0 && (
        <div className="mb-6">
          <p className="text-retro-cyan text-sm mb-2">Badges Earned</p>
          <div className="flex flex-wrap gap-2">
            {badges.map((b, i) => (
              <span key={i} className="text-xs px-2 py-1 border border-yellow-500 text-retro-yellow rounded">{b.name || b}</span>
            ))}
          </div>
        </div>
      )}
      <button onClick={onContinue} className="retro-button py-3 w-full uppercase">Continue</button>
    </div>
  );
}


