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
  }
];

// Mock database for global high scores
const MOCK_LEADERBOARD = [
  { rank: 1, name: "Alex_SWE", points: 140, avatar: "🥇" },
  { rank: 2, name: "Jojo_Striker", points: 120, avatar: "🥈" },
  { rank: 3, name: "FootballFan99", points: 90, avatar: "🥉" },
  { rank: 4, name: "CryptoGoal", points: 80, avatar: "⚽" },
  { rank: 5, name: "PredictorPro", points: 50, avatar: "🎯" }
];

export default function App() {
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPredictions, setSelectedPredictions] = useState({});
  const [activeMatchTab, setActiveMatchTab] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  
  // 🟢 View Toggle State: 'matches' or 'leaderboard'
  const [currentView, setCurrentView] = useState('matches');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); 
    return () => clearInterval(timer);
  }, []);

  const openMatches = matches.filter((match) => {
    return match.status !== 'FINISHED' && currentTime < new Date(match.kickoffTime);
  });

  const handleSelectStrategy = (matchId, strategy) => {
    if (selectedPredictions[matchId] === strategy) return;

    setSelectedPredictions(prev => ({
      ...prev,
      [matchId]: strategy
    }));

    setUserPoints(prevPoints => prevPoints + 10);
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 p-4 font-sans pb-24 selection:bg-emerald-500/30">
      
      {/* Dynamic Header */}
      <header className="mb-6 flex justify-between items-center bg-[#0d1726] p-4 rounded-xl border border-slate-800/60 shadow-xl">
        <div>
          <h1 className="text-xl font-black text-emerald-400 tracking-wider">AMCS Predictor</h1>
          <p className="text-xs text-gray-400 font-medium">FIFA World Cup 2026 Live Automation</p>
        </div>
        <div className="bg-[#132238] border border-slate-700/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-inner">
          <span className="text-sm font-black text-emerald-400">🏆 {userPoints} PTS</span>
        </div>
      </header>

      {/* 🟢 VIEW 1: MATCH POOLS */}
      {currentView === 'matches' && (
        <div className="space-y-4">
          {openMatches.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm border border-dashed border-slate-800 rounded-xl">
              No live prediction pools available right now.
            </div>
          ) : (
            openMatches.map((match) => (
              <div key={match.id} className="bg-[#0e1726] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col">
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">{match.round}</span>
                  <span className="text-xs bg-[#17283f] text-emerald-400 px-2.5 py-1 rounded-full font-bold">
                    {new Date(match.kickoffTime).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center text-center my-2">
                  <div>
                    <span className="font-bold text-base text-white">{match.homeTeam}</span>
                    <span className="text-[10px] text-gray-500 font-semibold uppercase block">Home</span>
                  </div>
                  <div className="bg-[#121f33] border border-slate-800 rounded-xl py-2 px-3 mx-auto">
                    <span className="text-xs font-black text-gray-400">VS</span>
                  </div>
                  <div>
                    <span className="font-bold text-base text-white">{match.awayTeam}</span>
                    <span className="text-[10px] text-gray-500 font-semibold uppercase block">Away</span>
                  </div>
                </div>

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

                  {activeMatchTab === match.id && (
                    <div className="grid grid-cols-3 gap-2.5">
                      {['Home Win', 'Draw', 'Away Win'].map((strategy) => {
                        const isSelected = selectedPredictions[match.id] === strategy;
                        return (
                          <button
                            key={strategy}
                            onClick={() => handleSelectStrategy(match.id, strategy)}
                            className={`py-2.5 px-2 text-xs font-extrabold rounded-xl border transition-all duration-150 ${
                              isSelected
                                ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg scale-[0.98]'
                                : 'bg-[#122035] border-slate-800 text-gray-300 hover:bg-[#172842]'
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
      )}

      {/* 🟢 VIEW 2: LEADERBOARD SCREEN */}
      {currentView === 'leaderboard' && (
        <div className="bg-[#0e1726] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <div className="mb-4 text-center">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">Global Leaderboard</h2>
            <p className="text-xs text-gray-400">Top accurate predictors this tournament phase</p>
          </div>

          <div className="space-y-2.5">
            {/* Dynamic Card highlighting the active user's current rank entry */}
            <div className="bg-[#16273f] border border-emerald-500/30 rounded-xl p-3 flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-emerald-400">#--</span>
                <span className="text-sm font-bold text-white">You (Live Score)</span>
              </div>
              <span className="text-sm font-black text-emerald-400">{userPoints} PTS</span>
            </div>

            <hr className="border-slate-800/60 my-3" />

            {/* High-scorers list mapping loop */}
            {MOCK_LEADERBOARD.map((player) => (
              <div key={player.rank} className="bg-[#111c2e] border border-slate-800/50 rounded-xl p-3 flex justify-between items-center transition-all">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center text-sm font-black text-gray-400">{player.avatar}</span>
                  <span className="text-sm font-medium text-slate-200">{player.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-300">{player.points} PTS</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🟢 FIXED FOOTER NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0d1726]/95 backdrop-blur-md border-t border-slate-800/80 px-6 py-3 flex justify-around items-center z-50 shadow-2xl">
        <button 
          onClick={() => setCurrentView('matches')}
          className={`flex flex-col items-center gap-1 transition-all duration-150 ${
            currentView === 'matches' ? 'text-emerald-400 scale-105 font-bold' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <span className="text-lg">⚽</span>
          <span className="text-[10px] tracking-wide uppercase font-black">Predictions</span>
        </button>

        <button 
          onClick={() => setCurrentView('leaderboard')}
          className={`flex flex-col items-center gap-1 transition-all duration-150 ${
            currentView === 'leaderboard' ? 'text-emerald-400 scale-105 font-bold' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <span className="text-lg">📊</span>
          <span className="text-[10px] tracking-wide uppercase font-black">Leaderboard</span>
        </button>
      </nav>

    </div>
  );
}