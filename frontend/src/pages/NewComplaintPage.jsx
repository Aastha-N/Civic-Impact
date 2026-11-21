import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../services/api';
import {
  ShieldAlert,
  Camera,
  MapPin,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { PriorityBadge } from '../components/common/StatusBadge';

export const NewComplaintPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Garbage/Waste',
    address: user?.address || '',
    location_lat: 28.6139,
    location_lng: 77.2090
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Live Rule-based priority preview
  const [previewPriority, setPreviewPriority] = useState({
    level: 'Medium',
    score: 15,
    reasons: ['Municipal waste collection required']
  });

  // Calculate priority live on frontend matching backend rules
  useEffect(() => {
    const text = `${formData.title} ${formData.description} ${formData.address}`.toLowerCase();
    let score = 0;
    const reasons = [];

    // Category
    switch (formData.category) {
      case 'Illegal Dumping':
        score += 25;
        reasons.push('Illegal dumping poses health & sanitation risks');
        break;
      case 'Drainage':
        score += 20;
        reasons.push('Drainage blockage can lead to waterlogging & pathogens');
        break;
      case 'Water Leakage':
        score += 20;
        reasons.push('Water supply loss & road foundation erosion');
        break;
      case 'Pothole/Road':
        score += 15;
        reasons.push('Road infrastructure impacts traffic and vehicle safety');
        break;
      case 'Garbage/Waste':
        score += 15;
        reasons.push('Municipal waste collection required');
        break;
      case 'Streetlight':
        score += 10;
        reasons.push('Lighting affects nighttime safety');
        break;
      default:
        score += 10;
        reasons.push('Standard civic inquiry');
    }

    // Critical keywords
    const criticalKws = [
      'live wire', 'sparking', 'electric shock', 'open manhole', 'manhole open',
      'gas leak', 'fire', 'collapsed', 'sinkhole', 'flood', 'flooding',
      'hazard', 'toxic', 'chemical spill', 'accident', 'deadly', 'emergency',
      'deep pothole'
    ];
    for (const kw of criticalKws) {
      if (text.includes(kw)) {
        score += 40;
        reasons.push(`Critical safety alert: "${kw}"`);
        break;
      }
    }

    // High impact keywords
    const highKws = ['school', 'hospital', 'clinic', 'overflowing', 'sewage', 'burst pipe', 'major road', 'foul smell'];
    for (const kw of highKws) {
      if (text.includes(kw)) {
        score += 20;
        reasons.push(`High impact area/factor: "${kw}"`);
        break;
      }
    }

    let level = 'Medium';
    if (score >= 50) level = 'Critical';
    else if (score >= 30) level = 'High';
    else if (score >= 15) level = 'Medium';
    else level = 'Low';

    setPreviewPriority({ level, score, reasons });
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData({
            ...formData,
            location_lat: pos.coords.latitude,
            location_lng: pos.coords.longitude,
            address: formData.address || `Geo-Coords: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
          });
        },
        (err) => {
          console.warn('Geolocation error:', err);
          alert('Could not retrieve GPS location. You can enter the street address manually.');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.address) {
      setError('Please fill in title, description, and street address.');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('address', formData.address);
      data.append('location_lat', formData.location_lat);
      data.append('location_lng', formData.location_lng);
      if (photo) {
        data.append('photo', photo);
      }

      const res = await complaintAPI.createComplaint(data);
      if (res.data.success) {
        navigate(`/complaints/${res.data.complaint.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting complaint.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2 border border-amber-200">
          <Sparkles size={14} className="text-amber-600" />
          <span>Earn +10 Green Points upon submission!</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">Report a Civic Problem</h1>
        <p className="text-xs text-slate-500 mt-1">
          Provide accurate details and photos to help municipal services address your report promptly.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Issue Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Issue Title / Headline *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Deep pothole near school crossing gate"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Description *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the severity, when it started, and any hazards to pedestrians or traffic..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Location / Address *
              </label>
              <button
                type="button"
                onClick={handleUseMyLocation}
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
              >
                <MapPin size={12} />
                <span>Use Current GPS</span>
              </button>
            </div>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="Street name, landmark, sector, or neighborhood"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Upload Problem Photo (Optional)
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl cursor-pointer text-xs font-bold text-slate-700 transition">
                <Camera size={16} />
                <span>Choose Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              {photo && <span className="text-xs text-slate-500 truncate">{photo.name}</span>}
            </div>

            {photoPreview && (
              <div className="mt-3 w-40 h-28 rounded-xl overflow-hidden border border-slate-200">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition"
            >
              <span>{loading ? 'Submitting...' : 'Submit Complaint'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </div>
        </form>

        {/* Live Priority Preview Sidebar */}
        <div className="space-y-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-850 text-white rounded-3xl p-6 border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Smart Priority Engine
              </span>
              <Sparkles size={16} className="text-amber-400" />
            </div>

            <div>
              <p className="text-[11px] text-slate-400 mb-1">Live Estimated Priority:</p>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={previewPriority.level} />
                <span className="text-xs font-bold text-slate-300">
                  (Score: {previewPriority.score})
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                Detected Factors:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {previewPriority.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[10px] text-slate-400 leading-snug pt-2 border-t border-slate-800">
              * The system scans for critical safety keywords (live wire, sinkhole, accident) and high-impact areas (schools, hospitals) to fast-track urgency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
