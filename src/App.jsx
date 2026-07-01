import React, { useState, useEffect } from 'react';

// Example Mock Dataset mimicking your Football API sync structure
const INITIAL_MATCHES = [
  {
    id: "m80",
    homeTeam: "England",
    awayTeam: "DR Congo",
    round: "ROUND OF 32",
    kickoffTime: "2026-07-01T20:00:00+04:00", // local user timezone (UAE)
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
    status: "FINISHED" // Handled automatically by the wrapper
  }
];

export default function AMCSPredictor() {
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Automated Update Engine: Evaluates match expiration statuses every 10 seconds 
  // without needing a code push or manual page refresh.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); 

    return () => clearInterval(timer);
  }, []);

  // Quick Wrapper: Dynamically filters out finished games and those past kickoff
  const openPredictionMatches = matches.filter((match) => {
    const isFinished = match.status === 'FINISHED';
    const isPastKickoff = currentTime > new Date(match.kickoffTime);
    
    return !isFinished && !isPastKickoff;
  });

  const handlePredictionOpen = (matchId) => {
    // Open Telegram WebApp / Mini App internal popup or overlay here
    console.log(`Opening prediction sheet for match: ${matchId}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans">
      <header className="mb-6">
        <h1 className="text-xl font-black text-emerald-400 tracking-wider">AMCS PREDICTOR</h1>
        <p className="text-xs text-gray-400">Live Prediction Window</p>
      </header>

      <div className="space-y-4">
        {openPredictionMatches.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No open prediction pools available right now.
          </div>
        ) : (
          openPredictionMatches.map((match) => (
            <div 
              key={match.id} 
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-500 text-xs font-bold tracking-wide uppercase">
                  {match.round}
                </span>
                <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                  {new Date(match.kickoffTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>

              <div className="flex justify-around items-center my-2 text-center">
                <div className="w-1/3 font-medium text-sm">{match.homeTeam}</div>
                <div className="text-gray-600 text-xs font-bold">VS</div>
                <div className="w-1/3 font-medium text-sm">{match.awayTeam}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-end">
                <button 
                  onClick={() => handlePredictionOpen(match.id)}
                  className="px-4 py-1.5 bg-emerald-500 text-slate-950 rounded-lg text-xs font-black tracking-wider uppercase hover:bg-emerald-400 active:scale-95 transition-all"
                >
                  OPEN
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}