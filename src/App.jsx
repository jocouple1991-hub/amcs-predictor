import React, { useState, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Team Logo Registry
const TEAM_LOGOS = {
  "United States": "🇺🇸", "Bosnia": "🇧🇦", "Spain": "🇪🇸", 
  "Austria": "🇦🇹", "Portugal": "🇵🇹", "Croatia": "🇭🇷"
};

const FIXTURES = [
  { id: "wc-81", teamA: "United States", teamB: "Bosnia", kickoffTime: "2026-07-02T04:00:00+04:00" },
  { id: "wc-84", teamA: "Spain", teamB: "Austria", kickoffTime: "2026-07-02T23:00:00+04:00" },
  { id: "wc-83", teamA: "Portugal", teamB: "Croatia", kickoffTime: "2026-07-03T03:00:00+04:00" }
];

export default function App() {
  const [matches, setMatches] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    // Automated cleanup: Only show matches that have not yet started
    const updateMatches = () => {
      const now = new Date();
      setMatches(FIXTURES.filter(m => new Date(m.kickoffTime) > now));
    };
    
    updateMatches();
    const interval = setInterval(updateMatches, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handlePrediction = (matchId, choice) => {
    // Prediction logic is prepared for future DB integration
    console.log(`Prediction saved: ${choice} for match ${matchId}`);
    alert(`Prediction saved! Points will be awarded if correct after the match ends.`);
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-white p-4 font-sans">
      <header className="flex justify-between items-center mb-8 p-4 bg-[#0d1726] rounded-xl border border-slate-800">
        <h1 className="font-black text-emerald-400">AMCS Predictor</h1>
        <div className="text-sm font-bold">🏆 {userPoints} PTS</div>
      </header>

      <div className="space-y-4">
        {matches.map(m => (
          <div key={m.id} className="bg-[#0e1726] p-5 rounded-2xl border border-slate-800">
            {/* Country Logos and Team Display */}
            <div className="flex justify-between items-center mb-6 px-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">{TEAM_LOGOS[m.teamA] || "⚽"}</span>
                <span className="font-bold text-xs">{m.teamA}</span>
              </div>
              <span className="text-slate-600 font-black">VS</span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">{TEAM_LOGOS[m.teamB] || "⚽"}</span>
                <span className="font-bold text-xs">{m.teamB}</span>
              </div>
            </div>

            {/* Win-Draw-Win Prediction Layout */}
            <div className="grid grid-cols-3 gap-2">
              {['WIN', 'DRAW', 'WIN'].map((type, i) => (
                <button 
                  key={i}
                  onClick={() => handlePrediction(m.id, type)}
                  className="bg-[#122035] py-3 rounded-lg text-xs font-bold border border-slate-700 hover:border-emerald-500 transition-all"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <SpeedInsights />
    </div>
  );
}