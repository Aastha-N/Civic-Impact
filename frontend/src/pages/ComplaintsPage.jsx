import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintAPI, SERVER_BASE_URL } from '../services/api';
import {
  ShieldAlert,
  PlusCircle,
  Search,
  Filter,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/StatCard';

export const ComplaintsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [myOnly, setMyOnly] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, [category, status, priority, myOnly]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await complaintAPI.getComplaints({
        search,
        category,
        status,
        priority,
        myOnly: myOnly ? 'true' : 'false'
      });
      if (res.data.success) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const categories = [
    'All',
    'Garbage/Waste',
    'Pothole/Road',
    'Streetlight',
    'Water Leakage',
    'Drainage',
    'Public Toilet',
    'Illegal Dumping',
    'Other'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-amber-500" size={26} />
            <h1 className="text-2xl font-black text-slate-900">Civic Problem Tracker</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Report civic hazards, track neighborhood resolutions, and hold municipal services accountable.
          </p>
        </div>

        <Link
          to="/complaints/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition transform hover:-translate-y-0.5"
        >
          <PlusCircle size={16} />
          <span>Report Civic Problem</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, description, complaint ID, or address..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
          >
            <option value="All">Status: All</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
          >
            <option value="All">Priority: All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* My Complaints Only Toggle */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setMyOnly(!myOnly)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                myOnly
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {myOnly ? '✓ My Reports' : 'My Reports Only'}
            </button>
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Complaints Grid */}
      {loading ? (
        <LoadingSpinner label="Loading Civic Complaints..." />
      ) : complaints.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No Complaints Found"
          description="There are currently no civic complaints matching your filter criteria."
          actionText="Report an Issue Now"
          onAction={() => window.location.assign('/complaints/new')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {complaints.map((c) => (
            <Link
              key={c.id}
              to={`/complaints/${c.id}`}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header bar: ID & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-emerald-700 transition">
                    #{c.complaint_id}
                  </span>
                  <StatusBadge status={c.status} />
                </div>

                {/* Photo thumbnail if present */}
                {c.photo_url && (
                  <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-100 relative">
                    <img
                      src={`${SERVER_BASE_URL}${c.photo_url}`}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Title & Description */}
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {c.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition leading-snug mt-0.5">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                {/* Priority with hover reason */}
                <div>
                  <PriorityBadge priority={c.priority} reason={c.priority_reason} />
                </div>
              </div>

              {/* Footer info: Location & Date */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 mt-4">
                <span className="flex items-center gap-1 max-w-[170px] truncate">
                  <MapPin size={12} className="shrink-0 text-slate-400" />
                  <span className="truncate">{c.address}</span>
                </span>
                <span className="flex items-center gap-1 shrink-0">
                  <Calendar size={12} />
                  <span>{new Date(c.created_at).toLocaleDateString()}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
