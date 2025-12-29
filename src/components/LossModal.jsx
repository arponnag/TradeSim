import React from 'react';

export default function LossModal({ title = 'Financial Warning', message, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
      <div className="retro-card scanlines p-6 border-2 border-red-500 bg-black max-w-md w-full">
        <h3 className="retro-font text-red-400 retro-glow mb-3">{title}</h3>
        <p className="text-sm text-red-300 mb-4">{message}</p>
        <button onClick={onClose} className="retro-button w-full py-3 uppercase">I Understand</button>
      </div>
    </div>
  );
}


