import React from 'react';

export default function ModeSelect({ onSelect }) {
  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="retro-card scanlines p-8 max-w-md w-full">
        <h2 className="retro-font text-retro-cyan retro-glow mb-6 text-center">Choose Mode</h2>
        <div className="grid gap-4">
          <button className="retro-button py-4" onClick={() => onSelect('kcoin')}>Kcoin Story</button>
          <button className="retro-button py-4" onClick={() => onSelect('battle')}>Battle Mode (2 Players)</button>
        </div>
      </div>
    </div>
  );
}


