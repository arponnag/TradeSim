// Component to show milestone achievements
import { useState, useEffect } from 'react';

export default function ProgressMilestone({ netWorth = 0, age = 22, questionNumber = 1, totalQuestions = 35 }) {
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestone, setMilestone] = useState(null);

  const [milestoneFlags, setMilestoneFlags] = useState({
    millionaire: false,
    halfMillion: false,
    hundredK: false,
    halfway: false
  });

  useEffect(() => {
    // Check for milestones (use session-based tracking, not localStorage)
    let newMilestone = null;
    
    if (netWorth >= 1000000 && !milestoneFlags.millionaire) {
      newMilestone = {
        title: 'MILLIONAIRE!',
        message: `You've reached $1,000,000!`,
        icon: '***',
        color: 'text-yellow-400'
      };
      setMilestoneFlags(prev => ({ ...prev, millionaire: true }));
    } else if (netWorth >= 500000 && !milestoneFlags.halfMillion) {
      newMilestone = {
        title: 'Half Million!',
        message: `You've reached $500,000!`,
        icon: '***',
        color: 'text-green-400'
      };
      setMilestoneFlags(prev => ({ ...prev, halfMillion: true }));
    } else if (netWorth >= 100000 && !milestoneFlags.hundredK) {
      newMilestone = {
        title: 'Six Figures!',
        message: `You've reached $100,000!`,
        icon: '***',
        color: 'text-cyan-400'
      };
      setMilestoneFlags(prev => ({ ...prev, hundredK: true }));
    } else if (questionNumber === Math.floor(totalQuestions / 2) && !milestoneFlags.halfway) {
      newMilestone = {
        title: 'Halfway There!',
        message: `You're halfway through your journey!`,
        icon: '***',
        color: 'text-cyan-400'
      };
      setMilestoneFlags(prev => ({ ...prev, halfway: true }));
    }

    if (newMilestone) {
      setMilestone(newMilestone);
      setShowMilestone(true);
      setTimeout(() => setShowMilestone(false), 4000);
    }
  }, [netWorth, questionNumber, totalQuestions, milestoneFlags]);

  if (!showMilestone || !milestone) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-black border-4 border-cyan-500 p-6 rounded-lg shadow-2xl">
        <div className="text-center">
          <div className="text-5xl mb-2">{milestone.icon}</div>
          <h3 className={`text-2xl font-bold ${milestone.color} mb-2 retro-glow`}>
            {milestone.title}
          </h3>
          <p className="text-retro-green">{milestone.message}</p>
        </div>
      </div>
    </div>
  );
}

