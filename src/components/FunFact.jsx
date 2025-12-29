import { getFunFact } from '../utils/funFacts';

export default function FunFact({ factKey }) {
  const fact = getFunFact(factKey);
  // Optionally surface a related lesson from Investiverse content
  let relatedLesson = null;
  try {
    // Lazy load JSON so build doesn't break if file is missing
    const lessons = require('../utils/lifesimLessons.json');
    const map = {
      'early_investing': ['lesson_investing_4'],
      '401k_match': ['lesson_etf_2'],
      'emergency_fund': ['lesson_investing_2'],
      'tech_stocks': ['lesson_adv_3'],
      'panic_selling': ['lesson_risk_3'],
      'recession': ['lesson_risk_1'],
      'diversification': ['lesson_risk_2'],
      'debt_vs_investing': ['lesson_investing_2'],
      'savings_rate': ['lesson_investing_2'],
      'retirement_savings': ['lesson_etf_1']
    };
    const targetIds = map[factKey] || [];
    for (const cat of lessons) {
      for (const lesson of (cat.lessons || [])) {
        if (targetIds.includes(lesson.id)) {
          relatedLesson = { title: lesson.title, desc: lesson.shortDescription };
          break;
        }
      }
      if (relatedLesson) break;
    }
  } catch (e) {
    // ignore if file not present
  }
  
  if (!fact) return null;

  return (
    <div className="bg-black border-2 border-yellow-500 p-4 rounded-lg mt-4">
      <div className="flex items-start gap-2">
        <span className="text-2xl">[*]</span>
        <div className="flex-1">
          <p className="text-retro-yellow text-sm font-bold mb-1">Fun Fact!</p>
          <p className="text-cyan-200 text-xs leading-relaxed">{fact.fact}</p>
          <p className="text-gray-500 text-xs mt-2 italic">Source: {fact.source}</p>
          {relatedLesson && (
            <div className="mt-3 border-t border-yellow-700 pt-2">
              <p className="text-retro-cyan text-xs font-semibold">Related Lesson: {relatedLesson.title}</p>
              <p className="text-gray-300 text-xs">{relatedLesson.desc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

