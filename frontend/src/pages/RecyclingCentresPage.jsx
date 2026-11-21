import React, { useState, useEffect } from 'react';
import { recyclingAPI } from '../services/api';
import {
  MapPin,
  Search,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Filter
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/StatCard';

export const RecyclingCentresPage = () => {
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [material, setMaterial] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCentres();
  }, [material]);

  const fetchCentres = async () => {
    try {
      setLoading(true);
      const res = await recyclingAPI.getCentres({
        material: material === 'All' ? '' : material,
        search
      });
      if (res.data.success) {
        setCentres(res.data.centres);
      }
    } catch (err) {
      console.error('Error fetching recycling centres:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCentres();
  };

  const materialsList = ['All', 'Plastic', 'E-waste', 'Paper', 'Metal', 'Glass', 'Wet Waste'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="text-blue-600" size={26} />
            <h1 className="text-2xl font-black text-slate-900">Recycling Centres Directory</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Discover authorized municipal sorting stations, e-waste recyclers, and community composting yards.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs font-bold">
          <ShieldCheck size={14} className="text-blue-600" />
          <span>Demo Data Clearly Marked</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by facility name, address, or material..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {materialsList.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMaterial(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  material === m
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Centres Grid */}
      {loading ? (
        <LoadingSpinner label="Locating Recycling Facilities..." />
      ) : centres.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No Recycling Centres Found"
          description="Try selecting a different material stream or clearing your search term."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {centres.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={12} className="shrink-0 text-slate-400" />
                      <span>{c.address}</span>
                    </p>
                  </div>
                  {c.is_sample && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Demo Facility
                    </span>
                  )}
                </div>

                {c.description && (
                  <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>
                )}

                {/* Accepted Materials Badges */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Accepted Materials:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {c.accepted_materials.split(',').map((mat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-100"
                      >
                        ✓ {mat.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact and Timings */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {c.opening_hours && (
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400 shrink-0" />
                      <span>{c.opening_hours}</span>
                    </div>
                  )}
                  {c.contact_phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={13} className="text-slate-400 shrink-0" />
                      <span>{c.contact_phone}</span>
                    </div>
                  )}
                  {c.contact_email && (
                    <div className="flex items-center gap-1.5 sm:col-span-2">
                      <Mail size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{c.contact_email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action: Open in Map */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Geo: {c.location_lat || 28.61}, {c.location_lng || 77.20}
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    c.name + ' ' + c.address
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                >
                  <span>View on Map</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
