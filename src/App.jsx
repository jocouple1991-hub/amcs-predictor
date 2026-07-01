import React, { useState, useEffect } from 'react';

// Replace this with your actual Sports Data Provider base endpoint if different
const API_ENDPOINT = 'https://api.sportsdata.io/v4/soccer/scores/json/Fixtures/1019'; 
const API_KEY = 'YOUR_API_KEY_HERE'; // Drop your integrated API token here

export default function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPredictions, setSelectedPredictions] = useState({});
  const [activeMatchTab, setActiveMatchTab] = useState(null);
  const [userPoints, setUserPoints] = useState(0);

  // Automated Synchronization Engine
  useEffect(() => {
    async function syncFixtures() {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINT, {
          headers: {
            'Ocp-Apim-Subscription-Key': API_KEY, // Standard header for sports data providers
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`API returned status code ${response.status}`);
        }

        const data = await response.json();
        const currentTime = new Date();

        // 100% Automated Filter Pipeline:
        // Parse incoming fixtures and ONLY keep matches where the kickoff time is in the future
        const openPools = data
          .map((fixture, index) => ({
            id: fixture.MatchId || `fixture-${index}`,
            homeTeam: fixture.HomeTeamName || fixture.HomeTeam,
            awayTeam: fixture.AwayTeamName || fixture.AwayTeam,
            round: fixture.Group || "ROUND OF 32",
            // Convert incoming API timestamp to standard ISO/Local date object
            kickoffTime: fixture.DateTime || fixture.Date, 
            status: fixture.Status || "SCHEDULED"
          }))
          .filter((match) => {
            if (!match.kickoffTime) return false;
            const kickoff = new Date(match.kickoffTime);
            // Must be scheduled, not finished, and kickoff hasn't happened yet
            return match.status !== 'FINISHED' && currentTime < kickoff;
          });

        setMatches(openPools);
        setError(null);
      } catch (err) {
        console.error("Automation Sync Error:", err);
        setError("Unable to sync live match data streams. Please check your API configuration.");
      } finally {
        setLoading(false);
      }
    }

    syncFixtures();
    
    // Auto-refresh the system layout every 60 seconds to clean out kicked-off matches hands-free
    const liveInterval = setInterval(syncFixtures, 60000);
    return () => clearInterval(liveInterval);
  }, []);

  const handleSelectStrategy = (matchId, strategy) => {
    if (selectedPredictions[matchId] === strategy) return;

    setSelectedPredictions(prev => ({
      ...prev,
      [matchId]: strategy
    }));

    // Local state tracking for immediate user visual feedback
    setUserPoints(prevPoints => prevPoints + 10);
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 p-4 font-sans selection:bg-emerald-500/30">
      
      {/* Dynamic Native Mini App Header */}
      <header className="mb-6 flex justify-between items-center bg-[#0d1726] p-4 rounded-xl border border-slate-800/60 shadow-xl">
        <div>
          <h1 className="text-xl font-black text-emerald-400 tracking-wider">AMCS Predictor</h1>
          <p className="text-xs text-gray-400 font-medium">FIFA World Cup 2026 Live Automation</p>
        </div>
        <div className="bg-[#132238] border border-slate-700/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-inner">
          <span className="text-sm font-black text-emerald-400">🏆 {userPoints} PTS</span>
        </div>
      </header>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-widest">Connecting Live Match Feeds...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 px-4 border border-red-500/20 bg-red-500/5 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm border border-dashed border-slate-800 rounded-xl max-w-md mx-auto">
          <span className="text-3xl block mb-2">⚽</span>
          No upcoming match prediction pools available right now. 
          <p className="text-xs text-gray-600 mt-1">Check back closer to the next fixture round!</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-md mx-auto">
          {matches.map((match) => (
            <div 
              key={match.id} 
              className="bg-[#0e1726] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col transition-all duration-300"
            >
              {/* Card Meta details fetched live */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">
                  {match.round}
                </span>
                <span className="text-xs bg-[#17283f] text-emerald-400 px-2.5 py-1 rounded-full font-bold shadow-sm">
                  {new Date(match.kickoffTime).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                </span>
              </div>

              {/* Grid Layout mapping Team Names dynamically */}
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

              {/* Strategy Drawer Engine */}
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

                {/* Strategy Option Keys Grid */}
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
          ))}
        </div>
      )}
    </div>
  );
}