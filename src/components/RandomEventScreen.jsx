export default function RandomEventScreen({ randomEvent, playerName, onContinue }) {
  const impact = randomEvent.impact;
  let impactText = '';
  
  if (impact.cash) {
    impactText = impact.cash > 0 
      ? `+$${Math.abs(impact.cash).toLocaleString()} to your cash`
      : `-$${Math.abs(impact.cash).toLocaleString()} from your cash`;
  } else if (impact.stocks) {
    impactText = impact.stocks > 0
      ? `+${(impact.stocks * 100).toFixed(0)}% to your stocks`
      : `${(impact.stocks * 100).toFixed(0)}% from your stocks`;
  } else if (impact.incomeBonus) {
    impactText = `+$${impact.incomeBonus.toLocaleString()}/year to your income`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="retro-card scanlines p-8 relative z-10">
          <div className="text-center mb-6">
            <h2 className="retro-font text-retro-cyan mb-4 retro-glow">
              {randomEvent.title}
            </h2>
            <p className="text-retro-green text-lg mb-4">
              {randomEvent.story(playerName)}
            </p>
            <div className="bg-black border-2 border-cyan-500 p-4 rounded mt-4">
              <p className="text-retro-yellow text-sm mb-2">Impact:</p>
              <p className="text-retro-green font-bold">{impactText}</p>
            </div>
          </div>
          
          <button
            onClick={onContinue}
            className="retro-button w-full py-4 uppercase tracking-wider"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

