// Randomized starting scenarios for variety
export const STARTING_SCENARIOS = [
  {
    id: 'university_student',
    title: '🎓 University Student',
    description: 'You\'re a college student with part-time job savings',
    age: 20,
    initialAmount: () => Math.floor(Math.random() * 5001), // Random 0-5000
    yearlyIncome: () => Math.floor(Math.random() * 8000) + 8000, // Part-time: $8k-$16k/year
    yearlyExpenses: () => Math.floor(Math.random() * 6000) + 6000, // $6k-$12k/year
    story: (name, amount) => `${name}, you're a university student working part-time. You've saved $${amount.toLocaleString()} from summer jobs. Time to start your financial journey!`
  },
  {
    id: 'fresh_graduate',
    title: '💼 Fresh Graduate',
    description: 'You just graduated and landed your first job',
    age: 22,
    initialAmount: () => Math.floor(Math.random() * 5001), // Random 0-5000
    yearlyIncome: () => Math.floor(Math.random() * 15000) + 40000, // $40k-$55k/year
    yearlyExpenses: () => Math.floor(Math.random() * 6000) + 12000, // $12k-$18k/year
    story: (name, amount, income) => `${name}, congratulations on graduating! You've landed your first job at $${income.toLocaleString()}/year. You have $${amount.toLocaleString()} in savings from college.`
  },
  {
    id: 'young_professional',
    title: '🚀 Young Professional',
    description: 'You\'ve been working for a couple years',
    age: 24,
    initialAmount: () => Math.floor(Math.random() * 5001), // Random 0-5000
    yearlyIncome: () => Math.floor(Math.random() * 20000) + 50000, // $50k-$70k/year
    yearlyExpenses: () => Math.floor(Math.random() * 8000) + 15000, // $15k-$23k/year
    story: (name, amount, income) => `${name}, you're a young professional with 2 years of experience. You've saved $${amount.toLocaleString()} and earn $${income.toLocaleString()}/year.`
  },
  {
    id: 'entrepreneur',
    title: '💡 Entrepreneur',
    description: 'You started a small business',
    age: 25,
    initialAmount: () => Math.floor(Math.random() * 5001), // Random 0-5000
    yearlyIncome: () => Math.floor(Math.random() * 20000) + 30000, // $30k-$50k/year (variable)
    yearlyExpenses: () => Math.floor(Math.random() * 6000) + 10000, // $10k-$16k/year
    story: (name, amount, income) => `${name}, you're an entrepreneur who started a small business! You have $${amount.toLocaleString()} saved and your business makes $${income.toLocaleString()}/year.`
  },
  {
    id: 'career_switcher',
    title: '🔄 Career Switcher',
    description: 'You switched careers and have some savings',
    age: 28,
    initialAmount: () => Math.floor(Math.random() * 5001), // Random 0-5000
    yearlyIncome: () => Math.floor(Math.random() * 15000) + 45000, // $45k-$60k/year
    yearlyExpenses: () => Math.floor(Math.random() * 8000) + 15000, // $15k-$23k/year
    story: (name, amount, income) => `${name}, you made a bold career switch! You have $${amount.toLocaleString()} in savings and your new career pays $${income.toLocaleString()}/year.`
  },
  {
    id: 'part_time_worker',
    title: '☕ Part-Time Worker',
    description: 'You work part-time while studying or looking for opportunities',
    age: 21,
    initialAmount: () => Math.floor(Math.random() * 5001), // Random 0-5000
    yearlyIncome: () => Math.floor(Math.random() * 6000) + 6000, // $6k-$12k/year
    yearlyExpenses: () => Math.floor(Math.random() * 5000) + 5000, // $5k-$10k/year
    story: (name, amount, income) => `${name}, you're working part-time while figuring out your path. You've saved $${amount.toLocaleString()} and earn $${income.toLocaleString()}/year.`
  },
  {
    id: 'gig_worker',
    title: '🚗 Gig Worker',
    description: 'You work in the gig economy',
    age: 23,
    initialAmount: () => Math.floor(Math.random() * 5001), // Random 0-5000
    yearlyIncome: () => Math.floor(Math.random() * 12000) + 18000, // $18k-$30k/year
    yearlyExpenses: () => Math.floor(Math.random() * 6000) + 10000, // $10k-$16k/year
    story: (name, amount, income) => `${name}, you're working in the gig economy! You've saved $${amount.toLocaleString()} and earn $${income.toLocaleString()}/year.`
  }
];

export function getRandomStartingScenario() {
  const scenario = STARTING_SCENARIOS[Math.floor(Math.random() * STARTING_SCENARIOS.length)];
  const initialAmount = scenario.initialAmount();
  const yearlyIncome = scenario.yearlyIncome();
  const yearlyExpenses = scenario.yearlyExpenses();
  
  return {
    ...scenario,
    initialAmount,
    yearlyIncome,
    yearlyExpenses,
    story: (name) => scenario.story(name, initialAmount, yearlyIncome)
  };
}

