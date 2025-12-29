import { useState } from 'react';

export default function Tooltip({ term, definition, children }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span
      className="relative inline-block cursor-help"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="border-b-2 border-dotted border-cyan-400 text-cyan-300 hover:text-cyan-100">
        {children || term}
      </span>
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-black border-2 border-cyan-500 p-3 rounded-lg shadow-lg">
          <div className="text-retro-green font-bold mb-1">{term}</div>
          <div className="text-sm text-cyan-200">{definition}</div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-500"></div>
        </div>
      )}
    </span>
  );
}

