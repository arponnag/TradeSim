import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SimulatorDashboard({ portfolio = { cash: 0, stocks: 0, debt: 0 }, netWorthHistory = [0], age = 22 }) {
  const [benchmark, setBenchmark] = React.useState(null);
  React.useEffect(() => {
    // Try LifeSim path first, then fallback to old Investiverse path
    fetch('/lifesim/benchmark.json')
      .then(r => r && r.ok ? r.json() : null)
      .then(data => data || fetch('/investiverse/benchmark.json').then(r => r && r.ok ? r.json() : null))
      .then(data => {
        if (!data || !Array.isArray(data.values)) return;
        // Normalize benchmark to start at player's starting net worth
        const start = netWorthHistory && netWorthHistory.length > 0 ? Math.max(1, netWorthHistory[0]) : 1000;
        const b0 = Math.max(1, data.values[0] || 100);
        const scaled = data.values.map(v => (v / b0) * start);
        // Resample to match history length
        const resampled = [];
        for (let i = 0; i < netWorthHistory.length; i++) {
          const idx = Math.floor((i / Math.max(1, netWorthHistory.length - 1)) * (scaled.length - 1));
          resampled.push(Math.round(scaled[idx]));
        }
        setBenchmark({ label: data.label || 'Benchmark', values: resampled });
      })
      .catch(() => {});
  }, [netWorthHistory]);
  // Calculate average growth rate per period
  // REALISTIC: Show -20% to +30% per period
  // Each period represents 2-3 years, so we need realistic calculations
  let growthRate = 0;
  if (netWorthHistory.length > 1 && netWorthHistory[0] > 0) {
    const startValue = netWorthHistory[0];
    const endValue = netWorthHistory[netWorthHistory.length - 1];
    const periods = netWorthHistory.length - 1;
    
    if (periods > 0) {
      // Calculate period-over-period average growth (handles both gains and losses)
      let totalGrowth = 0;
      let validPeriods = 0;
      
      for (let i = 1; i < netWorthHistory.length; i++) {
        if (netWorthHistory[i - 1] > 0) {
          // Calculate growth (can be positive or negative)
          const periodGrowth = ((netWorthHistory[i] / netWorthHistory[i - 1]) - 1) * 100;
          // Cap individual period growth at realistic bounds: -20% to +30%
          // Prevent outliers and reflect target band
          totalGrowth += Math.max(-20, Math.min(30, periodGrowth));
          validPeriods++;
        }
      }
      
      if (validPeriods > 0) {
        const avgGrowth = totalGrowth / validPeriods;
        // Cap final average at realistic range: -20% to +30%
        growthRate = Math.max(-20, Math.min(30, avgGrowth)).toFixed(1);
      } else {
        // Fallback: use CAGR if period-over-period calculation fails
        const ratio = endValue / startValue;
        const cagr = (Math.pow(ratio, 1 / periods) - 1) * 100;
        growthRate = Math.max(-20, Math.min(30, cagr)).toFixed(1);
      }
    }
  }

  const chartData = {
    labels: netWorthHistory.map((_, index) => {
      const startAge = age - (netWorthHistory.length - 1 - index) * 2;
      return `Age ${startAge}`;
    }),
    datasets: [
      {
        label: 'Net Worth',
        data: netWorthHistory,
        borderColor: '#00ff00',
        backgroundColor: 'rgba(0, 255, 0, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: netWorthHistory.length > 10 ? 2 : 4,
        pointBackgroundColor: '#00ff00',
        pointBorderColor: '#00ffff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
      ...(benchmark ? [{
        label: benchmark.label,
        data: benchmark.values,
        borderColor: '#8888ff',
        backgroundColor: 'rgba(136,136,255,0.05)',
        borderDash: [6, 4],
        fill: false,
        tension: 0.2,
        pointRadius: 0,
      }] : [])
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#00ff00',
        borderWidth: 1,
        padding: 12,
        titleColor: '#00ff00',
        bodyColor: '#00ffff',
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            const change = context.parsedIndex > 0 && netWorthHistory[context.parsedIndex - 1] > 0
              ? ((value / netWorthHistory[context.parsedIndex - 1] - 1) * 100).toFixed(1)
              : 0;
            return [
              `Net Worth: $${value.toLocaleString()}`,
              context.parsedIndex > 0 ? `Change: ${change > 0 ? '+' : ''}${change}%` : 'Starting point'
            ];
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          color: '#00ff00',
          font: {
            size: 10
          },
          callback: function(value) {
            if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
            if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'K';
            return '$' + value.toLocaleString();
          },
        },
        grid: {
          color: 'rgba(0, 255, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#00ffff',
          font: {
            size: 9
          }
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const totalPortfolio = Math.max(0, portfolio.cash + Math.max(0, portfolio.stocks));
  const stockPercentage = totalPortfolio > 0 && portfolio.stocks > 0 
    ? ((Math.max(0, portfolio.stocks) / totalPortfolio) * 100).toFixed(1) 
    : 0;
  
  // Calculate portfolio health indicator
  const getPortfolioHealth = () => {
    if (stockPercentage >= 70) return { text: 'Aggressive', color: 'text-yellow-400', bg: 'bg-yellow-900 bg-opacity-30' };
    if (stockPercentage >= 50) return { text: 'Balanced', color: 'text-green-400', bg: 'bg-green-900 bg-opacity-30' };
    if (stockPercentage >= 20) return { text: 'Conservative', color: 'text-cyan-400', bg: 'bg-cyan-900 bg-opacity-30' };
    return { text: 'Very Conservative', color: 'text-gray-400', bg: 'bg-gray-900 bg-opacity-30' };
  };
  
  const health = getPortfolioHealth();

  return (
    <div className="retro-card scanlines p-6 relative z-20 h-full flex flex-col">
      <h3 className="retro-font text-retro-cyan mb-4 retro-glow">Portfolio Dashboard</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black border-2 border-cyan-500 p-4 rounded-lg">
          <p className="text-sm text-retro-cyan mb-1">Cash</p>
          <p className="text-2xl font-bold text-retro-green retro-glow">${portfolio.cash.toLocaleString()}</p>
        </div>
        <div className="bg-black border-2 border-green-500 p-4 rounded-lg">
          <p className="text-sm text-retro-green mb-1">Stocks</p>
          <p className="text-2xl font-bold text-retro-yellow retro-glow">${Math.max(0, portfolio.stocks).toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-retro-green">Total Portfolio</span>
          <span className="font-semibold text-retro-yellow">${totalPortfolio.toLocaleString()}</span>
        </div>
        <div className="w-full bg-black border border-green-500 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${stockPercentage}%`, boxShadow: '0 0 10px #00ff00' }}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-retro-cyan">{stockPercentage}% in stocks</p>
          <span className={`text-xs px-2 py-1 rounded ${health.color} ${health.bg} border border-current`}>
            {health.text}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="bg-black border border-green-500 p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-retro-cyan">Net Worth</span>
            <span className="text-lg font-bold text-retro-green retro-glow">
              ${Math.max(0, (portfolio.cash + portfolio.stocks - portfolio.debt)).toLocaleString()}
            </span>
          </div>
          {parseFloat(growthRate) !== 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-retro-cyan">Avg Growth</span>
              <span className={`text-sm font-bold ${parseFloat(growthRate) > 0 ? 'text-retro-yellow' : 'text-red-400'}`}>
                {parseFloat(growthRate) > 0 ? '+' : ''}{growthRate}%
              </span>
            </div>
          )}
          {portfolio.debt > 0 && (
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-red-500/30">
              <span className="text-xs text-red-400">Debt</span>
              <span className="text-sm font-bold text-red-300">-${portfolio.debt.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-48 flex-1 min-h-[180px] mb-4">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-black border border-cyan-500 p-2 rounded">
          <p className="text-retro-cyan">Age</p>
          <p className="text-retro-green font-bold">{age}</p>
        </div>
        {portfolio.debt > 0 && (
          <div className="bg-black border border-red-500 p-2 rounded">
            <p className="text-red-400">Debt</p>
            <p className="text-red-300 font-bold">${portfolio.debt.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

