import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../services/api';
import {
  ShieldAlert,
  MapPin,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  ArrowLeft,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const { user, isAdmin, isServiceTeam } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await complaintAPI.getComplaintById(id);
      if (res.data.success) {
        setComplaint(res.data.complaint);
        setTimeline(res.data.timeline);
      }
    } catch (err) {
      console.error('Error fetching complaint details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading Complaint Details..." />;
  }

  if (!complaint) {
    return (
      <div className="text-center py-16">
        <p className="text-sm font-bold text-slate-700">Complaint not found.</p>
        <Link to="/complaints" className="text-xs text-emerald-600 font-bold mt-2 inline-block">
          ← Back to Complaints
        </Link>
      </div>
    );
  }

  const allStatuses = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
  const currentIndex = allStatuses.indexOf(complaint.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top back link */}
      <div>
        <Link
          to="/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition"
        >
          <ArrowLeft size={14} />
          <span>Back to Complaints Directory</span>
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">#{complaint.complaint_id}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {complaint.category}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">{complaint.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <PriorityBadge priority={complaint.priority} reason={complaint.priority_reason} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Visual Lifecycle Stepper */}
        <div className="py-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Resolution Progress Lifecycle
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {allStatuses.map((step, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <div
                  key={step}
                  className={`p-3 rounded-2xl border text-center transition ${
                    isCurrent
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-bold'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <span className="block text-[10px] uppercase tracking-wider opacity-80">
                    Step {idx + 1}
                  </span>
                  <span className="text-xs">{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Image & Description Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
          <div className="md:col-span-2 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Citizen Description
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-400" />
                <span><strong>Location:</strong> {complaint.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span><strong>Reported On:</strong> {new Date(complaint.created_at).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-slate-400" />
                <span><strong>Reported By:</strong> {complaint.citizen_name}</span>
              </div>
            </div>

            {/* Smart Priority Reasoning Callout */}
            {complaint.priority_reason && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <strong className="block font-bold">⚡ Smart Priority Calculation Reasoning:</strong>
                <p className="leading-snug">{complaint.priority_reason}</p>
              </div>
            )}
          </div>

          {/* Photo & Resolution */}
          <div className="space-y-4">
            {complaint.photo_url && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Uploaded Photo
                </h4>
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                  <img
                    src={`http://localhost:5000${complaint.photo_url}`}
                    alt="Complaint"
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                </div>
              </div>
            )}

            {/* Assigned Personnel Card */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Assigned Service Team
              </span>
              <p className="font-bold text-emerald-400 text-sm">
                {complaint.assigned_to_name || 'Pending Municipal Assignment'}
              </p>
              {complaint.assigned_to_phone && (
                <p className="text-slate-300">Contact: {complaint.assigned_to_phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Resolution Notes If Present */}
        {complaint.resolution_notes && (
          <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <CheckCircle2 size={16} />
              <span className="text-sm">Official Resolution Report</span>
            </div>
            <p className="leading-relaxed">{complaint.resolution_notes}</p>
          </div>
        )}
      </div>

      {/* Audit History Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Activity & Status Audit Trail</h3>

        <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
          {timeline.map((update, idx) => (
            <div key={update.id} className="relative flex items-start gap-4 pl-6">
              <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></div>
              <div className="flex-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Status: {update.status_to}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(update.created_at).toLocaleString()}
                  </span>
                </div>
                {update.note && (
                  <p className="text-xs text-slate-600 mt-1 leading-snug">{update.note}</p>
                )}
                {update.updated_by_name && (
                  <span className="block text-[10px] text-slate-400 mt-1">
                    Updated by {update.updated_by_name} ({update.updated_by_role})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
