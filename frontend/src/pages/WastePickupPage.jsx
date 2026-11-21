import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { pickupAPI } from '../services/api';
import {
  Trash2,
  PlusCircle,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  PackageCheck
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/StatCard';

export const WastePickupPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    waste_type: 'Dry Waste',
    description: '',
    quantity: '1-2 Bags',
    pickup_address: user?.address || '',
    preferred_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    preferred_time: '10:00 AM - 12:00 PM',
    instructions: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const res = await pickupAPI.getPickups({ myOnly: 'true' });
      if (res.data.success) {
        setPickups(res.data.pickups);
      }
    } catch (err) {
      console.error('Error fetching pickups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreatePickup = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.description || !formData.pickup_address || !formData.preferred_date) {
      setError('Please fill in description, pickup address, and date.');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      Object.keys(formData).forEach((k) => data.append(k, formData[k]));

      const res = await pickupAPI.createPickup(data);
      if (res.data.success) {
        setCreateModalOpen(false);
        setFormData({
          waste_type: 'Dry Waste',
          description: '',
          quantity: '1-2 Bags',
          pickup_address: user?.address || '',
          preferred_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          preferred_time: '10:00 AM - 12:00 PM',
          instructions: ''
        });
        fetchPickups();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error booking pickup request.');
    } finally {
      setSubmitting(false);
    }
  };

  const wasteTypes = [
    'Dry Waste',
    'Wet Waste',
    'Plastic',
    'Paper',
    'Glass',
    'Metal',
    'E-waste',
    'Other'
  ];

  const quantities = [
    '1-2 Bags',
    '3-5 Bags / Medium Bundle',
    'Carton / Crate',
    'Bulk (>25 kg)'
  ];

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Trash2 className="text-teal-600" size={26} />
            <h1 className="text-2xl font-black text-slate-900">Doorstep Waste Collection</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Book municipal or authorized recycling pickup for segregated wet, dry, plastic, and electronic waste.
          </p>
        </div>

        <button
          onClick={() => {
            if (!isAuthenticated) {
              window.location.assign('/login');
              return;
            }
            setCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition transform hover:-translate-y-0.5"
        >
          <PlusCircle size={16} />
          <span>Schedule Waste Pickup</span>
        </button>
      </div>

      {/* Rewards callout banner */}
      <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white rounded-3xl p-6 shadow-md flex items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
            🌱 Green Points Incentive
          </span>
          <h3 className="text-base font-extrabold">Earn +20 Green Points For Every Handover</h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Keep recyclables dry, rinsed, and properly segregated before handover to service personnel.
          </p>
        </div>
        <div className="hidden sm:block text-4xl">♻️</div>
      </div>

      {/* Pickups List */}
      {loading ? (
        <LoadingSpinner label="Loading Waste Pickup Requests..." />
      ) : pickups.length === 0 ? (
        <EmptyState
          icon={Trash2}
          title="No Pickup Requests Found"
          description="You haven't requested any waste collection yet. Click below to book your first doorstep pickup!"
          actionText="Request Waste Pickup"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pickups.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">#{p.pickup_id}</span>
                  <StatusBadge status={p.status} />
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {p.waste_type}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {p.waste_type} Collection ({p.quantity})
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400 shrink-0" />
                    <span>
                      <strong>Slot:</strong> {p.scheduled_date || p.preferred_date} • {p.scheduled_time || p.preferred_time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{p.pickup_address}</span>
                  </div>
                  {p.assigned_to_name && (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <PackageCheck size={13} />
                      <span>Assigned to: {p.assigned_to_name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Created {new Date(p.created_at).toLocaleDateString()}</span>
                {p.status === 'Completed' && (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>+20 pts earned</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Pickup Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Schedule a Doorstep Waste Pickup"
      >
        <form onSubmit={handleCreatePickup} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Waste Category *
              </label>
              <select
                name="waste_type"
                value={formData.waste_type}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-teal-500"
              >
                {wasteTypes.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Estimated Quantity *
              </label>
              <select
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-teal-500"
              >
                {quantities.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description of Items / Waste *
            </label>
            <textarea
              name="description"
              required
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Flattened delivery boxes, newspapers, and 12 PET soda bottles..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Pickup Address *
            </label>
            <input
              type="text"
              name="pickup_address"
              required
              value={formData.pickup_address}
              onChange={handleChange}
              placeholder="Apartment/Street, Sector, City"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Preferred Date *
              </label>
              <input
                type="date"
                name="preferred_date"
                required
                value={formData.preferred_date}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Preferred Time Slot *
              </label>
              <select
                name="preferred_time"
                value={formData.preferred_time}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-teal-500"
              >
                {timeSlots.map((ts) => (
                  <option key={ts} value={ts}>
                    {ts}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Pickup Instructions (Optional)
            </label>
            <input
              type="text"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="e.g. Leave with security guard at front gate..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              {submitting ? 'Booking...' : 'Confirm Pickup Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
