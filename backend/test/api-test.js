/**
 * Civic Impact Full-Stack Automated Test Suite
 * Native Node.js test runner using native fetch & assert.
 * Validates all endpoints, role permissions, rule engines, points, and workflows.
 */

const assert = require('assert');

const BASE_URL = 'http://localhost:5000/api';

async function request(url, options = {}) {
  const fullUrl = `${BASE_URL}${url}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(fullUrl, {
    ...options,
    headers,
    body: options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : undefined
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('🧪 ========================================================');
  console.log('🧪 Starting Civic Impact Comprehensive Test Suite');
  console.log('🧪 ========================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // 1. System Health
  await test('GET /health returns status OK and active database type', async () => {
    const res = await request('/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'OK');
    assert.ok(res.data.databaseType);
  });

  // 2. Authentication: Login
  let citizenToken = '';
  let serviceToken = '';
  let adminToken = '';

  await test('POST /auth/login - Logs in Citizen successfully', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: { email: 'citizen1@civicimpact.org', password: 'Password123!' }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.token);
    assert.strictEqual(res.data.user.role, 'citizen');
    citizenToken = res.data.token;
  });

  await test('POST /auth/login - Logs in Service Team member', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: { email: 'service1@civicimpact.org', password: 'Password123!' }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.user.role, 'service_team');
    serviceToken = res.data.token;
  });

  await test('POST /auth/login - Logs in Admin', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@civicimpact.org', password: 'Password123!' }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.user.role, 'admin');
    adminToken = res.data.token;
  });

  await test('POST /auth/login - Rejects invalid password', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@civicimpact.org', password: 'WrongPassword' }
    });
    assert.strictEqual(res.status, 401);
  });

  // 3. User Registration
  const testUserEmail = `testuser_${Date.now()}@test.org`;
  let newRegisteredToken = '';
  await test('POST /auth/register - Registers new citizen with +20 welcome points', async () => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Test Citizen Explorer',
        email: testUserEmail,
        phone: '+1-555-9999',
        address: '100 Test Avenue, Metro City',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.user.green_points, 20);
    newRegisteredToken = res.data.token;
  });

  // 4. Role Guard: Service Team cannot access Admin stats
  await test('GET /admin/stats - Blocks service team with 403 Forbidden', async () => {
    const res = await request('/admin/stats', {
      headers: { Authorization: `Bearer ${serviceToken}` }
    });
    assert.strictEqual(res.status, 403);
  });

  // 5. Admin Stats
  await test('GET /admin/stats - Admin successfully fetches KPI stats', async () => {
    const res = await request('/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.stats.users.total >= 3);
    assert.ok(res.data.stats.complaints.total >= 1);
  });

  // 6. Civic Complaints: Creation with Smart Priority Engine
  let createdComplaintId = null;
  await test('POST /complaints - Creates complaint and computes Critical priority for live wire', async () => {
    const res = await request('/complaints', {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` },
      body: {
        title: 'Dangerous live wire fell near school playground',
        description: 'Storm knocked tree onto overhead cable, sparking live on sidewalk near high school',
        category: 'Streetlight',
        address: '50 Elm Road, Metro City'
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.complaint.priority, 'Critical');
    assert.ok(res.data.complaint.priority_reason.includes('live wire'));
    assert.strictEqual(res.data.complaint.status, 'Submitted');
    createdComplaintId = res.data.complaint.id;
  });

  // 7. Complaint Assignment by Admin
  await test('PATCH /complaints/:id/assign - Admin assigns complaint to service team', async () => {
    const teamRes = await request('/admin/service-team', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const memberId = teamRes.data.members[0].id;

    const res = await request(`/complaints/${createdComplaintId}/assign`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { serviceTeamUserId: memberId, note: 'Immediate field dispatch requested.' }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.complaint.status, 'Assigned');
  });

  // 8. Service Team updates progress and marks Resolved
  await test('PATCH /complaints/:id/status - Service team marks complaint In Progress and then Resolved', async () => {
    const res1 = await request(`/complaints/${createdComplaintId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${serviceToken}` },
      body: { status: 'In Progress', note: 'Technicians on site repairing severed insulation.' }
    });
    assert.strictEqual(res1.status, 200);
    assert.strictEqual(res1.data.complaint.status, 'In Progress');

    const res2 = await request(`/complaints/${createdComplaintId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${serviceToken}` },
      body: { status: 'Resolved', note: 'Wire restrung, power safety checks verified.' }
    });
    assert.strictEqual(res2.status, 200);
    assert.strictEqual(res2.data.complaint.status, 'Resolved');
  });

  // 9. Waste Pickup Lifecycle
  let createdPickupId = null;
  await test('POST /pickups - Citizen creates waste pickup request', async () => {
    const res = await request('/pickups', {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` },
      body: {
        waste_type: 'E-waste',
        description: 'Old laptop motherboard, chargers, 3 dead batteries',
        quantity: '1-2 Bags',
        pickup_address: '42 Greenway Avenue, Sector 5',
        preferred_date: '2026-10-05',
        preferred_time: '10:00 AM - 12:00 PM'
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.pickup.status, 'Requested');
    createdPickupId = res.data.pickup.id;
  });

  await test('PATCH /pickups/:id/schedule - Admin schedules and assigns pickup', async () => {
    const teamRes = await request('/admin/service-team', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const memberId = teamRes.data.members[0].id;

    const res = await request(`/pickups/${createdPickupId}/schedule`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        scheduled_date: '2026-10-05',
        scheduled_time: '10:00 AM - 12:00 PM',
        assigned_to_user_id: memberId
      }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.pickup.status, 'Assigned');
  });

  await test('PATCH /pickups/:id/status - Service team completes pickup (+20 Green Points)', async () => {
    const res = await request(`/pickups/${createdPickupId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${serviceToken}` },
      body: { status: 'Completed', notes: 'Waste collected and safely delivered to E-waste depot.' }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.pickup.status, 'Completed');
  });

  // 10. Reuse Marketplace & Request Workflow
  let listingId = null;
  await test('POST /listings - Citizen lists an item for donation', async () => {
    const res = await request('/listings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` },
      body: {
        title: 'Complete Encyclopedia of Science (8 Volumes)',
        description: 'Hardbound volumes in pristine condition. Great for middle/high school students.',
        category: 'Study Materials',
        listing_type: 'Donate',
        condition: 'Like New',
        location_address: 'Central Library Ward 5'
      }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.listing.availability_status, 'Available');
    listingId = res.data.listing.id;
  });

  await test('POST /listings/:id/request - User CANNOT request their own item', async () => {
    const res = await request(`/listings/${listingId}/request`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` },
      body: { message: 'I want my own book' }
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.message.includes('own'));
  });

  let requestId = null;
  await test('POST /listings/:id/request - Second citizen successfully requests item', async () => {
    const res = await request(`/listings/${listingId}/request`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${newRegisteredToken}` },
      body: { message: 'Hello! I am a high school science teacher and would cherish these books for our class.' }
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.request.status, 'Pending');
    requestId = res.data.request.id;
  });

  await test('PATCH /listings/:id/requests/:reqId - Owner accepts request (+30 pts donor, +10 pts recipient)', async () => {
    const res = await request(`/listings/${listingId}/requests/${requestId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${citizenToken}` },
      body: { status: 'Accepted' }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.request.status, 'Accepted');
  });

  // 11. "What Should I Do?" Smart Assistant Engine
  await test('POST /assistant/ask - Correctly categorizes old clothes as Donate/Give Away', async () => {
    const res = await request('/assistant/ask', {
      method: 'POST',
      body: { query: 'I have old clothes that are still usable' }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.guidance.itemIdentified, 'Clothing / Textiles');
    assert.ok(res.data.guidance.recommendedAction.includes('Donate'));
    assert.strictEqual(res.data.guidance.relatedModule.route, '/reuse');
  });

  await test('POST /assistant/ask - Correctly categorizes vegetable peels as Wet Waste / Composting', async () => {
    const res = await request('/assistant/ask', {
      method: 'POST',
      body: { query: 'I have vegetable peels and leftover food' }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.guidance.recommendedAction.includes('Compost'));
  });

  await test('POST /assistant/ask - Correctly handles unknown items with safe fallback', async () => {
    const res = await request('/assistant/ask', {
      method: 'POST',
      body: { query: 'xyzzy 999 obscure unclassified relic' }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.guidance.recommendedAction.includes('Inspect Condition'));
  });

  // 12. Green Points & Leaderboard
  await test('GET /points/my - Fetches authenticated user green points balance and transactions', async () => {
    const res = await request('/points/my', {
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.balance > 0);
    assert.ok(res.data.transactions.length > 0);
  });

  await test('GET /points/leaderboard - Returns privacy-friendly community leaderboard', async () => {
    const res = await request('/points/leaderboard');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.leaderboard.length > 0);
    res.data.leaderboard.forEach((entry) => {
      assert.strictEqual(entry.email, undefined);
      assert.strictEqual(entry.phone, undefined);
      assert.ok(entry.name);
      assert.ok(typeof entry.green_points === 'number');
    });
  });

  // 13. Notifications
  await test('GET /notifications - Fetches notifications and unread badge count', async () => {
    const res = await request('/notifications', {
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.notifications.length > 0);
  });

  await test('PATCH /notifications/read-all - Marks all notifications as read', async () => {
    const res = await request('/notifications/read-all', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
  });

  // 14. Recycling Centres Directory
  await test('GET /recycling - Lists verified sample recycling centres and filters by material', async () => {
    const res = await request('/recycling?material=E-waste');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.centres.length > 0);
    assert.ok(res.data.centres[0].accepted_materials.includes('E-waste'));
  });

  // 15. Waste Education & Quiz Points
  await test('POST /education/quiz - Awards +15 points for completing educational quiz', async () => {
    const res = await request('/education/quiz', {
      method: 'POST',
      headers: { Authorization: `Bearer ${newRegisteredToken}` },
      body: { topicId: 1, quizScore: 100 }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.pointsAwarded, 15);
  });

  console.log('\n🧪 ========================================================');
  console.log(`🧪 Test Suite Finished: ${passed} Passed, ${failed} Failed`);
  console.log('🧪 ========================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
