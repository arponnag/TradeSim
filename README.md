# 🎮 TradeSim - Financial Literacy Game

An interactive, gamified financial education platform that teaches lifelong investing through engaging gameplay. Experience 30 years of financial decisions in just minutes across multiple game modes.

## 🎯 Overview

TradeSim gamifies financial literacy by letting players experience real-world financial scenarios in a safe, educational environment. Players start at age 22 with $5,000 and navigate through life events (jobs, emergencies, market crashes) while making investment choices that teach core financial principles.

## ✨ Features

### Game Modes

- **Story Mode**: 5 levels with 7 randomized questions per level, covering ages 22-52
- **Battle Mode**: 2-player competitive mode with 3 levels and timed questions
- **Kcoin Story**: Branching narrative scenario with real-time price simulation and behavioral feedback

### Core Features

- **Realistic Finance Engine**: Monthly salary deposits, debt compounding, market volatility
- **Dynamic Difficulty**: Higher levels introduce black-swan events, expense inflation, and riskier choices
- **Educational Feedback**: End-of-level summaries with personalized advice
- **Badge System**: Track achievements and learning milestones
- **Portfolio Visualization**: Real-time charts showing net worth progression
- **Retro UI**: Pixel-art aesthetic with character avatars

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16.x or higher
- **npm** 8.x or higher (comes with Node.js)

### Installation

1. **Clone or download the repository**
   ```bash
   cd TradeSim
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:7971`
   - The game will automatically open in your default browser

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The production build will be in the `dist/` folder, ready for deployment.

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite and configure settings

3. **Deploy**
   - Click "Deploy" - your site will be live in seconds!

### Deploy to Netlify

1. **Install Netlify CLI** (optional)
   ```bash
   npm i -g netlify-cli
   ```

2. **Build and deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `dist/` folder to any static hosting service:
   - GitHub Pages
   - AWS S3 + CloudFront
   - Firebase Hosting
   - Any web server

## 🎮 How to Play

1. **Start Game**: Enter your name and select a starting scenario
2. **Choose Mode**: Select Story Mode, Battle Mode, or Kcoin Story
3. **Make Decisions**: Answer financial questions and make investment choices
4. **Watch Your Portfolio**: See your net worth grow (or shrink) in real-time
5. **Learn**: Receive feedback and tips at the end of each level
6. **Complete**: Finish all levels and see your final financial outcome

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Styling**: Tailwind CSS 3.3.6
- **Charts**: Chart.js 4.4.0
- **Animations**: react-confetti 6.1.0

## 📁 Project Structure

```
TradeSim/
├── src/
│   ├── components/      # React UI components
│   ├── core/            # Financial engine & game rules
│   ├── modes/           # Game mode implementations
│   ├── utils/           # Helper functions
│   ├── knowledge/       # Educational content
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── public/              # Static assets
│   └── backgrounds/     # Background images
├── docs/                # Architecture documentation
│   ├── CODE_ARCHITECTURE_QA.md
│   └── FRONTEND_BACKEND_ARCHITECTURE.md
├── index.html           # HTML template
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

> **Note**: Detailed architecture documentation is available in the `docs/` folder for developers.

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server (port 7971)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Troubleshooting

**Issue: Stale bundles or cache problems**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
# On Windows:
rmdir /s node_modules\.vite

# Reinstall and restart
npm install
npm run dev
```

**Issue: Port 7971 already in use**
- Change the port in `vite.config.js` or kill the process using port 7971

## 📚 Educational Content

TradeSim teaches:
- **Compound Interest**: How money grows over time
- **Diversification**: Spreading risk across investments
- **Emergency Funds**: Importance of cash reserves
- **Debt Management**: Understanding credit card interest
- **Market Volatility**: Realistic market ups and downs
- **Sequence Risk**: Timing of market events matters
- **Behavioral Finance**: Emotional decision-making pitfalls

## 🎯 Learning Outcomes

After playing TradeSim, users will understand:
- How compound interest works
- Why starting early matters
- The importance of emergency funds
- How debt compounds and impacts wealth
- Market volatility and recovery patterns
- Risk management strategies

## 🤝 Contributing

This project is built by NCTBytes, a HKU Student-led group. For contributions:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

All rights reserved by NCTBytes, a HKU Student-led group.

## 🙏 Acknowledgments

Built for hackathon demonstration. Designed to be educational and engaging for Gen Z non-investors (ages 18-25).

## 🐛 Known Issues

- Game state resets on page refresh (intentional for MVP)
- No save/load functionality (can be added with localStorage)
- No user accounts or leaderboards (future feature)

## 🔮 Future Enhancements

- User accounts and progress tracking
- Leaderboards and social features
- Real-time market data integration
- Additional game scenarios
- Mobile app version
- Multiplayer features

---

**Need Help?** Check the code comments or open an issue on GitHub.
