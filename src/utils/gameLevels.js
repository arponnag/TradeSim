// Level-based question system - 5 levels, 7 questions each
export const GAME_LEVELS = [
  {
    level: 1,
    name: 'Level 1: Getting Started',
    ageRange: [20, 25],
    questions: [
      {
        id: 'l1q1',
        title: 'First Savings Decision 💰',
        story: (name) => `${name}, you've saved some money! What should you do with it?`,
        choices: [
          {
            id: 'savings_choice',
            text: 'What should you do with your savings?',
            type: 'multiple',
            options: ['Keep it in your bank account', 'Invest it in the stock market', 'Spend it on fun things']
          }
        ],
        yearsPass: 2,
        baseReturn: 5
      },
      {
        id: 'l1q2',
        title: 'Your First Job Offer 🎉',
        story: (name) => `${name}, you got a job offer! The company offers a retirement plan with free matching money.`,
        choices: [
          {
            id: '401k_yes',
            text: 'Should you take the free matching money?',
            type: 'yesno',
            options: ['Yes, take the free money!', 'No, skip it']
          },
          {
            id: 'starting_amount',
            text: 'What should you do with your starting money?',
            type: 'multiple',
            options: ['Keep it as cash', 'Invest in stocks', 'Buy something expensive']
          }
        ],
        yearsPass: 3,
        baseReturn: 8
      },
      {
        id: 'l1q3',
        title: 'Monthly Budget 📊',
        story: (name) => `${name}, you need to create a monthly budget. How much should you save?`,
        choices: [
          {
            id: 'savings_rate',
            text: 'How much of your income should you save?',
            type: 'multiple',
            options: ['10% (minimum)', '20% (good goal)', '30%+ (aggressive)']
          }
        ],
        yearsPass: 2,
        baseReturn: 6
      },
      {
        id: 'l1q4',
        title: 'Small Emergency 🚨',
        story: (name) => `${name}, you had a small emergency that costs $500. How do you pay?`,
        choices: [
          {
            id: 'small_emergency',
            text: 'How do you handle this?',
            type: 'multiple',
            options: ['Use your savings', 'Use a credit card', 'Ask family for help']
          }
        ],
        yearsPass: 2,
        baseReturn: 7
      },
      {
        id: 'l1q5',
        title: 'Learning About Investing 📚',
        story: (name) => `${name}, you're learning about investing. Should you start with stocks or wait?`,
        choices: [
          {
            id: 'learning_invest',
            text: 'What should you do?',
            type: 'multiple',
            options: ['Start investing small amounts now', 'Wait until you know more', 'Invest everything you have']
          }
        ],
        yearsPass: 2,
        baseReturn: 8
      },
      {
        id: 'l1q6',
        title: 'Friends Want to Go Out 🎉',
        story: (name) => `${name}, your friends want to go on an expensive trip. Do you join them?`,
        choices: [
          {
            id: 'social_spending',
            text: 'What do you do?',
            type: 'multiple',
            options: ['Save money and skip it', 'Go but spend wisely', 'Spend everything on fun']
          }
        ],
        yearsPass: 1,
        baseReturn: 5
      },
      {
        id: 'l1q7',
        title: 'First Investment Decision 💹',
        story: (name) => `${name}, you've saved $2,000. Should you invest it or keep it safe?`,
        choices: [
          {
            id: 'first_invest',
            text: 'Investment decision?',
            type: 'multiple',
            options: ['Invest in a stock market fund', 'Keep it in savings account', 'Buy individual stocks']
          }
        ],
        yearsPass: 3,
        baseReturn: 8
      }
      ,
      {
        id: 'l1q8',
        title: 'Bank Account Choice',
        story: (name) => `${name}, your bank offers 0.5% interest. A high-yield account offers 4%.`,
        choices: [
          { id: 'bank_choice', text: 'Where to keep cash reserve?', type: 'multiple', options: ['Stay with 0.5%', 'Move to 4% high-yield', 'Hold as physical cash'] }
        ],
        yearsPass: 1,
        baseReturn: 5
      },
      {
        id: 'l1q9',
        title: 'Broker Basics',
        story: (name) => `${name}, your broker offers zero-commission ETFs and fractional shares.`,
        choices: [
          { id: 'etf_start', text: 'Starter portfolio?', type: 'multiple', options: ['Single stock bet', 'Broad-market ETF', 'All cash for now'] }
        ],
        yearsPass: 1,
        baseReturn: 6
      },
      {
        id: 'l1q10',
        title: 'Emergency Target',
        story: (name) => `${name}, you have 1 month saved. Target is 3–6 months.`,
        choices: [
          { id: 'efund_step', text: 'Next step?', type: 'multiple', options: ['Automate $200/mo', 'Invest first, save later', 'Rely on credit'] }
        ],
        yearsPass: 1,
        baseReturn: 5
      }
    ]
  },
  {
    level: 2,
    name: 'Level 2: Building Foundations',
    ageRange: [25, 30],
    questions: [
      {
        id: 'l2q1',
        title: 'Major Emergency 🚗',
        story: (name) => `${name}, your car broke down! It costs $3,000 to fix.`,
        choices: [
          {
            id: 'emergency_fund',
            text: 'How do you pay for it?',
            type: 'multiple',
            options: [
              'Use your savings (smart!) [Light]',
              '0% promo card then pay off [Light]',
              'Use a credit card (expensive!) [Heavy]',
              'Personal loan at 18% APR [Heavy]',
              'Ignore the bill for now [Heavy]'
            ]
          },
          {
            id: 'after_emergency',
            text: 'After this, what should you do?',
            type: 'yesno',
            options: ['Rebuild emergency fund', 'Forget about it']
          }
        ],
        yearsPass: 3,
        baseReturn: 8
      },
      {
        id: 'l2q2',
        title: 'Pay Raise! 💰',
        story: (name) => `${name}, you got a raise! Your income increased.`,
        choices: [
          {
            id: 'raise_choice',
            text: 'What should you do with extra money?',
            type: 'multiple',
            options: [
              'Save half, invest half [Light]',
              'Increase emergency fund [Light]',
              'Invest it all in one hot stock [Heavy]',
              'Lifestyle creep (subscriptions, gadgets) [Heavy]',
              'Crypto YOLO allocation [Heavy]'
            ]
          }
        ],
        yearsPass: 3,
        baseReturn: 9
      },
      {
        id: 'l2q3',
        title: 'Market Opportunity 📈',
        story: (name) => `${name}, the stock market is doing well! Should you invest more?`,
        choices: [
          {
            id: 'market_opportunity',
            text: 'Investment strategy?',
            type: 'multiple',
            options: [
              'DCA into broad ETFs [Light]',
              'Add bonds for balance [Light]',
              'Margin to boost exposure [Heavy]',
              'All-in on momentum names [Heavy]',
              'Sell safe assets to chase returns [Heavy]'
            ]
          }
        ],
        yearsPass: 4,
        baseReturn: 7  // Normal market: 7% (realistic long-term average)
      },
      {
        id: 'l2q4',
        title: 'Debt Decision 💳',
        story: (name) => `${name}, you have some credit card debt. Should you pay it off first?`,
        choices: [
          {
            id: 'debt_strategy',
            text: 'What should you prioritize?',
            type: 'multiple',
            options: [
              'Avalanche (highest APR first) [Light]',
              'Snowball (smallest first) [Light]',
              'Invest and pay minimums [Heavy]',
              'Ignore the debt [Heavy]',
              'New loan to pay old debt [Heavy]'
            ]
          }
        ],
        yearsPass: 2,
        baseReturn: 7
      },
      {
        id: 'l2q5',
        title: 'Side Hustle Opportunity 💼',
        story: (name) => `${name}, you have a chance to start a side business. It requires investment.`,
        choices: [
          {
            id: 'side_hustle',
            text: 'Should you invest in the side hustle?',
            type: 'multiple',
            options: [
              'Test MVP with $500 [Light]',
              'Fully fund $5,000 on credit [Heavy]',
              'Quit job to go full-time [Heavy]',
              'Partner and split costs [Light]',
              'Hire agency upfront [Heavy]'
            ]
          }
        ],
        yearsPass: 3,
        baseReturn: 8  // Normal market: 8% (realistic S&P 500 average)
      },
      {
        id: 'l2q6',
        title: 'Housing Decision 🏠',
        story: (name) => `${name}, you're thinking about moving. Should you rent or save for a house?`,
        choices: [
          {
            id: 'housing',
            text: 'Housing decision?',
            type: 'multiple',
            options: [
              'Keep renting, invest more [Light]',
              'House fund, 20% down target [Light]',
              'Buy now with ARM + PMI [Heavy]',
              'Stretch budget, max debt-to-income [Heavy]',
              'Ignore maintenance costs [Heavy]'
            ]
          }
        ],
        yearsPass: 4,
        baseReturn: 8
      },
      {
        id: 'l2q7',
        title: 'Investment Diversification 📊',
        story: (name) => `${name}, all your money is in stocks. Should you diversify?`,
        choices: [
          {
            id: 'diversify',
            text: 'Diversification strategy?',
            type: 'multiple',
            options: [
              '60/40 (stocks/bonds) [Light]',
              'Add broad international ETF [Light]',
              'Stay 100% in one sector [Heavy]',
              'Leveraged ETFs long-term [Heavy]',
              'Concentrate in illiquid assets [Heavy]'
            ]
          }
        ],
        yearsPass: 3,
        baseReturn: 8
      }
      ,
      {
        id: 'l2q8',
        title: 'Insurance Gap',
        story: (name) => `${name}, you have minimal insurance. A plan with better coverage increases monthly cost.`,
        choices: [
          { id: 'cover_choice', text: 'Choose coverage', type: 'multiple', options: ['Upgrade plan', 'Stay minimal', 'Self-insure (risky)'] }
        ],
        yearsPass: 2,
        baseReturn: 6
      },
      {
        id: 'l2q9',
        title: 'Debt Avalanche vs Snowball',
        story: (name) => `${name}, you carry multiple debts: 25% APR card, 6% loan.`,
        choices: [
          { id: 'debt_method', text: 'Repayment strategy', type: 'multiple', options: ['Avalanche (highest APR first)', 'Snowball (smallest first)', 'Min payments only'] }
        ],
        yearsPass: 2,
        baseReturn: 7
      },
      {
        id: 'l2q10',
        title: 'Windfall Use',
        story: (name) => `${name}, you received a $2,000 windfall.`,
        choices: [
          { id: 'windfall', text: 'Best use?', type: 'multiple', options: ['Pay high-interest debt', 'Invest lump sum', 'Upgrade lifestyle'] }
        ],
        yearsPass: 1,
        baseReturn: 7
      }
    ]
  },
  {
    level: 3,
    name: 'Level 3: Growing Wealth',
    ageRange: [28, 35],
    questions: [
      {
        id: 'l3q1',
        title: 'Tech Boom! 🚀',
        story: (name) => `${name}, tech stocks are booming! Should you invest more?`,
        choices: [
          {
            id: 'tech_invest',
            text: 'Should you invest in tech?',
            type: 'yesno',
            options: ['Yes, invest $2,000 in tech', 'No, stay conservative']
          },
          {
            id: 'diversify_tech',
            text: 'How should you balance?',
            type: 'multiple',
            options: ['Add safer investments', 'Go all-in on tech', 'Keep balanced mix']
          }
        ],
        yearsPass: 5,
        baseReturn: 7  // Normal market: 7% (realistic long-term average)  // Tech boom: 10% (realistic for tech sector outperformance)
      },
      {
        id: 'l3q2',
        title: 'Career Change 💼',
        story: (name) => `${name}, you're considering a career change for higher pay but more risk.`,
        choices: [
          {
            id: 'career_change',
            text: 'What should you do?',
            type: 'multiple',
            options: ['Take the risk for higher pay', 'Stay in current job', 'Start your own business']
          }
        ],
        yearsPass: 4,
        baseReturn: 7  // Normal market: 7% (realistic long-term average)
      },
      {
        id: 'l3q3',
        title: 'Real Estate Opportunity 🏘️',
        story: (name) => `${name}, you see a good real estate investment opportunity.`,
        choices: [
          {
            id: 'real_estate',
            text: 'Should you invest?',
            type: 'yesno',
            options: ['Yes, invest $10,000', 'No, stick with stocks']
          }
        ],
        yearsPass: 5,
        baseReturn: 9
      },
      {
        id: 'l3q4',
        title: 'Market Volatility 📉',
        story: (name) => `${name}, the market has been very volatile lately. How do you react?`,
        choices: [
          {
            id: 'volatility',
            text: 'Your strategy?',
            type: 'multiple',
            options: ['Stay invested, ignore volatility', 'Sell and wait', 'Buy more during dips']
          }
        ],
        yearsPass: 4,
        baseReturn: 7
      },
      {
        id: 'l3q5',
        title: 'Tax Optimization 💸',
        story: (name) => `${name}, you're earning more and taxes are higher. Should you use tax-advantaged accounts?`,
        choices: [
          {
            id: 'tax_strategy',
            text: 'Tax strategy?',
            type: 'multiple',
            options: ['Maximize retirement accounts', 'Don\'t worry about taxes', 'Get tax advice']
          }
        ],
        yearsPass: 3,
        baseReturn: 7  // Normal market: 7% (realistic long-term average)
      },
      {
        id: 'l3q6',
        title: 'Investment Education 📖',
        story: (name) => `${name}, you want to learn more about investing. Should you pay for courses?`,
        choices: [
          {
            id: 'education',
            text: 'What should you do?',
            type: 'multiple',
            options: ['Invest in financial education', 'Learn for free online', 'Don\'t bother learning']
          }
        ],
        yearsPass: 2,
        baseReturn: 8
      },
      {
        id: 'l3q7',
        title: 'Portfolio Rebalancing ⚖️',
        story: (name) => `${name}, your portfolio has grown. Should you rebalance it?`,
        choices: [
          {
            id: 'rebalance',
            text: 'Rebalancing strategy?',
            type: 'multiple',
            options: ['Rebalance to target allocation', 'Let it ride', 'Go all-in on winners']
          }
        ],
        yearsPass: 3,
        baseReturn: 9
      }
      ,
      {
        id: 'l3q8',
        title: 'Concentration Risk',
        story: (name) => `${name}, 85% of your portfolio is a single sector.`,
        choices: [
          { id: 'concentration', text: 'Adjust exposure?', type: 'multiple', options: ['Trim winners, rebalance', 'Double-down winners', 'Hedge with bonds'] }
        ],
        yearsPass: 3,
        baseReturn: 7
      },
      {
        id: 'l3q9',
        title: 'RSU/Bonus Season',
        story: (name) => `${name}, you receive $8,000 RSUs/bonus.`,
        choices: [
          { id: 'bonus_alloc', text: 'Allocation?', type: 'multiple', options: ['Sell and diversify', 'Hold employer stock', 'Split: taxes, invest, cash'] }
        ],
        yearsPass: 2,
        baseReturn: 8
      },
      {
        id: 'l3q10',
        title: 'Tax Loss Harvesting',
        story: (name) => `${name}, positions are down this year.`,
        choices: [
          { id: 'tlh', text: 'Action?', type: 'multiple', options: ['Harvest losses, avoid wash sale', 'Do nothing', 'Sell everything'] }
        ],
        yearsPass: 1,
        baseReturn: 7
      }
    ]
  },
  {
    level: 4,
    name: 'Level 4: Managing Crises',
    ageRange: [35, 42],
    questions: [
      {
        id: 'l4q1',
        title: 'Market Crash! 📉',
        story: (name) => `${name}, the stock market crashed 40%! Your investments lost value.`,
        choices: [
          {
            id: 'panic_sell',
            text: 'How do you handle the crash?',
            type: 'multiple',
            options: ['Sell everything now (panic!)', 'Hold and wait for recovery', 'Buy more while prices are low']
          },
          {
            id: 'crash_strategy',
            text: 'What\'s your strategy?',
            type: 'multiple',
            options: ['Save more cash for safety', 'Keep investing as normal', 'Move to safer investments']
          }
        ],
        yearsPass: 10,
        baseReturn: -40,
        recoveryYears: 5,
        recoveryRate: 12  // Recovery after crash: 12% (realistic post-crash recovery)
      },
      {
        id: 'l4q2',
        title: 'Job Loss 😰',
        story: (name) => `${name}, you lost your job! How will you handle finances?`,
        choices: [
          {
            id: 'job_loss',
            text: 'What should you do?',
            type: 'multiple',
            options: ['Use emergency fund', 'Sell investments', 'Take on debt']
          }
        ],
        yearsPass: 2,
        baseReturn: 5
      },
      {
        id: 'l4q3',
        title: 'Inflation Concerns 💹',
        story: (name) => `${name}, inflation is rising. Your money is losing value.`,
        choices: [
          {
            id: 'inflation',
            text: 'How do you protect against inflation?',
            type: 'multiple',
            options: ['Invest more aggressively', 'Buy real estate', 'Keep cash']
          }
        ],
        yearsPass: 4,
        baseReturn: 8
      },
      {
        id: 'l4q4',
        title: 'Family Emergency 👨‍👩‍👧',
        story: (name) => `${name}, a family member needs financial help.`,
        choices: [
          {
            id: 'family_help',
            text: 'What should you do?',
            type: 'multiple',
            options: ['Help with savings', 'Invest less to help', 'Say no, protect your future']
          }
        ],
        yearsPass: 3,
        baseReturn: 7
      },
      {
        id: 'l4q5',
        title: 'Market Recovery 📈',
        story: (name) => `${name}, after the crash, markets are recovering!`,
        choices: [
          {
            id: 'recovery',
            text: 'Recovery strategy?',
            type: 'multiple',
            options: ['Stay invested for recovery', 'Take profits now', 'Invest even more']
          }
        ],
        yearsPass: 5,
        baseReturn: 8  // Normal market: 8% (realistic S&P 500 average)  // Recovery after crash: 12% average (realistic post-crash recovery)
      },
      {
        id: 'l4q6',
        title: 'Health Insurance 🏥',
        story: (name) => `${name}, you need better health insurance but it costs more.`,
        choices: [
          {
            id: 'insurance',
            text: 'What should you do?',
            type: 'multiple',
            options: ['Get better insurance', 'Skip it to save money', 'Find cheaper options']
          }
        ],
        yearsPass: 3,
        baseReturn: 7
      },
      {
        id: 'l4q7',
        title: 'Retirement Planning 🎯',
        story: (name) => `${name}, you're thinking about retirement. Should you increase savings?`,
        choices: [
          {
            id: 'retirement_boost',
            text: 'Retirement strategy?',
            type: 'multiple',
            options: ['Drastically increase savings', 'Keep current pace', 'Worry about it later']
          }
        ],
        yearsPass: 4,
        baseReturn: 9
      }
      ,
      {
        id: 'l4q8',
        title: 'Sequence Risk',
        story: (name) => `${name}, you plan withdrawals soon; markets are choppy.`,
        choices: [
          { id: 'seq_risk', text: 'Mitigation?', type: 'multiple', options: ['Glidepath to bonds', 'Bucket strategy', 'Ignore risk'] }
        ],
        yearsPass: 3,
        baseReturn: 6
      },
      {
        id: 'l4q9',
        title: 'Liquidity Crunch',
        story: (name) => `${name}, you need $10,000 for an unexpected repair.`,
        choices: [
          { id: 'liquidity', text: 'Raise cash?', type: 'multiple', options: ['Sell bonds', 'Sell stocks', 'Short-term loan'] }
        ],
        yearsPass: 1,
        baseReturn: 6
      }
    ]
  },
  {
    level: 5,
    name: 'Level 5: Advanced Planning',
    ageRange: [42, 52],
    questions: [
      {
        id: 'l5q1',
        title: 'Family Planning 👨‍👩‍👧',
        story: (name) => `${name}, you have a child! College costs are expensive.`,
        choices: [
          {
            id: '529_plan',
            text: 'Should you save for college?',
            type: 'yesno',
            options: ['Yes, save $1,000/year', 'No, skip it']
          },
          {
            id: 'family_investments',
            text: 'How should you handle investments?',
            type: 'multiple',
            options: ['Move to safer investments', 'Stay aggressive', 'Mix of both']
          }
        ],
        yearsPass: 7,
        baseReturn: -20,
        recoveryRate: 10  // Recovery: 10% (realistic post-recession recovery)
      },
      {
        id: 'l5q2',
        title: 'Recession Hits 📉',
        story: (name) => `${name}, a recession hits! Stocks drop 20%.`,
        choices: [
          {
            id: 'recession_response',
            text: 'How do you respond?',
            type: 'multiple',
            options: ['Move to bonds', 'Stay aggressive', 'Mix of both strategies']
          }
        ],
        yearsPass: 5,
        baseReturn: -20,
        recoveryRate: 10  // Recovery: 10% (realistic post-recession recovery)
      },
      {
        id: 'l5q3',
        title: 'Estate Planning 📜',
        story: (name) => `${name}, you should plan for passing wealth to your family.`,
        choices: [
          {
            id: 'estate_planning',
            text: 'Estate planning?',
            type: 'multiple',
            options: ['Set up a will and trust', 'Don\'t worry about it', 'Give money away now']
          }
        ],
        yearsPass: 3,
        baseReturn: 8
      },
      {
        id: 'l5q4',
        title: 'Tax Strategy 💰',
        story: (name) => `${name}, you're earning more and need better tax strategies.`,
        choices: [
          {
            id: 'advanced_tax',
            text: 'Tax optimization?',
            type: 'multiple',
            options: ['Use tax-advantaged accounts', 'Don\'t worry about taxes', 'Get professional help']
          }
        ],
        yearsPass: 4,
        baseReturn: 7  // Normal market: 7% (realistic long-term average)
      },
      {
        id: 'l5q5',
        title: 'Retirement Account Max 💼',
        story: (name) => `${name}, you can now max out your retirement accounts. Should you?`,
        choices: [
          {
            id: 'max_retirement',
            text: 'Should you max out retirement accounts?',
            type: 'yesno',
            options: ['Yes, max it out!', 'No, invest elsewhere']
          }
        ],
        yearsPass: 5,
        baseReturn: 9
      },
      {
        id: 'l5q6',
        title: 'Legacy Planning 🏛️',
        story: (name) => `${name}, you want to leave a legacy for your family.`,
        choices: [
          {
            id: 'legacy',
            text: 'Legacy planning?',
            type: 'multiple',
            options: ['Increase investments for family', 'Enjoy money now', 'Charitable giving']
          }
        ],
        yearsPass: 4,
        baseReturn: 8
      },
      {
        id: 'l5q7',
        title: 'Final Push to Retirement 🎯',
        story: (name) => `${name}, you're close to retirement age. Final decisions!`,
        choices: [
          {
            id: 'final_strategy',
            text: 'Final retirement strategy?',
            type: 'multiple',
            options: ['Shift to safer investments', 'Stay aggressive for growth', 'Mix of both']
          }
        ],
        yearsPass: 7,
        baseReturn: 7
      }
      ,
      {
        id: 'l5q8',
        title: 'Roth Conversion Window',
        story: (name) => `${name}, income dips this year.`,
        choices: [
          { id: 'roth_conv', text: 'Consider conversions?', type: 'multiple', options: ['Partial convert in low bracket', 'Skip conversion', 'Convert all now'] }
        ],
        yearsPass: 2,
        baseReturn: 7
      },
      {
        id: 'l5q9',
        title: 'Long-Term Care Planning',
        story: (name) => `${name}, LTC insurance is expensive but risks are real.`,
        choices: [
          { id: 'ltc', text: 'Approach?', type: 'multiple', options: ['Buy LTC policy', 'Self-insure', 'Hybrid life/LTC'] }
        ],
        yearsPass: 3,
        baseReturn: 6
      },
      {
        id: 'l5q10',
        title: 'Drawdown Strategy',
        story: (name) => `${name}, withdrawals start next year.`,
        choices: [
          { id: 'drawdown', text: 'Plan?', type: 'multiple', options: ['4% rule', 'Guardrails method', 'Ad-hoc as needed'] }
        ],
        yearsPass: 2,
        baseReturn: 7
      }
    ]
  }
];

// Get current level based on age
export function getCurrentLevel(age) {
  if (age >= 42) return GAME_LEVELS[4]; // Level 5
  if (age >= 35) return GAME_LEVELS[3]; // Level 4
  if (age >= 28) return GAME_LEVELS[2]; // Level 3
  if (age >= 25) return GAME_LEVELS[1]; // Level 2
  return GAME_LEVELS[0]; // Level 1
}

// Get question for current level and question index
export function getLevelQuestion(level, questionIndex) {
  if (!level || !level.questions || questionIndex >= level.questions.length) {
    return null;
  }
  return level.questions[questionIndex];
}

