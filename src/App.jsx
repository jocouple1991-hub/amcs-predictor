import React, { useState, useEffect } from 'react';

const INITIAL_MATCHES = [
  {
    id: "m80",
    homeTeam: "England",
    awayTeam: "DR Congo",
    round: "ROUND OF 32",
    kickoffTime: "2026-07-01T20:00:00+04:00", 
    status: "SCHEDULED"
  },
  {
    id: "m81",
    homeTeam: "United States",
    awayTeam: "Bosnia and Herzegovina",
    round: "ROUND OF 32",
    kickoffTime: "2026-07-02T04:00:00+04:00",
    status: "SCHEDULED"
  },
  {
    id: "m82",
    homeTeam: "Belgium",
    awayTeam: "Senegal",
    round: "ROUND OF 32",
    kickoffTime: "2026-07-02T00:00:00+04:00",
    status: "SCHEDULED"
  },
  {
    id: "m79",
    homeTeam: "Mexico",
    awayTeam: "Ecuador",
    round: "ROUND OF 32",
    kickoffTime: "2026-07-01T06:00:00+04:00", 
    status: "FINISHED" // Disappears automatically!
  }
];

export default function App() {
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPredictions, setSelectedPredictions] = useState({});
  const [activeMatchTab, setActiveMatchTab] = useState(null);

  // Auto-refresh match checking loop every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); 
    return () => clearInterval(timer);
  }, []);

  // Quick Wrapper: Hide matches that are already finished or past kickoff
  const openMatches = matches.filter((match) => {
    return match.status !== 'FINISHED' && currentTime < new Date(match.kickoffTime);
  });

  const handleSelectStrategy = (matchId, strategy) => {
    setSelectedPredictions(prev => ({
      ...prev,
      [matchId]: strategy
    }));
    alert(`Prediction saved: ${strategy}!`);
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 p-4 font-sans selection:bg-emerald-500/30">
      {/* Header Layout */}
      <header className="mb-6 flex justify-between items-center bg-[#0d1726] p-4 rounded-xl border border-slate-800/60 shadow-xl">
        <div>
          <h1 className="text-xl font-black text-emerald-400 tracking-wider">AMCS Predictor</h1>
          <p className="text-xs text-gray-400 font-medium">FIFA World Cup 2026 Live Automation</p>
        </div>
        <div className="bg-[#132238] border border-slate-700/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-inner">
          <span className="text-sm font-black text-emerald-400">🏆 0 PTS</span>
        </div>
      </header>

      {/* Match Grid Layout */}
      <div className="space-y-4">
        {openMatches.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm border border-dashed border-slate-800 rounded-xl">
            No live prediction pools available right now.
          </div>
        ) : (
          openMatches.map((match) => (
            <div 
              key={match.id} 
              className="bg-[#0e1726] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col transition-all duration-300"
            >
              {/* Card Meta */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">
                  {match.round}
                </span>
                <span className="text-xs bg-[#17283f] text-emerald-400 px-2.5 py-1 rounded-full font-bold shadow-sm">
                  {new Date(match.kickoffTime).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                </span>
              </div>

              {/* Match Details Layout */}
              <div className="grid grid-cols-3 items-center text-center my-2">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-base tracking-wide text-white">{match.homeTeam}</span>
                  <span className="text-[10px] text-gray-500 font-semibold uppercase mt-0.5">Home</span>
                </div>
                
                <div className="bg-[#121f33] border border-slate-800 rounded-xl py-2 px-3 mx-auto flex flex-col justify-center min-w-[70px]">
                  <span className="text-xs font-black text-gray-400">VS</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-bold text-base tracking-wide text-white">{match.awayTeam}</span>
                  <span className="text-[10px] text-gray-500 font-semibold uppercase mt-0.5">Away</span>
                </div>
              </div>

              {/* Prediction Action Bar */}
              <div className="mt-5 pt-4 border-t border-slate-800/50 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Your Prediction Strategy</span>
                  <button 
                    onClick={() => setActiveMatchTab(activeMatchTab === match.id ? null : match.id)}
                    className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-black tracking-wider uppercase hover:bg-emerald-500 hover:text-slate-950 transition-all duration-200"
                  >
                    {activeMatchTab === match.id ? 'Close' : 'Open'}
                  </button>
                </div>

                {/* Prediction Strategy Keys (Visible when Open is toggled) */}
                {activeMatchTab === match.id && (
                  <div className="grid grid-cols-3 gap-2.5 animate-fadeIn">
                    {['Home Win', 'Draw', 'Away Win'].map((strategy) => {
                      const isSelected = selectedPredictions[match.id] === strategy;
                      return (
                        <button
                          key={strategy}
                          onClick={() => handleSelectStrategy(match.id, strategy)}
                          className={`py-2.5 px-2 text-xs font-extrabold rounded-xl border transition-all duration-150 ${
                            isSelected
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 scale-[0.98]'
                              : 'bg-[#122035] border-slate-800 text-gray-300 hover:bg-[#172842] hover:border-slate-700'
                          }`}
                        >
                          {strategy}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}