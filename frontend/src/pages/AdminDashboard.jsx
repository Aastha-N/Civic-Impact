import React, { useState, useEffect } from 'react';
import {
  adminAPI,
  complaintAPI,
  pickupAPI,
  listingAPI,
  recyclingAPI,
  educationAPI
} from '../services/api';
import {
  ShieldCheck,
  Users,
  ShieldAlert,
  Trash2,
  Gift,
  MapPin,
  BookOpen,
  Trophy,
  Search,
  Filter,
  Plus,
  Edit,
  Trash,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab Data States
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [listings, setListings] = useState([]);
  const [centres, setCentres] = useState([]);
  const [topics, setTopics] = useState([]);
  const [serviceMembers, setServiceMembers] = useState([]);

  // Assignment Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [assignNote, setAssignNote] = useState('');

  // Priority Override Modal
  const [priorityModalOpen, setPriorityModalOpen] = useState(false);
  const [overridePriorityVal, setOverridePriorityVal] = useState('Medium');
  const [overrideReason, setOverrideReason] = useState('');

  // Schedule Pickup Modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [pickupServiceId, setPickupServiceId] = useState('');

  // Add/Edit Recycling Centre Modal
  const [centreModalOpen, setCentreModalOpen] = useState(false);
  const [centreForm, setCentreForm] = useState({
    name: '',
    address: '',
    accepted_materials: '',
    contact_phone: '',
    contact_email: '',
    opening_hours: '',
    description: ''
  });
  const [editingCentreId, setEditingCentreId] = useState(null);

  // Add/Edit Education Topic Modal
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [topicForm, setTopicForm] = useState({
    title: '',
    category: 'Dry Waste',
    description: '',
    examples: '',
    disposal_action: '',
    icon: 'Package'
  });
  const [editingTopicId, setEditingTopicId] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [statsRes, teamRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getServiceTeam()
      ]);
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (teamRes.data.success) setServiceMembers(teamRes.data.members);
    } catch (err) {
      console.error('Error loading admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = async (tab) => {
    setActiveTab(tab);
    try {
      if (tab === 'users') {
        const res = await adminAPI.getUsers();
        if (res.data.success) setUsers(res.data.users);
      } else if (tab === 'complaints') {
        const res = await complaintAPI.getComplaints({ myOnly: 'false' });
        if (res.data.success) setComplaints(res.data.complaints);
      } else if (tab === 'pickups') {
        const res = await pickupAPI.getPickups({ myOnly: 'false' });
        if (res.data.success) setPickups(res.data.pickups);
      } else if (tab === 'listings') {
        const res = await listingAPI.getListings();
        if (res.data.success) setListings(res.data.listings);
      } else if (tab === 'centres') {
        const res = await recyclingAPI.getCentres();
        if (res.data.success) setCentres(res.data.centres);
      } else if (tab === 'education') {
        const res = await educationAPI.getContent();
        if (res.data.success) setTopics(res.data.topics);
      }
    } catch (err) {
      console.error(`Error loading data for ${tab}:`, err);
    }
  };

  // User Role Update
  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, { role: newRole });
      loadTabData('users');
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating role');
    }
  };

  // Complaint Assignment Submit
  const handleAssignComplaint = async (e) => {
    e.preventDefault();
    if (!selectedComplaint || !selectedServiceId) return;
    try {
      await complaintAPI.assignComplaint(selectedComplaint.id, {
        serviceTeamUserId: selectedServiceId,
        note: assignNote
      });
      setAssignModalOpen(false);
      loadTabData('complaints');
    } catch (err) {
      alert(err.response?.data?.message || 'Error assigning complaint');
    }
  };

  // Priority Override Submit
  const handleOverridePriority = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    try {
      await complaintAPI.overridePriority(selectedComplaint.id, {
        priority: overridePriorityVal,
        priorityReason: overrideReason
      });
      setPriorityModalOpen(false);
      loadTabData('complaints');
    } catch (err) {
      alert(err.response?.data?.message || 'Error overriding priority');
    }
  };

  // Schedule Pickup Submit
  const handleSchedulePickup = async (e) => {
    e.preventDefault();
    if (!selectedPickup) return;
    try {
      await pickupAPI.scheduleAndAssign(selectedPickup.id, {
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        assigned_to_user_id: pickupServiceId || null
      });
      setScheduleModalOpen(false);
      loadTabData('pickups');
    } catch (err) {
      alert(err.response?.data?.message || 'Error scheduling pickup');
    }
  };

  // Recycling Centre Save
  const handleSaveCentre = async (e) => {
    e.preventDefault();
    try {
      if (editingCentreId) {
        await recyclingAPI.updateCentre(editingCentreId, centreForm);
      } else {
        await recyclingAPI.createCentre(centreForm);
      }
      setCentreModalOpen(false);
      setEditingCentreId(null);
      loadTabData('centres');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving recycling centre');
    }
  };

  const handleDeleteCentre = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recycling centre?')) return;
    try {
      await recyclingAPI.deleteCentre(id);
      loadTabData('centres');
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting centre');
    }
  };

  // Education Topic Save
  const handleSaveTopic = async (e) => {
    e.preventDefault();
    try {
      if (editingTopicId) {
        await educationAPI.updateTopic(editingTopicId, topicForm);
      } else {
        await educationAPI.createTopic(topicForm);
      }
      setTopicModalOpen(false);
      setEditingTopicId(null);
      loadTabData('education');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving topic');
    }
  };

  const handleDeleteTopic = async (id) => {
    if (!window.confirm('Delete this educational topic?')) return;
    try {
      await educationAPI.deleteTopic(id);
      loadTabData('education');
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting topic');
    }
  };

  // Moderation: Remove listing
  const handleDeleteListing = async (id) => {
    if (!window.confirm('Moderate & remove this item listing?')) return;
    try {
      await listingAPI.deleteListing(id);
      loadTabData('listings');
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting listing');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading Admin Control Center..." />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview & KPIs', icon: ShieldCheck },
    { id: 'complaints', label: 'Complaints', icon: ShieldAlert },
    { id: 'pickups', label: 'Waste Pickups', icon: Trash2 },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'listings', label: 'Reuse Moderation', icon: Gift },
    { id: 'centres', label: 'Recycling Centres', icon: MapPin },
    { id: 'education', label: 'Waste Education', icon: BookOpen },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-2">
            <ShieldCheck size={14} />
            <span>Municipal Administrator Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Civic Impact Administration</h1>
          <p className="text-xs text-slate-400 mt-1">
            Platform governance, complaint triage, resource assignments, and community sustainability analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold border border-emerald-500/30">
            System Status: Operational
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => loadTabData(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & KPIs */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Registered Citizens"
              value={stats.users.total}
              icon={Users}
              color="blue"
              subtitle={`${serviceMembers.length} Service Team Members`}
            />
            <StatCard
              title="Total Complaints"
              value={stats.complaints.total}
              icon={ShieldAlert}
              color="amber"
              subtitle={`${stats.complaints.pending} Pending • ${stats.complaints.resolved} Resolved`}
            />
            <StatCard
              title="Waste Pickups"
              value={stats.pickups.total}
              icon={Trash2}
              color="teal"
              subtitle={`${stats.pickups.completed} Collections Handled`}
            />
            <StatCard
              title="Green Points Awarded"
              value={stats.greenPointsAwarded}
              icon={Trophy}
              color="emerald"
              subtitle="Community Civic Rewards"
            />
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Complaints by Category</h3>
              <div className="space-y-2">
                {stats.complaints.byCategory.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50">
                    <span className="font-semibold text-slate-700">{cat.category}</span>
                    <span className="px-2 py-0.5 bg-slate-100 font-bold rounded-md text-slate-800">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Complaints by Priority</h3>
              <div className="space-y-2">
                {stats.complaints.byPriority.map((p) => (
                  <div key={p.priority} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50">
                    <PriorityBadge priority={p.priority} />
                    <span className="px-2 py-0.5 bg-slate-100 font-bold rounded-md text-slate-800">{p.count} issues</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Complaints Management */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Complaints Dispatch & Triage</h3>
            <span className="text-xs text-slate-500">{complaints.length} Total Complaints</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Complaint ID</th>
                  <th className="p-3.5">Title & Category</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Assigned To</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5 font-bold text-slate-800">{c.complaint_id}</td>
                    <td className="p-3.5 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{c.title}</p>
                      <p className="text-[11px] text-slate-500">{c.category} • {c.address}</p>
                    </td>
                    <td className="p-3.5">
                      <PriorityBadge priority={c.priority} reason={c.priority_reason} />
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700">
                      {c.assigned_to_name || <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedComplaint(c);
                          setSelectedServiceId(c.assigned_to_user_id || '');
                          setAssignNote('');
                          setAssignModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold"
                      >
                        Assign Team
                      </button>
                      <button
                        onClick={() => {
                          setSelectedComplaint(c);
                          setOverridePriorityVal(c.priority);
                          setOverrideReason('');
                          setPriorityModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold"
                      >
                        Override Priority
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Pickups Management */}
      {activeTab === 'pickups' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Doorstep Waste Pickups Management</h3>
            <span className="text-xs text-slate-500">{pickups.length} Total Requests</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Pickup ID</th>
                  <th className="p-3.5">Waste Type & Qty</th>
                  <th className="p-3.5">Citizen & Address</th>
                  <th className="p-3.5">Preferred Date/Time</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Assigned To</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pickups.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5 font-bold text-slate-800">{p.pickup_id}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{p.waste_type}</p>
                      <p className="text-[11px] text-slate-500">{p.quantity}</p>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <p className="font-semibold text-slate-800">{p.citizen_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{p.pickup_address}</p>
                    </td>
                    <td className="p-3.5 text-slate-700">
                      {p.scheduled_date || p.preferred_date} • {p.scheduled_time || p.preferred_time}
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700">
                      {p.assigned_to_name || <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedPickup(p);
                          setScheduledDate(p.scheduled_date || p.preferred_date);
                          setScheduledTime(p.scheduled_time || p.preferred_time);
                          setPickupServiceId(p.assigned_to_user_id || '');
                          setScheduleModalOpen(true);
                        }}
                        className="px-3 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg font-bold"
                      >
                        Schedule / Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Users Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">User Directory & Role Permissions</h3>
            <span className="text-xs text-slate-500">{users.length} Users Found</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Address</th>
                  <th className="p-3.5">Green Points</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-[11px] text-slate-400">ID #{u.id}</p>
                    </td>
                    <td className="p-3.5">
                      <p className="text-slate-800">{u.email}</p>
                      <p className="text-[11px] text-slate-500">{u.phone}</p>
                    </td>
                    <td className="p-3.5 text-slate-600 max-w-xs truncate">{u.address}</td>
                    <td className="p-3.5 font-bold text-emerald-700">🌱 {u.green_points} pts</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' : u.role === 'service_team' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-2 py-1 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                      >
                        <option value="citizen">Citizen</option>
                        <option value="service_team">Service Team</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Reuse Listings Moderation */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Reuse Marketplace Listings</h3>
            <span className="text-xs text-slate-500">{listings.length} Listings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Item Title</th>
                  <th className="p-3.5">Type & Category</th>
                  <th className="p-3.5">Condition</th>
                  <th className="p-3.5">Owner</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Moderate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5 font-bold text-slate-900 max-w-xs truncate">{l.title}</td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800">{l.listing_type}</span>
                      <span className="text-slate-400 text-[11px] block">{l.category}</span>
                    </td>
                    <td className="p-3.5 text-slate-600">{l.condition}</td>
                    <td className="p-3.5 text-slate-700">{l.owner_name}</td>
                    <td className="p-3.5"><StatusBadge status={l.availability_status} /></td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteListing(l.id)}
                        className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-bold"
                      >
                        Remove Listing
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Recycling Centres */}
      {activeTab === 'centres' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Manage Recycling Centres Directory</h3>
            <button
              onClick={() => {
                setEditingCentreId(null);
                setCentreForm({
                  name: '',
                  address: '',
                  accepted_materials: '',
                  contact_phone: '',
                  contact_email: '',
                  opening_hours: 'Mon-Sat: 8:00 AM - 6:00 PM',
                  description: ''
                });
                setCentreModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
            >
              <Plus size={14} />
              <span>Add Recycling Centre</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {centres.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCentreId(c.id);
                        setCentreForm({
                          name: c.name,
                          address: c.address,
                          accepted_materials: c.accepted_materials,
                          contact_phone: c.contact_phone || '',
                          contact_email: c.contact_email || '',
                          opening_hours: c.opening_hours || '',
                          description: c.description || ''
                        });
                        setCentreModalOpen(true);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCentre(c.id)}
                      className="p-1 text-rose-400 hover:text-rose-700"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">{c.address}</p>
                <div className="pt-1 text-[11px] text-emerald-700 font-semibold">
                  Materials: {c.accepted_materials}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Education Management */}
      {activeTab === 'education' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Manage Waste Segregation Topics</h3>
            <button
              onClick={() => {
                setEditingTopicId(null);
                setTopicForm({
                  title: '',
                  category: 'Dry Waste',
                  description: '',
                  examples: '',
                  disposal_action: '',
                  icon: 'Package'
                });
                setTopicModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
            >
              <Plus size={14} />
              <span>Add Topic</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {t.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">{t.title}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTopicId(t.id);
                        setTopicForm({
                          title: t.title,
                          category: t.category,
                          description: t.description,
                          examples: t.examples,
                          disposal_action: t.disposal_action,
                          icon: t.icon || 'Package'
                        });
                        setTopicModalOpen(true);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(t.id)}
                      className="p-1 text-rose-400 hover:text-rose-700"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600">{t.description}</p>
                <p className="text-[11px] text-slate-500"><strong>Examples:</strong> {t.examples}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Assign Complaint */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign Service Personnel: ${selectedComplaint?.complaint_id}`}
      >
        <form onSubmit={handleAssignComplaint} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Service Team Member *</label>
            <select
              required
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- Choose Personnel --</option>
              {serviceMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assignment Directive / Notes</label>
            <textarea
              rows={2}
              value={assignNote}
              onChange={(e) => setAssignNote(e.target.value)}
              placeholder="e.g. Prioritize morning clearing before school gates open..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Override Priority */}
      <Modal
        isOpen={priorityModalOpen}
        onClose={() => setPriorityModalOpen(false)}
        title={`Override Priority: ${selectedComplaint?.complaint_id}`}
      >
        <form onSubmit={handleOverridePriority} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Priority *</label>
            <select
              value={overridePriorityVal}
              onChange={(e) => setOverridePriorityVal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Reason for Override *</label>
            <textarea
              required
              rows={2}
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="e.g. VIP corridor visit scheduled; urgent public safety override."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setPriorityModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Apply Override
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Schedule Pickup */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title={`Schedule Waste Pickup: ${selectedPickup?.pickup_id}`}
      >
        <form onSubmit={handleSchedulePickup} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirmed Date *</label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Time Slot *</label>
              <input
                type="text"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="e.g. 10:00 AM - 12:00 PM"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assign Service Team Personnel</label>
            <select
              value={pickupServiceId}
              onChange={(e) => setPickupServiceId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            >
              <option value="">-- Optional / Keep Unassigned --</option>
              {serviceMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setScheduleModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Recycling Centre Add/Edit */}
      <Modal
        isOpen={centreModalOpen}
        onClose={() => setCentreModalOpen(false)}
        title={editingCentreId ? 'Edit Recycling Centre' : 'Add New Recycling Centre'}
      >
        <form onSubmit={handleSaveCentre} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Centre Name *</label>
            <input
              type="text"
              required
              value={centreForm.name}
              onChange={(e) => setCentreForm({ ...centreForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Address *</label>
            <input
              type="text"
              required
              value={centreForm.address}
              onChange={(e) => setCentreForm({ ...centreForm, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Accepted Materials (comma separated) *</label>
            <input
              type="text"
              required
              placeholder="Plastic, Paper, Glass, Metal, E-waste"
              value={centreForm.accepted_materials}
              onChange={(e) => setCentreForm({ ...centreForm, accepted_materials: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact Phone</label>
              <input
                type="text"
                value={centreForm.contact_phone}
                onChange={(e) => setCentreForm({ ...centreForm, contact_phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Opening Hours</label>
              <input
                type="text"
                value={centreForm.opening_hours}
                onChange={(e) => setCentreForm({ ...centreForm, opening_hours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setCentreModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              Save Centre
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Education Topic Add/Edit */}
      <Modal
        isOpen={topicModalOpen}
        onClose={() => setTopicModalOpen(false)}
        title={editingTopicId ? 'Edit Educational Topic' : 'Add Educational Topic'}
      >
        <form onSubmit={handleSaveTopic} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Topic Title *</label>
            <input
              type="text"
              required
              value={topicForm.title}
              onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
            <select
              value={topicForm.category}
              onChange={(e) => setTopicForm({ ...topicForm, category: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold"
            >
              <option value="Wet Waste">Wet Waste</option>
              <option value="Dry Waste">Dry Waste</option>
              <option value="E-Waste">E-Waste</option>
              <option value="Hazardous Waste">Hazardous Waste</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description *</label>
            <textarea
              required
              rows={2}
              value={topicForm.description}
              onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Common Examples *</label>
            <input
              type="text"
              required
              placeholder="e.g. Cardboard boxes, newspapers, bottles"
              value={topicForm.examples}
              onChange={(e) => setTopicForm({ ...topicForm, examples: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Disposal Action *</label>
            <textarea
              required
              rows={2}
              value={topicForm.disposal_action}
              onChange={(e) => setTopicForm({ ...topicForm, disposal_action: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setTopicModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              Save Topic
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
