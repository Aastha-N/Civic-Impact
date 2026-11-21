const bcrypt = require('bcryptjs');
const { setupDatabase, query } = require('../config/db');

async function seedData() {
  console.log('🌱 Starting Civic Impact database seeding...');
  await setupDatabase();

  const defaultPassword = 'Password123!';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(defaultPassword, salt);

  // 1. Seed Users (Admin, Service Team, Citizens)
  console.log('Inserting demo users...');
  const usersToInsert = [
    {
      name: 'Municipal Admin',
      email: 'admin@civicimpact.org',
      phone: '+1-555-0100',
      address: 'City Hall Civic Center, Room 402, Metro City',
      role: 'admin',
      green_points: 50
    },
    {
      name: 'Alex Rivera (Zone Sanitation Lead)',
      email: 'service1@civicimpact.org',
      phone: '+1-555-0101',
      address: 'Municipal Depot 4, Ward 7, Metro City',
      role: 'service_team',
      green_points: 120
    },
    {
      name: 'Priya Sharma (Public Works Engineer)',
      email: 'service2@civicimpact.org',
      phone: '+1-555-0102',
      address: 'Civic Works Division, Ward 12, Metro City',
      role: 'service_team',
      green_points: 90
    },
    {
      name: 'Amina Diallo',
      email: 'citizen1@civicimpact.org',
      phone: '+1-555-0103',
      address: '42 Greenway Avenue, Sector 5, Metro City',
      role: 'citizen',
      green_points: 310
    },
    {
      name: 'Marcus Chen',
      email: 'citizen2@civicimpact.org',
      phone: '+1-555-0104',
      address: '108 Oakridge Boulevard, Sector 8, Metro City',
      role: 'citizen',
      green_points: 260
    },
    {
      name: 'Elena Vance',
      email: 'citizen3@civicimpact.org',
      phone: '+1-555-0105',
      address: '77 Meadow Lane, Sector 3, Metro City',
      role: 'citizen',
      green_points: 185
    }
  ];

  const userIds = {};

  for (const u of usersToInsert) {
    const existing = await query('SELECT id FROM users WHERE email = $1', [u.email]);
    if (existing.rows.length === 0) {
      const res = await query(
        `INSERT INTO users (name, email, phone, password_hash, address, role, green_points, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING id, email;`,
        [u.name, u.email, u.phone, passwordHash, u.address, u.role, u.green_points]
      );
      userIds[u.email] = res.rows[0].id;
    } else {
      userIds[u.email] = existing.rows[0].id;
    }
  }

  // 2. Seed Educational Content
  console.log('Inserting educational content...');
  const educationTopics = [
    {
      title: 'Wet Waste (Organic / Biodegradable)',
      category: 'Wet Waste',
      description: 'Organic matters that decompose naturally under microbial action without releasing synthetic toxic residues.',
      examples: 'Vegetable peels, fruit rinds, leftover food, tea leaves, eggshells, dried leaves, garden cuttings, biodegradable paper towels.',
      disposal_action: 'Segregate in green household bins. Never mix with plastic wrap. Ideal for home composting or municipal aerobic digestors.',
      icon: 'Apple'
    },
    {
      title: 'Dry Waste (Recyclable Solids)',
      category: 'Dry Waste',
      description: 'Non-biodegradable, clean, recyclable materials that can be remanufactured into secondary consumer items.',
      examples: 'Cardboard boxes, newspaper, clean plastic containers, PET bottles, soda cans, aluminum foil, glass bottles, metal jars.',
      disposal_action: 'Rinse container food residues thoroughly, dry completely, flatten boxes, and place in blue recyclables bin or book a pickup.',
      icon: 'Package'
    },
    {
      title: 'E-Waste (Electrical & Electronics)',
      category: 'E-Waste',
      description: 'Discarded electronics harboring valuable metals alongside hazardous toxins like lead, mercury, beryllium, and cadmium.',
      examples: 'Dead smartphones, lithium batteries, frayed chargers, circuit boards, discarded laptops, computer mice, remote controls.',
      disposal_action: 'Strictly do NOT discard in general garbage. Drop off at certified municipal E-Waste collection points or request specialized pickup.',
      icon: 'Cpu'
    },
    {
      title: 'Domestic Hazardous Waste',
      category: 'Hazardous Waste',
      description: 'Household chemicals and bio-medical leftovers that cause severe environmental poisoning or physical danger to collectors.',
      examples: 'Expired medicines, hypodermic needles, paint cans, turpentine, drain cleaners, fluorescent tube lights, pesticide containers.',
      disposal_action: 'Wrap sharp items in puncture-proof boxes. Deliver medicines to pharmacy return drives. Keep chemicals in sealed original containers.',
      icon: 'AlertTriangle'
    }
  ];

  for (const topic of educationTopics) {
    const existing = await query('SELECT id FROM educational_content WHERE title = $1', [topic.title]);
    if (existing.rows.length === 0) {
      await query(
        `INSERT INTO educational_content (title, category, description, examples, disposal_action, icon, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
        [topic.title, topic.category, topic.description, topic.examples, topic.disposal_action, topic.icon]
      );
    }
  }

  // 3. Seed Recycling Centres (Fictional / Sample marked clearly)
  console.log('Inserting sample recycling centres...');
  const centres = [
    {
      name: 'Metro Eco-Recycle Hub (Sample Demo Centre)',
      address: 'Plot 14, Industrial Zone North, Metro City',
      location_lat: 28.6139,
      location_lng: 77.2090,
      accepted_materials: 'Plastic, Cardboard, Paper, Metal, Glass',
      contact_phone: '+1-555-0211',
      contact_email: 'ecohub.demo@civicimpact.org',
      opening_hours: 'Mon-Sat: 8:00 AM - 7:00 PM',
      description: '[DEMO DATA] State-of-the-art municipal sorting station equipped for high-density baling and glass cullet processing.'
    },
    {
      name: 'GreenFuture E-Waste Recovery Unit (Sample Demo Centre)',
      address: '88 Tech Boulevard, Silicon Park, Metro City',
      location_lat: 28.6280,
      location_lng: 77.2180,
      accepted_materials: 'E-waste, Mobile Phones, Batteries, Computers, Chargers',
      contact_phone: '+1-555-0212',
      contact_email: 'ewaste.demo@civicimpact.org',
      opening_hours: 'Mon-Fri: 9:00 AM - 5:30 PM',
      description: '[DEMO DATA] Certified electronics dismantling facility ensuring zero-landfill hydrometallurgical component recovery.'
    },
    {
      name: 'Central Compost & Bio-Refinery (Sample Demo Centre)',
      address: '20 Agro-Link Road, Green Belt, Metro City',
      location_lat: 28.5950,
      location_lng: 77.1980,
      accepted_materials: 'Wet Waste, Garden Waste, Organic Kitchen Scraps',
      contact_phone: '+1-555-0213',
      contact_email: 'compost.demo@civicimpact.org',
      opening_hours: 'Daily: 7:00 AM - 4:00 PM',
      description: '[DEMO DATA] Aerobic windrow composting unit providing enriched organic compost back to community urban gardens.'
    },
    {
      name: 'Civic Metal & Scrap Salvage Yard (Sample Demo Centre)',
      address: '302 Freight Corridor Road, Metro City',
      location_lat: 28.6400,
      location_lng: 77.2300,
      accepted_materials: 'Metal, Aluminum Cans, Copper Wire, Scrap Steel',
      contact_phone: '+1-555-0214',
      contact_email: 'metalsalvage.demo@civicimpact.org',
      opening_hours: 'Mon-Sat: 8:30 AM - 6:00 PM',
      description: '[DEMO DATA] Licensed scrap drop-off offering fair weight vouchers and immediate container recycling.'
    }
  ];

  for (const c of centres) {
    const existing = await query('SELECT id FROM recycling_centres WHERE name = $1', [c.name]);
    if (existing.rows.length === 0) {
      await query(
        `INSERT INTO recycling_centres (name, address, location_lat, location_lng, accepted_materials, contact_phone, contact_email, opening_hours, description, is_sample, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1, CURRENT_TIMESTAMP)`,
        [c.name, c.address, c.location_lat, c.location_lng, c.accepted_materials, c.contact_phone, c.contact_email, c.opening_hours, c.description]
      );
    }
  }

  // 4. Seed Complaints
  console.log('Inserting sample civic complaints...');
  const complaints = [
    {
      complaint_id: 'CMP-2026-1001',
      user_email: 'citizen1@civicimpact.org',
      title: 'Overflowing commercial dumpster outside St. Jude Hospital',
      description: 'Garbage has not been cleared for three days. Hospital visitors and pedestrians are facing severe foul smell and stray animals are scattering medical refuse.',
      category: 'Garbage/Waste',
      address: 'Main Gate, St. Jude Hospital Road, Sector 5, Metro City',
      location_lat: 28.6145,
      location_lng: 77.2085,
      priority: 'High',
      priority_reason: 'Municipal waste collection required; High impact area/factor identified: "hospital", "overflowing", "foul smell" (Calculated Score: 35)',
      status: 'In Progress',
      assigned_to_email: 'service1@civicimpact.org'
    },
    {
      complaint_id: 'CMP-2026-1002',
      user_email: 'citizen2@civicimpact.org',
      title: 'Deep pothole causing accidents near Metro Station exit',
      description: 'Large sinkhole/deep pothole formed right after monsoon rains. Two two-wheelers skidded last night. Immediate cold patching needed.',
      category: 'Pothole/Road',
      address: 'Gate 2 Metro Plaza, Central Avenue, Metro City',
      location_lat: 28.6250,
      location_lng: 77.2150,
      priority: 'Critical',
      priority_reason: 'Road infrastructure impacts traffic and vehicle safety; Critical safety alert triggered by keyword: "accident", "deep pothole" (Calculated Score: 55)',
      status: 'Assigned',
      assigned_to_email: 'service2@civicimpact.org'
    },
    {
      complaint_id: 'CMP-2026-1003',
      user_email: 'citizen3@civicimpact.org',
      title: 'Main pipeline water leakage wasting clean drinking water',
      description: 'Subterranean supply pipe burst. Clean drinking water flooding pedestrian pathway for the past 24 hours.',
      category: 'Water Leakage',
      address: 'Corner of 4th Cross and Pine Street, Sector 3, Metro City',
      location_lat: 28.6010,
      location_lng: 77.1950,
      priority: 'High',
      priority_reason: 'Water supply loss and potential road erosion; High impact area/factor identified: "burst pipe", "drinking water" (Calculated Score: 40)',
      status: 'Resolved',
      assigned_to_email: 'service2@civicimpact.org',
      resolution_notes: 'Excavation team replaced cracked PVC collar and pressure-tested line. Pathway restored.'
    },
    {
      complaint_id: 'CMP-2026-1004',
      user_email: 'citizen1@civicimpact.org',
      title: 'Non-functional streetlights along Girls High School walkway',
      description: 'Four consecutive sodium vapor poles are dark. Creates unsafe dark corridor for evening tuition students.',
      category: 'Streetlight',
      address: 'Lane 7, Behind Government Girls High School, Sector 5, Metro City',
      location_lat: 28.6180,
      location_lng: 77.2110,
      priority: 'High',
      priority_reason: 'Lighting affects nighttime pedestrian safety; High impact area/factor identified: "school" (Calculated Score: 30)',
      status: 'Under Review'
    }
  ];

  for (const cmp of complaints) {
    const existing = await query('SELECT id FROM complaints WHERE complaint_id = $1', [cmp.complaint_id]);
    if (existing.rows.length === 0) {
      const uId = userIds[cmp.user_email];
      const assignedId = cmp.assigned_to_email ? userIds[cmp.assigned_to_email] : null;

      const res = await query(
        `INSERT INTO complaints (
          complaint_id, user_id, title, description, category, address,
          location_lat, location_lng, priority, priority_reason, status,
          assigned_to_user_id, resolution_notes, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id;`,
        [
          cmp.complaint_id, uId, cmp.title, cmp.description, cmp.category, cmp.address,
          cmp.location_lat, cmp.location_lng, cmp.priority, cmp.priority_reason, cmp.status,
          assignedId, cmp.resolution_notes || null
        ]
      );

      const compDbId = res.rows[0].id;
      // Add timeline entry
      await query(
        `INSERT INTO complaint_updates (complaint_id, user_id, status_from, status_to, note, created_at)
         VALUES ($1, $2, NULL, $3, 'Initial complaint logged and categorized.', CURRENT_TIMESTAMP)`,
        [compDbId, uId, cmp.status]
      );
    }
  }

  // 5. Seed Waste Pickup Requests
  console.log('Inserting sample waste pickup requests...');
  const pickups = [
    {
      pickup_id: 'WPK-2026-101',
      user_email: 'citizen1@civicimpact.org',
      waste_type: 'Dry Waste',
      description: 'Four boxes of clean flattened corrugated cardboard and unsoiled office paper.',
      quantity: '2-4 Bags / Bundles',
      pickup_address: '42 Greenway Avenue, Sector 5, Metro City',
      preferred_date: '2026-10-02',
      preferred_time: '10:00 AM - 12:00 PM',
      status: 'Assigned',
      assigned_to_email: 'service1@civicimpact.org'
    },
    {
      pickup_id: 'WPK-2026-102',
      user_email: 'citizen2@civicimpact.org',
      waste_type: 'E-waste',
      description: 'Old CRT monitor, 2 broken laptops, tangled charging cables, and old power banks.',
      quantity: 'Medium Cart (10-25 kg)',
      pickup_address: '108 Oakridge Boulevard, Sector 8, Metro City',
      preferred_date: '2026-10-03',
      preferred_time: '02:00 PM - 04:00 PM',
      status: 'Requested'
    },
    {
      pickup_id: 'WPK-2026-103',
      user_email: 'citizen3@civicimpact.org',
      waste_type: 'Plastic',
      description: 'Clean rinsed beverage containers and HDPE detergent jugs collected over the past month.',
      quantity: '1-2 Bags',
      pickup_address: '77 Meadow Lane, Sector 3, Metro City',
      preferred_date: '2026-09-28',
      preferred_time: '09:00 AM - 11:00 AM',
      status: 'Completed',
      assigned_to_email: 'service1@civicimpact.org',
      notes: 'Picked up on schedule and routed to Eco-Recycle Hub.'
    }
  ];

  for (const p of pickups) {
    const existing = await query('SELECT id FROM waste_pickup_requests WHERE pickup_id = $1', [p.pickup_id]);
    if (existing.rows.length === 0) {
      await query(
        `INSERT INTO waste_pickup_requests (
          pickup_id, user_id, waste_type, description, quantity, pickup_address,
          preferred_date, preferred_time, status, assigned_to_user_id, notes,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          p.pickup_id, userIds[p.user_email], p.waste_type, p.description, p.quantity,
          p.pickup_address, p.preferred_date, p.preferred_time, p.status,
          p.assigned_to_email ? userIds[p.assigned_to_email] : null, p.notes || null
        ]
      );
    }
  }

  // 6. Seed Reuse / Donate Listings
  console.log('Inserting sample reuse listings...');
  const listings = [
    {
      title: 'Complete Set of Engineering Physics & Calculus Textbooks',
      description: 'Hardcover university textbooks in excellent condition with clear diagrams. Perfect for first-year undergraduate engineering students.',
      category: 'Study Materials',
      listing_type: 'Donate',
      condition: 'Like New',
      location_address: 'Sector 5 Civic Library Drop, Metro City',
      user_email: 'citizen1@civicimpact.org',
      availability_status: 'Available'
    },
    {
      title: 'Solid Oak Study Desk & Ergonomic Swivel Chair',
      description: 'Sturdy wooden desk with two pull-out drawers. Fully functional chair with minor fabric scuff on side. Upgrading office, giving away free.',
      category: 'Furniture',
      listing_type: 'Give Away',
      condition: 'Gently Used',
      location_address: 'Oakridge Neighborhood Center, Sector 8, Metro City',
      user_email: 'citizen2@civicimpact.org',
      availability_status: 'Available'
    },
    {
      title: 'Child Bicycle (Ages 6-9) with Training Wheels',
      description: 'Red bicycle, tires in great condition, brakes tuned up. Outgrown by our son. Ready for another kid to ride!',
      category: 'Toys',
      listing_type: 'Reuse',
      condition: 'Functional',
      location_address: 'Meadow Lane Park Gate, Sector 3, Metro City',
      user_email: 'citizen3@civicimpact.org',
      availability_status: 'Available'
    },
    {
      title: 'Winter Coats & Woolen Blankets (Clean & Washed)',
      description: 'Three freshly laundered heavy winter jackets (Medium & Large) and two double-bed blankets for anyone who needs them.',
      category: 'Clothes',
      listing_type: 'Donate',
      condition: 'Gently Used',
      location_address: 'Greenway Community Hall, Sector 5, Metro City',
      user_email: 'citizen1@civicimpact.org',
      availability_status: 'Available'
    }
  ];

  for (const l of listings) {
    const existing = await query('SELECT id FROM reuse_listings WHERE title = $1', [l.title]);
    if (existing.rows.length === 0) {
      await query(
        `INSERT INTO reuse_listings (
          user_id, title, description, category, listing_type, condition,
          location_address, availability_status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [userIds[l.user_email], l.title, l.description, l.category, l.listing_type, l.condition, l.location_address, l.availability_status]
      );
    }
  }

  // 7. Seed Green Points Transactions
  console.log('Inserting green point transactions...');
  const pointLogs = [
    { email: 'citizen1@civicimpact.org', pts: 20, type: 'Welcome Bonus', desc: 'Joined Civic Impact Community' },
    { email: 'citizen1@civicimpact.org', pts: 10, type: 'Civic Complaint Submission', desc: 'Reported issue: CMP-2026-1001' },
    { email: 'citizen1@civicimpact.org', pts: 30, type: 'Item Donation', desc: 'Donated Winter Coats & Blankets' },
    { email: 'citizen2@civicimpact.org', pts: 20, type: 'Welcome Bonus', desc: 'Joined Civic Impact Community' },
    { email: 'citizen2@civicimpact.org', pts: 10, type: 'Civic Complaint Submission', desc: 'Reported issue: CMP-2026-1002' },
    { email: 'citizen2@civicimpact.org', pts: 20, type: 'Item Give Away', desc: 'Gave away Study Desk & Chair' },
    { email: 'citizen3@civicimpact.org', pts: 20, type: 'Welcome Bonus', desc: 'Joined Civic Impact Community' },
    { email: 'citizen3@civicimpact.org', pts: 10, type: 'Civic Complaint Submission', desc: 'Reported issue: CMP-2026-1003' },
    { email: 'citizen3@civicimpact.org', pts: 25, type: 'Complaint Resolution', desc: 'Issue CMP-2026-1003 resolved' },
    { email: 'citizen3@civicimpact.org', pts: 20, type: 'Waste Pickup Completed', desc: 'Handed over clean plastics' }
  ];

  for (const pl of pointLogs) {
    const uId = userIds[pl.email];
    if (uId) {
      const existing = await query(
        'SELECT id FROM green_point_transactions WHERE user_id = $1 AND activity_type = $2 AND description = $3',
        [uId, pl.type, pl.desc]
      );
      if (existing.rows.length === 0) {
        await query(
          `INSERT INTO green_point_transactions (user_id, points, activity_type, description, created_at)
           VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
          [uId, pl.pts, pl.type, pl.desc]
        );
      }
    }
  }

  // 8. Seed Notifications
  console.log('Inserting sample notifications...');
  const notifs = [
    {
      email: 'citizen1@civicimpact.org',
      title: 'Welcome to Civic Impact! 🌍',
      message: 'Thank you for taking a step towards a cleaner, smarter city. Explore civic complaints, waste pickup, and reuse marketplace.',
      type: 'system'
    },
    {
      email: 'citizen1@civicimpact.org',
      title: 'Complaint Under Review',
      message: 'Your complaint #CMP-2026-1001 is being handled by Zone Sanitation Lead.',
      type: 'complaint'
    },
    {
      email: 'service1@civicimpact.org',
      title: 'New Complaint Assignment',
      message: 'You have been assigned to handle complaint #CMP-2026-1001 at St. Jude Hospital.',
      type: 'complaint'
    }
  ];

  for (const n of notifs) {
    const uId = userIds[n.email];
    if (uId) {
      await query(
        `INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
         VALUES ($1, $2, $3, $4, 0, CURRENT_TIMESTAMP)`,
        [uId, n.title, n.message, n.type]
      );
    }
  }

  console.log('✅ Demo seed data successfully populated!');
}

// Execute if run directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('🎉 Seeding completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = { seedData };
