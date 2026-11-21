import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listingAPI, SERVER_BASE_URL } from '../services/api';
import {
  Gift,
  PlusCircle,
  Search,
  Filter,
  MapPin,
  Camera,
  CheckCircle2,
  Clock,
  Send,
  User,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/StatCard';

export const ReuseMarketplacePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [category, setCategory] = useState('All');
  const [listingType, setListingType] = useState('All');
  const [condition, setCondition] = useState('All');
  const [search, setSearch] = useState('');
  const [myOnly, setMyOnly] = useState(false);

  // Create Listing Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Books',
    listing_type: 'Donate',
    condition: 'Gently Used',
    location_address: user?.address || ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Item Details / Request Modal
  const [selectedListing, setSelectedListing] = useState(null);
  const [listingDetails, setListingDetails] = useState(null);
  const [requestMsg, setRequestMsg] = useState('');
  const [requestSending, setRequestSending] = useState(false);
  const [requestStatusMsg, setRequestStatusMsg] = useState('');

  useEffect(() => {
    fetchListings();
  }, [category, listingType, condition, myOnly]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await listingAPI.getListings({
        category,
        listing_type: listingType,
        condition,
        search,
        myOnly: myOnly ? 'true' : 'false'
      });
      if (res.data.success) {
        setListings(res.data.listings);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = async (listing) => {
    setSelectedListing(listing);
    setRequestStatusMsg('');
    setRequestMsg('');
    try {
      const res = await listingAPI.getListingById(listing.id);
      if (res.data.success) {
        setListingDetails(res.data);
      }
    } catch (err) {
      console.error('Error loading listing details:', err);
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!selectedListing) return;
    try {
      setRequestSending(true);
      const res = await listingAPI.requestItem(selectedListing.id, { message: requestMsg });
      if (res.data.success) {
        setRequestStatusMsg('Your request has been delivered to the owner!');
        handleOpenDetails(selectedListing);
      }
    } catch (err) {
      setRequestStatusMsg(err.response?.data?.message || 'Error submitting item request.');
    } finally {
      setRequestSending(false);
    }
  };

  const handleRespondRequest = async (requestId, status) => {
    try {
      await listingAPI.respondToRequest(selectedListing.id, requestId, { status });
      handleOpenDetails(selectedListing);
      fetchListings();
    } catch (err) {
      alert(err.response?.data?.message || 'Error responding to request.');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.description || !formData.location_address) {
      setFormError('Please fill in title, description, and location.');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      Object.keys(formData).forEach((k) => data.append(k, formData[k]));
      if (photo) data.append('photo', photo);

      const res = await listingAPI.createListing(data);
      if (res.data.success) {
        setCreateModalOpen(false);
        setPhoto(null);
        setPhotoPreview(null);
        fetchListings();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error creating listing.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    'All',
    'Clothes',
    'Books',
    'Furniture',
    'Electronics',
    'Household Items',
    'Study Materials',
    'Toys',
    'Other'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="text-purple-600" size={26} />
            <h1 className="text-2xl font-black text-slate-900">Reuse & Donate Marketplace</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Give usable items a second life. Donors earn Green Points (+30) and requesters reduce landfill waste!
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
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition transform hover:-translate-y-0.5"
        >
          <PlusCircle size={16} />
          <span>List an Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items by title, category, or location..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>

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

          <select
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
          >
            <option value="All">Type: All</option>
            <option value="Donate">Donate</option>
            <option value="Give Away">Give Away</option>
            <option value="Reuse">Reuse</option>
          </select>

          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
          >
            <option value="All">Condition: All</option>
            <option value="Like New">Like New</option>
            <option value="Gently Used">Gently Used</option>
            <option value="Functional">Functional</option>
            <option value="Needs Minor Repair">Needs Minor Repair</option>
          </select>

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setMyOnly(!myOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition border ${
                myOnly
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {myOnly ? '✓ My Listings' : 'My Listings'}
            </button>
          )}

          <button
            onClick={fetchListings}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <LoadingSpinner label="Loading Circular Marketplace..." />
      ) : listings.length === 0 ? (
        <EmptyState
          icon={Gift}
          title="No Items Found"
          description="Be the first to list usable clothes, books, furniture, or toys for someone in your area."
          actionText="Create a Listing"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenDetails(item)}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                    {item.listing_type}
                  </span>
                  <StatusBadge status={item.availability_status} />
                </div>

                {item.photo_url && (
                  <div className="w-full h-40 rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src={`${SERVER_BASE_URL}${item.photo_url}`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.category} • Condition: {item.condition}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition mt-0.5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 mt-4">
                <span className="flex items-center gap-1 truncate max-w-[160px]">
                  <MapPin size={12} className="shrink-0 text-slate-400" />
                  <span className="truncate">{item.location_address}</span>
                </span>
                <span className="font-bold text-purple-600 group-hover:translate-x-0.5 transition-transform">
                  View / Request →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Details & Request Modal */}
      <Modal
        isOpen={!!selectedListing}
        onClose={() => {
          setSelectedListing(null);
          setListingDetails(null);
        }}
        title={`Item: ${selectedListing?.title}`}
      >
        {selectedListing && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-purple-50 text-purple-800 text-[10px] uppercase">
                  {selectedListing.listing_type}
                </span>
                <span className="text-slate-500 ml-2">Category: {selectedListing.category}</span>
              </div>
              <StatusBadge status={selectedListing.availability_status} />
            </div>

            {selectedListing.photo_url && (
              <div className="w-full h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={`${SERVER_BASE_URL}${selectedListing.photo_url}`}
                  alt={selectedListing.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <h4 className="font-bold text-slate-800 text-sm">{selectedListing.title}</h4>
              <p className="text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">
                {selectedListing.description}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <p><strong>Item Condition:</strong> {selectedListing.condition}</p>
              <p><strong>Pickup Neighborhood:</strong> {selectedListing.location_address}</p>
              <p><strong>Listed by:</strong> {selectedListing.owner_name}</p>
            </div>

            {/* If Current User is OWNER: Show incoming requests */}
            {user && (user.id === selectedListing.user_id || user.role === 'admin') ? (
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Incoming Requests from Citizens ({listingDetails?.requests?.length || 0})
                </h4>

                {listingDetails?.requests?.length === 0 ? (
                  <p className="text-slate-400 py-3 text-center">No requests yet for this item.</p>
                ) : (
                  <div className="space-y-2">
                    {listingDetails?.requests?.map((req) => (
                      <div
                        key={req.id}
                        className="p-3 bg-white rounded-xl border border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">
                            {req.requester_name} ({req.requester_phone})
                          </span>
                          <StatusBadge status={req.status} />
                        </div>
                        <p className="text-slate-600 italic">"{req.message}"</p>

                        {req.status === 'Pending' && (
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleRespondRequest(req.id, 'Rejected')}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                            >
                              Decline
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRespondRequest(req.id, 'Accepted')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                            >
                              Accept & Hand Over
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* If Current User is NOT Owner: Request Form */
              <div className="pt-3 border-t border-slate-100 space-y-3">
                {requestStatusMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold">
                    {requestStatusMsg}
                  </div>
                )}

                {listingDetails?.myRequest ? (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block">Your Request Status:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={listingDetails.myRequest.status} />
                      <span className="text-slate-500">Sent on {new Date(listingDetails.myRequest.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendRequest} className="space-y-3">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      Message to Owner *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={requestMsg}
                      onChange={(e) => setRequestMsg(e.target.value)}
                      placeholder="e.g. Hello! I would love to pick this up tomorrow evening..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500"
                    />

                    <button
                      type="submit"
                      disabled={requestSending}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2"
                    >
                      <Send size={14} />
                      <span>{requestSending ? 'Sending Request...' : 'Send Request to Owner'}</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Listing Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="List a Usable Item for Reuse or Donation"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-3">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Item Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Set of 4 Wooden Dining Chairs"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              >
                {categories.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Listing Type *</label>
              <select
                value={formData.listing_type}
                onChange={(e) => setFormData({ ...formData, listing_type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="Donate">Donate</option>
                <option value="Give Away">Give Away</option>
                <option value="Reuse">Reuse</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Condition *</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="Like New">Like New</option>
                <option value="Gently Used">Gently Used</option>
                <option value="Functional">Functional</option>
                <option value="Needs Minor Repair">Needs Minor Repair</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Neighborhood / Pickup Location *</label>
              <input
                type="text"
                required
                value={formData.location_address}
                onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                placeholder="Sector / Area landmark"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="State dimensions, utility, working condition, and reason for giving away..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Upload Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setPhoto(file);
                  setPhotoPreview(URL.createObjectURL(file));
                }
              }}
              className="text-xs"
            />
            {photoPreview && (
              <div className="mt-2 w-28 h-20 rounded-xl overflow-hidden border border-slate-200">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
            >
              {submitting ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
