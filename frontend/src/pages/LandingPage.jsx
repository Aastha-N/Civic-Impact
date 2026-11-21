import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Trash2,
  Gift,
  MapPin,
  Sparkles,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  Users,
  Leaf,
  ChevronRight
} from 'lucide-react';
import { pointsAPI } from '../services/api';

export const LandingPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [topUsers, setTopUsers] = useState([]);
  const [quickLoginLoading, setQuickLoginLoading] = useState(false);

  useEffect(() => {
    // Load top 3 from leaderboard
    pointsAPI.getLeaderboard({ timeframe: 'overall' })
      .then((res) => {
        if (res.data.success) {
          setTopUsers(res.data.leaderboard.slice(0, 3));
        }
      })
      .catch((err) => console.log('Leaderboard preview load error:', err));
  }, []);

  const handleQuickLogin = async (email, roleRedirect) => {
    try {
      setQuickLoginLoading(true);
      await login(email, 'Password123!');
      navigate(roleRedirect);
    } catch (err) {
      console.error('Quick login failed:', err);
    } finally {
      setQuickLoginLoading(false);
    }
  };

  const features = [
    {
      title: 'Civic Complaint Reporting',
      description: 'Report potholes, broken streetlights, water leaks, and illegal garbage dumps with photos and auto-smart priority.',
      icon: ShieldAlert,
      route: '/complaints',
      color: 'from-amber-500 to-orange-500',
      tag: 'Smart Prioritization'
    },
    {
      title: 'Doorstep Waste Pickup',
      description: 'Schedule scheduled collection of segregated wet, dry, plastic, and electronic waste straight from your home.',
      icon: Trash2,
      route: '/pickup',
      color: 'from-emerald-500 to-teal-500',
      tag: 'Doorstep Service'
    },
    {
      title: 'Reuse & Donate Marketplace',
      description: 'Give usable clothes, books, furniture, and electronics a second life by connecting with neighbors in your community.',
      icon: Gift,
      route: '/reuse',
      color: 'from-purple-500 to-indigo-500',
      tag: 'Circular Economy'
    },
    {
      title: '"What Should I Do?" Assistant',
      description: 'Confused about how to handle an item? Ask our smart rule-based advisor for instant segregation and recycling guidance.',
      icon: Sparkles,
      route: '/assistant',
      color: 'from-teal-500 to-cyan-500',
      tag: 'Smart Assistant'
    },
    {
      title: 'Recycling Centres Directory',
      description: 'Explore certified local recycling facilities, opening hours, accepted waste streams, and drop-off guidance.',
      icon: MapPin,
      route: '/recycling',
      color: 'from-blue-500 to-sky-500',
      tag: 'City Directory'
    },
    {
      title: 'Green Points & Leaderboard',
      description: 'Earn points for responsible civic actions, report validations, and donations. Climb the civic leaderboard!',
      icon: Trophy,
      route: '/leaderboard',
      color: 'from-lime-500 to-emerald-500',
      tag: 'Gamification'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Leaf size={14} className="text-emerald-400" />
            <span>Smart City + Waste Management Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Cleaner Streets, <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Smarter Cities</span>, & Empowered Citizens.
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Report civic issues, request waste pickups, donate reusable items, and earn Green Points. An all-in-one platform bridging citizens and municipal service teams.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/complaints/new"
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <ShieldAlert size={18} />
              <span>Report a Civic Problem</span>
            </Link>

            <Link
              to="/assistant"
              className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition"
            >
              <Sparkles size={18} className="text-teal-400" />
              <span>Ask "What Should I Do?"</span>
            </Link>
          </div>

          {/* Quick Demo Roles Bar (Evaluation Friendly) */}
          <div className="pt-8 max-w-3xl mx-auto">
            <div className="p-4 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-center gap-1.5">
                <Zap size={14} className="text-amber-400" />
                <span>Fast Project Evaluation — 1-Click Demo Login</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => handleQuickLogin('citizen1@civicimpact.org', '/dashboard')}
                  disabled={quickLoginLoading}
                  className="px-3 py-2 bg-slate-700/70 hover:bg-emerald-600/30 hover:border-emerald-500/50 border border-slate-600 rounded-xl text-xs font-bold text-slate-200 transition text-center"
                >
                  👤 Login as Citizen
                  <span className="block text-[10px] text-slate-400 font-normal">Amina (310 Pts)</span>
                </button>
                <button
                  onClick={() => handleQuickLogin('service1@civicimpact.org', '/service')}
                  disabled={quickLoginLoading}
                  className="px-3 py-2 bg-slate-700/70 hover:bg-teal-600/30 hover:border-teal-500/50 border border-slate-600 rounded-xl text-xs font-bold text-slate-200 transition text-center"
                >
                  🛠️ Login as Service Team
                  <span className="block text-[10px] text-slate-400 font-normal">Alex (Sanitation)</span>
                </button>
                <button
                  onClick={() => handleQuickLogin('admin@civicimpact.org', '/admin')}
                  disabled={quickLoginLoading}
                  className="px-3 py-2 bg-slate-700/70 hover:bg-purple-600/30 hover:border-purple-500/50 border border-slate-600 rounded-xl text-xs font-bold text-slate-200 transition text-center"
                >
                  👑 Login as Municipal Admin
                  <span className="block text-[10px] text-slate-400 font-normal">Full Control Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Integrated Civic & Sustainability Modules
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Engineered to cover the entire lifecycle: from reporting civic hazards to circular reuse and recycling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md`}
                    >
                      <Icon size={24} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                <Link
                  to={feat.route}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-800 transition"
                >
                  <span>Explore Feature</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Transparent Priority System Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                Rule-Based Intelligence
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Explainable, Smart Complaint Prioritization
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Rather than an opaque black box, Civic Impact uses transparent rule logic analyzing category urgency, public safety hazards (live wires, deep sinkholes, sewage), and vulnerable proximity (schools, hospitals) to automatically assign Low, Medium, High, or Critical priority.
              </p>
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 size={16} />
                  <span>Instant keyword safety detection</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 size={16} />
                  <span>Full reason displayed on every complaint card</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 size={16} />
                  <span>Admin override capabilities anytime</span>
                </div>
              </div>
            </div>

            {/* Visual Example Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">#CMP-2026-1002</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-rose-500 text-white animate-pulse">
                  ⚡ Critical Priority
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Deep pothole causing accidents near Metro exit</h4>
                <p className="text-xs text-slate-300 mt-1">Category: Pothole/Road • Address: Central Avenue</p>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700 text-xs">
                <span className="text-emerald-400 font-bold block mb-1">Transparent Reasoning:</span>
                <p className="text-slate-300 leading-snug">
                  "Road infrastructure impacts traffic and vehicle safety; Critical safety alert triggered by keyword: 'accident', 'deep pothole' (Calculated Score: 55)"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard & Community Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Community Leaders
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                Top Civic Contributors
              </h3>
            </div>
            <Link
              to="/leaderboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-800"
            >
              <span>View Full Community Leaderboard</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topUsers.map((u, i) => (
              <div
                key={u.id}
                className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-emerald-50/40 transition flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-sm ${
                    i === 0
                      ? 'bg-amber-400 text-amber-950'
                      : i === 1
                      ? 'bg-slate-300 text-slate-800'
                      : 'bg-amber-700 text-amber-100'
                  }`}
                >
                  #{u.rank}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{u.name}</h4>
                  <p className="text-xs text-emerald-700 font-extrabold mt-0.5">🌱 {u.green_points} Green Points</p>
                  <p className="text-[11px] text-slate-400">{u.activity_count} verified civic actions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
