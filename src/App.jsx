import React, { useState, useEffect } from 'react';
import InputScreen from './components/InputScreen';
import EventScreen from './components/EventScreen';
import SimulatorDashboard from './components/SimulatorDashboard';
import EndScreen from './components/EndScreen';
import ModeSelect from './components/ModeSelect';
import BattleMode from './components/BattleMode';
import KcoinStory from './components/KcoinStory';
import RandomEventScreen from './components/RandomEventScreen';
import ProgressMilestone from './components/ProgressMilestone';
import ErrorBoundary from './components/ErrorBoundary';
import LevelSummary from './components/LevelSummary';
import LossModal from './components/LossModal';
import QuestionFeedback from './components/QuestionFeedback';
import { calculateCompoundInterest, calculatePortfolioGrowth } from './core/financeEngine';
import { BADGES, getRandomEvent, generateFeedback } from './core/gameRules';
import { GAME_LEVELS, getCurrentLevel, getLevelQuestion } from './modes/story';
import { getBackgroundStyle } from './utils/backgrounds';
import { getRandomStartingScenario } from './utils/startingScenarios';
import { getRandomizedQuestions, resetRandomizedSets } from './modes/story';

function App() {
  const [gameState, setGameState] = useState('input'); // 'input' | 'modeSelect' | 'playing' | 'randomEvent' | 'battle' | 'ended'
  const [mode, setMode] = useState('story'); // 'story' | 'battle'
  const [playerData, setPlayerData] = useState(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0); // 0-4 (5 levels)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 0-6 (7 questions per level)
  const [randomizedQuestions, setRandomizedQuestions] = useState({}); // Store randomized question sets per level
  const [randomEvent, setRandomEvent] = useState(null);
  const [questionFeedback, setQuestionFeedback] = useState(null); // Store feedback data for current question
  const [showLevelSummary, setShowLevelSummary] = useState(false);
  const [lossWarning, setLossWarning] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameChoices, setGameChoices] = useState({
    opted401k: false,
    investedEarly: false,
    usedCreditCard: false,
    panicSold: false,
    hasLostJob: false,
    hasRecoveredFromJobLoss: false
  });
  
  // Game state
  const [age, setAge] = useState(22);
  const [portfolio, setPortfolio] = useState({ cash: 5000, stocks: 0, debt: 0 });
  const [badges, setBadges] = useState([]);
  const [netWorthHistory, setNetWorthHistory] = useState([5000]);
  const [yearlyIncome, setYearlyIncome] = useState(0);
  const [yearlyExpenses, setYearlyExpenses] = useState(0);
  const [lastSalaryDeposit, setLastSalaryDeposit] = useState(0);
  const [lastCashDelta, setLastCashDelta] = useState(0);
  const [lastCashNotes, setLastCashNotes] = useState([]);

  // Removed useEffect that was resetting net worth history incorrectly
  // Net worth history is properly initialized in handleStart and updated in processEventChoice

  const calculateNetWorth = () => {
    return portfolio.cash + portfolio.stocks - portfolio.debt;
  };

  const processEventChoice = (event, choices) => {
    if (isProcessing) return; // prevent double-submit glitches
    setIsProcessing(true);
    if (!event || !choices) {
      console.error('Invalid event or choices');
      setIsProcessing(false);
      return;
    }
    
    let newPortfolio = { ...portfolio };
    const cashNotes = [];
    let notedCashDelta = 0;
    const cashBeforeAll = newPortfolio.cash;
    let newAge = age;
    let newYearlyIncome = yearlyIncome;
    let newYearlyExpenses = yearlyExpenses;
    let newBadges = [...badges];
    // Standardize to 1 round = 1 time step to keep deltas intuitive
    let yearsToPass = 1;
    let returnRate = event.baseReturn || 8;
    let eventMultiplier = event.eventMultiplier || 1;
    const allowLegacySalaryAccrual = false; // prevent large cash jumps from legacy handlers

    // Calculate total questions answered (for income/job loss triggers)
    // NOTE: This is calculated again later for feedback, so we'll use it here
    const currentLevel = currentLevelIndex + 1; // 1-5
    const incomeModelEnabled = true; // Story Mode: salary active each round
    const totalQuestionsAnswered = (currentLevelIndex * 7) + currentQuestionIndex + 1;
    
    // (Handled below) Income accrual after events, each round (1 month)
    
    // DIFFICULTY SCALING: After Level 1, it gets HARDER to get income increases
    // REALISTIC: Income increases every 6 questions, but chance decreases after Level 1
    if (incomeModelEnabled && totalQuestionsAnswered % 6 === 0 && totalQuestionsAnswered > 0) {
      // Level 1: Easy raises (guaranteed)
      // After Level 1: Harder to get raises (decreasing chance)
      const raiseChance = currentLevel === 1 ? 1.0 : // 100% in level 1
                          currentLevel === 2 ? 0.7 : // 70% in level 2
                          currentLevel === 3 ? 0.5 : // 50% in level 3
                          currentLevel === 4 ? 0.3 : // 30% in level 4
                          0.2; // 20% in level 5
      
      if (Math.random() < raiseChance) {
        // Smaller raises after level 1
        const raisePercentage = currentLevel === 1 ? 0.08 : // 8% in level 1
                                currentLevel === 2 ? 0.06 : // 6% in level 2
                                currentLevel === 3 ? 0.04 : // 4% in level 3
                                currentLevel === 4 ? 0.03 : // 3% in level 4
                                0.02; // 2% in level 5
        const raiseAmount = Math.floor(newYearlyIncome * raisePercentage);
        newYearlyIncome += raiseAmount;
        console.log(`🎉 Career Growth! After ${totalQuestionsAnswered} questions, you got a raise: +$${raiseAmount.toLocaleString()}/year (${(raisePercentage * 100).toFixed(0)}% increase)`);
      } else if (currentLevel > 1) {
        console.log(`⚠️ No raise this time. Career growth is harder after early career!`);
      }
    }
    
    // REALISTIC: Job loss can happen after question 8 (realistic hardship)
    // Only happens once, 10% chance after question 8
    // This teaches the importance of emergency funds and financial resilience
    if (incomeModelEnabled && totalQuestionsAnswered >= 8 && totalQuestionsAnswered < 15 && Math.random() < 0.10) {
      // Job loss: income drops significantly, but you can recover
      const incomeDrop = Math.floor(newYearlyIncome * 0.4); // 40% income drop (unemployment)
      newYearlyIncome = Math.max(20000, newYearlyIncome - incomeDrop);
      
      // Expenses also drop (unemployment benefits, cutting costs)
      newYearlyExpenses = Math.floor(newYearlyExpenses * 0.7); // 30% expense reduction
      
      console.log(`⚠️ Job Loss! Income dropped by $${incomeDrop.toLocaleString()}/year. You're now earning $${newYearlyIncome.toLocaleString()}/year. This is why emergency funds matter!`);
      
      // Set flag so this only happens once
      if (!gameChoices.hasLostJob) {
        setGameChoices(prev => ({ ...prev, hasLostJob: true }));
      }
    }
    
    // REALISTIC: Job recovery after job loss (if it happened)
    // 50% chance of finding new job after 2-3 questions (realistic recovery time)
    if (incomeModelEnabled && gameChoices.hasLostJob && totalQuestionsAnswered >= 10 && Math.random() < 0.5) {
      // Recover to previous income level or better
      const recoveryIncome = Math.floor(newYearlyIncome * 1.5); // 50% increase from unemployment
      newYearlyIncome = recoveryIncome;
      newYearlyExpenses = Math.floor(newYearlyExpenses / 0.7); // Restore expenses
      console.log(`✅ Job Recovery! You found a new job: $${newYearlyIncome.toLocaleString()}/year. You learned the importance of emergency funds!`);
      setGameChoices(prev => ({ ...prev, hasLostJob: false, hasRecoveredFromJobLoss: true }));
    }
    
    // REALISTIC: Job progression for low-income players (students, part-time workers)
    // Only 15% chance for low-income players (was 30% - too easy)
    // Real world: Many people struggle with low income for years
    if (incomeModelEnabled && newYearlyIncome < 20000 && Math.random() < 0.15 && !gameChoices.hasLostJob) {
      const jobOfferIncrease = Math.floor(Math.random() * 10000) + 5000; // $5k-$15k increase
      newYearlyIncome += jobOfferIncrease;
      console.log(`🎉 New job offer! Income increased by $${jobOfferIncrease.toLocaleString()}`);
    }
    
    // DIFFICULTY SCALING: More expenses after Level 1 (harder to save)
    // REALISTIC: Expense inflation - expenses tend to increase over time
    // After Level 1: More frequent and larger expense increases
    const expenseInflationChance = currentLevel === 1 ? 0.2 : // 20% in level 1
                                   currentLevel === 2 ? 0.4 : // 40% in level 2
                                   currentLevel === 3 ? 0.5 : // 50% in level 3
                                   currentLevel === 4 ? 0.6 : // 60% in level 4
                                   0.7; // 70% in level 5
    
    if (incomeModelEnabled && Math.random() < expenseInflationChance && !gameChoices.hasLostJob) {
      const expenseIncreasePercent = currentLevel === 1 ? 0.02 : // 2% in level 1
                                     currentLevel === 2 ? 0.04 : // 4% in level 2
                                     currentLevel === 3 ? 0.05 : // 5% in level 3
                                     currentLevel === 4 ? 0.06 : // 6% in level 4
                                     0.08; // 8% in level 5
      const expenseIncrease = Math.floor(newYearlyExpenses * expenseIncreasePercent);
      newYearlyExpenses += expenseIncrease;
      console.log(`💰 Expenses increased: +$${expenseIncrease.toLocaleString()}/year (inflation, rent hikes, healthcare, etc.)`);
    }
    
    // DIFFICULTY SCALING: More negative events after Level 1
    // Random negative events that cost money
    const negativeEventChance = currentLevel === 1 ? 0.05 : // 5% in level 1
                                currentLevel === 2 ? 0.15 : // 15% in level 2
                                currentLevel === 3 ? 0.25 : // 25% in level 3
                                currentLevel === 4 ? 0.35 : // 35% in level 4
                                0.45; // 45% in level 5
    
    if (Math.random() < negativeEventChance && currentLevel > 1) {
      const eventTypes = ['medical', 'car_repair', 'home_repair', 'tax_bill', 'unexpected_expense'];
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      let cost = 0;
      let eventName = '';
      
      switch(eventType) {
        case 'medical':
          cost = Math.floor(1000 + Math.random() * 4000); // $1k-$5k
          eventName = 'Medical Emergency';
          break;
        case 'car_repair':
          cost = Math.floor(500 + Math.random() * 2500); // $500-$3k
          eventName = 'Car Repair';
          break;
        case 'home_repair':
          cost = Math.floor(1500 + Math.random() * 3500); // $1.5k-$5k
          eventName = 'Home Repair';
          break;
        case 'tax_bill':
          cost = Math.floor(500 + Math.random() * 2000); // $500-$2.5k
          eventName = 'Unexpected Tax Bill';
          break;
        case 'unexpected_expense':
          cost = Math.floor(300 + Math.random() * 1700); // $300-$2k
          eventName = 'Unexpected Expense';
          break;
      }
      
      // Pay from cash first, then debt if no cash
      if (newPortfolio.cash >= cost) {
        newPortfolio.cash -= cost;
        cashNotes.push(`${eventName} -$${cost.toLocaleString()}`);
        console.log(`⚠️ ${eventName}: -$${cost.toLocaleString()} (paid from cash)`);
      } else {
        // Add to debt with interest
        const remaining = cost - newPortfolio.cash;
        newPortfolio.cash = 0;
        const debtWithInterest = remaining * Math.pow(1.2459, yearsToPass); // 24.59% APR
        newPortfolio.debt += debtWithInterest;
        cashNotes.push(`${eventName} paid via debt +$${debtWithInterest.toFixed(0)}`);
        console.log(`⚠️ ${eventName}: -$${cost.toLocaleString()} (added to debt with interest)`);
      }

      // Black swan: larger losses after level 1 (10% chance)
      if (Math.random() < 0.10) {
        if (newPortfolio.stocks > 0 && Math.random() < 0.6) {
          const drop = 0.3 + Math.random() * 0.2; // 30-50% stock drawdown
          newPortfolio.stocks = Math.max(0, Math.round(newPortfolio.stocks * (1 - drop)));
          console.log(`⚠️ Black Swan: Stocks fell ${(drop * 100).toFixed(0)}%`);
        } else if (newPortfolio.cash > 0) {
          const cashLoss = Math.floor(newPortfolio.cash * (0.15 + Math.random() * 0.15)); // 15-30% cash hit
          newPortfolio.cash = Math.max(0, newPortfolio.cash - cashLoss);
          console.log(`⚠️ Black Swan: Cash loss -$${cashLoss.toLocaleString()}`);
        }
      }
    }

    // STORY MODE: Accrue monthly net income every 5 questions (approx. 5 months pass)
    // ORDER: After income/expense updates and random negative events
    if (incomeModelEnabled) {
      // Salary arrives every 7 rounds (end of level cadence)
      const monthlyNetIncome = Math.max(0, (newYearlyIncome - newYearlyExpenses) / 12);
      const accrual = Math.round(monthlyNetIncome);
      if (totalQuestionsAnswered % 7 === 0) {
        setLastSalaryDeposit(accrual);
        if (accrual > 0) {
          newPortfolio.cash += accrual;
          notedCashDelta += accrual;
          cashNotes.push(`Salary deposit +$${accrual.toLocaleString()}`);
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Salary] Monthly net deposited: $${accrual.toLocaleString()}`);
          }
        }
      } else {
        setLastSalaryDeposit(0);
      }
    }

    // EARLY debt servicing before choice cash flows/growth
    let didPayDebtEarly = false;
    if (newPortfolio.debt > 0 && newPortfolio.cash > 0) {
      const minPaymentEarly = Math.max(newPortfolio.debt * 0.02, 50);
      const earlyPayment = Math.min(newPortfolio.cash, Math.max(minPaymentEarly, 0));
      if (earlyPayment > 0) {
        newPortfolio.cash -= earlyPayment;
        newPortfolio.debt = Math.max(0, newPortfolio.debt - earlyPayment);
        didPayDebtEarly = true;
        cashNotes.push(`Debt payment -$${earlyPayment.toLocaleString()}`);
        if (process.env.NODE_ENV === 'development' && earlyPayment > 100) {
          console.log(`💰 Early Debt Payment: $${earlyPayment.toLocaleString()} (pre-choice/growth)`);
        }
      }
    }

    const addBadge = (badgeKey) => {
      if (!newBadges.find(b => b.name === BADGES[badgeKey].name)) {
        newBadges.push(BADGES[badgeKey]);
      }
    };

    // RISK IMPACTS: After Level 1, selected options can apply heavier penalties
    if (currentLevel > 1 && choices) {
      const picked = Object.values(choices).filter(Boolean);
      let heavyHits = 0;
      let lightHits = 0;
      picked.forEach(label => {
        if (typeof label === 'string') {
          if (label.includes('[Heavy]')) heavyHits++;
          else if (label.includes('[Light]')) lightHits++;
        }
      });
      // Apply heavy penalties: prioritize stock drawdowns if invested, else cash
      for (let i = 0; i < heavyHits; i++) {
        if (newPortfolio.stocks > 0 && Math.random() < 0.6) {
          const drop = 0.15 + Math.random() * 0.20; // 15-35%
          newPortfolio.stocks = Math.max(0, Math.round(newPortfolio.stocks * (1 - drop)));
          cashNotes.push(`Heavy impact: stocks -${Math.round(drop*100)}%`);
        } else if (newPortfolio.cash > 0) {
          const loss = Math.floor(newPortfolio.cash * (0.10 + Math.random() * 0.15)); // 10-25%
          newPortfolio.cash = Math.max(0, newPortfolio.cash - loss);
          cashNotes.push(`Heavy impact: cash -$${loss.toLocaleString()}`);
        }
      }
      // Apply light penalties: small cash nicks
      for (let i = 0; i < lightHits; i++) {
        if (newPortfolio.cash > 0) {
          const loss = Math.floor(newPortfolio.cash * (0.01 + Math.random() * 0.04)); // 1-5%
          newPortfolio.cash = Math.max(0, newPortfolio.cash - loss);
          cashNotes.push(`Light impact: cash -$${loss.toLocaleString()}`);
        }
      }
    }

    // Event 1: First Job (Age 22) - OLD FORMAT (shouldn't be used with level-based system)
    if (event.id === 1) {
      // STEP 1: Add income sources FIRST
      if (choices['401k_yes'] === 'Yes, take the free money!') {
        // 401(k) match: $3,000/year
        const matchAmount = 3000 * yearsToPass;
        newPortfolio.cash += matchAmount;
        newYearlyIncome += 3000; // Match is part of compensation
        addBadge('FREE_MONEY_FINDER');
        setGameChoices(prev => ({ ...prev, opted401k: true }));
      }

      // Legacy annual salary accrual disabled (we use per-round monthly deposit instead)
      const salaryIncome = (newYearlyIncome - newYearlyExpenses) * yearsToPass;
      if (allowLegacySalaryAccrual) newPortfolio.cash += Math.max(0, salaryIncome);

      // STEP 2: Process investment choices with available cash
      if (choices.initial_allocation === 'Invest it in the stock market') {
        // Move up to $5,000 to stocks (or whatever cash is available)
        const investAmount = Math.min(newPortfolio.cash, 5000);
        if (investAmount > 0 && newPortfolio.cash >= investAmount) {
          newPortfolio.cash -= investAmount;
          newPortfolio.stocks = investAmount;
          setGameChoices(prev => ({ ...prev, investedEarly: true }));
        }
      } else if (choices.initial_allocation === 'Buy a fancy car') {
        const spendAmount = Math.min(newPortfolio.cash, 5000);
        if (newPortfolio.cash >= spendAmount) {
          newPortfolio.cash -= spendAmount;
          newYearlyExpenses += 2000; // Car maintenance/year
        }
      }

      // STEP 3: Apply stock growth
      if (newPortfolio.stocks > 0) {
        newPortfolio.stocks = calculatePortfolioGrowth(
          newPortfolio.stocks,
          yearsToPass,
          returnRate,
          eventMultiplier
        );
      }
    }

    // Event 2: Emergency Fund Test (Age 25) - OLD FORMAT
    if (event.id === 2) {
      // Legacy annual salary accrual disabled
      const salaryIncome = (newYearlyIncome - newYearlyExpenses) * yearsToPass;
      if (allowLegacySalaryAccrual) newPortfolio.cash += Math.max(0, salaryIncome);

      // STEP 2: Process emergency choices
      const emergencyCost = 3000;

      if (choices.emergency_fund === 'Use your savings (smart choice!)') {
        if (newPortfolio.cash >= emergencyCost) {
          newPortfolio.cash -= emergencyCost;
          addBadge('SAFETY_NET_SHIELD');
        } else {
          newPortfolio.debt += emergencyCost * 1.2; // 20% interest
        }
      } else if (choices.emergency_fund === 'Use a credit card (expensive!)') {
        newPortfolio.debt += emergencyCost * 1.25; // 25% interest
        setGameChoices(prev => ({ ...prev, usedCreditCard: true }));
      } else if (choices.emergency_fund === 'Sell your investments') {
        if (newPortfolio.stocks >= emergencyCost) {
          newPortfolio.stocks -= emergencyCost;
        } else {
          const remaining = emergencyCost - newPortfolio.stocks;
          newPortfolio.stocks = 0;
          newPortfolio.debt += remaining * 1.2;
        }
      }

      // STEP 3: Portfolio growth
      if (newPortfolio.stocks > 0) {
        newPortfolio.stocks = calculatePortfolioGrowth(
          newPortfolio.stocks,
          yearsToPass,
          returnRate,
          eventMultiplier
        );
      }
    }

    // Event 3: China Making Chips (Age 28) - OLD FORMAT
    if (event.id === 3) {
      // Legacy annual salary accrual disabled
      const salaryIncome = (newYearlyIncome - newYearlyExpenses) * yearsToPass;
      if (allowLegacySalaryAccrual) newPortfolio.cash += Math.max(0, salaryIncome);

      // STEP 2: Process tech investment
      if (choices.tech_invest === 'Yes, invest $2,000 in tech') {
        const investAmount = Math.min(newPortfolio.cash, 2000);
        if (investAmount > 0 && newPortfolio.cash >= investAmount) {
          newPortfolio.cash -= investAmount;
          newPortfolio.stocks += investAmount;
          addBadge('TECH_VISIONARY');
          eventMultiplier = 1.15; // Tech boom multiplier
        }
      }

      // STEP 3: Portfolio growth with tech boom
      if (newPortfolio.stocks > 0) {
        newPortfolio.stocks = calculatePortfolioGrowth(
          newPortfolio.stocks,
          yearsToPass,
          returnRate,
          eventMultiplier
        );
      }
    }

    // Event 4: War Broke Out (Age 35) - OLD FORMAT
    if (event.id === 4) {
      // Legacy annual salary accrual disabled
      const salaryIncome = (newYearlyIncome - newYearlyExpenses) * yearsToPass;
      if (allowLegacySalaryAccrual) newPortfolio.cash += Math.max(0, salaryIncome);

      // STEP 2: Market crash happens: stocks drop 40%
      newPortfolio.stocks *= 0.6;

      // STEP 3: Then player reacts
      if (choices.panic_sell === 'Sell everything now (panic!)') {
        // Sell after crash (lock in the 40% loss)
        newPortfolio.cash += newPortfolio.stocks;
        newPortfolio.stocks = 0;
        setGameChoices(prev => ({ ...prev, panicSold: true }));
      } else if (choices.panic_sell === 'Buy more while prices are low') {
        // Invest more during crash
        const dipInvestment = Math.min(newPortfolio.cash, 5000);
        if (newPortfolio.cash >= dipInvestment) {
          newPortfolio.cash -= dipInvestment;
          newPortfolio.stocks += dipInvestment;
        }
      }
      // "Hold (HODL)" - do nothing, just ride it out

      // STEP 4: Recovery phase: 5 years of realistic recovery growth (10-12%)
      if (newPortfolio.stocks > 0) {
        newPortfolio.stocks = calculatePortfolioGrowth(
          newPortfolio.stocks,
          event.recoveryYears || 5,
          event.recoveryRate || 12,  // Realistic recovery: 12% average (not 60%!)
          1
        );
      }

      // Remaining years
      const remainingYears = yearsToPass - (event.recoveryYears || 5);
      if (remainingYears > 0 && newPortfolio.stocks > 0) {
        newPortfolio.stocks = calculatePortfolioGrowth(
          newPortfolio.stocks,
          remainingYears,
          8,
          1
        );
      }

      if (choices.panic_sell === 'Hold and wait for recovery' || choices.panic_sell === 'Buy more while prices are low') {
        addBadge('WAR_SURVIVOR');
        addBadge('HODL_HERO');
      }
    }

    // Event 5: Family + Recession (Age 45) - OLD FORMAT
    if (event.id === 5) {
      // STEP 1: Add salary income FIRST (with kid expenses)
      newYearlyExpenses += 12000; // Kid expenses
      const salaryIncome = (newYearlyIncome - newYearlyExpenses) * yearsToPass;
      if (allowLegacySalaryAccrual) newPortfolio.cash += Math.max(0, salaryIncome);

      // STEP 2: Process 529 plan
      if (choices['529_plan'] === 'Yes, save $1,000/year for college') {
        // 529 plan: tax-free growth
        const total529 = 1000 * yearsToPass;
        if (newPortfolio.cash >= total529) {
          newPortfolio.cash -= total529;
          // 529 grows tax-free (better returns)
          newPortfolio.stocks += calculateCompoundInterest(total529, 9, yearsToPass);
          addBadge('LEGACY_BUILDER');
        }
      }

      // STEP 3: Recession: stocks down 20%
      if (newPortfolio.stocks > 0) {
        newPortfolio.stocks *= 0.8;
        
        // Recovery - realistic rates
        newPortfolio.stocks = calculatePortfolioGrowth(
          newPortfolio.stocks,
          yearsToPass,
          event.recoveryRate || 10,  // Realistic recovery: 10% average
          eventMultiplier
        );
      }
    }

    // Generic handler for ALL level-based questions (l1q1, l2q2, etc.)
    // This is the PRIMARY handler for the current game system
    if (event.id && typeof event.id === 'string' && event.id.startsWith('l')) {
      // STEP 1: Update income FIRST (before calculating salary)
      // Add 401k match (if chosen) - this adds money AND increases income
      // REALISTIC: Average employer match is 4.5% of salary (not fixed $3k)
      if (choices['401k_yes'] === 'Yes, take the free money!') {
        // Calculate match as percentage of salary (realistic: 4.5% average)
        const matchRate = 0.045; // 4.5% employer match (Vanguard 2024 data)
        const yearlyMatch = newYearlyIncome * matchRate;
        const matchAmount = yearlyMatch * yearsToPass;
        newPortfolio.cash += matchAmount;
        newYearlyIncome += yearlyMatch; // Update income BEFORE calculating salary
        addBadge('FREE_MONEY_FINDER');
        setGameChoices(prev => ({ ...prev, opted401k: true }));
      }

      // Handle savings rate choice FIRST (affects how much you spend vs save)
      // Savings rate means you're committing to save X% of income
      // This reduces your actual spending (expenses) going forward
      if (choices.savings_rate) {
        const rate = choices.savings_rate.includes('10%') ? 0.1 : 
                     choices.savings_rate.includes('20%') ? 0.2 : 0.3;
        // If you commit to saving X% of income, you can only spend (100% - X%) of income
        // Example: Saving 20% means max spending = 80% of income
        const maxSpending = newYearlyIncome * (1 - rate);
        // Your expenses are capped at this amount (you can't spend more than you allow yourself)
        if (newYearlyExpenses > maxSpending) {
          newYearlyExpenses = maxSpending;
        }
      }

      // Add salary income (money earned over the years) - use UPDATED income and expenses
      // REALISTIC: Not everyone saves all their net income - life happens
      // Apply a "realistic savings efficiency" factor (70-90% of net income actually saved)
      // Real world: People have unexpected expenses, lifestyle creep, etc.
      const netIncome = (newYearlyIncome - newYearlyExpenses) * yearsToPass;
      const savingsEfficiency = 0.7 + (Math.random() * 0.2); // 70-90% efficiency (realistic)
      const salaryIncome = netIncome * savingsEfficiency;
      if (allowLegacySalaryAccrual) newPortfolio.cash += Math.max(0, salaryIncome);

      // STEP 2: Now process spending/investment choices with available cash
      if (choices.savings_choice === 'Invest it in the stock market') {
        const investAmount = Math.min(newPortfolio.cash, newPortfolio.cash * 0.5); // Invest up to 50% of cash
        if (investAmount > 0 && newPortfolio.cash >= investAmount) {
          newPortfolio.cash -= investAmount;
          newPortfolio.stocks += investAmount;
          setGameChoices(prev => ({ ...prev, investedEarly: true }));
        }
      } else if (choices.savings_choice === 'Spend it on fun things') {
        const spendAmount = Math.min(newPortfolio.cash, 1000);
        if (newPortfolio.cash >= spendAmount) {
          newPortfolio.cash -= spendAmount;
          newYearlyExpenses += 500; // Lifestyle inflation
        }
      }

      if (choices.starting_amount === 'Invest in stocks') {
        const investAmount = Math.min(newPortfolio.cash, 5000);
        if (investAmount > 0 && newPortfolio.cash >= investAmount) {
          newPortfolio.cash -= investAmount;
          newPortfolio.stocks += investAmount;
          setGameChoices(prev => ({ ...prev, investedEarly: true }));
        }
      } else if (choices.starting_amount === 'Buy something expensive') {
        const spendAmount = Math.min(newPortfolio.cash, 5000);
        if (newPortfolio.cash >= spendAmount) {
          newPortfolio.cash -= spendAmount;
          newYearlyExpenses += 2000;
        }
      }

      // Handle emergency choices
      // REALISTIC: Credit card APR is 24.59% (Fed 2024), but interest compounds over time
      // For simplicity, we'll apply interest immediately but note it's annual rate
      const creditCardAPR = 0.2459; // 24.59% annual rate
      
      if (choices.small_emergency === 'Use your savings') {
        const cost = 500;
        if (newPortfolio.cash >= cost) {
          newPortfolio.cash -= cost;
          addBadge('SAFETY_NET_SHIELD');
        } else {
          // If no savings, debt accumulates with interest over years
          // Interest compounds: debt = cost * (1 + APR)^years
          const debtWithInterest = cost * Math.pow(1 + creditCardAPR, yearsToPass);
          newPortfolio.debt += debtWithInterest;
        }
      } else if (choices.small_emergency === 'Use a credit card') {
        // Credit card adds debt with compound interest
        const debtWithInterest = 500 * Math.pow(1 + creditCardAPR, yearsToPass);
        newPortfolio.debt += debtWithInterest;
        setGameChoices(prev => ({ ...prev, usedCreditCard: true }));
      }

      if (choices.emergency_fund === 'Use your savings (smart!)') {
        const cost = 3000;
        if (newPortfolio.cash >= cost) {
          newPortfolio.cash -= cost;
          addBadge('SAFETY_NET_SHIELD');
        } else {
          // Partial savings: debt accumulates with interest
          const debtWithInterest = cost * Math.pow(1 + creditCardAPR, yearsToPass);
          newPortfolio.debt += debtWithInterest;
        }
      } else if (choices.emergency_fund === 'Use a credit card (expensive!)') {
        // Credit card adds debt with compound interest
        const debtWithInterest = 3000 * Math.pow(1 + creditCardAPR, yearsToPass);
        newPortfolio.debt += debtWithInterest;
        setGameChoices(prev => ({ ...prev, usedCreditCard: true }));
      } else if (choices.emergency_fund === 'Sell investments') {
        const cost = 3000;
        if (newPortfolio.stocks >= cost) {
          newPortfolio.stocks -= cost;
        } else {
          // Partial stock sale: remaining debt accumulates with interest
          const remaining = cost - newPortfolio.stocks;
          newPortfolio.stocks = 0;
          const debtWithInterest = remaining * Math.pow(1 + creditCardAPR, yearsToPass);
          newPortfolio.debt += debtWithInterest;
        }
      }

      // Handle investment choices
      if (choices.learning_invest === 'Start investing small amounts now') {
        const investAmount = Math.min(newPortfolio.cash, 1000);
        if (investAmount > 0 && newPortfolio.cash >= investAmount) {
          newPortfolio.cash -= investAmount;
          newPortfolio.stocks += investAmount;
          setGameChoices(prev => ({ ...prev, investedEarly: true }));
        }
      } else if (choices.learning_invest === 'Invest everything you have') {
        const investAmount = Math.max(0, Math.floor(newPortfolio.cash * 0.8)); // Invest 80%, rounded down
        if (investAmount > 0 && newPortfolio.cash >= investAmount) {
          newPortfolio.cash -= investAmount;
          newPortfolio.stocks += investAmount;
        }
      }

      if (choices.first_invest === 'Invest in a stock market fund') {
        const investAmount = Math.min(newPortfolio.cash, 2000);
        if (investAmount > 0 && newPortfolio.cash >= investAmount) {
          newPortfolio.cash -= investAmount;
          newPortfolio.stocks += investAmount;
        }
      }

      // Handle social spending
      if (choices.social_spending === 'Spend everything on fun') {
        const spendAmount = Math.min(newPortfolio.cash, 2000);
        if (newPortfolio.cash >= spendAmount) {
          newPortfolio.cash -= spendAmount;
        }
      } else if (choices.social_spending === 'Go but spend wisely') {
        const spendAmount = Math.min(newPortfolio.cash, 500);
        if (newPortfolio.cash >= spendAmount) {
          newPortfolio.cash -= spendAmount;
        }
      }

      // Handle tech investment
      if (choices.tech_invest === 'Yes, invest $2,000 in tech' || choices.tech_invest === 'Yes ($2,000)') {
        const investAmount = Math.min(newPortfolio.cash, 2000);
        if (investAmount > 0 && newPortfolio.cash >= investAmount) {
          newPortfolio.cash -= investAmount;
          newPortfolio.stocks += investAmount;
          eventMultiplier = 1.15;
          addBadge('TECH_VISIONARY');
        }
      }

      // Handle panic selling
      if (choices.panic_sell === 'Sell everything now (panic!)') {
        newPortfolio.cash += newPortfolio.stocks;
        newPortfolio.stocks = 0;
        setGameChoices(prev => ({ ...prev, panicSold: true }));
      } else if (choices.panic_sell === 'Buy more while prices are low') {
        const investAmount = Math.min(newPortfolio.cash, 5000);
        if (investAmount > 0 && newPortfolio.cash >= investAmount) {
          newPortfolio.cash -= investAmount;
          newPortfolio.stocks += investAmount;
        }
      }

      // Handle 529 plan
      if (choices['529_plan'] === 'Yes, save $1,000/year' || choices['529_plan'] === 'Yes, save $1,000/year for college') {
        const total529 = 1000 * yearsToPass;
        if (newPortfolio.cash >= total529) {
          newPortfolio.cash -= total529;
          newPortfolio.stocks += calculateCompoundInterest(total529, 9, yearsToPass);
          addBadge('LEGACY_BUILDER');
        }
      }

      // STEP 2.5: Handle market crashes/recessions BEFORE stock growth
      // Crashes should happen BEFORE growth, so we see the crash impact, then recovery
      if (event.id === 'l4q1' || event.id === 'l5q2') {
        // Market crash/recession happens FIRST
        if (newPortfolio.stocks > 0) {
          if (event.id === 'l4q1') {
            newPortfolio.stocks *= 0.6; // 40% crash
          } else {
            newPortfolio.stocks *= 0.8; // 20% recession
          }
        }
      }

      // STEP 3: Apply stock growth AFTER all investments and crashes
      // CRITICAL: This ensures ALL existing stock holdings grow over time
      // Growth happens every period, compounding on existing investments
      // DIFFICULTY SCALING: Lower growth rates after Level 1
      if (newPortfolio.stocks > 0) {
        // Adjust return rate based on level (harder after level 1)
        let adjustedReturnRate = returnRate;
        if (currentLevel > 1) {
          // Reduce growth rate by level difficulty
          const growthPenalty = (currentLevel - 1) * 0.5; // -0.5% per level after 1
          adjustedReturnRate = Math.max(returnRate - growthPenalty, 3); // Minimum 3% growth
        }
        
        const stocksBeforeGrowth = newPortfolio.stocks;
        newPortfolio.stocks = calculatePortfolioGrowth(
          newPortfolio.stocks,
          yearsToPass,
          adjustedReturnRate,
          eventMultiplier
        );
        
        // Log growth for debugging (only if significant change)
        if (process.env.NODE_ENV === 'development') {
          const growthAmount = newPortfolio.stocks - stocksBeforeGrowth;
          const growthPercent = stocksBeforeGrowth > 0 
            ? ((growthAmount / stocksBeforeGrowth) * 100).toFixed(1)
            : 0;
          if (Math.abs(growthAmount) > 100) {
            console.log(`📈 Stock Growth: $${stocksBeforeGrowth.toLocaleString()} → $${newPortfolio.stocks.toLocaleString()} (+${growthPercent}% over ${yearsToPass} years)`);
          }
        }
      }

      // STEP 4: Apply debt interest (CRITICAL: Debt compounds over time)
      // REALISTIC: Credit card debt at 24.59% APR compounds annually
      // This must happen AFTER we know yearsToPass
      if (newPortfolio.debt > 0) {
        const debtBeforeInterest = newPortfolio.debt;
        const creditCardAPR = 0.2459; // 24.59% annual (Fed 2024 data)
        // Compound interest: debt = debt * (1 + APR)^years
        newPortfolio.debt = newPortfolio.debt * Math.pow(1 + creditCardAPR, yearsToPass);
        
        // Log debt growth for debugging
        if (process.env.NODE_ENV === 'development' && newPortfolio.debt > debtBeforeInterest) {
          const interestAdded = newPortfolio.debt - debtBeforeInterest;
          console.log(`💳 Debt Interest: $${debtBeforeInterest.toLocaleString()} → $${newPortfolio.debt.toLocaleString()} (+$${interestAdded.toLocaleString()} interest over ${yearsToPass} years)`);
        }
      }

      // STEP 5: Auto-pay debt from cash if available (skip if already paid early)
      // If player has cash, automatically pay off debt (minimum payment or all if small)
      if (!didPayDebtEarly && newPortfolio.debt > 0 && newPortfolio.cash > 0) {
        // Realistic: Pay minimum 2% of debt or all if debt is small
        const minPayment = Math.max(newPortfolio.debt * 0.02, 50); // 2% or $50 minimum
        const paymentAmount = Math.min(newPortfolio.cash, Math.max(minPayment, newPortfolio.debt));
        
        if (paymentAmount > 0) {
          newPortfolio.cash -= paymentAmount;
          newPortfolio.debt = Math.max(0, newPortfolio.debt - paymentAmount);
          
          if (process.env.NODE_ENV === 'development' && paymentAmount > 100) {
            console.log(`💰 Debt Payment: Paid $${paymentAmount.toLocaleString()}, remaining debt: $${newPortfolio.debt.toLocaleString()}`);
          }
        }
      }
    }
    // NOTE: Old event handlers (event.id === 1-5) are kept for backward compatibility
    // but should NOT execute for level-based questions (all current questions use 'l1q1' format)

    // Update age
    newAge += yearsToPass;

    // Check for random event (30% chance after each question, but not on last question)
    const isLastQuestion = currentLevelIndex === 4 && currentQuestionIndex === 6;
    const hasRandomEvent = Math.random() < 0.3 && !isLastQuestion;
    
    if (hasRandomEvent) {
      const randomEventData = getRandomEvent();
      if (randomEventData) {
        // Apply random event impact
        if (randomEventData.impact.cash) {
          newPortfolio.cash += randomEventData.impact.cash;
          notedCashDelta += randomEventData.impact.cash;
          const sign = randomEventData.impact.cash >= 0 ? '+' : '';
          cashNotes.push(`Random event cash ${sign}$${Math.abs(randomEventData.impact.cash).toLocaleString()}`);
        }
        if (randomEventData.impact.stocks && newPortfolio.stocks > 0) {
          const factor = 1 + randomEventData.impact.stocks;
          if (Number.isFinite(factor) && factor > 0) {
            newPortfolio.stocks = Math.max(0, Math.round(newPortfolio.stocks * factor));
          }
        }
        if (randomEventData.impact.incomeBonus) {
          newYearlyIncome += randomEventData.impact.incomeBonus;
        }
        setPortfolio(newPortfolio);
        setAge(newAge);
        setYearlyIncome(newYearlyIncome);
        setYearlyExpenses(newYearlyExpenses);
        setBadges(newBadges);
        const newNetWorth = newPortfolio.cash + newPortfolio.stocks - newPortfolio.debt;
        setNetWorthHistory(prev => [...prev, newNetWorth]);
        setRandomEvent(randomEventData);
        setGameState('randomEvent');
        setIsProcessing(false);
        return;
      }
    }

    // Final validation: round to cents and clamp >= 0
    const round2 = (v) => Math.max(0, Math.round((v + Number.EPSILON) * 100) / 100);
    newPortfolio.stocks = round2(newPortfolio.stocks);
    newPortfolio.cash = round2(newPortfolio.cash);
    newPortfolio.debt = round2(newPortfolio.debt);
    // Anti-ghost-cash correction: if cash increased but not accounted for, revert the unexplained portion
    const cashAfterAll = newPortfolio.cash;
    const computedDelta = cashAfterAll - cashBeforeAll;
    const unexplained = computedDelta - notedCashDelta;
    if (unexplained > 0) {
      newPortfolio.cash = Math.max(0, newPortfolio.cash - unexplained);
      cashNotes.push(`Correction -$${unexplained.toLocaleString()} (reverted unexplained increase)`);
    }
    setLastCashDelta(cashAfterAll - cashBeforeAll);
    setLastCashNotes(cashNotes);
    
    // DIFFICULTY SCALING: Check for financial failure conditions
    // After Level 1, check if player is in financial trouble
    const currentNetWorth = newPortfolio.cash + newPortfolio.stocks - newPortfolio.debt;
    const debtToIncomeRatio = (newPortfolio.debt > 0 && newYearlyIncome > 0) ? newPortfolio.debt / newYearlyIncome : 0;
    
    // Failure conditions:
    // 1. Negative net worth AND debt > 50% of income (after level 1)
    // 2. Debt > 2x annual income (unsustainable)
    // 3. Negative net worth for 3+ consecutive periods (after level 1)
    if (currentLevel > 1) {
      if (currentNetWorth < 0 && debtToIncomeRatio > 0.5) {
        console.log(`🚨 Financial Warning: Negative net worth ($${currentNetWorth.toLocaleString()}) with high debt-to-income ratio (${(debtToIncomeRatio * 100).toFixed(1)}%)`);
        setLossWarning({
          title: 'Financial Warning',
          message: `Negative net worth ($${currentNetWorth.toLocaleString()}) and high debt-to-income (${(debtToIncomeRatio * 100).toFixed(1)}%). Build cash buffer and reduce debt.`
        });
      }
      if (debtToIncomeRatio > 2.0) {
        console.log(`🚨 Financial Crisis: Debt is ${(debtToIncomeRatio * 100).toFixed(1)}% of annual income! This is unsustainable!`);
        newYearlyExpenses = Math.floor(newYearlyExpenses * 1.1);
        setLossWarning({
          title: 'Financial Crisis',
          message: `Debt exceeds 200% of your annual income. Expenses increased due to stress. Prioritize paying down high-interest debt.`
        });
      }
    }
    
    // Debug logging to help track down calculation issues
    if (process.env.NODE_ENV === 'development') {
      console.log('=== PORTFOLIO UPDATE ===');
      console.log('Event ID:', event.id);
      console.log('Before:', {
        cash: portfolio.cash.toLocaleString(),
        stocks: portfolio.stocks.toLocaleString(),
        debt: portfolio.debt.toLocaleString()
      });
      console.log('After:', {
        cash: newPortfolio.cash.toLocaleString(),
        stocks: newPortfolio.stocks.toLocaleString(),
        debt: newPortfolio.debt.toLocaleString(),
        netWorth: (newPortfolio.cash + newPortfolio.stocks - newPortfolio.debt).toLocaleString(),
        age: newAge,
        income: newYearlyIncome.toLocaleString(),
        expenses: newYearlyExpenses.toLocaleString()
      });
      console.log('Years passed:', yearsToPass);
      console.log('========================');
    }
    
    // Store portfolio state BEFORE updating (for feedback comparison)
    const portfolioBefore = { ...portfolio };
    const ageBefore = age;

    // Update state - batch all updates together
    setPortfolio(newPortfolio);
    setAge(newAge);
    setYearlyIncome(newYearlyIncome);
    setYearlyExpenses(newYearlyExpenses);
    setBadges(newBadges);

    // Update net worth history - calculate AFTER all updates, prevent duplicates
    const newNetWorth = newPortfolio.cash + newPortfolio.stocks - newPortfolio.debt;
    setNetWorthHistory(prev => {
      // Prevent duplicate entries if somehow called twice
      const lastValue = prev.length > 0 ? prev[prev.length - 1] : null;
      if (lastValue !== newNetWorth) {
        return [...prev, newNetWorth];
      }
      return prev;
    });

    // Calculate total questions answered (reuse the one calculated earlier)
    // Store feedback data for QuestionFeedback component
    setQuestionFeedback({
      event,
      choices,
      portfolioBefore,
      portfolioAfter: newPortfolio,
      ageBefore,
      ageAfter: newAge,
      incomeBefore: yearlyIncome,
      incomeAfter: newYearlyIncome,
      expensesBefore: yearlyExpenses,
      expensesAfter: newYearlyExpenses,
      totalQuestionsAnswered: totalQuestionsAnswered
    });

    // Show feedback screen only at the end of each level
    const isLevelEnd = (currentQuestionIndex + 1) === 7; // Last question of level (question 7)
    const shouldShowFeedback = isLevelEnd;
    
    if (shouldShowFeedback) {
      setGameState('questionFeedback');
    } else {
      // Skip feedback and go directly to next question (atomic rollover)
      setCurrentQuestionIndex(prevQ => {
        const nextQ = prevQ + 1;
        if (nextQ < 7) return nextQ;
        // Rollover: advance level and reset question
        setCurrentLevelIndex(prevL => (prevL < 4 ? prevL + 1 : prevL));
        setShowLevelSummary(true);
        return 0;
      });
    }
  };

  const handleQuestionFeedbackContinue = () => {
    // Move to next question or level after feedback
    // FIX: Use functional updates to prevent loops and ensure correct progression
    setCurrentQuestionIndex(prev => {
      const nextQuestion = prev + 1;
      if (nextQuestion < 7) {
        // Still in current level (0-6 = 7 questions) - move to next question
        return nextQuestion;
      } else {
        // Finished current level - move to next level
        setCurrentLevelIndex(prevLevel => {
          if (prevLevel < 4) {
            // Move to next level (0-4 = 5 levels)
            const lv = prevLevel + 1;
            // Show level summary after feedback resolution
            setShowLevelSummary(true);
            return lv;
          } else {
            // Game ended - completed all 5 levels
            setGameState('ended');
            return prevLevel;
          }
        });
        // Reset to question 0 for new level
        return 0;
      }
    });
    setQuestionFeedback(null);
    setGameState('playing');
    setIsProcessing(false);
  };

  const handleRandomEventContinue = () => {
    setRandomEvent(null);
    setGameState('playing');
  };

  const handleStart = (data) => {
    // Clear ALL localStorage data from previous games
    try {
      // Clear all tip localStorage entries
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('tip_')) {
          localStorage.removeItem(key);
        }
      });
      // Clear any other game-related localStorage entries
      keys.forEach(key => {
        if (key.startsWith('milestone_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }

    // Reset randomized questions
    resetRandomizedSets();
    const newRandomized = {};
    
    // Generate randomized question sets for each level
    GAME_LEVELS.forEach((level, index) => {
      newRandomized[index] = getRandomizedQuestions(level);
    });
    
    // Reset ALL game state
    setRandomizedQuestions(newRandomized);
    setPlayerData(data);
    // Default to Kcoin scenario as main story
    setMode('kcoin');
    setGameState('kcoin');
    setCurrentLevelIndex(0);
    setCurrentQuestionIndex(0);
    setRandomEvent(null);
    setAge(data.age || 22);
    setPortfolio({ cash: data.initialAmount, stocks: 0, debt: 0 });
    setBadges([]);
    setNetWorthHistory([data.initialAmount]);
    setYearlyIncome(data.yearlyIncome || 48000);
    setYearlyExpenses(data.yearlyExpenses || 24000);
    setLastSalaryDeposit(0);
    setGameChoices({
      opted401k: false,
      investedEarly: false,
      usedCreditCard: false,
      panicSold: false,
      hasLostJob: false,
      hasRecoveredFromJobLoss: false
    });
  };

  const handlePlayAgain = () => {
    // Clear ALL localStorage data when playing again
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('tip_') || key.startsWith('milestone_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }

    // Reset all state
    setGameState('input');
    setPlayerData(null);
    setCurrentLevelIndex(0);
    setCurrentQuestionIndex(0);
    setRandomizedQuestions({});
    setRandomEvent(null);
    setBadges([]);
    setPortfolio({ cash: 5000, stocks: 0, debt: 0 });
    setNetWorthHistory([5000]);
    setAge(22);
    setYearlyIncome(48000);
    setYearlyExpenses(24000);
    setLastSalaryDeposit(0);
    setGameChoices({
      opted401k: false,
      investedEarly: false,
      usedCreditCard: false,
      panicSold: false,
      hasLostJob: false,
      hasRecoveredFromJobLoss: false
    });
  };

  // Get current level and question (with randomization)
  const currentLevel = GAME_LEVELS[currentLevelIndex];
  const getRandomizedQuestion = () => {
    if (!currentLevel) return null;
    const randomizedSet = randomizedQuestions[currentLevelIndex];
    if (randomizedSet && randomizedSet.length > 0) {
      return randomizedSet[currentQuestionIndex] || null;
    }
    // Fallback to regular question
    return getLevelQuestion(currentLevel, currentQuestionIndex);
  };
  const currentQuestion = getRandomizedQuestion();
  
  // Calculate total questions completed
  const totalQuestionsCompleted = currentLevelIndex * 7 + currentQuestionIndex;
  const totalQuestions = 35; // 5 levels * 7 questions

  // Calculate net worth for background - updates dynamically
  const currentNetWorth = gameState === 'playing' || gameState === 'ended' ? calculateNetWorth() : (playerData?.initialAmount || 0);
  
  // Get background style based on current net worth
  const backgroundStyle = React.useMemo(() => {
    try {
      return getBackgroundStyle(currentNetWorth);
    } catch (error) {
      console.error('Background style error:', error);
      return {
        backgroundImage: 'url(/backgrounds/Wallpapers/Level 1 Room.jpg)',
        gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e8ba3 100%)',
        overlay: 'rgba(0, 0, 0, 0.3)'
      };
    }
  }, [currentNetWorth]);

  return (
    <div className="min-h-screen" style={{ 
      position: 'relative',
      // Use only non-shorthand background props to avoid conflicts
      backgroundImage: backgroundStyle.gradient, // linear-gradient(...)
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Background Image Layer */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: backgroundStyle.backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        zIndex: 0,
        transition: 'background-image 0.5s ease'
      }}></div>
      
      {/* Overlay Layer */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: backgroundStyle.overlay,
        pointerEvents: 'none',
        zIndex: 1
      }}></div>
      
      {/* Content Layer */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {lossWarning && (
          <LossModal title={lossWarning.title} message={lossWarning.message} onClose={() => setLossWarning(null)} />
        )}
        {gameState === 'input' && (
          <div className="relative">
            <InputScreen onStart={handleStart} />
          </div>
        )}
        {gameState === 'modeSelect' && (
          <ModeSelect onSelect={(m) => {
            if (m === 'battle') { setMode('battle'); setGameState('battle'); return; }
            if (m === 'kcoin') { setMode('kcoin'); setGameState('kcoin'); return; }
            setMode('story'); setGameState('playing');
          }} />
        )}
        
        {gameState === 'playing' && mode === 'story' && playerData && currentQuestion && (
          <ErrorBoundary>
          <div className="min-h-screen p-4 flex items-center relative">
            <ProgressMilestone 
              netWorth={calculateNetWorth()} 
              age={age}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
            />
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4 h-full max-h-[90vh]">
              {/* Left Side - Questions */}
              <div className="order-2 lg:order-1 flex flex-col min-h-0">
                <EventScreen
                  event={currentQuestion}
                  playerName={playerData.name}
                  onChoiceMade={(choices) => processEventChoice(currentQuestion, choices)}
                  portfolio={portfolio}
                  age={age}
                  currentLevel={currentLevel}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={totalQuestions}
                  lastSalaryDeposit={lastSalaryDeposit}
                  lastCashDelta={lastCashDelta}
                  lastCashNotes={lastCashNotes}
                  scenario={playerData?.scenario}
                  isProcessing={isProcessing}
                />
              </div>
              
              {/* Right Side - Chart */}
              <div className="order-1 lg:order-2 flex flex-col min-h-0">
                <SimulatorDashboard
                  portfolio={portfolio}
                  netWorthHistory={netWorthHistory}
                  age={age}
                />
              </div>
            </div>
          </div>
          </ErrorBoundary>
        )}

        {gameState === 'battle' && (
          <BattleMode onExit={() => {
            setGameState('modeSelect');
          }} />
        )}

        {gameState === 'kcoin' && (
          <KcoinStory
            onExit={() => setGameState('modeSelect')}
            onFinish={(outcome, path) => {
              // Apply simple outcome to portfolio and end
              setPortfolio(p => ({ ...p, cash: outcome.finalCash, stocks: 0 }));
              setBadges(b => ([...b, { name: outcome.group, description: '', icon: '[*]' }]));
              setNetWorthHistory(prev => [...prev, outcome.finalCash]);
              setGameState('ended');
            }}
          />
        )}
        
        {gameState === 'questionFeedback' && questionFeedback && (
          <div className="min-h-screen p-4 flex items-center relative">
            <div className="max-w-4xl mx-auto w-full">
              <QuestionFeedback
                event={questionFeedback.event}
                choices={questionFeedback.choices}
                portfolioBefore={questionFeedback.portfolioBefore}
                portfolioAfter={questionFeedback.portfolioAfter}
                ageBefore={questionFeedback.ageBefore}
                ageAfter={questionFeedback.ageAfter}
                incomeBefore={questionFeedback.incomeBefore}
                incomeAfter={questionFeedback.incomeAfter}
                expensesBefore={questionFeedback.expensesBefore}
                expensesAfter={questionFeedback.expensesAfter}
                totalQuestionsAnswered={questionFeedback.totalQuestionsAnswered}
                onContinue={handleQuestionFeedbackContinue}
              />
            </div>
          </div>
        )}

        {showLevelSummary && (
          <div className="min-h-screen p-4 flex items-center relative">
            <div className="max-w-3xl mx-auto w-full">
              <LevelSummary
                levelName={currentLevel?.name || 'Level Complete'}
                netWorth={calculateNetWorth()}
                age={age}
                badges={badges}
                onContinue={() => setShowLevelSummary(false)}
              />
            </div>
          </div>
        )}

        {gameState === 'randomEvent' && randomEvent && playerData && (
          <RandomEventScreen
            randomEvent={randomEvent}
            playerName={playerData.name}
            onContinue={handleRandomEventContinue}
          />
        )}

        {gameState === 'ended' && playerData && (
          <EndScreen
            playerName={playerData.name}
            netWorth={calculateNetWorth()}
            badges={badges}
            age={age}
            portfolio={portfolio}
            gameChoices={gameChoices}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </div>
  );
}

export default App;

