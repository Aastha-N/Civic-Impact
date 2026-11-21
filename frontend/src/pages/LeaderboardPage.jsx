import React, { useState, useEffect } from 'react';
import { pointsAPI } from '../services/api';
import {
  Trophy,
  Award,
  Medal,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeframe, setTimeframe] = useState('overall'); // 'overall' | 'month'
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  useEffect(() => {
    pointsAPI.getRules().then((res) => {
      if (res.data.success) setRules(res.data.rules);
    });
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await pointsAPI.getLeaderboard({ timeframe });
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Trophy size={14} className="text-emerald-700" />
          <span>Community Impact Leaderboard</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Citizen Sustainability Champions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Recognizing active citizens contributing to clean neighborhoods and circular waste segregation.
        </p>

        {/* Timeframe Toggle */}
        <div className="pt-2 flex justify-center">
          <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setTimeframe('overall')}
              className={`px-4 py-1.5 rounded-xl transition ${
                timeframe === 'overall'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All-Time Ranking
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-4 py-1.5 rounded-xl transition ${
                timeframe === 'month'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Month
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Compiling Community Scores..." />
      ) : (
        <>
          {/* Top 3 Podium */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {/* Silver (#2) */}
              {topThree[1] && (
                <div className="order-2 sm:order-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-2 relative flex flex-col justify-end">
                  <div className="w-14 h-14 rounded-2xl bg-slate-200 text-slate-700 font-extrabold text-2xl flex items-center justify-center mx-auto shadow-sm">
                    🥈
                  </div>
                  <span className="text-xs font-bold text-slate-400">Rank #2</span>
                  <h3 className="text-sm font-bold text-slate-900 truncate">{topThree[1].name}</h3>
                  <div className="pt-1">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-black rounded-full inline-block">
                      🌱 {topThree[1].green_points} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{topThree[1].activity_count} civic actions</p>
                </div>
              )}

              {/* Gold (#1) */}
              {topThree[0] && (
                <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-500/10 via-white to-white rounded-3xl p-8 border-2 border-amber-400 shadow-xl text-center space-y-3 relative transform sm:-translate-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 font-black text-3xl flex items-center justify-center mx-auto shadow-md">
                    👑
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider inline-block">
                    #1 Grand Champion
                  </span>
                  <h3 className="text-base font-black text-slate-900 truncate">{topThree[0].name}</h3>
                  <div className="pt-1">
                    <span className="px-4 py-1.5 bg-emerald-600 text-white text-sm font-black rounded-full shadow-xs inline-block">
                      🌱 {topThree[0].green_points} Green Points
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {topThree[0].activity_count} verified contributions
                  </p>
                </div>
              )}

              {/* Bronze (#3) */}
              {topThree[2] && (
                <div className="order-3 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-2 relative flex flex-col justify-end">
                  <div className="w-14 h-14 rounded-2xl bg-amber-700/20 text-amber-900 font-extrabold text-2xl flex items-center justify-center mx-auto shadow-sm">
                    🥉
                  </div>
                  <span className="text-xs font-bold text-slate-400">Rank #3</span>
                  <h3 className="text-sm font-bold text-slate-900 truncate">{topThree[2].name}</h3>
                  <div className="pt-1">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-black rounded-full inline-block">
                      🌱 {topThree[2].green_points} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{topThree[2].activity_count} civic actions</p>
                </div>
              )}
            </div>
          )}

          {/* Full Leaderboard Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Community Civic Ranking</h3>
              <span className="text-xs text-slate-400">Privacy Protected (No Emails Disclosed)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3.5 w-16 text-center">Rank</th>
                    <th className="p-3.5">Eco Citizen</th>
                    <th className="p-3.5 text-center">Actions Logged</th>
                    <th className="p-3.5 text-right">Total Green Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaderboard.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="p-3.5 text-center font-bold text-slate-700">
                        {item.rank === 1 ? '🥇 1' : item.rank === 2 ? '🥈 2' : item.rank === 3 ? '🥉 3' : `#${item.rank}`}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                            {item.name[0]}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{item.name}</span>
                            <span className="text-[10px] text-slate-400">Verified Citizen</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-center font-semibold text-slate-600">
                        {item.activity_count}
                      </td>
                      <td className="p-3.5 text-right font-black text-emerald-700 text-sm">
                        🌱 {item.green_points} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Points Rules Scheme Guide */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-amber-400" size={18} />
              <h3 className="text-base font-bold">How to Earn Green Points in Civic Impact</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {rules.map((rule, idx) => (
                <div key={idx} className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{rule.activity}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-black text-xs">
                      +{rule.points} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{rule.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
