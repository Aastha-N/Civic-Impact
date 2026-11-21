import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, complaintAPI, pickupAPI, listingAPI, pointsAPI } from '../services/api';
import {
  ShieldAlert,
  Trash2,
  Gift,
  Sparkles,
  Trophy,
  PlusCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [listings, setListings] = useState([]);
  const [pointData, setPointData] = useState({ balance: 0, rank: 1, transactions: [] });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [compRes, pickRes, listRes, ptsRes] = await Promise.all([
        complaintAPI.getComplaints({ myOnly: 'true' }),
        pickupAPI.getPickups({ myOnly: 'true' }),
        listingAPI.getListings({ myOnly: 'true' }),
        pointsAPI.getMyPoints()
      ]);

      if (compRes.data.success) setComplaints(compRes.data.complaints);
      if (pickRes.data.success) setPickups(pickRes.data.pickups);
      if (listRes.data.success) setListings(listRes.data.listings);
      if (ptsRes.data.success) setPointData(ptsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading Citizen Dashboard..." />;
  }

  const activeComplaints = complaints.filter(
    (c) => ['Submitted', 'Under Review', 'Assigned', 'In Progress'].includes(c.status)
  ).length;
  const resolvedComplaints = complaints.filter(
    (c) => ['Resolved', 'Closed'].includes(c.status)
  ).length;
  const pendingPickups = pickups.filter(
    (p) => ['Requested', 'Scheduled', 'Assigned'].includes(p.status)
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-400/20">
            <span>🌱 Active Eco-Citizen</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name || 'Citizen'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Welcome to your civic hub. Monitor your reported complaints, manage waste collections, and view your community sustainability impact.
          </p>
        </div>

        {/* Green Points Card Badge */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-2xl shadow-md">
            🌱
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
              Green Points Balance
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{pointData.balance}</span>
              <span className="text-xs font-semibold text-emerald-300">Rank #{pointData.rank}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Complaints"
          value={complaints.length}
          icon={ShieldAlert}
          color="amber"
          subtitle={`${activeComplaints} Active • ${resolvedComplaints} Resolved`}
        />
        <StatCard
          title="Waste Pickups"
          value={pickups.length}
          icon={Trash2}
          color="teal"
          subtitle={`${pendingPickups} Pending Handover`}
        />
        <StatCard
          title="Reuse Listings"
          value={listings.length}
          icon={Gift}
          color="purple"
          subtitle="Donations & Free Giveaways"
        />
        <StatCard
          title="Green Rank"
          value={`#${pointData.rank}`}
          icon={Trophy}
          color="emerald"
          subtitle="In Community Leaderboard"
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/complaints/new"
            className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition border border-emerald-200"
          >
            <PlusCircle size={18} className="text-emerald-600" />
            <span>Report Issue</span>
          </Link>
          <Link
            to="/pickup"
            className="flex items-center gap-2 p-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition border border-teal-200"
          >
            <Trash2 size={18} className="text-teal-600" />
            <span>Request Pickup</span>
          </Link>
          <Link
            to="/reuse"
            className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition border border-purple-200"
          >
            <Gift size={18} className="text-purple-600" />
            <span>List Reuse Item</span>
          </Link>
          <Link
            to="/assistant"
            className="flex items-center gap-2 p-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold transition border border-cyan-200"
          >
            <Sparkles size={18} className="text-cyan-600" />
            <span>Smart Assistant</span>
          </Link>
        </div>
      </div>

      {/* Main Content Columns: Recent Complaints & Recent Pickups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Complaints */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-amber-500" />
              <h3 className="text-base font-extrabold text-slate-850">My Recent Complaints</h3>
            </div>
            <Link to="/complaints" className="text-xs font-bold text-emerald-600 hover:text-emerald-800">
              View All ({complaints.length})
            </Link>
          </div>

          {complaints.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              You haven't submitted any complaints yet. Report an issue to earn Green Points!
            </p>
          ) : (
            <div className="space-y-3">
              {complaints.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  to={`/complaints/${c.id}`}
                  className="block p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">{c.complaint_id}</span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">{c.title}</h4>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span className="truncate max-w-[160px]">{c.address}</span>
                    </span>
                    <PriorityBadge priority={c.priority} reason={c.priority_reason} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Pickups & Activity */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Trash2 size={18} className="text-teal-500" />
              <h3 className="text-base font-extrabold text-slate-850">Recent Waste Pickups</h3>
            </div>
            <Link to="/pickup" className="text-xs font-bold text-emerald-600 hover:text-emerald-800">
              Manage Pickups ({pickups.length})
            </Link>
          </div>

          {pickups.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No waste pickup requests on file. Book a pickup for your recyclable materials!
            </p>
          ) : (
            <div className="space-y-3">
              {pickups.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">{p.pickup_id}</span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                      {p.waste_type} <span className="font-normal text-slate-500">({p.quantity})</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar size={12} />
                      <span>{p.preferred_date} • {p.preferred_time}</span>
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          )}

          {/* Green Points Recent Activity */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Recent Green Points Earned
            </h4>
            <div className="space-y-2">
              {pointData.transactions.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-slate-600">{t.activity_type}: {t.description}</span>
                  <span className="font-bold text-emerald-600">+{t.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
