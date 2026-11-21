import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { complaintAPI, pickupAPI } from '../services/api';
import {
  Wrench,
  ShieldAlert,
  Trash2,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ServiceDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('complaints'); // 'complaints' | 'pickups'
  const [complaints, setComplaints] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Update modal state
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskType, setTaskType] = useState('complaint'); // 'complaint' | 'pickup'
  const [newStatus, setNewStatus] = useState('');
  const [workNotes, setWorkNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAssignedWork();
  }, []);

  const fetchAssignedWork = async () => {
    try {
      setLoading(true);
      const [compRes, pickRes] = await Promise.all([
        complaintAPI.getComplaints(),
        pickupAPI.getPickups()
      ]);
      if (compRes.data.success) setComplaints(compRes.data.complaints);
      if (pickRes.data.success) setPickups(pickRes.data.pickups);
    } catch (err) {
      console.error('Error fetching service work:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdate = (item, type) => {
    setSelectedTask(item);
    setTaskType(type);
    setNewStatus(item.status);
    setWorkNotes('');
    setMessage('');
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    try {
      setUpdating(true);
      if (taskType === 'complaint') {
        const formData = new FormData();
        formData.append('status', newStatus);
        formData.append('note', workNotes);
        formData.append('resolution_notes', newStatus === 'Resolved' ? workNotes : '');
        await complaintAPI.updateStatus(selectedTask.id, formData);
      } else {
        await pickupAPI.updateStatus(selectedTask.id, {
          status: newStatus,
          notes: workNotes
        });
      }
      setSelectedTask(null);
      fetchAssignedWork();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error updating status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading Assigned Field Tasks..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold mb-2">
            <Wrench size={13} />
            <span>Municipal Service & Field Operations</span>
          </div>
          <h1 className="text-2xl font-black">Field Operations Desk</h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as: <strong className="text-white">{user?.name}</strong> ({user?.email})
          </p>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Issues</span>
            <span className="text-xl font-black text-amber-400">{complaints.length}</span>
          </div>
          <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Pickups</span>
            <span className="text-xl font-black text-teal-400">{pickups.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex items-center gap-2 py-3 px-6 text-sm font-bold border-b-2 transition ${
            activeTab === 'complaints'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert size={16} />
          <span>Assigned Civic Complaints ({complaints.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pickups')}
          className={`flex items-center gap-2 py-3 px-6 text-sm font-bold border-b-2 transition ${
            activeTab === 'pickups'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trash2 size={16} />
          <span>Assigned Waste Pickups ({pickups.length})</span>
        </button>
      </div>

      {/* Complaints List */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          {complaints.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
              No civic complaints currently assigned to you. Check back later!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-400">{c.complaint_id}</span>
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={c.priority} reason={c.priority_reason} />
                        <StatusBadge status={c.status} />
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{c.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} className="text-slate-400 shrink-0" />
                        <span>Reporter: {c.citizen_name} ({c.citizen_phone})</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Logged: {new Date(c.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleOpenUpdate(c, 'complaint')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                    >
                      Update Work Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pickups List */}
      {activeTab === 'pickups' && (
        <div className="space-y-4">
          {pickups.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
              No waste pickup requests currently assigned to you.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pickups.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-400">{p.pickup_id}</span>
                      <StatusBadge status={p.status} />
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {p.waste_type} <span className="font-normal text-slate-500">({p.quantity})</span>
                    </h3>
                    <p className="text-xs text-slate-600">{p.description}</p>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{p.pickup_address}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-slate-400 shrink-0" />
                        <span>Scheduled: {p.scheduled_date || p.preferred_date} • {p.scheduled_time || p.preferred_time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} className="text-slate-400 shrink-0" />
                        <span>Citizen: {p.citizen_name} ({p.citizen_phone})</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Requested: {new Date(p.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleOpenUpdate(p, 'pickup')}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                    >
                      Update Pickup Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Update Progress Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={`Update ${taskType === 'complaint' ? 'Complaint' : 'Pickup'}: ${
          selectedTask?.complaint_id || selectedTask?.pickup_id
        }`}
      >
        <form onSubmit={handleSaveUpdate} className="space-y-4">
          {message && (
            <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold">
              {message}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Change Status *
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              {taskType === 'complaint' ? (
                <>
                  <option value="Assigned">Assigned (Received in Queue)</option>
                  <option value="In Progress">In Progress (Field Team Dispatched)</option>
                  <option value="Resolved">Resolved (Work Done)</option>
                </>
              ) : (
                <>
                  <option value="Assigned">Assigned (In Queue)</option>
                  <option value="Picked Up">Picked Up (Waste Collected from Doorstep)</option>
                  <option value="Completed">Completed (Delivered to Facility)</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Field Progress Notes / Resolution Remarks *
            </label>
            <textarea
              required
              rows={3}
              value={workNotes}
              onChange={(e) => setWorkNotes(e.target.value)}
              placeholder="e.g. Cleared 2 tons of wet waste; patched pothole with cold asphalt mix..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setSelectedTask(null)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              {updating ? 'Saving...' : 'Submit Work Update'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
