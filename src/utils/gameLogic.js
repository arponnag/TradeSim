// Compound interest formula: FV = P(1+r)^n + PMT[(1+r)^n -1]/r
export function calculateCompoundInterest(principal, annualRate, years, yearlyPayment = 0) {
  const rate = annualRate / 100;
  const futureValuePrincipal = principal * Math.pow(1 + rate, years);
  
  if (yearlyPayment > 0) {
    const futureValuePayments = yearlyPayment * ((Math.pow(1 + rate, years) - 1) / rate);
    return futureValuePrincipal + futureValuePayments;
  }
  
  return futureValuePrincipal;
}

// Calculate portfolio value with REAL-WORLD market volatility
// Based on S&P 500 historical data (1957-2023):
// - Average annual return: 10.3% nominal, ~7% after inflation
// - Year-to-year volatility: -37% (worst year 2008) to +37% (best year 1954)
// - Daily volatility: S&P moves >1% every 9 days on average
// - Standard deviation: ~15-17% annual volatility
export function calculatePortfolioGrowth(initialValue, years, baseRate, eventMultiplier = 1) {
  if (initialValue <= 0) return 0; // Can't grow from zero or negative
  if (years <= 0) return initialValue; // No time passed, no growth
  
  // Apply event multiplier to base rate
  let adjustedRate = baseRate * eventMultiplier;
  
  // Ensure base rate is realistic (between -50% and +50% per year)
  adjustedRate = Math.max(-50, Math.min(50, adjustedRate));
  
  // Real-world market volatility based on S&P 500 historical data
  // Smart regime model with realistic bounds and slight positive drift
  let totalValue = initialValue;
  
  // Apply growth year by year (compound growth)
  // REALISTIC: Make it harder - not everyone gets rich
  // Real markets have bad years, crashes, and periods of negative returns
  for (let year = 0; year < years; year++) {
    // Regime selection: bull, base, soft-bear
    // - 10% bull years: tilt positive 0%..+30%
    // - 70% base years: -20%..+30%
    // - 20% soft-bear years: -20%..+10%
    const rand = Math.random();
    let lower = -20;
    let upper = 30;
    if (rand < 0.10) { // bull
      lower = 0;
      upper = 30;
    } else if (rand > 0.90) { // soft-bear
      lower = -20;
      upper = 10;
    }

    // Base around adjustedRate with random variation but clamp to regime bounds
    const volatilityRange = 0.5; // 50% variation around adjusted base rate
    const annualRateUnclamped = adjustedRate * (1 + (Math.random() - 0.5) * volatilityRange);
    // Final clamp: -20% to +30% typical, with regime skew
    const clampedRate = Math.max(lower, Math.min(upper, annualRateUnclamped));
    
    // Apply compound growth for this year: value = value * (1 + rate)
    totalValue = totalValue * (1 + clampedRate / 100);
    
    // Ensure value never goes negative
    totalValue = Math.max(0, totalValue);
  }
  
  // Round to 2 decimals to avoid floating-point precision issues
  return Math.max(0, Math.round(totalValue * 100) / 100);
}

// Badge definitions
export const BADGES = {
  FREE_MONEY_FINDER: {
    name: 'Free Money Finder',
    description: 'Maximized your 401(k) match',
    icon: '[F]'
  },
  SAFETY_NET_SHIELD: {
    name: 'Safety Net Shield',
    description: 'Built an emergency fund',
    icon: '[S]'
  },
  TECH_VISIONARY: {
    name: 'Tech Visionary',
    description: 'Capitalized on tech boom',
    icon: '[T]'
  },
  WAR_SURVIVOR: {
    name: 'War Survivor',
    description: 'Held through market crash',
    icon: '[W]'
  },
  LEGACY_BUILDER: {
    name: 'Legacy Builder',
    description: 'Started 529 plan for family',
    icon: '[L]'
  },
  HODL_HERO: {
    name: 'HODL Hero',
    description: 'Never panic sold',
    icon: '[H]'
  }
};

// Life events configuration
export const LIFE_EVENTS = [
  {
    id: 1,
    age: 22,
    title: 'Your First Job',
    story: (name) => `${name}, congratulations! You got your first job making $50,000 per year. Your boss offers FREE MONEY if you save for retirement. What do you do?`,
    choices: [
      {
        id: '401k_yes',
        text: 'Save for retirement and get free money from boss?',
        type: 'yesno',
        options: ['Yes, take the free money!', 'No, skip it']
      },
      {
        id: 'initial_allocation',
        text: 'What should you do with your $5,000 savings?',
        type: 'multiple',
        options: ['Keep it in your bank account', 'Invest it in the stock market', 'Buy a fancy car']
      }
    ],
    yearsPass: 3,
    baseReturn: 8
  },
  {
    id: 2,
    age: 25,
    title: 'Uh Oh, Emergency',
    story: (name) => `${name}, your car just broke down! It costs $3,000 to fix. Do you have money saved for emergencies?`,
    choices: [
      {
        id: 'emergency_fund',
        text: 'How do you pay for the car repair?',
        type: 'multiple',
        options: ['Use your savings (smart choice!)', 'Use a credit card (expensive!)', 'Sell your investments']
      },
      {
        id: 'rebalance',
        text: 'After this, what should you do?',
        type: 'yesno',
        options: ['Keep investing for the future', 'Stop investing and save more cash']
      }
    ],
    yearsPass: 3,
    baseReturn: 8
  },
  {
    id: 3,
    age: 28,
    title: 'China Making Chips (Geopolitical Boom)',
    story: (name) => `${name}, global news: China ramps up chip production, boosting tech stocks! US markets surge, but inflation rises.`,
    choices: [
      {
        id: 'tech_invest',
        text: 'Invest in tech ETF (e.g., QQQ)?',
        type: 'yesno',
        options: ['Yes ($2,000)', 'No (miss opportunity)']
      },
      {
        id: 'diversify',
        text: 'Diversify portfolio?',
        type: 'multiple',
        options: ['Add bonds', 'Go all-in stocks', 'Stay balanced']
      }
    ],
    yearsPass: 5,
    baseReturn: 15, // Tech boom
    eventMultiplier: 1.15
  },
  {
    id: 4,
    age: 35,
    title: 'Market Crash',
    story: (name) => `${name}, oh no! The stock market just crashed 40%! Your investments lost a lot of value. But history shows markets always recover. What do you do?`,
    choices: [
      {
        id: 'panic_sell',
        text: 'How do you handle the crash?',
        type: 'multiple',
        options: ['Sell everything now (panic!)', 'Hold and wait for recovery', 'Buy more while prices are low']
      },
      {
        id: 'emergency_actions',
        text: 'What\'s your strategy?',
        type: 'multiple',
        options: ['Save more cash for safety', 'Keep investing as normal', 'Move to safer investments']
      }
    ],
    yearsPass: 10,
    baseReturn: -40, // Initial crash
    eventMultiplier: 0.6,
    recoveryYears: 5,
    recoveryRate: 60
  },
  {
    id: 5,
    age: 45,
    title: 'Family & Economic Challenges',
    story: (name) => `${name}, congratulations! You have a child now! But college is expensive, and there's a recession - stocks dropped 20%. How do you plan for your family's future?`,
    choices: [
      {
        id: '529_plan',
        text: 'Should you start saving for your child\'s college?',
        type: 'yesno',
        options: ['Yes, save $1,000/year for college', 'No, skip it']
      },
      {
        id: 'adjust_investments',
        text: 'How should you handle the recession?',
        type: 'multiple',
        options: ['Move to safer investments', 'Stay aggressive with stocks', 'Mix of both strategies']
      }
    ],
    yearsPass: 7,
    baseReturn: -20, // Recession
    eventMultiplier: 0.8,
    recoveryRate: 25
  }
];

// Random events that can happen between main events
export const RANDOM_EVENTS = [
  {
    id: 'bonus',
    title: 'Bonus Windfall',
    story: (name) => `${name}, you received an unexpected bonus at work!`,
    impact: { cash: 2000 },
    probability: 0.3
  },
  {
    id: 'medical',
    title: 'Medical Emergency',
    story: (name) => `${name}, you had a medical emergency that insurance didn't fully cover.`,
    impact: { cash: -1500 },
    probability: 0.25
  },
  {
    id: 'side_hustle',
    title: 'Side Hustle Success',
    story: (name) => `${name}, your side project finally took off!`,
    impact: { cash: 3000, incomeBonus: 5000 },
    probability: 0.2
  },
  {
    id: 'market_dip',
    title: 'Minor Market Dip',
    story: (name) => `${name}, markets had a temporary 5% correction.`,
    impact: { stocks: -0.05 },
    probability: 0.3
  },
  {
    id: 'market_surge',
    title: 'Market Surge',
    story: (name) => `${name}, markets had an unexpected 10% surge!`,
    impact: { stocks: 0.10 },
    probability: 0.25
  },
  {
    id: 'tax_refund',
    title: 'Tax Refund',
    story: (name) => `${name}, you got a larger than expected tax refund!`,
    impact: { cash: 1500 },
    probability: 0.3
  },
  {
    id: 'home_repair',
    title: 'Major Home Repair',
    story: (name) => `${name}, your home needed urgent repairs.`,
    impact: { cash: -2000 },
    probability: 0.25
  },
  {
    id: 'inheritance',
    title: 'Inheritance',
    story: (name) => `${name}, you received a small inheritance from a relative.`,
    impact: { cash: 5000 },
    probability: 0.15
  },
  {
    id: 'job_offer',
    title: 'Better Job Offer',
    story: (name) => `${name}, you got a better job offer with higher pay!`,
    impact: { incomeBonus: 10000 },
    probability: 0.2
  },
  {
    id: 'vacation',
    title: 'Unexpected Vacation Costs',
    story: (name) => `${name}, you had to take an emergency trip.`,
    impact: { cash: -1000 },
    probability: 0.3
  }
];

// Get a random event based on probability
export function getRandomEvent() {
  const possibleEvents = RANDOM_EVENTS.filter(event => Math.random() < event.probability);
  if (possibleEvents.length === 0) return null;
  return possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
}

// Generate feedback based on game performance
export function generateFeedback(gameStats) {
  const feedback = [];
  const { netWorth, portfolio, badges, choices } = gameStats;
  
  // Check 401(k) participation
  if (!choices.opted401k && netWorth < 1000000) {
    feedback.push({
      type: 'improvement',
      title: '💡 Maximize Employer Match',
      message: "CASE STUDY: Sarah maxed 401(k) match from age 22 = $1.2M by 65. John skipped it until 30 = only $600k. Same salary, same age, but John lost $600k! The 8 years of free employer match ($24k) cost John $600k in retirement. Always contribute up to the match - it's essentially a 100% return on investment."
    });
  }
  
  // Check emergency fund
  if (choices.usedCreditCard && netWorth < 500000) {
    feedback.push({
      type: 'improvement',
      title: '🛡️ Build Emergency Fund',
      message: "CASE STUDY: Maria's $400 car repair became $650 in 2 years on a credit card (24.59% APR). Had she had a $3,000 emergency fund, it would've cost $400 total. This is why 37% of Americans struggle - no emergency fund = expensive debt spiral. Aim for 3-6 months of expenses."
    });
  }
  
  // Check investment allocation
  const totalAssets = portfolio.cash + portfolio.stocks;
  const stockPercentage = totalAssets > 0 ? portfolio.stocks / totalAssets : 0;
  if (stockPercentage < 0.5 && netWorth < 1000000) {
    feedback.push({
      type: 'improvement',
      title: '📊 Increase Stock Allocation',
      message: "Real data: S&P 500 averaged 10.3% annually (1957-2023) vs cash at 0-1%. You kept too much in cash. Over long term, stocks historically outperform cash by 9-10% annually."
    });
  } else if (stockPercentage > 0.9 && netWorth < 500000) {
    feedback.push({
      type: 'improvement',
      title: '⚖️ Diversify Your Portfolio',
      message: "Real data: S&P 500 moves >1% daily every 9 days. Too much in stocks = high volatility. Consider adding bonds (3-5% returns) to reduce risk."
    });
  }
  
  // Check if they panic sold
  if (choices.panicSold) {
    feedback.push({
      type: 'improvement',
      title: '💪 Hold Through Volatility',
      message: "CASE STUDY: 2008 crash - Investor A held $100k through crash = $250k by 2021 (+150%). Investor B panic-sold at bottom = $61.5k forever (-38.5% permanent loss). Difference: $188,500! Markets recover, panic selling locks in losses permanently. Time in the market beats timing the market."
    });
  }
  
  // Check if they invested early
  if (!choices.investedEarly && netWorth < 1000000) {
    feedback.push({
      type: 'improvement',
      title: '⏰ Start Investing Early',
      message: "Real data: Investing $5,000 at age 22 vs 32 = $95,000 more by age 65 (7% returns). S&P 500 averaged 10.3% annually. Time is your biggest asset - compound interest needs decades to work!"
    });
  }
  
  // Debt check
  if (portfolio.debt > 0) {
    feedback.push({
      type: 'improvement',
      title: '🚫 Avoid High-Interest Debt',
      message: `Real data: Average credit card APR is 24.59% (2024). S&P 500 returns 10.3% annually. You ended with $${portfolio.debt.toLocaleString()} in debt. Debt at 25% destroys wealth faster than stocks at 10% can build it. Pay off debt >4% APR before investing!`
    });
  }
  
  // Positive reinforcement
  if (badges.length >= 4) {
    feedback.push({
      type: 'success',
      title: '🌟 Excellent Strategy!',
      message: "You made smart financial decisions throughout! You earned multiple badges by following best practices."
    });
  }
  
  // Retirement readiness
  if (netWorth >= 1000000) {
    feedback.push({
      type: 'success',
      title: '🎯 Millionaire Status!',
      message: "Congratulations! You reached millionaire status using the 25x rule (Trinity Study 1998). With $1M, you can safely withdraw $40k/year (4% rule) for 30+ years with 95% success rate. Excellent financial discipline!"
    });
  } else if (netWorth < 200000) {
    feedback.push({
      type: 'improvement',
      title: '📚 Improve Your Strategy',
      message: "Real data: S&P 500 averaged 10.3% annually (1957-2023). Your net worth is lower than ideal. Focus on: 1) Investing early (age 22 vs 32 = $95k more by 65), 2) Taking employer 401k match (4.5% average), 3) Avoiding credit card debt (24.59% APR)."
    });
  }
  
  // Generic tips if no specific feedback
  if (feedback.length === 0) {
    feedback.push({
      type: 'tip',
      title: '💡 General Tips',
      message: "Key principles: Start early, invest consistently, diversify, hold through volatility, and always take the employer match!"
    });
  }
  
  return feedback;
}

