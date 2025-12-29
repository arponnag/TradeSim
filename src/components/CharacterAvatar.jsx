import React from 'react';

export default function CharacterAvatar({ scenario }) {
  const getSrc = () => {
    const base = '/backgrounds/Characters/';
    const title = (scenario?.title || '').toLowerCase();
    if (title.includes('student')) return base + 'StudentIsometric.png';
    if (title.includes('business') || title.includes('job') || title.includes('work')) return base + 'BusinessManYoungIsometric (1) (1).jpg';
    return base + 'StudentFront.png';
  };
  const src = getSrc();
  return (
    <div className="flex items-center gap-3 mb-3">
      <img src={src} alt="Character" className="w-16 h-16 object-cover rounded border-2 border-cyan-500" />
      <div>
        <p className="text-retro-cyan text-xs">Your Character</p>
        <p className="text-retro-green text-sm">{scenario?.title || 'Explorer'}</p>
      </div>
    </div>
  );
}


