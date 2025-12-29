// Component to show immediate impact preview of choices
// IMPORTANT: This shows PREVIEW based on CURRENT portfolio state, not future state
export default function ChoiceImpact({ choices = {}, portfolio = { cash: 0, stocks: 0, debt: 0 }, currentNetWorth = 0 }) {
  if (!choices || Object.keys(choices).length === 0) return null;

  const impacts = [];
  
  // Calculate potential impacts based on CURRENT cash (before salary income is added)
  if (choices.savings_choice === 'Invest it in the stock market') {
    // Show specific investment amount based on current cash
    const currentCash = Math.max(0, Math.floor(portfolio.cash || 0));
    const investAmount = Math.floor(currentCash * 0.5); // 50% of current cash
    
    if (currentCash > 0) {
      impacts.push({
        type: 'positive',
        text: `This will invest $${investAmount.toLocaleString()} (50% of your current $${currentCash.toLocaleString()} cash). After income is added this period, you may have more to invest.`,
        icon: '📈'
      });
    } else {
      impacts.push({
        type: 'info',
        text: 'Any income earned this period will be available to invest after you submit.',
        icon: '💡'
      });
    }
  }
  
  if (choices.starting_amount === 'Invest in stocks') {
    // Check if player has enough cash to invest
    const investAmount = Math.min(portfolio.cash, 5000);
    if (investAmount > 0 && portfolio.cash >= investAmount) {
      impacts.push({
        type: 'positive',
        text: `Investing $${investAmount.toLocaleString()} early = more time for growth!`,
        icon: '⏰'
      });
    } else if (portfolio.cash > 0) {
      impacts.push({
        type: 'positive',
        text: `You can invest up to $${Math.floor(portfolio.cash).toLocaleString()} (available cash).`,
        icon: '⏰'
      });
    }
  }
  
  if (choices['401k_yes'] === 'Yes, take the free money!') {
    impacts.push({
      type: 'excellent',
      text: 'FREE MONEY from employer! This is a no-brainer.',
      icon: '💰'
    });
  }
  
  if (choices.small_emergency === 'Use a credit card' || choices.emergency_fund === 'Use a credit card (expensive!)') {
    impacts.push({
      type: 'warning',
      text: 'Warning: Credit cards charge 25% interest!',
      icon: '⚠️'
    });
  }
  
  if (choices.savings_rate) {
    const rate = choices.savings_rate.includes('30%') ? 'high' : choices.savings_rate.includes('20%') ? 'good' : 'low';
    impacts.push({
      type: rate === 'high' ? 'positive' : rate === 'good' ? 'neutral' : 'warning',
      text: `${rate === 'high' ? 'Excellent' : rate === 'good' ? 'Good' : 'Low'} savings rate - ${rate === 'high' ? 'you\'ll build wealth faster!' : rate === 'good' ? 'aim for 20%+ for best results' : 'try to save more'}`,
      icon: rate === 'high' ? '🌟' : rate === 'good' ? '✅' : '💡'
    });
  }

  if (impacts.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      {impacts.map((impact, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg border-2 ${
            impact.type === 'excellent'
              ? 'bg-green-900 bg-opacity-30 border-green-500'
              : impact.type === 'positive'
              ? 'bg-cyan-900 bg-opacity-30 border-cyan-500'
              : impact.type === 'warning'
              ? 'bg-yellow-900 bg-opacity-30 border-yellow-500'
              : 'bg-gray-900 bg-opacity-30 border-gray-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{impact.icon}</span>
            <p className={`text-sm font-semibold ${
              impact.type === 'excellent' ? 'text-green-300' :
              impact.type === 'positive' ? 'text-cyan-300' :
              impact.type === 'warning' ? 'text-yellow-300' :
              'text-gray-300'
            }`}>
              {impact.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

