// Quick tips overlay for beginners
import { useState, useEffect } from 'react';

export default function QuickTip({ questionId = 'default' }) {
  const [showTip, setShowTip] = useState(false);
  const [hasSeenTip, setHasSeenTip] = useState(false); // Always start fresh for each game session
  
  // Check localStorage on mount (but don't persist across game sessions)
  useEffect(() => {
    try {
      const seen = localStorage.getItem(`tip_${questionId}`) === 'true';
      setHasSeenTip(seen);
    } catch (e) {
      // localStorage might not be available
    }
  }, [questionId]);

  const tips = {
    'l1q1': '💡 Real Data: S&P 500 averaged 10.3% annually (1957-2023). Starting early = 10 extra years of compound growth!',
    'l1q2': '💡 Real Data: Average 401(k) match is 4.5% of salary. Missing this = losing $600k+ over 40 years!',
    'l1q4': '💡 Real Data: 37% of Americans can\'t cover $400 emergency (Fed Survey 2023). Credit cards charge 24.59% APR!',
    'l2q1': '💡 Real Data: Emergency fund prevents debt. Average credit card APR: 24.59% vs S&P 500: 10.3% return.',
    'l4q1': '💡 Real Data: 2008 crash (-38.5%) recovered by 2012. By 2021, those who held gained 250%! Panic sellers lost forever.',
    'default': '💡 Real Data: S&P 500 has returned 10.3% annually since 1957. But volatility is normal - markets move >1% every 9 days!'
  };

  const tip = tips[questionId] || tips.default;

  if (hasSeenTip) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => {
          setShowTip(!showTip);
          if (!showTip) {
            try {
              localStorage.setItem(`tip_${questionId}`, 'true');
            } catch (e) {
              // localStorage might not be available, continue anyway
            }
            setHasSeenTip(true);
          }
        }}
        className="text-xs text-retro-yellow hover:text-retro-cyan transition-colors flex items-center gap-1"
      >
        <span>💡</span>
        <span>Show Quick Tip</span>
      </button>
      
      {showTip && (
        <div className="mt-2 bg-yellow-900 bg-opacity-30 border-2 border-yellow-500 p-3 rounded-lg">
          <p className="text-sm text-yellow-300">{tip}</p>
        </div>
      )}
    </div>
  );
}

