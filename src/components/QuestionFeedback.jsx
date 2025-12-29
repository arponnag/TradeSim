// Component to show feedback after each question
import { useEffect, useState } from 'react';
import PixelCharacter from './PixelCharacter';

export default function QuestionFeedback({ 
  event, 
  choices, 
  portfolioBefore, 
  portfolioAfter, 
  ageBefore, 
  ageAfter,
  incomeBefore,
  incomeAfter,
  expensesBefore,
  expensesAfter,
  totalQuestionsAnswered,
  onContinue 
}) {
  const [feedback, setFeedback] = useState([]);
  
  useEffect(() => {
    generateFeedback();
  }, []);

  const generateFeedback = () => {
    const lessons = [];
    const cashBefore = portfolioBefore?.cash || 0;
    const cashAfter = portfolioAfter?.cash || 0;
    const stocksBefore = portfolioBefore?.stocks || 0;
    const stocksAfter = portfolioAfter?.stocks || 0;
    const debtBefore = portfolioBefore?.debt || 0;
    const debtAfter = portfolioAfter?.debt || 0;
    const netWorthBefore = cashBefore + stocksBefore - debtBefore;
    const netWorthAfter = cashAfter + stocksAfter - debtAfter;
    
    // Calculate what happened
    const cashChange = cashAfter - cashBefore;
    const stocksChange = stocksAfter - stocksBefore;
    const debtChange = debtAfter - debtBefore;
    const netWorthChange = netWorthAfter - netWorthBefore;
    const yearsPassed = ageAfter - ageBefore;

    // Analyze choices and provide feedback
    if (choices['401k_yes'] === 'Yes, take the free money!') {
      lessons.push({
        type: 'success',
        title: '✅ Great Choice: 401(k) Match!',
        message: `You took the employer match! You received $${(cashChange > 0 ? Math.round(cashChange / 10) : 0).toLocaleString()} in free money over ${yearsPassed} years. CASE STUDY: Sarah maxed 401(k) match from age 22 = $1.2M by 65. John skipped it = only $600k. Same salary, but John lost $600k!`,
        icon: '💰'
      });
    } else if (choices['401k_yes'] === 'No, skip it') {
      lessons.push({
        type: 'error',
        title: '❌ Missed Opportunity: 401(k) Match',
        message: `You skipped free employer money! Average match is 4.5% of salary. Over 40 years, missing this costs $600k+ in retirement. CASE STUDY: John skipped 401(k) match until age 30 = lost $600k by retirement. Always take the match - it's essentially a 100% return!`,
        icon: '⚠️'
      });
    }

    if (choices.savings_choice === 'Invest it in the stock market') {
      const invested = Math.min(cashBefore * 0.5, cashBefore);
      lessons.push({
        type: 'success',
        title: '✅ Smart Move: Investing Early',
        message: `You invested $${Math.floor(invested).toLocaleString()} in stocks! This will compound over time. CASE STUDY: Same $5,000 investment - started at age 22 = $126k by 65. Started at 32 = only $31k. Starting 10 years earlier = $95,000 more!`,
        icon: '📈'
      });
    } else if (choices.savings_choice === 'Keep it in your bank account') {
      lessons.push({
        type: 'warning',
        title: '⚠️ Opportunity Cost: Keeping Cash',
        message: `You kept money in cash (0-1% return). S&P 500 averaged 10.3% annually (1957-2023). Over 30 years, $10,000 in cash = $13,000. In stocks = $180,000! Cash loses buying power to inflation.`,
        icon: '💸'
      });
    } else if (choices.savings_choice === 'Spend it on fun things') {
      lessons.push({
        type: 'error',
        title: '❌ Lifestyle Inflation',
        message: `You spent instead of investing. This increases expenses permanently. Real data: Average American saves 3.7% of income. Financial experts recommend 20%+. Saving 20% vs 3.7% = 5x retirement wealth difference!`,
        icon: '🎯'
      });
    }

    if (choices.small_emergency === 'Use a credit card' || choices.emergency_fund === 'Use a credit card (expensive!)') {
      lessons.push({
        type: 'error',
        title: '❌ Expensive Debt: Credit Card',
        message: `You used a credit card! Average APR: 24.59% (Fed 2024). Your $${debtChange > 0 ? Math.floor(debtChange).toLocaleString() : 0} debt will compound over time. CASE STUDY: Maria's $400 car repair became $650 in 2 years on credit card. Emergency fund = $400 total.`,
        icon: '💳'
      });
    } else if (choices.small_emergency === 'Use your savings' || choices.emergency_fund === 'Use your savings (smart!)') {
      lessons.push({
        type: 'success',
        title: '✅ Smart: Emergency Fund',
        message: `You used your savings instead of credit cards! This saved you $${debtChange > 0 ? Math.floor(debtChange * 0.25).toLocaleString() : 0} in interest. Real data: 37% of Americans can't cover $400 emergency. You're building good financial habits!`,
        icon: '🛡️'
      });
    }

    if (choices.panic_sell === 'Sell everything now (panic!)') {
      lessons.push({
        type: 'error',
        title: '❌ Panic Selling: Locked in Losses',
        message: `You panic-sold! This locks in losses permanently. CASE STUDY: 2008 crash - Investor A held $100k through crash = $250k by 2021 (+150%). Investor B panic-sold = $61.5k forever (-38.5% permanent loss). Difference: $188,500! Markets recover, but panic selling locks in losses.`,
        icon: '😰'
      });
    } else if (choices.panic_sell === 'Buy more while prices are low') {
      lessons.push({
        type: 'success',
        title: '✅ Excellent: Buy the Dip',
        message: `You bought more during the crash! This is smart long-term investing. Real data: 2008 crash recovered by 2012. By 2021, those who bought during crash gained 250%! Time in the market beats timing the market.`,
        icon: '📈'
      });
    }

    if (choices.starting_amount === 'Invest in stocks') {
      const invested = Math.min(cashBefore, 5000);
      lessons.push({
        type: 'success',
        title: '✅ Investing Early: Time is Your Asset',
        message: `You invested $${Math.floor(invested).toLocaleString()} early! Starting early = 10 extra years of compound growth. CASE STUDY: $5,000 at age 22 vs 32 = $95,000 more by age 65. Time is your biggest asset!`,
        icon: '⏰'
      });
    }

    if (choices.savings_rate) {
      const rate = choices.savings_rate.includes('30%') ? 30 : 
                   choices.savings_rate.includes('20%') ? 20 : 10;
      if (rate >= 20) {
        lessons.push({
          type: 'success',
          title: '✅ Excellent Savings Rate',
          message: `You're saving ${rate}% of income! Real data: Average American saves 3.7%. Saving 20% vs 10% = 2x retirement wealth. CASE STUDY: Three people, same $50k income. 10% savings = $950k retirement. 20% = $1.9M (2x!). 30% = $2.85M (3x!).`,
          icon: '💵'
        });
      } else {
        lessons.push({
          type: 'warning',
          title: '⚠️ Low Savings Rate',
          message: `You're saving ${rate}% - minimum recommended. Average American saves 3.7%. Financial experts recommend 20%+ for retirement. Doubling savings rate doubles retirement wealth. Try to increase it!`,
          icon: '📊'
        });
      }
    }

    // Show income changes (promotions, raises, job loss)
    if (incomeAfter && incomeBefore) {
      const incomeChange = incomeAfter - incomeBefore;
      if (incomeChange > 0) {
        lessons.push({
          type: 'success',
          title: '🎉 Income Increased!',
          message: `Your annual income increased: $${incomeBefore.toLocaleString()} → $${incomeAfter.toLocaleString()} (+$${incomeChange.toLocaleString()}/year). This is a raise or promotion!`,
          icon: '💰'
        });
      } else if (incomeChange < -1000) {
        lessons.push({
          type: 'error',
          title: '⚠️ Job Loss - Income Decreased',
          message: `Your income dropped: $${incomeBefore.toLocaleString()} → $${incomeAfter.toLocaleString()} (${incomeChange.toLocaleString()}/year). This is why emergency funds matter! Real data: Average unemployment lasts 3-6 months. You'll need to rebuild your savings.`,
          icon: '💼'
        });
      }
    }

    // Show financial changes
    if (stocksChange > 0) {
      lessons.push({
        type: 'info',
        title: '📊 Investment Update',
        message: `Stocks: $${Math.floor(stocksBefore).toLocaleString()} → $${Math.floor(stocksAfter).toLocaleString()} (${stocksChange > 0 ? '+' : ''}${Math.floor(stocksChange).toLocaleString()})`,
        icon: '📈'
      });
    }

    if (debtChange > 0) {
      lessons.push({
        type: 'error',
        title: '💳 Debt Warning',
        message: `Debt increased: $${Math.floor(debtBefore).toLocaleString()} → $${Math.floor(debtAfter).toLocaleString()}. Credit card debt at 24.59% APR compounds quickly. Pay it off as soon as possible!`,
        icon: '⚠️'
      });
    }

    if (netWorthChange < 0) {
      lessons.push({
        type: 'warning',
        title: '📉 Net Worth Decreased',
        message: `Net worth: $${Math.floor(netWorthBefore).toLocaleString()} → $${Math.floor(netWorthAfter).toLocaleString()} (${netWorthChange < 0 ? '-' : '+'}${Math.floor(Math.abs(netWorthChange)).toLocaleString()}). This is normal - markets go down sometimes. Keep investing long-term!`,
        icon: '📉'
      });
    }

    // If no specific feedback, provide general lesson
    if (lessons.length === 0) {
      lessons.push({
        type: 'info',
        title: '💡 Financial Lesson',
        message: `Over ${yearsPassed} years, your net worth changed from $${Math.floor(netWorthBefore).toLocaleString()} to $${Math.floor(netWorthAfter).toLocaleString()}. Remember: Time in the market beats timing the market. Keep making smart financial decisions!`,
        icon: '💡'
      });
    }

    setFeedback(lessons);
  };

  return (
    <div className="retro-card scanlines p-8 relative z-20 h-full flex flex-col">
      <div className="mb-6 text-center">
        <PixelCharacter emotion="thinking" size="large" />
        <h2 className="retro-font text-retro-cyan mb-4 retro-glow mt-4">Round Feedback</h2>
        <p className="text-retro-green text-lg">What You Learned This Round</p>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto mb-6">
        {feedback.map((lesson, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${
              lesson.type === 'success'
                ? 'bg-green-900 bg-opacity-30 border-green-500'
                : lesson.type === 'error'
                ? 'bg-red-900 bg-opacity-30 border-red-500'
                : lesson.type === 'warning'
                ? 'bg-yellow-900 bg-opacity-30 border-yellow-500'
                : 'bg-cyan-900 bg-opacity-30 border-cyan-500'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{lesson.icon}</span>
              <div className="flex-1">
                <h3 className={`font-bold mb-2 ${
                  lesson.type === 'success' ? 'text-green-300' :
                  lesson.type === 'error' ? 'text-red-300' :
                  lesson.type === 'warning' ? 'text-yellow-300' :
                  'text-cyan-300'
                }`}>
                  {lesson.title}
                </h3>
                <p className="text-sm text-white leading-relaxed">{lesson.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="retro-button py-4 uppercase tracking-wider w-full"
      >
        Continue to Next Question
      </button>
    </div>
  );
}

