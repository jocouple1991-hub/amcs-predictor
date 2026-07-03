import React, { useState, useEffect } from 'react';

// Team Logo Registry
const TEAM_LOGOS = {
  "Switzerland": "🇨🇭", "Algeria": "🇩🇿", 
  "Australia": "🇦🇺", "Egypt": "🇪🇬", 
  "Argentina": "🇦🇷", "Cape Verde": "🇨🇻",
  "Colombia": "🇨🇴", "Ghana": "🇬🇭",
};
const FIXTURES = [
  { id: "wc-85", teamA: "Switzerland", teamB: "Algeria", kickoffTime: "2026-07-03T07:00:00+04:00" },
  { id: "wc-86", teamA: "Australia", teamB: "Egypt", kickoffTime: "2026-07-03T22:00:00+04:00" },
  { id: "wc-87", teamA: "Argentina", teamB: "Cape Verde", kickoffTime: "2026-07-04T02:00:00+04:00" },
  { id: "wc-88", teamA: "Colombia", teamB: "Ghana", kickoffTime: "2026-07-04TT05:00:00+04:00" }
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
    </div>
  );
}