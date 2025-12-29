// Kcoin Dilemma branching data

export const KCOIN_INTRO = {
  startCash: 5000,
  startAge: 22,
  title: 'Scenario 1: The Kcoin Dilemma — Full Decision Map',
  knowledgeCard: `Crypto rallies often begin with social momentum, not fundamentals — Dogecoin’s 2021 surge was driven by memes before losing most of its value months later. Yet Ethereum’s early adopters in 2016 held through volatility and were rewarded long-term.\n\nBuying dips can build wealth when supported by research, but during events like the Terra crash in 2022, many learned that confidence without understanding leads to disaster. What truly defines a “smart investor” — timing, patience, or knowledge?`,
  levels: [
    {
      id: 'L1',
      heading: 'LEVEL 1 – The Hype Begins',
      nodes: [
        {
          id: 'L1a',
          text: 'Kcoin surges +70% this month. Your friend says “it’s the next Bitcoin.”',
          choices: [
            { id: 'A', label: 'Go all-in ($5,000 into Kcoin) [Heavy]' },
            { id: 'B', label: 'Wait a week and watch [Light]' },
            { id: 'C', label: 'Research before deciding [Light]' },
          ],
        },
        {
          id: 'L1b',
          text: 'Your exchange offers 50x leverage and a signup bonus. Security page looks thin.',
          choices: [
            { id: 'L1b1', label: 'Enable 2FA, no leverage [Light]' },
            { id: 'L1b2', label: 'Try 5x leverage on a small position [Heavy]' },
            { id: 'L1b3', label: 'Deposit all funds and use bonus [Heavy]' },
          ],
        },
      ],
    },
    {
      id: 'L2',
      heading: 'LEVEL 2 – The Aftermath',
      branches: {
        A: [
          {
            id: 'L2A1',
            text: 'Kcoin drops -25% after government warnings.',
            choices: [
              { id: 'A1', label: 'Double down (another $2,000) [Heavy]' },
              { id: 'A2', label: 'Sell and cut losses [Light]' },
              { id: 'A3', label: 'Diversify (move half into ETF) [Light]' },
            ],
          },
          {
            id: 'L2A2',
            text: 'Liquidity crunch: spreads widen; fees spike during volatility.',
            choices: [
              { id: 'A1x', label: 'Market order now [Heavy]' },
              { id: 'A2x', label: 'Use limit orders only [Light]' },
              { id: 'A3x', label: 'Wait for calmer books [Light]' },
            ],
          },
          {
            id: 'L2A3',
            text: 'Risk controls: set a maximum drawdown or stop-loss?',
            choices: [
              { id: 'A1s', label: 'No stops; trust recovery [Heavy]' },
              { id: 'A2s', label: 'Place a 10% stop-loss [Light]' },
              { id: 'A3s', label: 'Reduce size and hedge with cash [Light]' },
            ],
          },
        ],
        B: [
          {
            id: 'L2B1',
            text: 'Kcoin stays flat, influencers say “you missed it.”',
            choices: [
              { id: 'B1', label: 'Give in to FOMO and buy now ($5,000) [Heavy]' },
              { id: 'B2', label: 'Stay patient and diversify (ETF + cash) [Light]' },
              { id: 'B3', label: 'Research before making any move [Light]' },
            ],
          },
          {
            id: 'L2B2',
            text: 'Tax note: short-term gains taxed as income; ETFs defer taxes more efficiently.',
            choices: [
              { id: 'B1x', label: 'Trade frequently anyway [Heavy]' },
              { id: 'B2x', label: 'Prefer tax-efficient ETFs [Light]' },
              { id: 'B3x', label: 'Research more [Light]' },
            ],
          },
          {
            id: 'L2B3',
            text: 'Emergency fund question: do you keep 3-6 months of expenses?',
            choices: [
              { id: 'B1s', label: 'Invest emergency fund into Kcoin [Heavy]' },
              { id: 'B2s', label: 'Keep emergency fund in cash [Light]' },
              { id: 'B3s', label: 'Split: some cash, some index fund [Light]' },
            ],
          },
        ],
        C: [
          {
            id: 'L2C1',
            text: 'You find unclear whitepaper, strong online hype.',
            choices: [
              { id: 'C1', label: 'Invest partially ($2,500) [Heavy]' },
              { id: 'C2', label: 'Avoid Kcoin completely [Light]' },
              { id: 'C3', label: 'Keep watching for trend confirmation [Light]' },
            ],
          },
          {
            id: 'L2C2',
            text: 'Security due diligence: audits? multisig? code repo activity?',
            choices: [
              { id: 'C1x', label: 'Skip checks, trust hype [Heavy]' },
              { id: 'C2x', label: 'Verify audits and multisig [Light]' },
              { id: 'C3x', label: 'Read the code issues [Light]' },
            ],
          },
          {
            id: 'L2C3',
            text: 'Position sizing: how much of your portfolio should a single bet be?',
            choices: [
              { id: 'C1s', label: 'Let one asset exceed 50% [Heavy]' },
              { id: 'C2s', label: 'Cap any single asset at 10% [Light]' },
              { id: 'C3s', label: 'Use 5% starter position and review [Light]' },
            ],
          },
        ],
      },
    },
    {
      id: 'L3',
      heading: 'LEVEL 3 – The Temptation',
      branches: {
        A1: [
          {
            id: 'L3A1',
            text: 'Kcoin briefly rallies +30%.',
            choices: [
              { id: 'A1a', label: 'Take profit now [Light]' },
              { id: 'A1b', label: 'Hold for the “next leg up” [Heavy]' },
              { id: 'A1c', label: 'Move half into index funds [Light]' },
            ],
          },
          {
            id: 'L3A2',
            text: 'Position sizing & risk: how much of portfolio in single asset?',
            choices: [
              { id: 'A1y', label: 'Cap at 10% position [Light]' },
              { id: 'A1z', label: 'Let it run to 50%+ [Heavy]' },
              { id: 'A1w', label: 'Gradual trim schedule [Light]' },
            ],
          }
        ],
        A2: {
          text: 'Kcoin rebounds +20% — you feel regret.',
          choices: [
            { id: 'A2a', label: 'Buy back in [Heavy]' },
            { id: 'A2b', label: 'Ignore it and stick to safer assets [Light]' },
            { id: 'A2c', label: 'Explore new opportunities (diversify into stocks) [Light]' },
          ],
        },
        A3: {
          text: 'ETF grows +10%, Kcoin +20%.',
          choices: [
            { id: 'A3a', label: 'Rebalance toward Kcoin again [Heavy]' },
            { id: 'A3b', label: 'Maintain current diversification [Light]' },
            { id: 'A3c', label: 'Exit Kcoin entirely [Light]' },
          ],
        },
        B1: [
          {
            id: 'L3B1',
            text: 'Kcoin drops another -10% next week. Your friend says "just average down!"',
            choices: [
              { id: 'B1a', label: 'Average down (buy another $2,000) [Heavy]', impact: { cashDelta: -2000, stockDelta: 2000, stockFactor: 0.9 } },
              { id: 'B1b', label: 'Exit quickly and cut losses [Light]', impact: { cashDelta: 1800, stockDelta: -2000, stockFactor: 1.0 } },
              { id: 'B1c', label: 'Hold long-term, ignore volatility [Light]', impact: { cashDelta: 0, stockDelta: 0, stockFactor: 1.0 } },
            ],
          },
          {
            id: 'L3B1b',
            text: 'Your friend suggests a new "pump and dump" scheme for another coin. What do you do?',
            choices: [
              { id: 'B1x', label: 'Join the pump (invest $1,000) [Heavy]', impact: { cashDelta: -1000, stockDelta: 1000, stockFactor: 0.5 } },
              { id: 'B1y', label: 'Decline and warn your friend [Light]', impact: { cashDelta: 0, stockDelta: 0, stockFactor: 1.0 } },
              { id: 'B1z', label: 'Report the scheme to authorities [Light]', impact: { cashDelta: 0, stockDelta: 0, stockFactor: 1.0 } },
            ],
          }
        ],
        B2: {
          text: 'Your diversified portfolio (ETF +6%, Kcoin +15%) is performing well. How do you proceed?',
          choices: [
            { id: 'B2a', label: 'Increase ETF stake (rebalance toward stability) [Light]', impact: { cashDelta: -2000, stockDelta: 0, stockFactor: 1.0 } },
            { id: 'B2b', label: 'Add small crypto exposure (5% of portfolio) [Light]', impact: { cashDelta: -1000, stockDelta: 1000, stockFactor: 1.1 } },
            { id: 'B2c', label: 'Stay passive and maintain current allocation [Light]', impact: { cashDelta: 0, stockDelta: 0, stockFactor: 1.0 } },
          ],
        },
        B3: {
          text: 'You uncover serious developer issues in Kcoin\'s GitHub repo: unpatched security vulnerabilities and inactive maintainers.',
          choices: [
            { id: 'B3a', label: 'Warn your friend and exit your position [Light]', impact: { cashDelta: 4500, stockDelta: -5000, stockFactor: 1.0 } },
            { id: 'B3b', label: 'Report online anonymously and reduce exposure [Light]', impact: { cashDelta: 2500, stockDelta: -2500, stockFactor: 1.0 } },
            { id: 'B3c', label: 'Ignore and keep watching (hope it gets fixed) [Heavy]', impact: { cashDelta: 0, stockDelta: 0, stockFactor: 0.8 } },
          ],
        },
        C1: {
          text: 'Your partial Kcoin position is up +10%. The hype continues, but fundamentals remain unclear.',
          choices: [
            { id: 'C1a', label: 'Add more funds (double down) [Heavy]', impact: { cashDelta: -2500, stockDelta: 2500, stockFactor: 1.2 } },
            { id: 'C1b', label: 'Take profit and observe (sell half) [Light]', impact: { cashDelta: 1375, stockDelta: -1250, stockFactor: 1.0 } },
            { id: 'C1c', label: 'Hold steady and wait for confirmation [Light]', impact: { cashDelta: 0, stockDelta: 0, stockFactor: 1.0 } },
          ],
        },
        C2: [
          {
            id: 'L3C2',
            text: 'Kcoin goes +50% in two weeks. Everyone is talking about it, and you feel like you\'re missing out.',
            choices: [
              { id: 'C2a', label: 'Jump in now (invest $3,000) [Heavy]', impact: { cashDelta: -3000, stockDelta: 3000, stockFactor: 1.3 } },
              { id: 'C2b', label: 'Stick to your principles (avoid FOMO) [Light]', impact: { cashDelta: 0, stockDelta: 0, stockFactor: 1.0 } },
              { id: 'C2c', label: 'Research similar projects first [Light]', impact: { cashDelta: 0, stockDelta: 0, stockFactor: 1.0 } },
            ],
          },
          {
            id: 'L3C2b',
            text: 'Momentum is strong, but narratives can reverse. Consider rules for entering late moves.',
            choices: [
              { id: 'C2x', label: 'Ignore rules; chase the pump [Heavy]', impact: { cashDelta: -2000, stockDelta: 2000, stockFactor: 0.7 } },
              { id: 'C2s', label: 'Set strict sizing and stops (invest $1,000 with 10% stop) [Light]', impact: { cashDelta: -1000, stockDelta: 1000, stockFactor: 1.1 } },
              { id: 'C2p', label: 'Paper trade first to test strategy [Light]', impact: { cashDelta: 0, stockDelta: 0, stockFactor: 1.0 } },
            ],
          }
        ],
        C3: {
          text: 'Kcoin price fluctuates wildly (+30%, then -25%). The volatility is extreme, and you\'re unsure if this is normal or a red flag.',
          choices: [
            { id: 'C3a', label: 'Invest during volatility (buy the dip) [Heavy]', impact: { cashDelta: -2000, stockDelta: 2000, stockFactor: 0.9 } },
            { id: 'C3b', label: 'Decide it\'s too risky and avoid [Light]', impact: { cashDelta: 0, stockDelta: 0, stockFactor: 1.0 } },
            { id: 'C3c', label: 'Paper trade to simulate outcome first [Light]', impact: { cashDelta: 0, stockDelta: 0, stockFactor: 1.0 } },
          ],
        },
      },
    },
  ],
  outcomes: [
    { group: 'Impulsive Investor', tags: ['A', 'A1', 'A2', 'B1'], cash: [2000, 5800, 3500], badge: 'RISK_TAKER' },
    { group: 'Analytical Investor', tags: ['C', 'B3'], cash: [5600, 6200], badge: 'RESEARCHER' },
    { group: 'Diversified Player', tags: ['A3', 'B2'], cash: [6800], badge: 'SMART_BALANCER' },
    { group: 'Emotional Learner', tags: ['B1a', 'A2a', 'C2a'], cash: [4000, 5000], badge: 'LESSON_LEARNER' },
    { group: 'Long-Term Conviction', tags: ['A1b', 'C1c'], cash: [5500, 6000], badge: 'DIAMOND_HANDS' },
  ],
};

export function resolveKcoinOutcome(path) {
  // path: array like ['A','A1','A1b']
  for (const o of KCOIN_INTRO.outcomes) {
    if (o.tags.some(tag => path.includes(tag))) {
      const values = o.cash;
      const finalCash = values[Math.floor(Math.random() * values.length)];
      return { group: o.group, finalCash, badgeKey: o.badge };
    }
  }
  // default modest outcome
  return { group: 'Observer', finalCash: 5600, badgeKey: 'OBSERVER' };
}





