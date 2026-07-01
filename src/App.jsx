import React, { useState, useEffect } from 'react';

// RapidAPI Target Configuration
const API_ENDPOINT = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?league=1&season=2026'; 
const RAPIDAPI_KEY = '0306fc109cmsh176143d024577dcp117909jsn9173c96d39c4';
const RAPIDAPI_HOST = 'api-football-v1.p.rapidapi.com';

export default function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPredictions, setSelectedPredictions] = useState({});
  const [activeMatchTab, setActiveMatchTab] = useState(null);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    async function syncFixtures() {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINT, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`API Connection Failed: ${response.status}`);
        }

        const json = await response.json();
        
        // Handle variations between direct arrays and RapidAPI's standard response structure
        const targetList = json.response || json.fixtures || (Array.isArray(json) ? json : []);
        const currentTime = new Date();

        // 100% Automated Filter Pipeline
        const openPools = targetList
          .map((item, index) => {
            // Mapping check to handle RapidAPI's nested object formatting safely
            const fixture = item.fixture || item;
            const teams = item.teams || {};
            const league = item.league || {};

            return {
              id: fixture.id || `match-${index}`,
              homeTeam: teams.home?.name || fixture.HomeTeamName || "Home Team",
              awayTeam: teams.away?.name || fixture.AwayTeamName || "Away Team",
              round: league.round || fixture.Group || "ROUND OF 32",
              kickoffTime: fixture.date || fixture.DateTime || fixture.Date,
              status: fixture.status?.short || fixture.Status || "NS"
            };
          })
          .filter((match) => {
            if (!match.kickoffTime) return false;
            const kickoff = new Date(match.kickoffTime);
            
            // Filters out past games or statuses matching finished criteria (FT, AET, PEN)
            const isFinished = ['FT', 'AET', 'PEN', 'FINISHED'].includes(match.status);
            return !isFinished && currentTime < kickoff;
          });

        setMatches(openPools);
        setError(null);
      } catch (err) {
        console.error("Automation Sync Error:", err);
        setError("Synchronization Error: Failed to authenticate or map live streaming endpoints.");
      } finally {
        setLoading(false);
      }
    }

    syncFixtures();
    
    // Automatic cleanup processing interval loop
    const liveInterval = setInterval(syncFixtures, 60000);
    return () => clearInterval(liveInterval);
  }, []);

  const handleSelectStrategy = (matchId, strategy) => {
    if (selectedPredictions[matchId] === strategy) return;

    setSelectedPredictions(prev => ({
      ...prev,
      [matchId]: strategy
    }));

    setUserPoints(prevPoints => prevPoints + 10);
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 p-4 font-sans selection:bg-emerald-500/30">
      
      <header className="mb-6 flex justify-between items-center bg-[#0d1726] p-4 rounded-xl border border-slate-800/60 shadow-xl">
        <div>
          <h1 className="text-xl font-black text-emerald-400 tracking-wider">AMCS Predictor</h1>
          <p className="text-xs text-gray-400 font-medium">FIFA World Cup 2026 Live Automation</p>
        </div>
        <div className="bg-[#132238] border border-slate-700/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-inner">
          <span className="text-sm font-black text-emerald-400">🏆 {userPoints} PTS</span>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-widest">Validating Authentication Keys...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 px-4 border border-red-500/20 bg-red-500/5 rounded-xl text-red-400 text-sm max-w-md mx-auto">
          {error}
          <p className="text-[11px] text-red-500/70 mt-2">
            Confirm that your custom API endpoint parameters match your current RapidAPI plan criteria.
          </p>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm border border-dashed border-slate-800 rounded-xl max-w-md mx-auto">
          <span className="text-3xl block mb-2">⚽</span>
          No upcoming match prediction pools available right now.
        </div>
      ) : (
        <div className="space-y-4 max-w-md mx-auto">
          {matches.map((match) => (
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
                  <span className="text-[10px] text-gray-500 font-semibold uppercase block mt-0.5">Home</span>
                </div>
                <div className="bg-[#121f33] border border-slate-800 rounded-xl py-2 px-3 mx-auto min-w-[70px]">
                  <span className="text-xs font-black text-gray-400">VS</span>
                </div>
                <div>
                  <span className="font-bold text-base text-white">{match.awayTeam}</span>
                  <span className="text-[10px] text-gray-500 font-semibold uppercase block mt-0.5">Away</span>
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
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg'
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
          ))}
        </div>
      )}
    </div>
  );
}