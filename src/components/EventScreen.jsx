import { useState } from 'react';
import Tooltip from './Tooltip';
import PixelCharacter from './PixelCharacter';
import CharacterAvatar from './CharacterAvatar';
import FunFact from './FunFact';
import ChoiceImpact from './ChoiceImpact';
import QuickTip from './QuickTip';
import { FINANCIAL_TERMS } from '../utils/terms';

export default function EventScreen({ event, playerName, onChoiceMade, portfolio, age, currentLevel, questionNumber, totalQuestions, lastSalaryDeposit, lastCashDelta, lastCashNotes, scenario, isProcessing }) {
  const [selectedChoices, setSelectedChoices] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  
  // Safety check
  if (!event || !event.choices || !Array.isArray(event.choices)) {
    return (
      <div className="retro-card scanlines p-8 relative z-20 h-full flex flex-col items-center justify-center">
        <p className="text-retro-red">Error: Invalid question data</p>
      </div>
    );
  }

  const handleChoice = (choiceId, value) => {
    const newChoices = { ...selectedChoices, [choiceId]: value };
    setSelectedChoices(newChoices);
    
    // Check if all required choices are made
    const allMade = event?.choices?.every(choice => newChoices[choice.id] !== undefined) || false;
    setCanSubmit(allMade);
  };

  const handleSubmit = () => {
    if (canSubmit) {
      onChoiceMade(selectedChoices);
    }
  };

  // Helper to wrap terms in tooltips
  const wrapTerms = (text) => {
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:()]/g, '');
      if (FINANCIAL_TERMS[cleanWord]) {
        return (
          <Tooltip key={index} term={cleanWord} definition={FINANCIAL_TERMS[cleanWord]}>
            {word}
          </Tooltip>
        );
      }
      return <span key={index}>{word}</span>;
    });
  };

  const getEmotion = () => {
    // Handle both old event IDs (1-5) and new level-based IDs (l1q1, etc.)
    if (typeof event.id === 'number') {
      // Old format
      if (event.id <= 2) return 'happy';
      if (event.id === 4) return 'worried';
      if (event.id === 5) return 'thinking';
      return 'excited';
    } else if (typeof event.id === 'string') {
      // New level-based format
      const level = parseInt(event.id.charAt(1)) || 1;
      const question = parseInt(event.id.charAt(3)) || 1;
      
      // Level 1-2: generally happy/excited
      if (level <= 2) return 'happy';
      // Level 4: market crash - worried
      if (level === 4 && question === 1) return 'worried';
      // Level 5: family planning - thinking
      if (level === 5 && question === 1) return 'thinking';
      // Default: excited
      return 'excited';
    }
    return 'happy';
  };

  const getFunFactKey = () => {
    // Handle both old event IDs and new level-based IDs
    if (typeof event.id === 'number') {
      // Old format
      if (event.id === 1) return '401k_match';
      if (event.id === 2) return 'emergency_fund';
      if (event.id === 3) return 'tech_stocks';
      if (event.id === 4) return 'panic_selling';
      if (event.id === 5) return 'recession';
    } else if (typeof event.id === 'string' && event.id.startsWith('l')) {
      // New level-based format - precise mapping for each question
      // Level 1 questions
      if (event.id === 'l1q1') return 'early_investing'; // First Savings Decision
      if (event.id === 'l1q2') return '401k_match'; // Job Offer with 401k
      if (event.id === 'l1q3') return 'savings_rate'; // Monthly Budget / Savings Rate
      if (event.id === 'l1q4') return 'emergency_fund'; // Small Emergency
      if (event.id === 'l1q5') return 'early_investing'; // Learning About Investing
      if (event.id === 'l1q6') return 'compound_interest'; // Friends Want to Go Out (spending vs saving)
      if (event.id === 'l1q7') return 'early_investing'; // First Investment
      
      // Level 2 questions
      if (event.id === 'l2q1') return 'emergency_fund'; // Major Emergency
      if (event.id === 'l2q2') return 'compound_interest'; // Pay Raise
      if (event.id === 'l2q3') return 'early_investing'; // Stock Market Doing Well
      if (event.id === 'l2q4') return 'debt_vs_investing'; // Credit Card Debt
      if (event.id === 'l2q5') return 'compound_interest'; // Side Business
      if (event.id === 'l2q6') return 'compound_interest'; // Rent vs Buy
      if (event.id === 'l2q7') return 'diversification'; // Diversification
      
      // Level 3 questions
      if (event.id === 'l3q1') return 'tech_stocks'; // Tech Stocks Booming
      if (event.id === 'l3q2') return 'compound_interest'; // Career Change
      if (event.id === 'l3q3') return 'compound_interest'; // Real Estate Investment
      if (event.id === 'l3q4') return 'market_volatility'; // Market Volatility
      if (event.id === 'l3q5') return 'compound_interest'; // Tax-Advantaged Accounts
      if (event.id === 'l3q6') return 'compound_interest'; // Market Timing
      if (event.id === 'l3q7') return 'diversification'; // Asset Allocation
      
      // Level 4 questions
      if (event.id === 'l4q1') return 'panic_selling'; // Market Crash
      if (event.id === 'l4q2') return 'recession'; // Recession
      if (event.id === 'l4q3') return 'compound_interest'; // Economic Uncertainty
      if (event.id === 'l4q4') return 'market_volatility'; // Market Recovery
      if (event.id === 'l4q5') return 'compound_interest'; // Investment Strategy
      if (event.id === 'l4q6') return 'compound_interest'; // Financial Planning
      if (event.id === 'l4q7') return 'retirement_savings'; // Retirement Planning
      
      // Level 5 questions
      if (event.id === 'l5q1') return 'compound_interest'; // Family Planning
      if (event.id === 'l5q2') return 'recession'; // Economic Downturn
      if (event.id === 'l5q3') return 'retirement_savings'; // Retirement Strategy
      if (event.id === 'l5q4') return 'compound_interest'; // Long-term Wealth
      if (event.id === 'l5q5') return 'retirement_savings'; // Estate Planning
      if (event.id === 'l5q6') return 'compound_interest'; // Legacy Building
      if (event.id === 'l5q7') return 'retirement_savings'; // Final Financial Review
      
      // Fallback: check title keywords if ID doesn't match
      const eventTitle = (event.title || '').toLowerCase();
      if (eventTitle.includes('401') || eventTitle.includes('job offer')) return '401k_match';
      if (eventTitle.includes('emergency')) return 'emergency_fund';
      if (eventTitle.includes('tech')) return 'tech_stocks';
      if (eventTitle.includes('crash') || eventTitle.includes('panic')) return 'panic_selling';
      if (eventTitle.includes('recession')) return 'recession';
      if (eventTitle.includes('diversif')) return 'diversification';
      if (eventTitle.includes('debt')) return 'debt_vs_investing';
      if (eventTitle.includes('budget') || eventTitle.includes('savings rate')) return 'savings_rate';
      if (eventTitle.includes('retirement')) return 'retirement_savings';
    }
    return 'compound_interest'; // Default fallback
  };

  return (
    <div className="retro-card scanlines p-8 relative z-20 h-full flex flex-col">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-retro-cyan bg-black border-2 border-cyan-500 px-3 py-1 rounded">
                Age {age}
              </span>
              <div className="flex items-center gap-2">
                {currentLevel && (
                  <span className="text-xs text-retro-yellow bg-black border border-yellow-500 px-2 py-1 rounded">
                    {currentLevel.name}
                  </span>
                )}
                <span className="text-sm text-retro-green">
                  Question {questionNumber || 1} of {totalQuestions || 35}
                </span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-black border border-green-500 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${((questionNumber || 1) / (totalQuestions || 35)) * 100}%`,
                    boxShadow: '0 0 10px #00ff00'
                  }}
                />
              </div>
              <p className="text-xs text-retro-cyan mt-1 text-right">
                {Math.round(((questionNumber || 1) / (totalQuestions || 35)) * 100)}% Complete
              </p>
            </div>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <CharacterAvatar scenario={scenario} />
              </div>
              <div className="flex-1">
                <h2 className="retro-font text-retro-cyan mb-4 retro-glow">{event.title || 'Financial Decision'}</h2>
                <div className="text-lg text-retro-green leading-relaxed">
                  {wrapTerms(event.story ? event.story(playerName || 'Player', portfolio) : 'Make your choice.')}
                </div>
                {/* Show current portfolio and income state for context */}
                <div className="mt-3 space-y-2">
                  <div className="text-sm text-retro-yellow bg-black bg-opacity-50 p-2 rounded border border-yellow-500">
                    <p>💰 Current Cash: ${(portfolio?.cash || 0).toLocaleString()} | 
                       📈 Stocks: ${Math.floor(portfolio?.stocks || 0).toLocaleString()} | 
                       {portfolio?.debt > 0 && <span className="text-red-400"> 💳 Debt: ${Math.floor(portfolio.debt).toLocaleString()}</span>}
                    </p>
                  </div>
                  {typeof lastSalaryDeposit === 'number' && lastSalaryDeposit >= 0 && (
                    <div className="text-sm text-retro-cyan bg-black bg-opacity-50 p-2 rounded border border-cyan-500">
                      <p>Bank Cash: ${Math.max(0, portfolio.cash).toLocaleString()} | Salary received this round: ${lastSalaryDeposit.toLocaleString()}</p>
                      {typeof lastCashDelta === 'number' && lastCashNotes && lastCashNotes.length > 0 && (
                        <p className="mt-1 text-xs text-retro-green">Last round cash change: {lastCashDelta >= 0 ? '+' : ''}${lastCashDelta.toLocaleString()} ({lastCashNotes.join('; ')})</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            <QuickTip questionId={event?.id || 'default'} />
            
            {event?.choices?.map((choice) => (
              <div key={choice.id} className="border-2 border-cyan-500 bg-black bg-opacity-50 rounded-lg p-4">
                <p className="font-medium text-retro-green mb-3">{wrapTerms(choice.text)}</p>
                <div className="space-y-2">
                  {choice.options.map((option, index) => {
                    const isSelected = selectedChoices[choice.id] === option;
                    // Add simple icons/hints for better understanding
                    const getOptionHint = (opt) => {
                      if (opt.toLowerCase().includes('invest') || opt.toLowerCase().includes('stock')) return '📈';
                      if (opt.toLowerCase().includes('save') || opt.toLowerCase().includes('emergency')) return '🛡️';
                      if (opt.toLowerCase().includes('credit card') || opt.toLowerCase().includes('debt')) return '⚠️';
                      if (opt.toLowerCase().includes('free money') || opt.toLowerCase().includes('401')) return '💰';
                      if (opt.toLowerCase().includes('spend') || opt.toLowerCase().includes('fun')) return '💸';
                      return '';
                    };
                    
                    return (
                      <button
                        key={index}
                        onClick={() => !isProcessing && handleChoice(choice.id, option)}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all transform ${
                          isSelected
                            ? 'border-cyan-500 bg-cyan-900 bg-opacity-30 text-cyan-300 scale-105'
                            : 'border-green-500 bg-black bg-opacity-50 text-retro-green hover:border-cyan-400 hover:bg-cyan-900 hover:bg-opacity-20 hover:scale-[1.02]'
                        }`}
                        disabled={!!isProcessing}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1">
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                              isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-green-500'
                            }`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-black"></div>}
                            </div>
                            <span>{option}</span>
                          </div>
                          {getOptionHint(option) && (
                            <span className="text-xl ml-2">{getOptionHint(option)}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <ChoiceImpact choices={selectedChoices} portfolio={portfolio} currentNetWorth={portfolio.cash + portfolio.stocks - portfolio.debt} />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isProcessing}
            className={`w-full mt-6 py-4 rounded-lg font-semibold transition-all transform ${
              canSubmit
                ? 'retro-button uppercase tracking-wider'
                : 'bg-gray-900 border-2 border-gray-700 text-gray-600 cursor-not-allowed'
            }`}
          >
            Make Decision & Continue
          </button>
          
          <FunFact factKey={getFunFactKey()} />
    </div>
  );
}

