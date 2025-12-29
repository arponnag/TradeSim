import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';
import { generateFeedback } from '../utils/gameLogic';

export default function EndScreen({ playerName, netWorth, badges, age, portfolio, gameChoices, onPlayAgain }) {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isMillionaire = netWorth >= 1000000;
  const isRetirementReady = netWorth >= 500000;

  // Generate feedback
  const feedback = generateFeedback({
    netWorth,
    portfolio,
    badges,
    choices: gameChoices
  });

  const getNetWorthMessage = () => {
    if (netWorth >= 1000000) {
      return { title: '🏆 Millionaire Milestone!', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    } else if (netWorth >= 500000) {
      return { title: '✨ Retirement Ready!', color: 'text-green-600', bg: 'bg-green-50' };
    } else if (netWorth >= 100000) {
      return { title: '📊 Solid Foundation', color: 'text-blue-600', bg: 'bg-blue-50' };
    } else {
      return { title: '💪 Keep Learning', color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  const message = getNetWorthMessage();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {isMillionaire && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} />}
      
      <div className="max-w-2xl mx-auto w-full">
        <div className="retro-card scanlines p-8 relative z-10">
          <div className="text-center mb-8">
            <h1 className="retro-font text-retro-cyan mb-4 retro-glow">Your Journey Ends</h1>
            <p className="text-retro-green">At age {age}, {playerName}, here's your financial story</p>
          </div>

          <div className="bg-black border-2 border-cyan-500 p-6 rounded-xl mb-6">
            <h2 className={`text-3xl font-bold ${message.type === 'success' ? 'text-retro-yellow' : 'text-retro-green'} mb-2 retro-glow`}>{message.title}</h2>
            <p className="text-5xl font-bold text-retro-cyan retro-glow">
              ${netWorth.toLocaleString()}
            </p>
            <p className="text-sm text-retro-green mt-2">Final Net Worth</p>
          </div>

          <div className="mb-6">
            <h3 className="retro-font text-retro-cyan mb-4 retro-glow">Retirement Status</h3>
            <div className={`p-4 rounded-lg border-2 ${isRetirementReady ? 'bg-black border-green-500' : 'bg-black border-red-500'}`}>
              <p className={`font-semibold ${isRetirementReady ? 'text-retro-green retro-glow' : 'text-red-400'}`}>
                {isRetirementReady ? '✅ On Track for Retirement' : '⚠️ Need More Savings'}
              </p>
            </div>
          </div>

          {badges.length > 0 && (
            <div className="mb-6">
              <h3 className="retro-font text-retro-cyan mb-4 retro-glow">Badges Earned</h3>
              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge, index) => (
                  <div key={index} className="bg-black border-2 border-cyan-500 p-4 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{badge.icon}</span>
                      <div>
                        <p className="font-semibold text-retro-green">{badge.name}</p>
                        <p className="text-xs text-retro-cyan">{badge.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Section */}
          <div className="mb-6">
            <h3 className="retro-font text-retro-cyan mb-4 retro-glow">📚 What You Can Do Better</h3>
            <div className="space-y-3">
              {feedback.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 bg-black bg-opacity-50 ${
                    item.type === 'success'
                      ? 'border-green-500'
                      : item.type === 'tip'
                      ? 'border-cyan-500'
                      : 'border-yellow-500'
                  }`}
                >
                  <h4 className={`font-bold mb-2 ${
                    item.type === 'success'
                      ? 'text-retro-green retro-glow'
                      : item.type === 'tip'
                      ? 'text-retro-cyan'
                      : 'text-retro-yellow'
                  }`}>
                    {item.title}
                  </h4>
                  <p className={`text-sm ${
                    item.type === 'success'
                      ? 'text-green-300'
                      : item.type === 'tip'
                      ? 'text-cyan-300'
                      : 'text-yellow-300'
                  }`}>
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onPlayAgain}
              className="flex-1 retro-button py-3 uppercase tracking-wider"
            >
              Play Again
            </button>
            <button
              onClick={() => {
                const text = `I just simulated 30 years of investing in TradeSim! Final net worth: $${netWorth.toLocaleString()}. Check it out!`;
                const url = window.location.href;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
              }}
              className="flex-1 bg-black border-2 border-cyan-500 text-retro-cyan py-3 rounded-lg font-semibold hover:bg-cyan-900 hover:bg-opacity-20 transition-all transform hover:scale-105 uppercase tracking-wider"
            >
              Share on Twitter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

