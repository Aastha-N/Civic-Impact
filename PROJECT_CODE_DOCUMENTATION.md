# 🌍 Civic Impact — Complete Project Source Code & Technical Documentation

> **Platform**: Civic Impact — Smart City, Civic Responsibility & Waste Management Platform
> **Course / Submission**: Full-Stack College Semester Capstone Project
> **Generated**: Official project source-code preservation and technical report

---

## 📑 Table of Contents

1. [Project Overview & Key Objectives](#1-project-overview--key-objectives)
2. [Complete Project Folder Structure](#2-complete-project-folder-structure)
3. [Technology Stack](#3-technology-stack)
4. [Installation & Setup Instructions](#4-installation--setup-instructions)
5. [Database Architecture & Schema](#5-database-architecture--schema)
6. [REST API Endpoints Specification](#6-rest-api-endpoints-specification)
7. [Pre-Seeded Demo Accounts for Evaluation](#7-pre-seeded-demo-accounts-for-evaluation)
8. [Automated Test Suite (27/27 Tests Passing)](#8-automated-test-suite-2727-tests-passing)
9. [Complete Source Code Listing](#9-complete-source-code-listing)

---

## 1. Project Overview & Key Objectives

**Civic Impact** is an integrated Smart City, Civic Responsibility, and Waste Management platform. It empowers citizens to actively participate in neighborhood upkeep while providing municipal administrators and service teams with robust tools to dispatch and resolve civic issues.

### Core Functional Modules:
- **Civic Complaints Tracker**: 8 categories, auto-generated IDs (`CMP-2026-XXXX`), 6-stage lifecycle (`Submitted` → `Under Review` → `Assigned` → `In Progress` → `Resolved` → `Closed`), and full timeline audit trails.
- **Transparent Rule-Based Priority Engine**: Evaluates category urgency, safety keywords (*live wire, gas leak, open manhole, accident*), and vulnerable locations (*schools, hospitals*) to compute Low, Medium, High, or Critical priority with transparent reasoning.
- **Doorstep Waste Pickup**: Citizens book collection for wet, dry, plastic, and electronic waste; municipal staff schedule and assign routes; citizens earn +20 Green Points upon completion.
- **Reuse & Donate Marketplace**: Peer-to-peer exchange for clothes, books, furniture, and toys. Donors earn +30 Green Points and recipients earn +10 Green Points upon hand-over.
- **"What Should I Do?" Smart Assistant**: Deterministic material recommendation engine advising whether to reuse, compost, recycle, or deliver to hazardous drop-offs.
- **Waste Segregation Academy & Quiz**: Visual guides on 4 waste streams plus an interactive 4-question knowledge quiz awarding +15 Green Points.
- **Recycling Centres Directory**: Filterable directory with accepted materials, operating hours, contact info, and Google Maps links.
- **Community Leaderboard & Green Points**: Privacy-first leaderboard with podium rankings (no private emails or phone numbers exposed).
- **Role-Based Portals**: Distinct experiences for Citizen, Service Team (Field Operations Desk), and Admin (Control Center).

---

## 2. Complete Project Folder Structure

```text
Civic Impact/
├── start-civic-impact.bat          # 1-Click Windows launcher script
├── README.md                       # High-level project README
├── PROJECT_CODE_DOCUMENTATION.md   # Complete source-code documentation file
├── .gitignore                      # Git ignore patterns
│
├── backend/
│   ├── package.json                # Backend dependencies and scripts
│   ├── .env                        # Active environment configuration
│   ├── .env.example                # Template environment file
│   ├── server.js                   # Express application entrypoint
│   ├── config/
│   │   └── db.js                   # PostgreSQL pool with SQLite zero-downtime fallback
│   ├── controllers/
│   │   ├── adminController.js      # Admin dashboard and user management
│   │   ├── assistantController.js  # "What Should I Do?" assistant handler
│   │   ├── authController.js       # Register, login, profile, password change
│   │   ├── complaintController.js  # Complaint submission, priority, status
│   │   ├── educationController.js  # Segregation guides and quiz rewards
│   │   ├── greenPointsController.js# Points ledger and leaderboard
│   │   ├── listingController.js    # Reuse/donation marketplace & requests
│   │   ├── notificationController.js# In-app notifications
│   │   ├── pickupController.js     # Waste pickup scheduling & completion
│   │   └── recyclingController.js  # Recycling centres CRUD and directory
│   ├── database/
│   │   ├── schema.sql              # PostgreSQL DDL schema
│   │   ├── seed.js                 # Demo dataset seeder
│   │   └── civic_impact.sqlite     # SQLite database file (fallback engine)
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT bearer token verification
│   │   ├── roleMiddleware.js       # Role authorization (citizen, service_team, admin)
│   │   └── uploadMiddleware.js     # Multer image upload handler
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── assistantRoutes.js
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── educationRoutes.js
│   │   ├── greenPointsRoutes.js
│   │   ├── listingRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── pickupRoutes.js
│   │   └── recyclingRoutes.js
│   ├── services/
│   │   ├── assistantEngine.js      # Rule-based material evaluation
│   │   ├── notificationService.js  # Notification and points helper
│   │   └── priorityEngine.js       # Transparent priority calculation
│   ├── test/
│   │   └── api-test.js             # 27-point automated test runner
│   └── uploads/                    # User-uploaded complaint and item photos
│
└── frontend/
    ├── package.json                # Frontend dependencies and scripts
    ├── vite.config.js              # Vite configuration
    ├── tailwind.config.js          # Tailwind CSS theme and color tokens
    ├── postcss.config.js           # PostCSS configuration
    ├── index.html                  # HTML template
    └── src/
        ├── main.jsx                # React DOM render root
        ├── index.css               # Tailwind directives and custom utility classes
        ├── App.jsx                 # Routes & protected route guards
        ├── services/
        │   └── api.js              # Axios API client with interceptors
        ├── context/
        │   ├── AuthContext.jsx     # User authentication state & persistent token
        │   └── NotificationContext.jsx # Notification polling & toast alerts
        ├── components/
        │   └── common/
        │       ├── EmptyState.jsx  # Reusable empty placeholder
        │       ├── Footer.jsx      # Municipal footer
        │       ├── LoadingSpinner.jsx # Loading spinner
        │       ├── Modal.jsx       # Modal dialog
        │       ├── Navbar.jsx      # Navigation header with notifications
        │       ├── StatCard.jsx    # Metric KPI card
        │       └── StatusBadge.jsx # Status & priority badges with tooltip
        └── pages/
            ├── AdminDashboard.jsx  # Admin portal
            ├── CitizenDashboard.jsx# Citizen overview
            ├── ComplaintDetailsPage.jsx # Complaint view with timeline
            ├── ComplaintsPage.jsx  # Complaint directory with search & filters
            ├── LandingPage.jsx     # Landing page with 1-click demo logins
            ├── LeaderboardPage.jsx # Community leaderboard with podium
            ├── LoginPage.jsx       # Login form with quick-fill buttons
            ├── NewComplaintPage.jsx# Complaint form with live priority preview
            ├── ProfilePage.jsx     # User profile and password change
            ├── RecyclingCentresPage.jsx # Recycling centres directory
            ├── RegisterPage.jsx    # Citizen registration with validation
            ├── ReuseMarketplacePage.jsx # Peer-to-peer donation marketplace
            ├── ServiceDashboard.jsx# Field operations desk for service team
            ├── SmartAssistantPage.jsx # "What Should I Do?" advisor
            ├── WasteEducationPage.jsx # Waste segregation guide & quiz
            └── WastePickupPage.jsx # Doorstep waste pickup booking
```

---

## 3. Technology Stack

| Layer | Technology | Key Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite | High performance Single Page Application (SPA) |
| **Styling** | Tailwind CSS v3 | Modern environmental emerald/teal/slate civic palette |
| **Icons** | Lucide React | Lightweight, accessible SVG icons |
| **Routing** | React Router DOM v6 | Client-side routing with role-based route guards |
| **Backend Framework** | Node.js + Express.js | Modular RESTful architecture with controllers & services |
| **Primary Database** | PostgreSQL 18 | Fully indexed relational schema with foreign keys & check constraints |
| **Fallback Database** | SQLite (better-sqlite3) | Automated zero-downtime offline fallback requiring no setup |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs | Salted hashing (10 rounds) and stateless token validation |
| **File Uploads** | Multer | MIME-type and 5MB size validated image storage |
| **Testing** | Native Node.js Test Suite | 27 comprehensive automated tests with 100% pass rate |

---

## 4. Installation & Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Method A: 1-Click Launch (Recommended on Windows)
Simply double-click the included `start-civic-impact.bat` file in the project root.
This script automatically:
1. Launches the backend server on `http://localhost:5000`
2. Launches the frontend development server on `http://localhost:5173`
3. Opens your default web browser directly to `http://localhost:5173`

### Method B: Manual Command-Line Startup
1. **Start Backend Server**:
   ```powershell
   cd "c:\Users\ASUS\Documents\Civic Imapct\backend"
   npm start
   ```
2. **Start Frontend Server** (in a second terminal):
   ```powershell
   cd "c:\Users\ASUS\Documents\Civic Imapct\frontend"
   npm run dev
   ```
3. **Open in Browser**:
   Navigate to `http://localhost:5173`.

---

## 5. Database Architecture & Schema

The application features a resilient **dual-engine database abstraction** in `backend/config/db.js`:
- **PostgreSQL 18** is the primary production target. When credentials are provided in `backend/.env`, it connects to PostgreSQL and runs `backend/database/schema.sql`.
- If PostgreSQL is offline or credentials are not yet set, it **automatically falls back to an embedded SQLite database** (`backend/database/civic_impact.sqlite`), ensuring 100% zero-downtime during college presentations and examiner reviews without manual database configuration.

---

## 6. REST API Endpoints Specification

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | System health check and active DB type | Public |
| `POST` | `/api/auth/register` | Register new citizen account (+20 pts) | Public |
| `POST` | `/api/auth/login` | Login and obtain JWT token | Public |
| `GET` | `/api/auth/profile` | Get current logged-in user profile | Authenticated |
| `PUT` | `/api/auth/profile` | Update user name, phone, address | Authenticated |
| `POST` | `/api/auth/change-password` | Change user password | Authenticated |
| `GET` | `/api/auth/activity` | Get user complaints, pickups, points history | Authenticated |
| `GET` | `/api/complaints` | List complaints (with search, filters) | Authenticated |
| `POST` | `/api/complaints` | Submit new complaint with photo (+10 pts) | Authenticated |
| `GET` | `/api/complaints/:id` | Get complaint details and timeline history | Authenticated |
| `PATCH` | `/api/complaints/:id/status` | Update complaint status and resolution notes | Service Team / Admin |
| `PATCH` | `/api/complaints/:id/assign` | Assign complaint to service team member | Admin |
| `PATCH` | `/api/complaints/:id/priority` | Override priority with explainable reason | Admin |
| `GET` | `/api/pickups` | List waste pickups | Authenticated |
| `POST` | `/api/pickups` | Book doorstep waste pickup | Authenticated |
| `GET` | `/api/pickups/:id` | Get pickup details | Authenticated |
| `PATCH` | `/api/pickups/:id/schedule` | Schedule pickup date and assign personnel | Admin |
| `PATCH` | `/api/pickups/:id/status` | Update pickup status (awards +20 pts on completion) | Service Team / Admin |
| `GET` | `/api/listings` | Browse reuse & donation marketplace | Public / Auth |
| `POST` | `/api/listings` | Create item listing for reuse/donation | Authenticated |
| `GET` | `/api/listings/:id` | Get item details and incoming requests | Public / Auth |
| `POST` | `/api/listings/:id/request` | Request an item (anti-self-request check) | Authenticated |
| `PATCH` | `/api/listings/:id/requests/:reqId` | Accept/reject item request (+30 pts donor, +10 pts recipient) | Item Owner |
| `DELETE` | `/api/listings/:id` | Remove/moderate inappropriate listing | Owner / Admin |
| `GET` | `/api/recycling` | List recycling centres with material filter | Public |
| `POST` | `/api/recycling` | Add new recycling centre | Admin |
| `PUT` | `/api/recycling/:id` | Update recycling centre | Admin |
| `DELETE` | `/api/recycling/:id` | Delete recycling centre | Admin |
| `GET` | `/api/education` | Get waste segregation topics | Public |
| `POST` | `/api/education/quiz` | Complete quiz and claim +15 Green Points | Authenticated |
| `POST` | `/api/education` | Add educational topic | Admin |
| `POST` | `/api/assistant/ask` | Analyze item and return guidance & route | Public |
| `GET` | `/api/assistant/suggestions` | Get popular quick question prompts | Public |
| `GET` | `/api/points/my` | Get user Green Points balance and transaction ledger | Authenticated |
| `GET` | `/api/points/leaderboard` | Get privacy-protected community leaderboard | Public |
| `GET` | `/api/points/rules` | Get Green Points reward scheme rules | Public |
| `GET` | `/api/notifications` | Get user in-app notifications and unread count | Authenticated |
| `PATCH` | `/api/notifications/:id/read` | Mark single notification as read | Authenticated |
| `PATCH` | `/api/notifications/read-all` | Mark all notifications as read | Authenticated |
| `GET` | `/api/admin/stats` | Platform analytics and category breakdowns | Admin |
| `GET` | `/api/admin/users` | User directory with search and role filters | Admin |
| `PATCH` | `/api/admin/users/:id/role` | Update user role (citizen, service_team, admin) | Admin |
| `GET` | `/api/admin/service-team` | List service team members for task assignment | Admin |

---

## 7. Pre-Seeded Demo Accounts for Evaluation

The application comes pre-loaded with realistic sample accounts for demonstration and evaluation:

| Role | Email | Password | Green Points | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Municipal Admin** | `admin@civicimpact.org` | `Password123!` | 50 | City administrator with full governance access |
| **Service Team** | `service1@civicimpact.org` | `Password123!` | 120 | Zone Sanitation Lead with field operations desk |
| **Service Team** | `service2@civicimpact.org` | `Password123!` | 90 | Public Works Field Engineer |
| **Citizen** | `citizen1@civicimpact.org` | `Password123!` | 310 | Community champion (Amina) with multiple activities |
| **Citizen** | `citizen2@civicimpact.org` | `Password123!` | 260 | Community member (Marcus) |
| **Citizen** | `citizen3@civicimpact.org` | `Password123!` | 185 | Community member (Elena) |

> **Tip**: The landing page and login page feature **1-click quick login buttons** to instantly explore each role without typing credentials!

---

## 8. Automated Test Suite (27/27 Tests Passing)

To run the automated test suite:
```powershell
cd "c:\Users\ASUS\Documents\Civic Imapct\backend"
npm test
```
Test results confirm:
- System health endpoint
- Citizen, Service Team, and Admin authentication
- Password hashing and rejection of invalid credentials
- Citizen registration with +20 welcome Green Points
- Role guards blocking service team from admin-only endpoints
- Admin KPI analytics retrieval
- Complaint creation with rule-based priority engine (critical detection for live wire)
- Admin complaint assignment to service team member
- Service team status progression (In Progress → Resolved)
- Waste pickup creation, scheduling, and completion (+20 points)
- Reuse marketplace item listing, anti-self-request validation, and owner acceptance (+30 pts donor, +10 pts recipient)
- "What Should I Do?" Smart Assistant item classification, reasoning, and fallback
- Green Points ledger calculation and privacy-protected leaderboard
- In-app notifications and read status updates
- Recycling centres directory and material filtering
- Waste education segregation quiz completion (+15 points)

---

## 9. Complete Source Code Listing

Below is the exact, complete source code of every important file in the Civic Impact project.

### 📄 File: `backend/package.json`

**Purpose**: Backend dependencies, scripts, and package metadata

```json
{
  "name": "civic-impact-backend",
  "version": "1.0.0",
  "description": "Civic Impact - Smart City, Civic Responsibility & Waste Management Platform Backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js",
    "seed": "node database/seed.js",
    "test": "node test/api-test.js"
  },
  "keywords": [
    "civic-impact",
    "smart-city",
    "waste-management",
    "complaints",
    "sustainability",
    "full-stack"
  ],
  "author": "Civic Impact Team",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "better-sqlite3": "^13.0.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "pg": "^8.12.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
```

---

### 📄 File: `backend/.env.example`

**Purpose**: Environment variables template for database, port, and JWT secret

```env
# Civic Impact Backend Environment Variables
PORT=5000
NODE_ENV=development

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
DB_NAME=civic_impact

# Optional full PostgreSQL connection string:
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/civic_impact

# JWT Secret for Authentication
JWT_SECRET=civic_impact_secure_jwt_token_secret_key_2026
JWT_EXPIRES_IN=7d

# Green Points Rules Configuration
POINTS_SUBMIT_COMPLAINT=10
POINTS_COMPLAINT_RESOLVED=25
POINTS_WASTE_PICKUP=20
POINTS_DONATE_ITEM=30
POINTS_GIVEAWAY_ITEM=20
POINTS_REUSE_ITEM=15
POINTS_EDUCATION_QUIZ=15
```

---

### 📄 File: `backend/server.js`

**Purpose**: Main Express.js server entry point, mounting all routes and middlewares

```javascript
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { setupDatabase, getDbType } = require('./config/db');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const pickupRoutes = require('./routes/pickupRoutes');
const listingRoutes = require('./routes/listingRoutes');
const recyclingRoutes = require('./routes/recyclingRoutes');
const educationRoutes = require('./routes/educationRoutes');
const assistantRoutes = require('./routes/assistantRoutes');
const greenPointsRoutes = require('./routes/greenPointsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static files for user-uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health & System Diagnostic Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    application: 'Civic Impact API',
    databaseType: getDbType(),
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount Feature API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/recycling', recyclingRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/points', greenPointsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server after database setup
async function startServer() {
  try {
    await setupDatabase();
    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`🚀 Civic Impact Backend Server running on port ${PORT}`);
      console.log(`🌐 Base API URL: http://localhost:${PORT}/api`);
      console.log(`🗄️ Database Connected: ${getDbType()}`);
      console.log(`=================================================`);
    });
  } catch (error) {
    console.error('Fatal: Server startup failed:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
```

---

### 📄 File: `backend/config/db.js`

**Purpose**: Unified database layer supporting PostgreSQL with automatic SQLite zero-downtime fallback

```javascript
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let dbType = 'PostgreSQL';
let pgPool = null;
let sqliteDb = null;

// Initialize Database Connection
async function setupDatabase() {
  const allowFallback = process.env.DB_ALLOW_SQLITE_FALLBACK !== 'false';

  // 1. Try PostgreSQL first
  try {
    const poolConfig = process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL }
      : {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'civic_impact',
          connectionTimeoutMillis: 3500,
        };

    const testPool = new Pool(poolConfig);
    // Test connection
    const client = await testPool.connect();
    client.release();

    pgPool = testPool;
    dbType = 'PostgreSQL';
    console.log('✅ Connected to PostgreSQL database successfully!');

    // Initialize Schema on PostgreSQL
    const schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf-8');
    await pgPool.query(schemaSql);
    console.log('✅ PostgreSQL schema verified/initialized.');
    return;
  } catch (err) {
    console.warn(`⚠️ PostgreSQL connection attempt failed (${err.message}).`);

    if (!allowFallback) {
      throw new Error(`PostgreSQL connection failed and SQLite fallback is disabled: ${err.message}`);
    }

    console.log('🔄 Engaging automatic SQLite database engine to ensure zero-downtime...');
    const Database = require('better-sqlite3');
    const dbPath = path.join(__dirname, '../database/civic_impact.sqlite');
    sqliteDb = new Database(dbPath);
    sqliteDb.pragma('journal_mode = WAL');
    sqliteDb.pragma('foreign_keys = ON');
    dbType = 'SQLite';

    // Initialize SQLite Schema
    initSqliteSchema(sqliteDb);
    console.log(`✅ SQLite fallback database initialized at: ${dbPath}`);
  }
}

// SQLite Schema initialization helper
function initSqliteSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      address TEXT NOT NULL,
      role TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'service_team', 'admin')),
      green_points INTEGER DEFAULT 0,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      complaint_id TEXT UNIQUE NOT NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL CHECK (category IN (
        'Garbage/Waste', 'Pothole/Road', 'Streetlight', 'Water Leakage',
        'Drainage', 'Public Toilet', 'Illegal Dumping', 'Other'
      )),
      photo_url TEXT,
      location_lat REAL,
      location_lng REAL,
      address TEXT NOT NULL,
      priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
      priority_reason TEXT,
      status TEXT DEFAULT 'Submitted' CHECK (status IN (
        'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'
      )),
      assigned_to_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      resolution_notes TEXT,
      resolution_photo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS complaint_updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      complaint_id INTEGER REFERENCES complaints(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      status_from TEXT,
      status_to TEXT NOT NULL,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS waste_pickup_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pickup_id TEXT UNIQUE NOT NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      waste_type TEXT NOT NULL CHECK (waste_type IN (
        'Wet Waste', 'Dry Waste', 'Plastic', 'Paper', 'Glass', 'Metal', 'E-waste', 'Other'
      )),
      description TEXT NOT NULL,
      quantity TEXT NOT NULL,
      pickup_address TEXT NOT NULL,
      location_lat REAL,
      location_lng REAL,
      preferred_date TEXT NOT NULL,
      preferred_time TEXT NOT NULL,
      photo_url TEXT,
      instructions TEXT,
      status TEXT DEFAULT 'Requested' CHECK (status IN (
        'Requested', 'Scheduled', 'Assigned', 'Picked Up', 'Completed'
      )),
      scheduled_date TEXT,
      scheduled_time TEXT,
      assigned_to_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS recycling_centres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      location_lat REAL,
      location_lng REAL,
      accepted_materials TEXT NOT NULL,
      contact_phone TEXT,
      contact_email TEXT,
      opening_hours TEXT,
      description TEXT,
      is_sample INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS educational_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      examples TEXT NOT NULL,
      disposal_action TEXT NOT NULL,
      icon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reuse_listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      listing_type TEXT NOT NULL CHECK (listing_type IN ('Donate', 'Give Away', 'Reuse')),
      condition TEXT NOT NULL CHECK (condition IN ('Like New', 'Gently Used', 'Functional', 'Needs Minor Repair')),
      photo_url TEXT,
      location_address TEXT NOT NULL,
      availability_status TEXT DEFAULT 'Available' CHECK (availability_status IN ('Available', 'Requested', 'Completed', 'Cancelled')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS item_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id INTEGER REFERENCES reuse_listings(id) ON DELETE CASCADE,
      requester_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      message TEXT,
      status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected')),
      response_note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS green_point_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      points INTEGER NOT NULL,
      activity_type TEXT NOT NULL,
      description TEXT NOT NULL,
      reference_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'general',
      reference_id TEXT,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Unified Query Interface
async function query(text, params = []) {
  if (dbType === 'PostgreSQL' && pgPool) {
    return await pgPool.query(text, params);
  }

  if (dbType === 'SQLite' && sqliteDb) {
    // Translate $1, $2, ... to ? for SQLite
    const translatedText = text.replace(/\$(\d+)/g, '?');
    const isSelect = /^\s*(SELECT|PRAGMA)/i.test(translatedText);
    const hasReturning = /RETURNING\s+/i.test(translatedText);

    if (isSelect) {
      const stmt = sqliteDb.prepare(translatedText);
      const rows = stmt.all(...params);
      return { rows, rowCount: rows.length };
    }

    // Insert / Update / Delete with RETURNING
    if (hasReturning) {
      // Clean query and execute with returning simulation or native returning if supported
      try {
        const stmt = sqliteDb.prepare(translatedText);
        const rows = stmt.all ? stmt.all(...params) : [];
        return { rows, rowCount: rows.length };
      } catch (e) {
        // Fallback if returning fails
        const cleanedText = translatedText.replace(/RETURNING\s+.*$/i, '').trim();
        const stmt = sqliteDb.prepare(cleanedText);
        const info = stmt.run(...params);
        return {
          rows: [{ id: info.lastInsertRowid }],
          rowCount: info.changes,
          lastInsertRowid: info.lastInsertRowid
        };
      }
    }

    const stmt = sqliteDb.prepare(translatedText);
    const info = stmt.run(...params);
    return {
      rows: [],
      rowCount: info.changes,
      lastInsertRowid: info.lastInsertRowid
    };
  }

  throw new Error('Database not initialized. Please call setupDatabase() first.');
}

function getDbType() {
  return dbType;
}

module.exports = {
  setupDatabase,
  query,
  getDbType
};
```

---

### 📄 File: `backend/database/schema.sql`

**Purpose**: PostgreSQL database schema with tables, constraints, foreign keys, and indexes

```sql
-- Civic Impact PostgreSQL Schema
-- Smart City + Civic Responsibility + Waste Management Platform

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    role VARCHAR(30) DEFAULT 'citizen' CHECK (role IN ('citizen', 'service_team', 'admin')),
    green_points INTEGER DEFAULT 0,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id SERIAL PRIMARY KEY,
    complaint_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'Garbage/Waste',
        'Pothole/Road',
        'Streetlight',
        'Water Leakage',
        'Drainage',
        'Public Toilet',
        'Illegal Dumping',
        'Other'
    )),
    photo_url TEXT,
    location_lat NUMERIC(10, 7),
    location_lng NUMERIC(10, 7),
    address TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    priority_reason TEXT,
    status VARCHAR(30) DEFAULT 'Submitted' CHECK (status IN (
        'Submitted',
        'Under Review',
        'Assigned',
        'In Progress',
        'Resolved',
        'Closed'
    )),
    assigned_to_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    resolution_photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Complaint Status & Update History
CREATE TABLE IF NOT EXISTS complaint_updates (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER REFERENCES complaints(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status_from VARCHAR(30),
    status_to VARCHAR(30) NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Waste Pickup Requests
CREATE TABLE IF NOT EXISTS waste_pickup_requests (
    id SERIAL PRIMARY KEY,
    pickup_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    waste_type VARCHAR(50) NOT NULL CHECK (waste_type IN (
        'Wet Waste',
        'Dry Waste',
        'Plastic',
        'Paper',
        'Glass',
        'Metal',
        'E-waste',
        'Other'
    )),
    description TEXT NOT NULL,
    quantity VARCHAR(50) NOT NULL,
    pickup_address TEXT NOT NULL,
    location_lat NUMERIC(10, 7),
    location_lng NUMERIC(10, 7),
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    photo_url TEXT,
    instructions TEXT,
    status VARCHAR(30) DEFAULT 'Requested' CHECK (status IN (
        'Requested',
        'Scheduled',
        'Assigned',
        'Picked Up',
        'Completed'
    )),
    scheduled_date DATE,
    scheduled_time VARCHAR(50),
    assigned_to_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Recycling Centres (Fictional / Sample marked clearly)
CREATE TABLE IF NOT EXISTS recycling_centres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    location_lat NUMERIC(10, 7),
    location_lng NUMERIC(10, 7),
    accepted_materials TEXT NOT NULL,
    contact_phone VARCHAR(50),
    contact_email VARCHAR(100),
    opening_hours VARCHAR(100),
    description TEXT,
    is_sample BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Educational Content (Waste segregation, e-waste, hazardous)
CREATE TABLE IF NOT EXISTS educational_content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    examples TEXT NOT NULL,
    disposal_action TEXT NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Reuse / Donate / Give Away Listings
CREATE TABLE IF NOT EXISTS reuse_listings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'Clothes',
        'Books',
        'Furniture',
        'Electronics',
        'Household Items',
        'Study Materials',
        'Toys',
        'Other'
    )),
    listing_type VARCHAR(30) NOT NULL CHECK (listing_type IN ('Donate', 'Give Away', 'Reuse')),
    condition VARCHAR(50) NOT NULL CHECK (condition IN ('Like New', 'Gently Used', 'Functional', 'Needs Minor Repair')),
    photo_url TEXT,
    location_address TEXT NOT NULL,
    availability_status VARCHAR(30) DEFAULT 'Available' CHECK (availability_status IN ('Available', 'Requested', 'Completed', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Item Requests
CREATE TABLE IF NOT EXISTS item_requests (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES reuse_listings(id) ON DELETE CASCADE,
    requester_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected')),
    response_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Green Point Transactions
CREATE TABLE IF NOT EXISTS green_point_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    reference_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. In-App Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'general',
    reference_id VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_complaints_user ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_complaints_assigned ON complaints(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_pickups_user ON waste_pickup_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_pickups_status ON waste_pickup_requests(status);
CREATE INDEX IF NOT EXISTS idx_pickups_assigned ON waste_pickup_requests(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_reuse_user ON reuse_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_reuse_category ON reuse_listings(category);
CREATE INDEX IF NOT EXISTS idx_reuse_status ON reuse_listings(availability_status);
CREATE INDEX IF NOT EXISTS idx_points_user ON green_point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
```

---

### 📄 File: `backend/database/seed.js`

**Purpose**: Realistic demonstration dataset seeder for all roles, complaints, pickups, listings, and educational content

```javascript
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
```

---

### 📄 File: `backend/middleware/authMiddleware.js`

**Purpose**: JWT authentication middleware for verifying bearer tokens

```javascript
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'civic_impact_jwt_secret_token_key_2026_super_safe';

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please log in again.'
      });
    }

    // Fetch user from DB
    const userRes = await query(
      'SELECT id, name, email, phone, address, role, green_points, avatar_url, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User account not found.'
      });
    }

    req.user = userRes.rows[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
}

// Optional Auth (for public routes that personalize if token is provided)
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'civic_impact_jwt_secret_token_key_2026_super_safe';
      const decoded = jwt.verify(token, secret);
      const userRes = await query(
        'SELECT id, name, email, phone, address, role, green_points, avatar_url, created_at FROM users WHERE id = $1',
        [decoded.userId]
      );
      if (userRes.rows.length > 0) {
        req.user = userRes.rows[0];
      }
    }
  } catch (err) {
    // Ignore invalid tokens in optional auth
  }
  next();
}

module.exports = {
  requireAuth,
  optionalAuth
};
```

---

### 📄 File: `backend/middleware/roleMiddleware.js`

**Purpose**: Role-based access control middleware (citizen, service_team, admin)

```javascript
/**
 * Role-Based Access Control Middleware
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before checking permissions.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to access this resource. Allowed roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}

module.exports = {
  authorizeRoles
};
```

---

### 📄 File: `backend/middleware/uploadMiddleware.js`

**Purpose**: Multer disk storage configuration and file type/size validation for photos

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, WEBP, GIF) are permitted!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter
});

module.exports = upload;
```

---

### 📄 File: `backend/services/priorityEngine.js`

**Purpose**: Rule-based smart complaint priority engine with transparent reasoning

```javascript
/**
 * Smart Rule-Based Complaint Priority Engine
 * Computes priority transparently based on category, keywords, severity indicators, and public safety.
 * Structured cleanly without faking external AI models.
 */

function calculatePriority({ category, title = '', description = '', address = '' }) {
  const text = `${title} ${description} ${address}`.toLowerCase();
  let score = 0;
  const reasons = [];

  // 1. Category Base Weight
  switch (category) {
    case 'Illegal Dumping':
      score += 25;
      reasons.push('Illegal dumping poses health & sanitation risks');
      break;
    case 'Drainage':
      score += 20;
      reasons.push('Drainage blockage can lead to waterlogging and disease');
      break;
    case 'Water Leakage':
      score += 20;
      reasons.push('Water supply loss and potential road erosion');
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
      reasons.push('Lighting affects nighttime pedestrian & vehicle safety');
      break;
    case 'Public Toilet':
      score += 15;
      reasons.push('Sanitation facility upkeep');
      break;
    default:
      score += 10;
      reasons.push('Standard civic inquiry');
  }

  // 2. Critical Safety Keywords (+40 score)
  const criticalKeywords = [
    'live wire', 'sparking', 'electric shock', 'open manhole', 'manhole open',
    'gas leak', 'fire', 'collapsed', 'sinkhole', 'flood', 'flooding',
    'hazard', 'toxic', 'chemical spill', 'accident', 'deadly', 'emergency',
    'deep pothole', 'severe'
  ];

  for (const kw of criticalKeywords) {
    if (text.includes(kw)) {
      score += 40;
      reasons.push(`Critical safety alert triggered by keyword: "${kw}"`);
      break;
    }
  }

  // 3. High Impact / Vulnerable Area Keywords (+25 score)
  const highKeywords = [
    'school', 'hospital', 'clinic', 'playground', 'elderly',
    'overflowing', 'sewage', 'burst pipe', 'major road', 'highway',
    'traffic jam', 'foul smell', 'drinking water', 'contamination'
  ];

  for (const kw of highKeywords) {
    if (text.includes(kw)) {
      score += 20;
      reasons.push(`High impact area/factor identified: "${kw}"`);
      break;
    }
  }

  // 4. Map score to Priority Tier
  let priority = 'Medium';
  if (score >= 50) {
    priority = 'Critical';
  } else if (score >= 30) {
    priority = 'High';
  } else if (score >= 15) {
    priority = 'Medium';
  } else {
    priority = 'Low';
  }

  const priorityReason = reasons.join('; ') + ` (Calculated Score: ${score})`;

  return {
    priority,
    score,
    reasons,
    priorityReason
  };
}

module.exports = {
  calculatePriority
};
```

---

### 📄 File: `backend/services/assistantEngine.js`

**Purpose**: "What Should I Do?" deterministic waste and material guidance engine

```javascript
/**
 * "What Should I Do?" Smart Waste & Item Guidance Engine
 * Rule-based recommendation engine for responsible item handling, segregation, reuse, and disposal.
 * Ready for future AI/LLM plug-in while remaining deterministic, explainable, and offline-reliable.
 */

const KNOWLEDGE_BASE = [
  {
    keywords: ['cloth', 'clothes', 'shirt', 'pants', 'dress', 'jacket', 'textile', 'blanket', 'curtain'],
    itemIdentified: 'Clothing / Textiles',
    recommendedAction: 'Donate or Give Away',
    reason: 'Textile production has high water and carbon footprints. Giving usable garments to others extends their lifecycle significantly.',
    alternativeAction: 'Repurpose into cleaning rags or visit textile recycling collection bins.',
    relatedModule: { name: 'Reuse & Donation Marketplace', route: '/reuse', action: 'Create a Donation Listing' }
  },
  {
    keywords: ['vegetable', 'peel', 'fruit', 'food', 'leftover', 'kitchen waste', 'egg shell', 'coffee ground', 'tea leaf'],
    itemIdentified: 'Organic Kitchen / Wet Waste',
    recommendedAction: 'Compost at Home or Segregate as Wet Waste',
    reason: 'Organic waste creates methane in landfills. Composting converts nutrient-rich biomass into fertile organic soil for plants.',
    alternativeAction: 'Place in designated green municipal wet-waste bin for community biogas/composting.',
    relatedModule: { name: 'Waste Segregation Guide', route: '/education', action: 'Learn Wet Waste Best Practices' }
  },
  {
    keywords: ['mobile', 'phone', 'smartphone', 'laptop', 'charger', 'battery', 'tablet', 'gadget', 'wire', 'cable', 'electronics', 'computer'],
    itemIdentified: 'Electronic Waste (E-Waste)',
    recommendedAction: 'Authorized E-Waste Collection / Recycling',
    reason: 'Electronics contain hazardous heavy metals (lead, mercury, cadmium) as well as precious recoverable materials (gold, copper).',
    alternativeAction: 'If working, consider listing on the Civic Impact Reuse portal or exchanging with manufacturer buyback.',
    relatedModule: { name: 'Recycling Centres Directory', route: '/recycling', action: 'Find E-Waste Centres' }
  },
  {
    keywords: ['plastic bottle', 'water bottle', 'shampoo bottle', 'plastic container', 'pet bottle', 'jug'],
    itemIdentified: 'Rigid Plastics (PET / HDPE)',
    recommendedAction: 'Rinse, Crush & Recycle',
    reason: 'Clean rigid plastics are 100% mechanically recyclable into new containers, polyester fibres, and construction materials.',
    alternativeAction: 'Schedule a Dry Waste Pickup on Civic Impact.',
    relatedModule: { name: 'Request Waste Pickup', route: '/pickup', action: 'Book Dry Waste Pickup' }
  },
  {
    keywords: ['book', 'textbook', 'notebook', 'novel', 'study material', 'stationery', 'magazine'],
    itemIdentified: 'Books & Educational Material',
    recommendedAction: 'Donate to Students or Local Libraries',
    reason: 'Books retain intellectual and educational value for decades. Sharing books fosters equal learning access in your community.',
    alternativeAction: 'If torn beyond use, recycle along with clean dry paper.',
    relatedModule: { name: 'Reuse & Donation Marketplace', route: '/reuse', action: 'Share Study Materials' }
  },
  {
    keywords: ['furniture', 'chair', 'table', 'desk', 'sofa', 'wardrobe', 'bed', 'stool', 'cupboard'],
    itemIdentified: 'Furniture & Woodwork',
    recommendedAction: 'Repair or Give Away for Second Life',
    reason: 'Bulk furniture takes enormous landfill space. Donating or minor refurbishing gives affordable utility to new homes.',
    alternativeAction: 'Dismantle into scrap wood and metal for licensed salvage recyclers.',
    relatedModule: { name: 'Reuse & Donation Marketplace', route: '/reuse', action: 'List Furniture' }
  },
  {
    keywords: ['cardboard', 'carton', 'box', 'paper packaging', 'newspaper'],
    itemIdentified: 'Cardboard & Paper Packaging',
    recommendedAction: 'Flatten & Dry Waste Recycling',
    reason: 'Cardboard can be pulped and re-molded into corrugated packaging up to 5-7 times, saving virgin timber and forest cover.',
    alternativeAction: 'Reuse sturdy packaging boxes for home storage or shipping.',
    relatedModule: { name: 'Recycling Centres Directory', route: '/recycling', action: 'Find Paper Recyclers' }
  },
  {
    keywords: ['medicine', 'expired pill', 'tablet', 'syrup', 'syringe', 'ointment'],
    itemIdentified: 'Expired Medicines / Pharmaceutical Waste',
    recommendedAction: 'Hazardous Waste Safe Disposal',
    reason: 'Flushing drugs contaminates groundwater, rivers, and aquatic ecosystems, breeding antimicrobial-resistant pathogens.',
    alternativeAction: 'Hand over to authorized pharmacy take-back drop boxes or municipal toxic waste drive.',
    relatedModule: { name: 'Waste Education & Hazards', route: '/education', action: 'Review Hazardous Guidelines' }
  },
  {
    keywords: ['paint', 'solvent', 'varnish', 'pesticide', 'insecticide', 'chemical', 'bleach'],
    itemIdentified: 'Household Chemical & Hazardous Waste',
    recommendedAction: 'Do NOT Pour Down Drains; Use Hazardous Drop-Off',
    reason: 'Household chemicals corrode sewage pipes and poison water treatment bio-filters.',
    alternativeAction: 'Dry small latex paint residues with sand/sawdust before disposal, or submit a specialized pickup request.',
    relatedModule: { name: 'Report Civic Hazard / Illegal Dumping', route: '/complaints/new', action: 'Report Toxic Spills' }
  },
  {
    keywords: ['glass bottle', 'jar', 'broken glass', 'mirror', 'window glass'],
    itemIdentified: 'Glass Containers & Cullet',
    recommendedAction: 'Reuse Glass Jars or Wrap & Recycle',
    reason: 'Glass is endlessly recyclable without loss of purity or quality. Wrap broken glass securely to protect sanitation workers.',
    alternativeAction: 'Rinse glass jars for spice or pantry ingredient storage.',
    relatedModule: { name: 'Recycling Centres Directory', route: '/recycling', action: 'Find Glass Recyclers' }
  },
  {
    keywords: ['toy', 'doll', 'board game', 'puzzle', 'action figure'],
    itemIdentified: 'Toys & Children Items',
    recommendedAction: 'Sanitize & Donate to Children / Shelter',
    reason: 'Composite plastic and wooden toys rarely recycle well, but bring immense joy to children when shared.',
    alternativeAction: 'List under Civic Impact Toys giveaway section.',
    relatedModule: { name: 'Reuse & Donation Marketplace', route: '/reuse', action: 'Donate Toys' }
  },
  {
    keywords: ['car battery', 'lead battery', 'inverter battery', 'dry cell'],
    itemIdentified: 'Lead-Acid / Heavy Metal Battery',
    recommendedAction: 'Authorized Battery Scrapyard / Dealer Exchange',
    reason: 'Lead-acid batteries carry severe toxic lead and corrosive sulfuric acid that require closed-loop smelting facilities.',
    alternativeAction: 'Avail buyback scrap discount at your battery retailer.',
    relatedModule: { name: 'Recycling Centres Directory', route: '/recycling', action: 'Locate Certified Scrapyards' }
  }
];

function analyzeItem(userQuery = '') {
  const normalized = userQuery.toLowerCase().trim();

  if (!normalized) {
    return {
      success: false,
      message: 'Please provide a description of the item or waste material.'
    };
  }

  // Find best match in knowledge base
  for (const entry of KNOWLEDGE_BASE) {
    const matchedKeyword = entry.keywords.find(kw => normalized.includes(kw));
    if (matchedKeyword) {
      return {
        success: true,
        matchedKeyword,
        itemIdentified: entry.itemIdentified,
        recommendedAction: entry.recommendedAction,
        reason: entry.reason,
        alternativeAction: entry.alternativeAction,
        relatedModule: entry.relatedModule
      };
    }
  }

  // General fallback for unknown items
  return {
    success: true,
    matchedKeyword: null,
    itemIdentified: 'Unclassified Item / General Civic Material',
    recommendedAction: 'Inspect Condition: Reuse if Functional, Segregate if Waste',
    reason: 'When unsure, prioritize the waste hierarchy: 1. Reduce/Refuse → 2. Reuse/Donate → 3. Recycle → 4. Municipal Waste Pickup.',
    alternativeAction: 'Check our Waste Segregation Guide or ask municipal sanitation staff.',
    relatedModule: {
      name: 'Waste Segregation Guide',
      route: '/education',
      action: 'Browse Waste Categories'
    }
  };
}

module.exports = {
  analyzeItem,
  KNOWLEDGE_BASE
};
```

---

### 📄 File: `backend/services/notificationService.js`

**Purpose**: In-app notification dispatcher and Green Points transaction ledger

```javascript
const { query } = require('../config/db');

/**
 * Dispatches an in-app notification to a user
 */
async function createNotification({ userId, title, message, type = 'general', referenceId = null }) {
  try {
    const sql = `
      INSERT INTO notifications (user_id, title, message, type, reference_id, is_read, created_at)
      VALUES ($1, $2, $3, $4, $5, 0, CURRENT_TIMESTAMP)
      RETURNING id, user_id, title, message, type, reference_id, is_read, created_at;
    `;
    const res = await query(sql, [userId, title, message, type, referenceId ? String(referenceId) : null]);
    return res.rows[0];
  } catch (error) {
    console.error('Error creating notification:', error.message);
  }
}

/**
 * Awards Green Points and records transaction history
 */
async function awardGreenPoints({ userId, points, activityType, description, referenceId = null }) {
  try {
    if (!points || points <= 0) return;

    // 1. Record transaction in green_point_transactions
    const transSql = `
      INSERT INTO green_point_transactions (user_id, points, activity_type, description, reference_id, created_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      RETURNING id, points;
    `;
    await query(transSql, [userId, points, activityType, description, referenceId ? String(referenceId) : null]);

    // 2. Increment user's total green points
    const userSql = `
      UPDATE users
      SET green_points = COALESCE(green_points, 0) + $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, name, green_points;
    `;
    const userRes = await query(userSql, [points, userId]);

    // 3. Notify user of points earned
    await createNotification({
      userId,
      title: '🌱 Green Points Earned!',
      message: `You earned +${points} Green Points for: ${activityType} (${description})!`,
      type: 'points',
      referenceId
    });

    return userRes.rows[0];
  } catch (error) {
    console.error('Error awarding green points:', error.message);
  }
}

module.exports = {
  createNotification,
  awardGreenPoints
};
```

---

### 📄 File: `backend/controllers/authController.js`

**Purpose**: User registration, login, profile management, and password change controller

```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { awardGreenPoints, createNotification } = require('../services/notificationService');

const JWT_SECRET = process.env.JWT_SECRET || 'civic_impact_jwt_secret_token_key_2026_super_safe';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Register Citizen
 */
async function register(req, res) {
  try {
    const { name, email, phone, password, confirmPassword, address } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, Phone, Password, Address).'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // Check if email already exists
    const existing = await query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Default role is citizen
    const insertSql = `
      INSERT INTO users (name, email, phone, password_hash, address, role, green_points, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, 'citizen', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, name, email, phone, address, role, green_points, created_at;
    `;
    const insertRes = await query(insertSql, [name.trim(), email.trim().toLowerCase(), phone.trim(), passwordHash, address.trim()]);
    const newUser = insertRes.rows[0];

    // Welcome Green Points & In-app Notification
    await awardGreenPoints({
      userId: newUser.id,
      points: 20,
      activityType: 'Welcome Bonus',
      description: 'Joined Civic Impact Community'
    });

    await createNotification({
      userId: newUser.id,
      title: 'Welcome to Civic Impact! 🌍',
      message: 'Thank you for taking a step towards a cleaner, smarter city. Explore civic complaints, waste pickup, and reuse marketplace.',
      type: 'system'
    });

    // Generate JWT
    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Refresh user to get updated points
    const freshUser = await query('SELECT id, name, email, phone, address, role, green_points, created_at FROM users WHERE id = $1', [newUser.id]);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome bonus 20 Green Points awarded.',
      token,
      user: freshUser.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration: ' + error.message });
  }
}

/**
 * Login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const userRes = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Exclude password_hash
    delete user.password_hash;

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login: ' + error.message });
  }
}

/**
 * Get Current User Profile
 */
async function getProfile(req, res) {
  try {
    const userRes = await query(
      'SELECT id, name, email, phone, address, role, green_points, avatar_url, created_at, updated_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      user: userRes.rows[0]
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching profile.' });
  }
}

/**
 * Update Profile
 */
async function updateProfile(req, res) {
  try {
    const { name, phone, address, avatar_url } = req.body;

    if (!name || !phone || !address) {
      return res.status(400).json({ success: false, message: 'Name, phone, and address are required.' });
    }

    const updateSql = `
      UPDATE users
      SET name = $1, phone = $2, address = $3, avatar_url = COALESCE($4, avatar_url), updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, name, email, phone, address, role, green_points, avatar_url, updated_at;
    `;
    const resUpdate = await query(updateSql, [name.trim(), phone.trim(), address.trim(), avatar_url || null, req.user.id]);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: resUpdate.rows[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
}

/**
 * Change Password
 */
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, message: 'New passwords do not match.' });
    }

    // Get current hash
    const userRes = await query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    const isMatch = await bcrypt.compare(currentPassword, userRes.rows[0].password_hash);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [newHash, req.user.id]);

    res.json({
      success: true,
      message: 'Password changed successfully!'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error changing password.' });
  }
}

/**
 * Get User Activity Timeline
 */
async function getUserActivity(req, res) {
  try {
    const userId = req.user.id;

    const complaints = await query(
      'SELECT id, complaint_id, title, category, status, priority, created_at FROM complaints WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
      [userId]
    );

    const pickups = await query(
      'SELECT id, pickup_id, waste_type, quantity, status, preferred_date, created_at FROM waste_pickup_requests WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
      [userId]
    );

    const listings = await query(
      'SELECT id, title, category, listing_type, availability_status, created_at FROM reuse_listings WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
      [userId]
    );

    const pointHistory = await query(
      'SELECT id, points, activity_type, description, created_at FROM green_point_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [userId]
    );

    res.json({
      success: true,
      activity: {
        complaints: complaints.rows,
        pickups: pickups.rows,
        listings: listings.rows,
        points: pointHistory.rows
      }
    });
  } catch (error) {
    console.error('User activity error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user activity.' });
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getUserActivity
};
```

---

### 📄 File: `backend/controllers/complaintController.js`

**Purpose**: Civic complaint CRUD, status updates, team assignment, and priority override

```javascript
const { query } = require('../config/db');
const { calculatePriority } = require('../services/priorityEngine');
const { awardGreenPoints, createNotification } = require('../services/notificationService');

/**
 * Generate unique complaint ID: CMP-2026-XXXX
 */
function generateComplaintId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `CMP-${year}-${randomNum}`;
}

/**
 * Create Complaint (Citizens & Users)
 */
async function createComplaint(req, res) {
  try {
    const { title, description, category, address, location_lat, location_lng } = req.body;
    const userId = req.user.id;

    if (!title || !description || !category || !address) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category, and address are required.'
      });
    }

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : req.body.photo_url || null;

    // Smart Rule-Based Priority calculation
    const priorityCalc = calculatePriority({ category, title, description, address });
    const complaintId = generateComplaintId();

    const insertSql = `
      INSERT INTO complaints (
        complaint_id, user_id, title, description, category,
        photo_url, location_lat, location_lng, address,
        priority, priority_reason, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Submitted', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;

    const result = await query(insertSql, [
      complaintId,
      userId,
      title.trim(),
      description.trim(),
      category,
      photoUrl,
      location_lat ? parseFloat(location_lat) : null,
      location_lng ? parseFloat(location_lng) : null,
      address.trim(),
      priorityCalc.priority,
      priorityCalc.priorityReason
    ]);

    const complaint = result.rows[0];

    // Initial timeline entry in complaint_updates
    await query(
      `INSERT INTO complaint_updates (complaint_id, user_id, status_from, status_to, note, created_at)
       VALUES ($1, $2, NULL, 'Submitted', 'Complaint submitted by citizen.', CURRENT_TIMESTAMP)`,
      [complaint.id, userId]
    );

    // Award Green Points (+10)
    await awardGreenPoints({
      userId,
      points: 10,
      activityType: 'Civic Complaint Submission',
      description: `Reported issue: ${title.substring(0, 30)}...`,
      referenceId: complaint.complaint_id
    });

    // Notify user
    await createNotification({
      userId,
      title: 'Complaint Logged Successfully',
      message: `Your complaint #${complaint.complaint_id} (${category}) has been submitted and assigned ${priorityCalc.priority} priority.`,
      type: 'complaint',
      referenceId: complaint.complaint_id
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully!',
      complaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ success: false, message: 'Server error creating complaint: ' + error.message });
  }
}

/**
 * Get Complaints (with Search, Filter, Pagination)
 */
async function getComplaints(req, res) {
  try {
    const { search, category, status, priority, myOnly } = req.query;
    const user = req.user;

    let sql = `
      SELECT c.*, u.name as citizen_name, u.phone as citizen_phone, u.email as citizen_email,
             s.name as assigned_to_name
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users s ON c.assigned_to_user_id = s.id
      WHERE 1=1
    `;
    const params = [];

    // If citizen requested 'myOnly' or if citizen only wants to see their complaints
    if (myOnly === 'true' || (user && user.role === 'citizen' && myOnly !== 'false')) {
      params.push(user.id);
      sql += ` AND c.user_id = $${params.length}`;
    }

    // If service team member viewing their assignments
    if (user && user.role === 'service_team') {
      params.push(user.id);
      sql += ` AND c.assigned_to_user_id = $${params.length}`;
    }

    if (category && category !== 'All') {
      params.push(category);
      sql += ` AND c.category = $${params.length}`;
    }

    if (status && status !== 'All') {
      params.push(status);
      sql += ` AND c.status = $${params.length}`;
    }

    if (priority && priority !== 'All') {
      params.push(priority);
      sql += ` AND c.priority = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(c.title) LIKE $${params.length} OR LOWER(c.description) LIKE $${params.length} OR LOWER(c.complaint_id) LIKE $${params.length} OR LOWER(c.address) LIKE $${params.length})`;
    }

    sql += ` ORDER BY c.created_at DESC`;

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      complaints: result.rows
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching complaints.' });
  }
}

/**
 * Get Complaint Details & Timeline
 */
async function getComplaintById(req, res) {
  try {
    const { id } = req.params;

    const compSql = `
      SELECT c.*, u.name as citizen_name, u.phone as citizen_phone, u.email as citizen_email,
             s.name as assigned_to_name, s.phone as assigned_to_phone
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users s ON c.assigned_to_user_id = s.id
      WHERE c.id = $1 OR c.complaint_id = $1
    `;
    const compRes = await query(compSql, [id]);

    if (compRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const complaint = compRes.rows[0];

    // Fetch timeline updates
    const updatesSql = `
      SELECT cu.*, u.name as updated_by_name, u.role as updated_by_role
      FROM complaint_updates cu
      LEFT JOIN users u ON cu.user_id = u.id
      WHERE cu.complaint_id = $1
      ORDER BY cu.created_at ASC
    `;
    const updatesRes = await query(updatesSql, [complaint.id]);

    res.json({
      success: true,
      complaint,
      timeline: updatesRes.rows
    });
  } catch (error) {
    console.error('Get complaint details error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching complaint details.' });
  }
}

/**
 * Update Complaint Status (Service Team or Admin)
 */
async function updateComplaintStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, note, resolution_notes } = req.body;
    const user = req.user;

    const allowedStatuses = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
    }

    // Fetch existing
    const existing = await query('SELECT * FROM complaints WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }
    const current = existing.rows[0];

    // Service team can only update complaints assigned to them
    if (user.role === 'service_team' && current.assigned_to_user_id !== user.id) {
      return res.status(403).json({ success: false, message: 'You are not assigned to this complaint.' });
    }

    const resolutionPhotoUrl = req.file ? `/uploads/${req.file.filename}` : current.resolution_photo_url;

    // Update complaint record
    const updateSql = `
      UPDATE complaints
      SET status = $1,
          resolution_notes = COALESCE($2, resolution_notes),
          resolution_photo_url = COALESCE($3, resolution_photo_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *;
    `;
    const updatedRes = await query(updateSql, [status, resolution_notes || null, resolutionPhotoUrl, id]);
    const updatedComplaint = updatedRes.rows[0];

    // Insert update history
    await query(
      `INSERT INTO complaint_updates (complaint_id, user_id, status_from, status_to, note, created_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
      [id, user.id, current.status, status, note || `Status changed from ${current.status} to ${status}`]
    );

    // If status became Resolved, award points to citizen (+25)
    if (status === 'Resolved' && current.status !== 'Resolved') {
      await awardGreenPoints({
        userId: current.user_id,
        points: 25,
        activityType: 'Complaint Resolution',
        description: `Your issue #${current.complaint_id} was successfully resolved!`,
        referenceId: current.complaint_id
      });
    }

    // Notify citizen
    await createNotification({
      userId: current.user_id,
      title: `Complaint #${current.complaint_id} Status: ${status}`,
      message: `Your reported civic issue has progressed to '${status}'. ${note ? `Note: ${note}` : ''}`,
      type: 'complaint',
      referenceId: current.complaint_id
    });

    res.json({
      success: true,
      message: `Complaint status updated to ${status}.`,
      complaint: updatedComplaint
    });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ success: false, message: 'Server error updating complaint: ' + error.message });
  }
}

/**
 * Assign Complaint to Service Team (Admin Only)
 */
async function assignComplaint(req, res) {
  try {
    const { id } = req.params;
    const { serviceTeamUserId, note } = req.body;

    if (!serviceTeamUserId) {
      return res.status(400).json({ success: false, message: 'Service team user ID is required.' });
    }

    // Verify service team member
    const serviceUser = await query("SELECT id, name, role FROM users WHERE id = $1 AND role = 'service_team'", [serviceTeamUserId]);
    if (serviceUser.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Selected user is not a valid Service Team personnel.' });
    }

    const compRes = await query('SELECT * FROM complaints WHERE id = $1', [id]);
    if (compRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }
    const current = compRes.rows[0];

    const updateSql = `
      UPDATE complaints
      SET assigned_to_user_id = $1,
          status = CASE WHEN status = 'Submitted' OR status = 'Under Review' THEN 'Assigned' ELSE status END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const updatedRes = await query(updateSql, [serviceTeamUserId, id]);
    const updated = updatedRes.rows[0];

    // Log update
    await query(
      `INSERT INTO complaint_updates (complaint_id, user_id, status_from, status_to, note, created_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
      [id, req.user.id, current.status, updated.status, `Assigned to ${serviceUser.rows[0].name}. ${note || ''}`]
    );

    // Notify service team member
    await createNotification({
      userId: serviceTeamUserId,
      title: 'New Complaint Assigned to You',
      message: `You have been assigned to handle complaint #${current.complaint_id} (${current.category}): "${current.title}".`,
      type: 'complaint',
      referenceId: current.complaint_id
    });

    // Notify citizen
    await createNotification({
      userId: current.user_id,
      title: `Complaint #${current.complaint_id} Assigned`,
      message: `Your complaint has been assigned to service team personnel (${serviceUser.rows[0].name}) for resolution.`,
      type: 'complaint',
      referenceId: current.complaint_id
    });

    res.json({
      success: true,
      message: `Complaint assigned to ${serviceUser.rows[0].name}.`,
      complaint: updated
    });
  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(500).json({ success: false, message: 'Server error assigning complaint: ' + error.message });
  }
}

/**
 * Admin Override Priority
 */
async function overridePriority(req, res) {
  try {
    const { id } = req.params;
    const { priority, priorityReason } = req.body;

    const allowed = ['Low', 'Medium', 'High', 'Critical'];
    if (!priority || !allowed.includes(priority)) {
      return res.status(400).json({ success: false, message: `Priority must be one of: ${allowed.join(', ')}` });
    }

    const updateSql = `
      UPDATE complaints
      SET priority = $1,
          priority_reason = COALESCE($2, priority_reason),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;
    const result = await query(updateSql, [priority, priorityReason || `Admin manual override to ${priority}`, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    res.json({
      success: true,
      message: `Priority updated to ${priority}.`,
      complaint: result.rows[0]
    });
  } catch (error) {
    console.error('Override priority error:', error);
    res.status(500).json({ success: false, message: 'Server error overriding priority.' });
  }
}

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  overridePriority
};
```

---

### 📄 File: `backend/controllers/pickupController.js`

**Purpose**: Doorstep waste collection scheduling, dispatch, and status tracking

```javascript
const { query } = require('../config/db');
const { awardGreenPoints, createNotification } = require('../services/notificationService');

/**
 * Generate unique Pickup ID: WPK-2026-XXXX
 */
function generatePickupId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `WPK-${year}-${randomNum}`;
}

/**
 * Create Waste Pickup Request (Citizen)
 */
async function createPickupRequest(req, res) {
  try {
    const {
      waste_type,
      description,
      quantity,
      pickup_address,
      preferred_date,
      preferred_time,
      instructions,
      location_lat,
      location_lng
    } = req.body;
    const userId = req.user.id;

    if (!waste_type || !description || !quantity || !pickup_address || !preferred_date || !preferred_time) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields (Waste Type, Description, Quantity, Address, Date, Time).'
      });
    }

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : req.body.photo_url || null;
    const pickupId = generatePickupId();

    const insertSql = `
      INSERT INTO waste_pickup_requests (
        pickup_id, user_id, waste_type, description, quantity,
        pickup_address, location_lat, location_lng,
        preferred_date, preferred_time, photo_url, instructions,
        status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Requested', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;

    const result = await query(insertSql, [
      pickupId,
      userId,
      waste_type,
      description.trim(),
      quantity,
      pickup_address.trim(),
      location_lat ? parseFloat(location_lat) : null,
      location_lng ? parseFloat(location_lng) : null,
      preferred_date,
      preferred_time,
      photoUrl,
      instructions ? instructions.trim() : null
    ]);

    const pickup = result.rows[0];

    // In-app notification
    await createNotification({
      userId,
      title: 'Waste Pickup Requested',
      message: `Your pickup request #${pickup.pickup_id} for ${waste_type} on ${preferred_date} has been placed.`,
      type: 'pickup',
      referenceId: pickup.pickup_id
    });

    res.status(201).json({
      success: true,
      message: 'Waste pickup request submitted successfully!',
      pickup
    });
  } catch (error) {
    console.error('Create pickup error:', error);
    res.status(500).json({ success: false, message: 'Server error creating pickup request: ' + error.message });
  }
}

/**
 * Get Pickup Requests (Filtered by role: Citizen sees theirs, Service Team sees assigned, Admin sees all)
 */
async function getPickupRequests(req, res) {
  try {
    const { status, waste_type, search, myOnly } = req.query;
    const user = req.user;

    let sql = `
      SELECT p.*, u.name as citizen_name, u.phone as citizen_phone, u.email as citizen_email,
             s.name as assigned_to_name, s.phone as assigned_to_phone
      FROM waste_pickup_requests p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN users s ON p.assigned_to_user_id = s.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by role
    if (myOnly === 'true' || (user && user.role === 'citizen' && myOnly !== 'false')) {
      params.push(user.id);
      sql += ` AND p.user_id = $${params.length}`;
    }

    if (user && user.role === 'service_team') {
      params.push(user.id);
      sql += ` AND p.assigned_to_user_id = $${params.length}`;
    }

    if (status && status !== 'All') {
      params.push(status);
      sql += ` AND p.status = $${params.length}`;
    }

    if (waste_type && waste_type !== 'All') {
      params.push(waste_type);
      sql += ` AND p.waste_type = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(p.pickup_id) LIKE $${params.length} OR LOWER(p.description) LIKE $${params.length} OR LOWER(p.pickup_address) LIKE $${params.length})`;
    }

    sql += ` ORDER BY p.created_at DESC`;

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      pickups: result.rows
    });
  } catch (error) {
    console.error('Get pickups error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching pickup requests.' });
  }
}

/**
 * Get Pickup by ID
 */
async function getPickupById(req, res) {
  try {
    const { id } = req.params;

    const sql = `
      SELECT p.*, u.name as citizen_name, u.phone as citizen_phone, u.email as citizen_email,
             s.name as assigned_to_name, s.phone as assigned_to_phone
      FROM waste_pickup_requests p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN users s ON p.assigned_to_user_id = s.id
      WHERE p.id = $1 OR p.pickup_id = $1
    `;
    const result = await query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pickup request not found.' });
    }

    res.json({
      success: true,
      pickup: result.rows[0]
    });
  } catch (error) {
    console.error('Get pickup details error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching pickup details.' });
  }
}

/**
 * Schedule & Assign Pickup (Admin)
 */
async function scheduleAndAssignPickup(req, res) {
  try {
    const { id } = req.params;
    const { scheduled_date, scheduled_time, assigned_to_user_id, notes } = req.body;

    const existing = await query('SELECT * FROM waste_pickup_requests WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pickup request not found.' });
    }
    const current = existing.rows[0];

    let newStatus = current.status;
    if (scheduled_date && assigned_to_user_id) {
      newStatus = 'Assigned';
    } else if (scheduled_date) {
      newStatus = 'Scheduled';
    }

    const updateSql = `
      UPDATE waste_pickup_requests
      SET scheduled_date = COALESCE($1, scheduled_date),
          scheduled_time = COALESCE($2, scheduled_time),
          assigned_to_user_id = COALESCE($3, assigned_to_user_id),
          notes = COALESCE($4, notes),
          status = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *;
    `;

    const result = await query(updateSql, [
      scheduled_date || null,
      scheduled_time || null,
      assigned_to_user_id || null,
      notes || null,
      newStatus,
      id
    ]);

    const updated = result.rows[0];

    // Notify citizen
    await createNotification({
      userId: current.user_id,
      title: `Waste Pickup #${current.pickup_id} Scheduled`,
      message: `Your waste pickup has been scheduled for ${scheduled_date || current.preferred_date} (${scheduled_time || current.preferred_time}).`,
      type: 'pickup',
      referenceId: current.pickup_id
    });

    // Notify service team member if assigned
    if (assigned_to_user_id) {
      await createNotification({
        userId: assigned_to_user_id,
        title: 'New Waste Pickup Assigned',
        message: `You are assigned to collect ${current.waste_type} at ${current.pickup_address} on ${scheduled_date || current.preferred_date}.`,
        type: 'pickup',
        referenceId: current.pickup_id
      });
    }

    res.json({
      success: true,
      message: 'Pickup request successfully updated.',
      pickup: updated
    });
  } catch (error) {
    console.error('Schedule pickup error:', error);
    res.status(500).json({ success: false, message: 'Server error scheduling pickup.' });
  }
}

/**
 * Update Pickup Status (Service Team or Admin)
 */
async function updatePickupStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const user = req.user;

    const allowedStatuses = ['Requested', 'Scheduled', 'Assigned', 'Picked Up', 'Completed'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowedStatuses.join(', ')}` });
    }

    const existing = await query('SELECT * FROM waste_pickup_requests WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pickup request not found.' });
    }
    const current = existing.rows[0];

    if (user.role === 'service_team' && current.assigned_to_user_id !== user.id) {
      return res.status(403).json({ success: false, message: 'You are not assigned to this pickup request.' });
    }

    const updateSql = `
      UPDATE waste_pickup_requests
      SET status = $1,
          notes = COALESCE($2, notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;
    const result = await query(updateSql, [status, notes || null, id]);
    const updated = result.rows[0];

    // If Completed, award Green Points (+20)
    if (status === 'Completed' && current.status !== 'Completed') {
      await awardGreenPoints({
        userId: current.user_id,
        points: 20,
        activityType: 'Waste Pickup Completed',
        description: `Responsible pickup of ${current.waste_type} (${current.quantity})`,
        referenceId: current.pickup_id
      });
    }

    // Notify citizen
    await createNotification({
      userId: current.user_id,
      title: `Waste Pickup #${current.pickup_id} Status: ${status}`,
      message: `Your pickup request has updated to '${status}'. ${notes ? `Notes: ${notes}` : ''}`,
      type: 'pickup',
      referenceId: current.pickup_id
    });

    res.json({
      success: true,
      message: `Pickup status updated to ${status}.`,
      pickup: updated
    });
  } catch (error) {
    console.error('Update pickup status error:', error);
    res.status(500).json({ success: false, message: 'Server error updating pickup status.' });
  }
}

module.exports = {
  createPickupRequest,
  getPickupRequests,
  getPickupById,
  scheduleAndAssignPickup,
  updatePickupStatus
};
```

---

### 📄 File: `backend/controllers/listingController.js`

**Purpose**: Reuse/donation marketplace item listings and peer-to-peer request workflow

```javascript
const { query } = require('../config/db');
const { awardGreenPoints, createNotification } = require('../services/notificationService');

/**
 * Create Reuse / Donation Listing
 */
async function createListing(req, res) {
  try {
    const { title, description, category, listing_type, condition, location_address } = req.body;
    const userId = req.user.id;

    if (!title || !description || !category || !listing_type || !condition || !location_address) {
      return res.status(400).json({
        success: false,
        message: 'All fields (title, description, category, listing_type, condition, location_address) are required.'
      });
    }

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : req.body.photo_url || null;

    const insertSql = `
      INSERT INTO reuse_listings (
        user_id, title, description, category, listing_type,
        condition, photo_url, location_address, availability_status,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Available', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;

    const result = await query(insertSql, [
      userId,
      title.trim(),
      description.trim(),
      category,
      listing_type,
      condition,
      photoUrl,
      location_address.trim()
    ]);

    const listing = result.rows[0];

    // Notification to user
    await createNotification({
      userId,
      title: 'Item Listed on Reuse Marketplace',
      message: `Your item "${listing.title}" is now visible to the community for ${listing.listing_type}.`,
      type: 'reuse',
      referenceId: listing.id
    });

    res.status(201).json({
      success: true,
      message: 'Item listed successfully!',
      listing
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ success: false, message: 'Server error creating listing: ' + error.message });
  }
}

/**
 * Get Listings (with Search, Category, Type, Condition filters)
 */
async function getListings(req, res) {
  try {
    const { category, listing_type, condition, search, myOnly } = req.query;
    const user = req.user;

    let sql = `
      SELECT l.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone
      FROM reuse_listings l
      JOIN users u ON l.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (myOnly === 'true' && user) {
      params.push(user.id);
      sql += ` AND l.user_id = $${params.length}`;
    } else {
      // By default public marketplace shows Available and Requested items
      sql += ` AND l.availability_status IN ('Available', 'Requested')`;
    }

    if (category && category !== 'All') {
      params.push(category);
      sql += ` AND l.category = $${params.length}`;
    }

    if (listing_type && listing_type !== 'All') {
      params.push(listing_type);
      sql += ` AND l.listing_type = $${params.length}`;
    }

    if (condition && condition !== 'All') {
      params.push(condition);
      sql += ` AND l.condition = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(l.title) LIKE $${params.length} OR LOWER(l.description) LIKE $${params.length} OR LOWER(l.location_address) LIKE $${params.length})`;
    }

    sql += ` ORDER BY l.created_at DESC`;

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      listings: result.rows
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching listings.' });
  }
}

/**
 * Get Listing Details and Requests
 */
async function getListingById(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;

    const listSql = `
      SELECT l.*, u.name as owner_name, u.phone as owner_phone
      FROM reuse_listings l
      JOIN users u ON l.user_id = u.id
      WHERE l.id = $1
    `;
    const result = await query(listSql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    const listing = result.rows[0];

    // If viewer is the owner, fetch incoming item requests
    let requests = [];
    if (user && (user.id === listing.user_id || user.role === 'admin')) {
      const reqSql = `
        SELECT r.*, u.name as requester_name, u.email as requester_email, u.phone as requester_phone
        FROM item_requests r
        JOIN users u ON r.requester_id = u.id
        WHERE r.listing_id = $1
        ORDER BY r.created_at DESC
      `;
      const reqRes = await query(reqSql, [id]);
      requests = reqRes.rows;
    }

    // Check if the current logged-in user already requested this item
    let myRequest = null;
    if (user && user.id !== listing.user_id) {
      const myReqRes = await query(
        'SELECT * FROM item_requests WHERE listing_id = $1 AND requester_id = $2',
        [id, user.id]
      );
      if (myReqRes.rows.length > 0) {
        myRequest = myReqRes.rows[0];
      }
    }

    res.json({
      success: true,
      listing,
      requests,
      myRequest
    });
  } catch (error) {
    console.error('Get listing details error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching listing details.' });
  }
}

/**
 * Request an Item
 */
async function requestItem(req, res) {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    // Check listing
    const listingRes = await query('SELECT * FROM reuse_listings WHERE id = $1', [id]);
    if (listingRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    const listing = listingRes.rows[0];

    // User must not request their own listing
    if (listing.user_id === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request your own listed item.'
      });
    }

    if (listing.availability_status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'This item has already been re-homed and is no longer available.'
      });
    }

    // Check existing request
    const existingReq = await query(
      'SELECT id FROM item_requests WHERE listing_id = $1 AND requester_id = $2',
      [id, userId]
    );
    if (existingReq.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already sent a request for this item.'
      });
    }

    // Create item request
    const insertSql = `
      INSERT INTO item_requests (listing_id, requester_id, message, status, created_at, updated_at)
      VALUES ($1, $2, $3, 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const result = await query(insertSql, [id, userId, message ? message.trim() : 'I am interested in this item.']);

    // Update listing status to Requested
    await query("UPDATE reuse_listings SET availability_status = 'Requested', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND availability_status = 'Available'", [id]);

    // Notify listing owner
    await createNotification({
      userId: listing.user_id,
      title: 'New Item Request Received! 🎁',
      message: `${req.user.name} sent a request for your item "${listing.title}".`,
      type: 'reuse',
      referenceId: listing.id
    });

    res.status(201).json({
      success: true,
      message: 'Request sent to the owner successfully!',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Request item error:', error);
    res.status(500).json({ success: false, message: 'Server error requesting item.' });
  }
}

/**
 * Accept or Reject Item Request (Owner Only)
 */
async function respondToRequest(req, res) {
  try {
    const { id, requestId } = req.params;
    const { status, response_note } = req.body;
    const userId = req.user.id;

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be either 'Accepted' or 'Rejected'." });
    }

    // Check listing ownership
    const listRes = await query('SELECT * FROM reuse_listings WHERE id = $1', [id]);
    if (listRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }
    const listing = listRes.rows[0];

    if (listing.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the item owner can accept or reject requests.' });
    }

    // Fetch request
    const reqRes = await query('SELECT * FROM item_requests WHERE id = $1 AND listing_id = $2', [requestId, id]);
    if (reqRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Item request not found.' });
    }
    const itemReq = reqRes.rows[0];

    // Update request
    const updateReqSql = `
      UPDATE item_requests
      SET status = $1, response_note = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;
    const updatedRes = await query(updateReqSql, [status, response_note || null, requestId]);

    if (status === 'Accepted') {
      // Mark listing as Completed
      await query("UPDATE reuse_listings SET availability_status = 'Completed', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);

      // Reject all other pending requests for this item
      await query("UPDATE item_requests SET status = 'Rejected', response_note = 'Item given to another requester.', updated_at = CURRENT_TIMESTAMP WHERE listing_id = $1 AND id != $2 AND status = 'Pending'", [id, requestId]);

      // Award points to Owner (+30 for Donate, +20 for Give Away, +15 for Reuse)
      const points = listing.listing_type === 'Donate' ? 30 : listing.listing_type === 'Give Away' ? 20 : 15;
      await awardGreenPoints({
        userId: listing.user_id,
        points,
        activityType: `Item ${listing.listing_type}`,
        description: `Passed on item "${listing.title}" to a community member`,
        referenceId: listing.id
      });

      // Award points to Requester for Reusing (+10)
      await awardGreenPoints({
        userId: itemReq.requester_id,
        points: 10,
        activityType: 'Item Reuse / Adoption',
        description: `Acquired reusable item "${listing.title}" instead of buying new`,
        referenceId: listing.id
      });

      // Notify Requester
      await createNotification({
        userId: itemReq.requester_id,
        title: '🎉 Item Request Accepted!',
        message: `Your request for "${listing.title}" was accepted! Contact the owner (${req.user.name}: ${req.user.phone}) to arrange pickup.`,
        type: 'reuse',
        referenceId: listing.id
      });
    } else {
      // If rejected, check if there are other pending requests; if not, revert to Available
      const pendingRes = await query("SELECT id FROM item_requests WHERE listing_id = $1 AND id != $2 AND status = 'Pending'", [id, requestId]);
      if (pendingRes.rows.length === 0) {
        await query("UPDATE reuse_listings SET availability_status = 'Available', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);
      }

      // Notify Requester of rejection
      await createNotification({
        userId: itemReq.requester_id,
        title: 'Item Request Status Update',
        message: `Your request for "${listing.title}" was not accepted. ${response_note ? `Note: ${response_note}` : ''}`,
        type: 'reuse',
        referenceId: listing.id
      });
    }

    res.json({
      success: true,
      message: `Request has been marked as ${status}.`,
      request: updatedRes.rows[0]
    });
  } catch (error) {
    console.error('Respond to request error:', error);
    res.status(500).json({ success: false, message: 'Server error responding to request.' });
  }
}

/**
 * Delete / Moderate Listing (Owner or Admin)
 */
async function deleteListing(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;

    const listRes = await query('SELECT * FROM reuse_listings WHERE id = $1', [id]);
    if (listRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found.' });
    }

    if (listRes.rows[0].user_id !== user.id && user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this listing.' });
    }

    await query('DELETE FROM reuse_listings WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Listing removed successfully.'
    });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting listing.' });
  }
}

module.exports = {
  createListing,
  getListings,
  getListingById,
  requestItem,
  respondToRequest,
  deleteListing
};
```

---

### 📄 File: `backend/controllers/recyclingController.js`

**Purpose**: Recycling centres directory querying, material filtering, and admin CRUD

```javascript
const { query } = require('../config/db');

/**
 * Get Recycling Centres (with Material & Location Search)
 */
async function getRecyclingCentres(req, res) {
  try {
    const { material, search } = req.query;

    let sql = `SELECT * FROM recycling_centres WHERE 1=1`;
    const params = [];

    if (material && material !== 'All') {
      params.push(`%${material.trim().toLowerCase()}%`);
      sql += ` AND LOWER(accepted_materials) LIKE $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(address) LIKE $${params.length} OR LOWER(accepted_materials) LIKE $${params.length} OR LOWER(description) LIKE $${params.length})`;
    }

    sql += ` ORDER BY name ASC`;

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      centres: result.rows
    });
  } catch (error) {
    console.error('Get recycling centres error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching recycling centres.' });
  }
}

/**
 * Get Single Recycling Centre
 */
async function getRecyclingCentreById(req, res) {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM recycling_centres WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Recycling centre not found.' });
    }

    res.json({
      success: true,
      centre: result.rows[0]
    });
  } catch (error) {
    console.error('Get centre error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching centre.' });
  }
}

/**
 * Create Recycling Centre (Admin Only)
 */
async function createRecyclingCentre(req, res) {
  try {
    const { name, address, location_lat, location_lng, accepted_materials, contact_phone, contact_email, opening_hours, description } = req.body;

    if (!name || !address || !accepted_materials) {
      return res.status(400).json({ success: false, message: 'Name, address, and accepted materials are required.' });
    }

    const insertSql = `
      INSERT INTO recycling_centres (
        name, address, location_lat, location_lng, accepted_materials,
        contact_phone, contact_email, opening_hours, description, is_sample, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0, CURRENT_TIMESTAMP)
      RETURNING *;
    `;

    const result = await query(insertSql, [
      name.trim(),
      address.trim(),
      location_lat ? parseFloat(location_lat) : null,
      location_lng ? parseFloat(location_lng) : null,
      accepted_materials.trim(),
      contact_phone ? contact_phone.trim() : null,
      contact_email ? contact_email.trim() : null,
      opening_hours ? opening_hours.trim() : 'Mon-Sat: 9:00 AM - 6:00 PM',
      description ? description.trim() : null
    ]);

    res.status(201).json({
      success: true,
      message: 'Recycling centre added successfully!',
      centre: result.rows[0]
    });
  } catch (error) {
    console.error('Create centre error:', error);
    res.status(500).json({ success: false, message: 'Server error adding centre.' });
  }
}

/**
 * Update Recycling Centre (Admin Only)
 */
async function updateRecyclingCentre(req, res) {
  try {
    const { id } = req.params;
    const { name, address, location_lat, location_lng, accepted_materials, contact_phone, contact_email, opening_hours, description } = req.body;

    const updateSql = `
      UPDATE recycling_centres
      SET name = COALESCE($1, name),
          address = COALESCE($2, address),
          location_lat = COALESCE($3, location_lat),
          location_lng = COALESCE($4, location_lng),
          accepted_materials = COALESCE($5, accepted_materials),
          contact_phone = COALESCE($6, contact_phone),
          contact_email = COALESCE($7, contact_email),
          opening_hours = COALESCE($8, opening_hours),
          description = COALESCE($9, description)
      WHERE id = $10
      RETURNING *;
    `;

    const result = await query(updateSql, [
      name ? name.trim() : null,
      address ? address.trim() : null,
      location_lat ? parseFloat(location_lat) : null,
      location_lng ? parseFloat(location_lng) : null,
      accepted_materials ? accepted_materials.trim() : null,
      contact_phone ? contact_phone.trim() : null,
      contact_email ? contact_email.trim() : null,
      opening_hours ? opening_hours.trim() : null,
      description ? description.trim() : null,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Recycling centre not found.' });
    }

    res.json({
      success: true,
      message: 'Recycling centre updated successfully.',
      centre: result.rows[0]
    });
  } catch (error) {
    console.error('Update centre error:', error);
    res.status(500).json({ success: false, message: 'Server error updating centre.' });
  }
}

/**
 * Delete Recycling Centre (Admin Only)
 */
async function deleteRecyclingCentre(req, res) {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM recycling_centres WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Recycling centre not found.' });
    }

    res.json({
      success: true,
      message: 'Recycling centre deleted successfully.'
    });
  } catch (error) {
    console.error('Delete centre error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting centre.' });
  }
}

module.exports = {
  getRecyclingCentres,
  getRecyclingCentreById,
  createRecyclingCentre,
  updateRecyclingCentre,
  deleteRecyclingCentre
};
```

---

### 📄 File: `backend/controllers/educationController.js`

**Purpose**: Waste segregation guide querying and interactive quiz point awards

```javascript
const { query } = require('../config/db');
const { awardGreenPoints } = require('../services/notificationService');

/**
 * Get Educational Content (Optional category filter & keyword search)
 */
async function getEducationContent(req, res) {
  try {
    const { category, search } = req.query;

    let sql = 'SELECT * FROM educational_content WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(examples) LIKE $${params.length} OR LOWER(disposal_action) LIKE $${params.length})`;
    }

    sql += ' ORDER BY id ASC';

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      topics: result.rows
    });
  } catch (error) {
    console.error('Get education error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching educational content.' });
  }
}

/**
 * Complete Educational Activity / Quiz for Green Points
 */
async function completeQuiz(req, res) {
  try {
    const userId = req.user.id;
    const { topicId, quizScore = 100 } = req.body;

    // Check if user already took quiz recently (limit to 1 reward per day or per topic)
    const existing = await query(
      "SELECT id FROM green_point_transactions WHERE user_id = $1 AND activity_type = 'Education Completed' AND reference_id = $2",
      [userId, String(topicId || 'general')]
    );

    if (existing.rows.length > 0) {
      return res.json({
        success: true,
        message: 'Quiz completed! You have already claimed Green Points for this topic.',
        pointsAwarded: 0
      });
    }

    await awardGreenPoints({
      userId,
      points: 15,
      activityType: 'Education Completed',
      description: 'Completed Waste Segregation Quiz with distinction',
      referenceId: String(topicId || 'general')
    });

    res.json({
      success: true,
      message: 'Congratulations! You earned +15 Green Points for completing the waste segregation quiz!',
      pointsAwarded: 15
    });
  } catch (error) {
    console.error('Complete quiz error:', error);
    res.status(500).json({ success: false, message: 'Server error completing quiz.' });
  }
}

/**
 * Create Educational Topic (Admin)
 */
async function createTopic(req, res) {
  try {
    const { title, category, description, examples, disposal_action, icon } = req.body;

    if (!title || !category || !description || !disposal_action) {
      return res.status(400).json({ success: false, message: 'Title, category, description, and disposal action are required.' });
    }

    const insertSql = `
      INSERT INTO educational_content (title, category, description, examples, disposal_action, icon, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      RETURNING *;
    `;

    const result = await query(insertSql, [
      title.trim(),
      category.trim(),
      description.trim(),
      examples ? examples.trim() : '',
      disposal_action.trim(),
      icon || 'Recycle'
    ]);

    res.status(201).json({
      success: true,
      message: 'Educational topic added successfully.',
      topic: result.rows[0]
    });
  } catch (error) {
    console.error('Create topic error:', error);
    res.status(500).json({ success: false, message: 'Server error adding educational topic.' });
  }
}

/**
 * Update Topic (Admin)
 */
async function updateTopic(req, res) {
  try {
    const { id } = req.params;
    const { title, category, description, examples, disposal_action, icon } = req.body;

    const updateSql = `
      UPDATE educational_content
      SET title = COALESCE($1, title),
          category = COALESCE($2, category),
          description = COALESCE($3, description),
          examples = COALESCE($4, examples),
          disposal_action = COALESCE($5, disposal_action),
          icon = COALESCE($6, icon)
      WHERE id = $7
      RETURNING *;
    `;

    const result = await query(updateSql, [
      title ? title.trim() : null,
      category ? category.trim() : null,
      description ? description.trim() : null,
      examples ? examples.trim() : null,
      disposal_action ? disposal_action.trim() : null,
      icon || null,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Educational topic not found.' });
    }

    res.json({
      success: true,
      message: 'Educational topic updated successfully.',
      topic: result.rows[0]
    });
  } catch (error) {
    console.error('Update topic error:', error);
    res.status(500).json({ success: false, message: 'Server error updating educational topic.' });
  }
}

/**
 * Delete Topic (Admin)
 */
async function deleteTopic(req, res) {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM educational_content WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Educational topic not found.' });
    }

    res.json({
      success: true,
      message: 'Topic deleted successfully.'
    });
  } catch (error) {
    console.error('Delete topic error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting topic.' });
  }
}

module.exports = {
  getEducationContent,
  completeQuiz,
  createTopic,
  updateTopic,
  deleteTopic
};
```

---

### 📄 File: `backend/controllers/assistantController.js`

**Purpose**: "What Should I Do?" guidance endpoint handler

```javascript
const { analyzeItem, KNOWLEDGE_BASE } = require('../services/assistantEngine');

/**
 * Handle "What Should I Do?" query
 */
async function askAssistant(req, res) {
  try {
    const { query: userQuery } = req.body;

    if (!userQuery || !userQuery.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an item description or waste inquiry.'
      });
    }

    const guidance = analyzeItem(userQuery);

    res.json({
      success: true,
      guidance
    });
  } catch (error) {
    console.error('Smart assistant error:', error);
    res.status(500).json({ success: false, message: 'Server error processing assistant inquiry.' });
  }
}

/**
 * Get popular/quick suggestion questions
 */
function getQuickSuggestions(req, res) {
  const suggestions = [
    { label: 'Old clothes & jackets', query: 'I have old clothes that are still usable' },
    { label: 'Kitchen vegetable peels', query: 'I have vegetable peels and leftover food' },
    { label: 'Old broken smartphone', query: 'I have an old mobile phone with dead battery' },
    { label: 'Cardboard delivery boxes', query: 'I have excess corrugated cardboard boxes' },
    { label: 'Wooden study desk', query: 'I want to get rid of a wooden study desk' },
    { label: 'Expired antibiotics & medicines', query: 'Where to dispose of expired medicines safely?' },
    { label: 'Household paint cans', query: 'Leftover wall paint cans and varnish' }
  ];

  res.json({
    success: true,
    suggestions
  });
}

module.exports = {
  askAssistant,
  getQuickSuggestions
};
```

---

### 📄 File: `backend/controllers/greenPointsController.js`

**Purpose**: Green Points balance, transaction history, and privacy-protected leaderboard

```javascript
const { query } = require('../config/db');

/**
 * Get Current User Green Points & History
 */
async function getMyPoints(req, res) {
  try {
    const userId = req.user.id;

    // Fetch user total points
    const userRes = await query('SELECT green_points FROM users WHERE id = $1', [userId]);
    const balance = userRes.rows[0]?.green_points || 0;

    // Fetch transactions
    const transRes = await query(
      `SELECT id, points, activity_type, description, reference_id, created_at
       FROM green_point_transactions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    );

    // Calculate user rank
    const rankRes = await query(
      `SELECT COUNT(*) + 1 as rank FROM users WHERE green_points > $1 AND role = 'citizen'`,
      [balance]
    );

    res.json({
      success: true,
      balance,
      rank: parseInt(rankRes.rows[0]?.rank || 1, 10),
      transactions: transRes.rows
    });
  } catch (error) {
    console.error('Get points error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching green points.' });
  }
}

/**
 * Get Community Leaderboard (Privacy-friendly: Name, Points, Activities count. No emails/phones!)
 */
async function getLeaderboard(req, res) {
  try {
    const { timeframe = 'overall' } = req.query;

    let sql;
    let params = [];

    if (timeframe === 'month') {
      // Monthly points earned from transactions in the current month
      sql = `
        SELECT u.id, u.name, u.avatar_url,
               COALESCE(SUM(t.points), 0) as green_points,
               COUNT(t.id) as activity_count
        FROM users u
        JOIN green_point_transactions t ON u.id = t.user_id
        WHERE u.role = 'citizen'
          AND t.created_at >= DATE_TRUNC('month', CURRENT_TIMESTAMP)
        GROUP BY u.id, u.name, u.avatar_url
        ORDER BY green_points DESC
        LIMIT 25;
      `;
    } else {
      // Overall leaderboard
      sql = `
        SELECT u.id, u.name, u.avatar_url, u.green_points,
               (SELECT COUNT(*) FROM green_point_transactions t WHERE t.user_id = u.id) as activity_count
        FROM users u
        WHERE u.role = 'citizen'
        ORDER BY u.green_points DESC, u.id ASC
        LIMIT 25;
      `;
    }

    let result;
    try {
      result = await query(sql, params);
    } catch (e) {
      // Fallback for SQLite date trunc if on sqlite
      const fallbackSql = `
        SELECT u.id, u.name, u.avatar_url, u.green_points,
               (SELECT COUNT(*) FROM green_point_transactions t WHERE t.user_id = u.id) as activity_count
        FROM users u
        WHERE u.role = 'citizen'
        ORDER BY u.green_points DESC
        LIMIT 25;
      `;
      result = await query(fallbackSql, []);
    }

    // Add rankings
    const leaderboard = result.rows.map((row, index) => ({
      rank: index + 1,
      id: row.id,
      name: row.name,
      avatar_url: row.avatar_url,
      green_points: parseInt(row.green_points || 0, 10),
      activity_count: parseInt(row.activity_count || 0, 10)
    }));

    res.json({
      success: true,
      timeframe,
      leaderboard
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching leaderboard.' });
  }
}

/**
 * Get Configurable Point Rewards Scheme
 */
function getPointsRules(req, res) {
  const rules = [
    { activity: 'Register Account', points: 20, description: 'Welcome gift for joining Civic Impact' },
    { activity: 'Submit Civic Complaint', points: 10, description: 'Report civic issues with photos and location' },
    { activity: 'Complaint Resolved', points: 25, description: 'Bonus when your reported issue gets solved' },
    { activity: 'Waste Pickup Completed', points: 20, description: 'Doorstep segregation and handover' },
    { activity: 'Donate Item', points: 30, description: 'Give usable clothes, books, and goods to someone in need' },
    { activity: 'Give Away Item', points: 20, description: 'Free distribution of household items' },
    { activity: 'Reuse Item', points: 15, description: 'Take or re-home an item instead of buying new' },
    { activity: 'Complete Educational Quiz', points: 15, description: 'Pass the waste segregation knowledge test' }
  ];

  res.json({
    success: true,
    rules
  });
}

module.exports = {
  getMyPoints,
  getLeaderboard,
  getPointsRules
};
```

---

### 📄 File: `backend/controllers/notificationController.js`

**Purpose**: User notifications retrieval, unread counter, and mark-as-read handlers

```javascript
const { query } = require('../config/db');

/**
 * Get User Notifications
 */
async function getNotifications(req, res) {
  try {
    const userId = req.user.id;

    const notifSql = `
      SELECT id, title, message, type, reference_id, is_read, created_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50;
    `;
    const result = await query(notifSql, [userId]);

    const unreadCount = result.rows.filter(n => !n.is_read).length;

    res.json({
      success: true,
      unreadCount,
      notifications: result.rows
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching notifications.' });
  }
}

/**
 * Mark Single Notification as Read
 */
async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await query('UPDATE notifications SET is_read = 1 WHERE id = $1 AND user_id = $2', [id, userId]);

    res.json({
      success: true,
      message: 'Notification marked as read.'
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: 'Server error updating notification.' });
  }
}

/**
 * Mark All Notifications as Read
 */
async function markAllAsRead(req, res) {
  try {
    const userId = req.user.id;

    await query('UPDATE notifications SET is_read = 1 WHERE user_id = $1', [userId]);

    res.json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ success: false, message: 'Server error updating notifications.' });
  }
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
```

---

### 📄 File: `backend/controllers/adminController.js`

**Purpose**: Platform-wide analytics, user directory, role permissions, and service team queries

```javascript
const { query, getDbType } = require('../config/db');

/**
 * Get Platform-Wide Analytics & KPI Metrics
 */
async function getDashboardStats(req, res) {
  try {
    // Users stats
    const totalUsersRes = await query('SELECT COUNT(*) as count FROM users');
    const roleStatsRes = await query('SELECT role, COUNT(*) as count FROM users GROUP BY role');

    // Complaints stats
    const totalComplaintsRes = await query('SELECT COUNT(*) as count FROM complaints');
    const pendingComplaintsRes = await query(
      "SELECT COUNT(*) as count FROM complaints WHERE status IN ('Submitted', 'Under Review', 'Assigned', 'In Progress')"
    );
    const resolvedComplaintsRes = await query(
      "SELECT COUNT(*) as count FROM complaints WHERE status IN ('Resolved', 'Closed')"
    );
    const categoryStatsRes = await query('SELECT category, COUNT(*) as count FROM complaints GROUP BY category');
    const priorityStatsRes = await query('SELECT priority, COUNT(*) as count FROM complaints GROUP BY priority');

    // Pickups stats
    const totalPickupsRes = await query('SELECT COUNT(*) as count FROM waste_pickup_requests');
    const pendingPickupsRes = await query(
      "SELECT COUNT(*) as count FROM waste_pickup_requests WHERE status IN ('Requested', 'Scheduled', 'Assigned')"
    );
    const completedPickupsRes = await query(
      "SELECT COUNT(*) as count FROM waste_pickup_requests WHERE status = 'Completed'"
    );

    // Reuse listings stats
    const totalListingsRes = await query('SELECT COUNT(*) as count FROM reuse_listings');
    const activeListingsRes = await query(
      "SELECT COUNT(*) as count FROM reuse_listings WHERE availability_status = 'Available'"
    );

    // Green Points awarded
    const totalPointsRes = await query('SELECT COALESCE(SUM(points), 0) as total FROM green_point_transactions');

    // Recycling centres
    const centresRes = await query('SELECT COUNT(*) as count FROM recycling_centres');

    res.json({
      success: true,
      databaseType: getDbType(),
      stats: {
        users: {
          total: parseInt(totalUsersRes.rows[0]?.count || 0, 10),
          roles: roleStatsRes.rows
        },
        complaints: {
          total: parseInt(totalComplaintsRes.rows[0]?.count || 0, 10),
          pending: parseInt(pendingComplaintsRes.rows[0]?.count || 0, 10),
          resolved: parseInt(resolvedComplaintsRes.rows[0]?.count || 0, 10),
          byCategory: categoryStatsRes.rows,
          byPriority: priorityStatsRes.rows
        },
        pickups: {
          total: parseInt(totalPickupsRes.rows[0]?.count || 0, 10),
          pending: parseInt(pendingPickupsRes.rows[0]?.count || 0, 10),
          completed: parseInt(completedPickupsRes.rows[0]?.count || 0, 10)
        },
        listings: {
          total: parseInt(totalListingsRes.rows[0]?.count || 0, 10),
          active: parseInt(activeListingsRes.rows[0]?.count || 0, 10)
        },
        greenPointsAwarded: parseInt(totalPointsRes.rows[0]?.total || 0, 10),
        recyclingCentresCount: parseInt(centresRes.rows[0]?.count || 0, 10)
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: 'Server error calculating dashboard stats.' });
  }
}

/**
 * Manage Users (List, Filter, Search)
 */
async function getUsers(req, res) {
  try {
    const { role, search } = req.query;

    let sql = `
      SELECT id, name, email, phone, address, role, green_points, created_at,
             (SELECT COUNT(*) FROM complaints WHERE user_id = users.id) as complaints_count,
             (SELECT COUNT(*) FROM reuse_listings WHERE user_id = users.id) as listings_count
      FROM users
      WHERE 1=1
    `;
    const params = [];

    if (role && role !== 'All') {
      params.push(role);
      sql += ` AND role = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length} OR LOWER(phone) LIKE $${params.length} OR LOWER(address) LIKE $${params.length})`;
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rows.length,
      users: result.rows
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user directory.' });
  }
}

/**
 * Update User Role (Admin only)
 */
async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ['citizen', 'service_team', 'admin'];
    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: `Invalid role. Allowed: ${allowedRoles.join(', ')}` });
    }

    // Prevent removing last admin
    if (parseInt(id, 10) === req.user.id && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'You cannot demote yourself from admin role.' });
    }

    const result = await query(
      'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      message: `User ${result.rows[0].name} role updated to '${role}'.`,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ success: false, message: 'Server error updating user role.' });
  }
}

/**
 * Get Service Team Members List (for assignment dropdowns)
 */
async function getServiceTeamMembers(req, res) {
  try {
    const result = await query(
      "SELECT id, name, email, phone, role FROM users WHERE role = 'service_team' ORDER BY name ASC"
    );

    res.json({
      success: true,
      members: result.rows
    });
  } catch (error) {
    console.error('Get service team error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching service team members.' });
  }
}

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserRole,
  getServiceTeamMembers
};
```

---

### 📄 File: `backend/routes/authRoutes.js`

**Purpose**: Authentication and profile REST routes

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', requireAuth, authController.getProfile);
router.put('/profile', requireAuth, authController.updateProfile);
router.post('/change-password', requireAuth, authController.changePassword);
router.get('/activity', requireAuth, authController.getUserActivity);

module.exports = router;
```

---

### 📄 File: `backend/routes/complaintRoutes.js`

**Purpose**: Civic complaints REST routes

```javascript
const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { requireAuth } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public or Authenticated listing (citizens see their own, service team sees assigned, admin sees all)
router.get('/', requireAuth, complaintController.getComplaints);
router.get('/:id', requireAuth, complaintController.getComplaintById);

// Citizen creates complaint with optional photo
router.post('/', requireAuth, upload.single('photo'), complaintController.createComplaint);

// Service Team or Admin updates status/progress with optional resolution photo
router.patch(
  '/:id/status',
  requireAuth,
  authorizeRoles('service_team', 'admin'),
  upload.single('resolution_photo'),
  complaintController.updateComplaintStatus
);

// Admin-only assignment and priority override
router.patch('/:id/assign', requireAuth, authorizeRoles('admin'), complaintController.assignComplaint);
router.patch('/:id/priority', requireAuth, authorizeRoles('admin'), complaintController.overridePriority);

module.exports = router;
```

---

### 📄 File: `backend/routes/pickupRoutes.js`

**Purpose**: Waste pickup requests REST routes

```javascript
const express = require('express');
const router = express.Router();
const pickupController = require('../controllers/pickupController');
const { requireAuth } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get requests
router.get('/', requireAuth, pickupController.getPickupRequests);
router.get('/:id', requireAuth, pickupController.getPickupById);

// Citizen creates waste pickup request
router.post('/', requireAuth, upload.single('photo'), pickupController.createPickupRequest);

// Admin schedule and assign service team
router.patch('/:id/schedule', requireAuth, authorizeRoles('admin'), pickupController.scheduleAndAssignPickup);

// Service Team or Admin updates status
router.patch('/:id/status', requireAuth, authorizeRoles('service_team', 'admin'), pickupController.updatePickupStatus);

module.exports = router;
```

---

### 📄 File: `backend/routes/listingRoutes.js`

**Purpose**: Reuse and donation marketplace REST routes

```javascript
const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public or Authenticated browsing
router.get('/', optionalAuth, listingController.getListings);
router.get('/:id', optionalAuth, listingController.getListingById);

// Create item listing
router.post('/', requireAuth, upload.single('photo'), listingController.createListing);

// Request an item
router.post('/:id/request', requireAuth, listingController.requestItem);

// Owner accepts or rejects a request
router.patch('/:id/requests/:requestId', requireAuth, listingController.respondToRequest);

// Delete or moderate
router.delete('/:id', requireAuth, listingController.deleteListing);

module.exports = router;
```

---

### 📄 File: `backend/routes/recyclingRoutes.js`

**Purpose**: Recycling centres directory REST routes

```javascript
const express = require('express');
const router = express.Router();
const recyclingController = require('../controllers/recyclingController');
const { requireAuth } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public access
router.get('/', recyclingController.getRecyclingCentres);
router.get('/:id', recyclingController.getRecyclingCentreById);

// Admin-only management
router.post('/', requireAuth, authorizeRoles('admin'), recyclingController.createRecyclingCentre);
router.put('/:id', requireAuth, authorizeRoles('admin'), recyclingController.updateRecyclingCentre);
router.delete('/:id', requireAuth, authorizeRoles('admin'), recyclingController.deleteRecyclingCentre);

module.exports = router;
```

---

### 📄 File: `backend/routes/educationRoutes.js`

**Purpose**: Waste education and quiz REST routes

```javascript
const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');
const { requireAuth } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public educational browsing
router.get('/', educationController.getEducationContent);

// Claim Green Points for completing quiz / educational guide
router.post('/quiz', requireAuth, educationController.completeQuiz);

// Admin content management
router.post('/', requireAuth, authorizeRoles('admin'), educationController.createTopic);
router.put('/:id', requireAuth, authorizeRoles('admin'), educationController.updateTopic);
router.delete('/:id', requireAuth, authorizeRoles('admin'), educationController.deleteTopic);

module.exports = router;
```

---

### 📄 File: `backend/routes/assistantRoutes.js`

**Purpose**: Smart Assistant REST routes

```javascript
const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistantController');

// Public access for citizens and guests
router.post('/ask', assistantController.askAssistant);
router.get('/suggestions', assistantController.getQuickSuggestions);

module.exports = router;
```

---

### 📄 File: `backend/routes/greenPointsRoutes.js`

**Purpose**: Green Points and leaderboard REST routes

```javascript
const express = require('express');
const router = express.Router();
const greenPointsController = require('../controllers/greenPointsController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/my', requireAuth, greenPointsController.getMyPoints);
router.get('/leaderboard', greenPointsController.getLeaderboard);
router.get('/rules', greenPointsController.getPointsRules);

module.exports = router;
```

---

### 📄 File: `backend/routes/notificationRoutes.js`

**Purpose**: In-app notifications REST routes

```javascript
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', requireAuth, notificationController.getNotifications);
router.patch('/:id/read', requireAuth, notificationController.markAsRead);
router.patch('/read-all', requireAuth, notificationController.markAllAsRead);

module.exports = router;
```

---

### 📄 File: `backend/routes/adminRoutes.js`

**Purpose**: Admin analytics and governance REST routes

```javascript
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All routes here strictly require Admin role
router.use(requireAuth);
router.use(authorizeRoles('admin'));

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.get('/service-team', adminController.getServiceTeamMembers);

module.exports = router;
```

---

### 📄 File: `backend/test/api-test.js`

**Purpose**: 27-point automated end-to-end test suite testing all endpoints and workflows

```javascript
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
```

---

### 📄 File: `frontend/package.json`

**Purpose**: Frontend dependencies, build scripts, and Vite/React setup

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.20.0",
    "lucide-react": "^1.48.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-router-dom": "^7.18.4"
  },
  "devDependencies": {
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.7",
    "@vitejs/plugin-react": "^6.1.1",
    "autoprefixer": "^10.6.1",
    "oxlint": "^1.81.0",
    "postcss": "^8.5.28",
    "tailwindcss": "^3.4.19",
    "vite": "^8.3.0"
  }
}
```

---

### 📄 File: `frontend/vite.config.js`

**Purpose**: Vite configuration for React

```javascript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

---

### 📄 File: `frontend/tailwind.config.js`

**Purpose**: Tailwind CSS theme, custom colors, and content paths

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        slate: {
          850: '#151f32',
          950: '#0b1120'
        }
      }
    },
  },
  plugins: [],
}
```

---

### 📄 File: `frontend/postcss.config.js`

**Purpose**: PostCSS configuration for Tailwind and Autoprefixer

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

### 📄 File: `frontend/index.html`

**Purpose**: HTML entry point with title, meta tags, and Google Fonts

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌍</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Civic Impact - Smart City, Civic Responsibility, and Waste Management Platform. Report issues, schedule waste pickups, donate reusable items, and earn Green Points." />
    <title>Civic Impact — Smart City & Waste Management Platform</title>
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      }
    </style>
  </head>
  <body class="bg-slate-50 text-slate-900 min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

### 📄 File: `frontend/src/main.jsx`

**Purpose**: React root renderer mounting App

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

### 📄 File: `frontend/src/index.css`

**Purpose**: Tailwind directives, scrollbars, and civic styling utilities

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-50 text-slate-900 font-sans antialiased min-h-screen selection:bg-emerald-500 selection:text-white;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Glass & Card Effects */
.glass-panel {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.gradient-civic {
  background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
}

.gradient-civic-dark {
  background: linear-gradient(135deg, #064e3b 0%, #0f172a 100%);
}
```

---

### 📄 File: `frontend/src/App.jsx`

**Purpose**: React Router setup with role-based protected route guards

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { ServiceDashboard } from './pages/ServiceDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { NewComplaintPage } from './pages/NewComplaintPage';
import { ComplaintDetailsPage } from './pages/ComplaintDetailsPage';
import { WastePickupPage } from './pages/WastePickupPage';
import { ReuseMarketplacePage } from './pages/ReuseMarketplacePage';
import { RecyclingCentresPage } from './pages/RecyclingCentresPage';
import { WasteEducationPage } from './pages/WasteEducationPage';
import { SmartAssistantPage } from './pages/SmartAssistantPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/complaints/:id" element={<ComplaintDetailsPage />} />
          <Route path="/pickup" element={<WastePickupPage />} />
          <Route path="/reuse" element={<ReuseMarketplacePage />} />
          <Route path="/recycling" element={<RecyclingCentresPage />} />
          <Route path="/education" element={<WasteEducationPage />} />
          <Route path="/assistant" element={<SmartAssistantPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />

          {/* Citizen Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaints/new"
            element={
              <ProtectedRoute>
                <NewComplaintPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Service Team Protected */}
          <Route
            path="/service"
            element={
              <RoleRoute allowedRoles={['service_team', 'admin']}>
                <ServiceDashboard />
              </RoleRoute>
            }
          />

          {/* Admin Protected */}
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          {/* 404 Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}
```

---

### 📄 File: `frontend/src/services/api.js`

**Purpose**: Axios API client with JWT bearer interceptor and all module endpoints

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Attach JWT Token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('civic_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Handle Unauthorized / Global Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      // localStorage.removeItem('civic_token');
      // localStorage.removeItem('civic_user');
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  getUserActivity: () => api.get('/auth/activity'),
};

export const complaintAPI = {
  getComplaints: (params) => api.get('/complaints', { params }),
  getComplaintById: (id) => api.get(`/complaints/${id}`),
  createComplaint: (formData) =>
    api.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateStatus: (id, formData) =>
    api.patch(`/complaints/${id}/status`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  assignComplaint: (id, data) => api.patch(`/complaints/${id}/assign`, data),
  overridePriority: (id, data) => api.patch(`/complaints/${id}/priority`, data),
};

export const pickupAPI = {
  getPickups: (params) => api.get('/pickups', { params }),
  getPickupById: (id) => api.get(`/pickups/${id}`),
  createPickup: (formData) =>
    api.post('/pickups', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  scheduleAndAssign: (id, data) => api.patch(`/pickups/${id}/schedule`, data),
  updateStatus: (id, data) => api.patch(`/pickups/${id}/status`, data),
};

export const listingAPI = {
  getListings: (params) => api.get('/listings', { params }),
  getListingById: (id) => api.get(`/listings/${id}`),
  createListing: (formData) =>
    api.post('/listings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  requestItem: (id, data) => api.post(`/listings/${id}/request`, data),
  respondToRequest: (id, requestId, data) =>
    api.patch(`/listings/${id}/requests/${requestId}`, data),
  deleteListing: (id) => api.delete(`/listings/${id}`),
};

export const recyclingAPI = {
  getCentres: (params) => api.get('/recycling', { params }),
  getCentreById: (id) => api.get(`/recycling/${id}`),
  createCentre: (data) => api.post('/recycling', data),
  updateCentre: (id, data) => api.put(`/recycling/${id}`, data),
  deleteCentre: (id) => api.delete(`/recycling/${id}`),
};

export const educationAPI = {
  getContent: (params) => api.get('/education', { params }),
  takeQuiz: (data) => api.post('/education/quiz', data),
  createTopic: (data) => api.post('/education', data),
  updateTopic: (id, data) => api.put(`/education/${id}`, data),
  deleteTopic: (id) => api.delete(`/education/${id}`),
};

export const assistantAPI = {
  askAssistant: (data) => api.post('/assistant/ask', data),
  getSuggestions: () => api.get('/assistant/suggestions'),
};

export const pointsAPI = {
  getMyPoints: () => api.get('/points/my'),
  getLeaderboard: (params) => api.get('/points/leaderboard', { params }),
  getRules: () => api.get('/points/rules'),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, data) => api.patch(`/admin/users/${id}/role`, data),
  getServiceTeam: () => api.get('/admin/service-team'),
};

export default api;
```

---

### 📄 File: `frontend/src/context/AuthContext.jsx`

**Purpose**: Global authentication state, JWT storage, user roles, and login/register methods

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('civic_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('civic_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      refreshProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const refreshProfile = async () => {
    try {
      const res = await authAPI.getProfile();
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('civic_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('Session validation error:', err);
      // If token is expired
      if (err.response && err.response.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('civic_token', res.data.token);
      localStorage.setItem('civic_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('civic_token', res.data.token);
      localStorage.setItem('civic_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('civic_token');
    localStorage.removeItem('civic_user');
  };

  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('civic_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    role: user?.role || 'guest',
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    isServiceTeam: user?.role === 'service_team',
    isCitizen: user?.role === 'citizen',
    loading,
    login,
    register,
    logout,
    refreshProfile,
    updateUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

### 📄 File: `frontend/src/context/NotificationContext.jsx`

**Purpose**: Real-time notification polling, unread badge counter, and toast notifications

```jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationAPI } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationAPI.getNotifications();
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 25000); // Polling every 25 seconds
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const value = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    showToast
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Toast Notification Popup */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium ${
              toast.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : toast.type === 'info'
                ? 'bg-sky-50 border-sky-200 text-sky-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <span>{toast.type === 'error' ? '⚠️' : '🌿'}</span>
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-slate-600 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
```

---

### 📄 File: `frontend/src/components/common/Navbar.jsx`

**Purpose**: Responsive navigation header with notification bell, points pill, and mobile drawer

```jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  ShieldAlert,
  Trash2,
  Gift,
  MapPin,
  BookOpen,
  Sparkles,
  Trophy,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ShieldCheck,
  Wrench
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isServiceTeam } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Complaints', path: '/complaints', icon: ShieldAlert },
    { name: 'Waste Pickup', path: '/pickup', icon: Trash2 },
    { name: 'Reuse & Donate', path: '/reuse', icon: Gift },
    { name: 'Recycling', path: '/recycling', icon: MapPin },
    { name: 'Waste Guide', path: '/education', icon: BookOpen },
    { name: 'Assistant', path: '/assistant', icon: Sparkles, highlight: true },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  const getDashboardPath = () => {
    if (isAdmin) return '/admin';
    if (isServiceTeam) return '/service';
    return '/dashboard';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <span className="text-xl font-black">🌍</span>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Civic<span className="text-emerald-600">Impact</span>
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase -mt-1">
                Smart City & Sustainability
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive(link.path)
                      ? 'bg-emerald-50 text-emerald-700'
                      : link.highlight
                      ? 'text-teal-700 bg-teal-50/60 hover:bg-teal-100/70'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={14} className={link.highlight ? 'text-teal-600' : ''} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Section: Points, Notifications, Profile / Login */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Green Points Pill */}
                <Link
                  to="/leaderboard"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-100/80 hover:bg-emerald-200/80 border border-emerald-300 text-emerald-800 rounded-full text-xs font-bold transition shadow-xs"
                  title="Your Green Points Balance"
                >
                  <span>🌱</span>
                  <span>{user?.green_points || 0} Points</span>
                </Link>

                {/* Dashboard Shortcut */}
                <Link
                  to={getDashboardPath()}
                  className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isActive(getDashboardPath())
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isAdmin ? <ShieldCheck size={14} /> : isServiceTeam ? <Wrench size={14} /> : <LayoutDashboard size={14} />}
                  <span>{isAdmin ? 'Admin Portal' : isServiceTeam ? 'Service Desk' : 'Dashboard'}</span>
                </Link>

                {/* Notification Dropdown Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setProfileDropdownOpen(false);
                    }}
                    className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    title="In-app Notifications"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Notifications ({unreadCount} new)
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="py-6 text-center text-xs text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 8).map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className={`p-3 text-left transition hover:bg-slate-50 cursor-pointer ${
                                !notif.is_read ? 'bg-emerald-50/40' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h5 className="text-xs font-bold text-slate-800">{notif.title}</h5>
                                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                  {new Date(notif.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                                {notif.message}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition border border-slate-200"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline text-xs font-bold text-slate-700 max-w-[100px] truncate">
                      {user?.name}
                    </span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 py-2">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                          Role: {user?.role}
                        </span>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <LayoutDashboard size={14} />
                        <span>My Dashboard</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <User size={14} />
                        <span>Profile & Settings</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left border-t border-slate-100 mt-1"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition"
                >
                  Join Civic Impact
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          {isAuthenticated && (
            <div className="p-3 bg-emerald-50 rounded-xl mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                <p className="text-[11px] text-emerald-800 font-semibold">🌱 {user?.green_points || 0} Green Points</p>
              </div>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg"
              >
                Dashboard
              </Link>
            </div>
          )}

          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Icon size={18} className="text-emerald-600" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-1">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-700"
              >
                <User size={18} />
                <span>My Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-rose-600"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-bold text-slate-700 border border-slate-200 rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-bold bg-emerald-600 text-white rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
```

---

### 📄 File: `frontend/src/components/common/Footer.jsx`

**Purpose**: Municipal footer with hotline info, quick links, and branding

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <span className="text-xl font-extrabold text-white">
                Civic<span className="text-emerald-400">Impact</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An integrated Smart City, Civic Responsibility, and Waste Management platform designed to empower citizens and municipalities towards a cleaner, circular future.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <Sparkles size={14} />
              <span>College Semester Project Demo</span>
            </div>
          </div>

          {/* Civic Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">Civic Modules</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/complaints" className="hover:text-emerald-400 transition">
                  Report Civic Issues
                </Link>
              </li>
              <li>
                <Link to="/pickup" className="hover:text-emerald-400 transition">
                  Doorstep Waste Pickup
                </Link>
              </li>
              <li>
                <Link to="/reuse" className="hover:text-emerald-400 transition">
                  Donate & Reuse Marketplace
                </Link>
              </li>
              <li>
                <Link to="/recycling" className="hover:text-emerald-400 transition">
                  Recycling Centres Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Education & Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">Smart Tools & Learn</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/assistant" className="hover:text-emerald-400 transition">
                  "What Should I Do?" Assistant
                </Link>
              </li>
              <li>
                <Link to="/education" className="hover:text-emerald-400 transition">
                  Waste Segregation Guide
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-emerald-400 transition">
                  Community Green Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition">
                  Citizen Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Municipal Helpline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">Municipal Helpline</h4>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
                <PhoneCall size={14} />
                <span>24/7 Civic Control Room</span>
              </div>
              <p className="text-[11px] text-slate-400">Toll Free: 1800-CIVIC-GOV (1800-248-4246)</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>Verified City Operations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Civic Impact. Built for Sustainable Cities & Communities.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with care for environmental responsibility</span>
            <Heart size={12} className="text-rose-500 inline fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
```

---

### 📄 File: `frontend/src/components/common/StatusBadge.jsx`

**Purpose**: Status badges and smart priority badges with hover reasoning tooltip

```jsx
import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      // Complaint statuses
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Assigned':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'In Progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';

      // Pickup statuses
      case 'Requested':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Scheduled':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Picked Up':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';

      // Listing statuses
      case 'Available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Accepted':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-700 border-slate-200';

      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority, reason }) => {
  const getStyle = () => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Medium':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Low':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="relative group inline-block">
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold border cursor-help ${getStyle()}`}
      >
        <span>⚡</span>
        <span>{priority} Priority</span>
      </span>

      {reason && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-30 w-64 p-2 text-xs bg-slate-900 text-white rounded-lg shadow-xl text-center pointer-events-none">
          <p className="font-semibold text-emerald-400 mb-0.5">Priority Logic:</p>
          <p className="text-slate-200 leading-snug">{reason}</p>
        </div>
      )}
    </div>
  );
};
```

---

### 📄 File: `frontend/src/components/common/StatCard.jsx`

**Purpose**: Reusable metric KPI display card

```jsx
import React from 'react';

export const StatCard = ({ title, value, icon: Icon, trend, color = 'emerald', subtitle }) => {
  const colorMap = {
    emerald: 'bg-emerald-500 text-white',
    blue: 'bg-blue-500 text-white',
    amber: 'bg-amber-500 text-white',
    purple: 'bg-purple-500 text-white',
    rose: 'bg-rose-500 text-white',
    teal: 'bg-teal-500 text-white',
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-850 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${colorMap[color] || colorMap.emerald}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-medium text-slate-600">
          <span className="text-emerald-600 font-bold mr-1">↑</span>
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidth} border border-slate-100 overflow-hidden transform transition-all`}>
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            ✕
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => {
  return (
    <div className="text-center py-12 px-4 rounded-2xl bg-white border border-dashed border-slate-200">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <Icon size={32} />
        </div>
      )}
      <h4 className="text-base font-bold text-slate-800">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export const LoadingSpinner = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      <p className="text-xs font-semibold text-slate-500 mt-3">{label}</p>
    </div>
  );
};
```

---

### 📄 File: `frontend/src/components/common/Modal.jsx`

**Purpose**: Reusable accessible modal dialog with backdrop blur

```jsx
import React from 'react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidth} border border-slate-100 overflow-hidden transform transition-all`}>
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            ✕
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
```

---

### 📄 File: `frontend/src/components/common/LoadingSpinner.jsx`

**Purpose**: Reusable animated loading indicator

```jsx
import React from 'react';

export const LoadingSpinner = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      <p className="text-xs font-semibold text-slate-500 mt-3">{label}</p>
    </div>
  );
};
```

---

### 📄 File: `frontend/src/components/common/EmptyState.jsx`

**Purpose**: Reusable empty state placeholder with CTA

```jsx
import React from 'react';

export const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => {
  return (
    <div className="text-center py-12 px-4 rounded-2xl bg-white border border-dashed border-slate-200">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <Icon size={32} />
        </div>
      )}
      <h4 className="text-base font-bold text-slate-800">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
```

---

### 📄 File: `frontend/src/pages/LandingPage.jsx`

**Purpose**: Home landing page with hero banner, 1-click evaluation login buttons, and feature grid

```jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Trash2,
  Gift,
  MapPin,
  Sparkles,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  Users,
  Leaf,
  ChevronRight
} from 'lucide-react';
import { pointsAPI } from '../services/api';

export const LandingPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [topUsers, setTopUsers] = useState([]);
  const [quickLoginLoading, setQuickLoginLoading] = useState(false);

  useEffect(() => {
    // Load top 3 from leaderboard
    pointsAPI.getLeaderboard({ timeframe: 'overall' })
      .then((res) => {
        if (res.data.success) {
          setTopUsers(res.data.leaderboard.slice(0, 3));
        }
      })
      .catch((err) => console.log('Leaderboard preview load error:', err));
  }, []);

  const handleQuickLogin = async (email, roleRedirect) => {
    try {
      setQuickLoginLoading(true);
      await login(email, 'Password123!');
      navigate(roleRedirect);
    } catch (err) {
      console.error('Quick login failed:', err);
    } finally {
      setQuickLoginLoading(false);
    }
  };

  const features = [
    {
      title: 'Civic Complaint Reporting',
      description: 'Report potholes, broken streetlights, water leaks, and illegal garbage dumps with photos and auto-smart priority.',
      icon: ShieldAlert,
      route: '/complaints',
      color: 'from-amber-500 to-orange-500',
      tag: 'Smart Prioritization'
    },
    {
      title: 'Doorstep Waste Pickup',
      description: 'Schedule scheduled collection of segregated wet, dry, plastic, and electronic waste straight from your home.',
      icon: Trash2,
      route: '/pickup',
      color: 'from-emerald-500 to-teal-500',
      tag: 'Doorstep Service'
    },
    {
      title: 'Reuse & Donate Marketplace',
      description: 'Give usable clothes, books, furniture, and electronics a second life by connecting with neighbors in your community.',
      icon: Gift,
      route: '/reuse',
      color: 'from-purple-500 to-indigo-500',
      tag: 'Circular Economy'
    },
    {
      title: '"What Should I Do?" Assistant',
      description: 'Confused about how to handle an item? Ask our smart rule-based advisor for instant segregation and recycling guidance.',
      icon: Sparkles,
      route: '/assistant',
      color: 'from-teal-500 to-cyan-500',
      tag: 'Smart Assistant'
    },
    {
      title: 'Recycling Centres Directory',
      description: 'Explore certified local recycling facilities, opening hours, accepted waste streams, and drop-off guidance.',
      icon: MapPin,
      route: '/recycling',
      color: 'from-blue-500 to-sky-500',
      tag: 'City Directory'
    },
    {
      title: 'Green Points & Leaderboard',
      description: 'Earn points for responsible civic actions, report validations, and donations. Climb the civic leaderboard!',
      icon: Trophy,
      route: '/leaderboard',
      color: 'from-lime-500 to-emerald-500',
      tag: 'Gamification'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Leaf size={14} className="text-emerald-400" />
            <span>Smart City + Waste Management Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Cleaner Streets, <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Smarter Cities</span>, & Empowered Citizens.
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Report civic issues, request waste pickups, donate reusable items, and earn Green Points. An all-in-one platform bridging citizens and municipal service teams.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/complaints/new"
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <ShieldAlert size={18} />
              <span>Report a Civic Problem</span>
            </Link>

            <Link
              to="/assistant"
              className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition"
            >
              <Sparkles size={18} className="text-teal-400" />
              <span>Ask "What Should I Do?"</span>
            </Link>
          </div>

          {/* Quick Demo Roles Bar (Evaluation Friendly) */}
          <div className="pt-8 max-w-3xl mx-auto">
            <div className="p-4 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-center gap-1.5">
                <Zap size={14} className="text-amber-400" />
                <span>Fast Project Evaluation — 1-Click Demo Login</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => handleQuickLogin('citizen1@civicimpact.org', '/dashboard')}
                  disabled={quickLoginLoading}
                  className="px-3 py-2 bg-slate-700/70 hover:bg-emerald-600/30 hover:border-emerald-500/50 border border-slate-600 rounded-xl text-xs font-bold text-slate-200 transition text-center"
                >
                  👤 Login as Citizen
                  <span className="block text-[10px] text-slate-400 font-normal">Amina (310 Pts)</span>
                </button>
                <button
                  onClick={() => handleQuickLogin('service1@civicimpact.org', '/service')}
                  disabled={quickLoginLoading}
                  className="px-3 py-2 bg-slate-700/70 hover:bg-teal-600/30 hover:border-teal-500/50 border border-slate-600 rounded-xl text-xs font-bold text-slate-200 transition text-center"
                >
                  🛠️ Login as Service Team
                  <span className="block text-[10px] text-slate-400 font-normal">Alex (Sanitation)</span>
                </button>
                <button
                  onClick={() => handleQuickLogin('admin@civicimpact.org', '/admin')}
                  disabled={quickLoginLoading}
                  className="px-3 py-2 bg-slate-700/70 hover:bg-purple-600/30 hover:border-purple-500/50 border border-slate-600 rounded-xl text-xs font-bold text-slate-200 transition text-center"
                >
                  👑 Login as Municipal Admin
                  <span className="block text-[10px] text-slate-400 font-normal">Full Control Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Integrated Civic & Sustainability Modules
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Engineered to cover the entire lifecycle: from reporting civic hazards to circular reuse and recycling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md`}
                    >
                      <Icon size={24} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                <Link
                  to={feat.route}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-800 transition"
                >
                  <span>Explore Feature</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Transparent Priority System Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                Rule-Based Intelligence
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Explainable, Smart Complaint Prioritization
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Rather than an opaque black box, Civic Impact uses transparent rule logic analyzing category urgency, public safety hazards (live wires, deep sinkholes, sewage), and vulnerable proximity (schools, hospitals) to automatically assign Low, Medium, High, or Critical priority.
              </p>
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 size={16} />
                  <span>Instant keyword safety detection</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 size={16} />
                  <span>Full reason displayed on every complaint card</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 size={16} />
                  <span>Admin override capabilities anytime</span>
                </div>
              </div>
            </div>

            {/* Visual Example Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">#CMP-2026-1002</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-rose-500 text-white animate-pulse">
                  ⚡ Critical Priority
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Deep pothole causing accidents near Metro exit</h4>
                <p className="text-xs text-slate-300 mt-1">Category: Pothole/Road • Address: Central Avenue</p>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700 text-xs">
                <span className="text-emerald-400 font-bold block mb-1">Transparent Reasoning:</span>
                <p className="text-slate-300 leading-snug">
                  "Road infrastructure impacts traffic and vehicle safety; Critical safety alert triggered by keyword: 'accident', 'deep pothole' (Calculated Score: 55)"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard & Community Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Community Leaders
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                Top Civic Contributors
              </h3>
            </div>
            <Link
              to="/leaderboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-800"
            >
              <span>View Full Community Leaderboard</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topUsers.map((u, i) => (
              <div
                key={u.id}
                className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-emerald-50/40 transition flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-sm ${
                    i === 0
                      ? 'bg-amber-400 text-amber-950'
                      : i === 1
                      ? 'bg-slate-300 text-slate-800'
                      : 'bg-amber-700 text-amber-100'
                  }`}
                >
                  #{u.rank}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{u.name}</h4>
                  <p className="text-xs text-emerald-700 font-extrabold mt-0.5">🌱 {u.green_points} Green Points</p>
                  <p className="text-[11px] text-slate-400">{u.activity_count} verified civic actions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
```

---

### 📄 File: `frontend/src/pages/LoginPage.jsx`

**Purpose**: Login page with show/hide password and 1-click demo credential autofill

```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const LoginPage = () => {
  const { login, isAdmin, isServiceTeam } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.user.role === 'admin') navigate('/admin');
      else if (res.user.role === 'service_team') navigate('/service');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
            🌍
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to your Civic Impact account</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Demo Credentials Quick-Fill Buttons */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
            <Zap size={13} className="text-amber-500" />
            <span>Quick-Fill Demo Accounts</span>
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => fillCredentials('citizen1@civicimpact.org')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-lg transition"
            >
              Citizen
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('service1@civicimpact.org')}
              className="py-1.5 px-2 bg-white hover:bg-teal-50 hover:text-teal-700 border border-slate-200 rounded-lg transition"
            >
              Service Team
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@civicimpact.org')}
              className="py-1.5 px-2 bg-white hover:bg-purple-50 hover:text-purple-700 border border-slate-200 rounded-lg transition"
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@civicimpact.org"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-emerald-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
```

---

### 📄 File: `frontend/src/pages/RegisterPage.jsx`

**Purpose**: Registration page with input validation and welcome Green Points bonus

```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, MapPin, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles size={14} className="text-emerald-600" />
            <span>+20 Welcome Green Points Bonus!</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Join Civic Impact</h2>
          <p className="text-xs text-slate-500">Become an active citizen shaping a cleaner, smarter city</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 555-0199"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Residential Address / Neighborhood *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 text-slate-400" size={16} />
              <textarea
                name="address"
                required
                rows={2}
                value={formData.address}
                onChange={handleChange}
                placeholder="House/Apartment #, Street, Sector, City"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 chars"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
```

---

### 📄 File: `frontend/src/pages/CitizenDashboard.jsx`

**Purpose**: Citizen dashboard with KPI stats, active complaints, pickups, and point history

```jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, complaintAPI, pickupAPI, listingAPI, pointsAPI } from '../services/api';
import {
  ShieldAlert,
  Trash2,
  Gift,
  Sparkles,
  Trophy,
  PlusCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [listings, setListings] = useState([]);
  const [pointData, setPointData] = useState({ balance: 0, rank: 1, transactions: [] });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [compRes, pickRes, listRes, ptsRes] = await Promise.all([
        complaintAPI.getComplaints({ myOnly: 'true' }),
        pickupAPI.getPickups({ myOnly: 'true' }),
        listingAPI.getListings({ myOnly: 'true' }),
        pointsAPI.getMyPoints()
      ]);

      if (compRes.data.success) setComplaints(compRes.data.complaints);
      if (pickRes.data.success) setPickups(pickRes.data.pickups);
      if (listRes.data.success) setListings(listRes.data.listings);
      if (ptsRes.data.success) setPointData(ptsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading Citizen Dashboard..." />;
  }

  const activeComplaints = complaints.filter(
    (c) => ['Submitted', 'Under Review', 'Assigned', 'In Progress'].includes(c.status)
  ).length;
  const resolvedComplaints = complaints.filter(
    (c) => ['Resolved', 'Closed'].includes(c.status)
  ).length;
  const pendingPickups = pickups.filter(
    (p) => ['Requested', 'Scheduled', 'Assigned'].includes(p.status)
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-400/20">
            <span>🌱 Active Eco-Citizen</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name || 'Citizen'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Welcome to your civic hub. Monitor your reported complaints, manage waste collections, and view your community sustainability impact.
          </p>
        </div>

        {/* Green Points Card Badge */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-2xl shadow-md">
            🌱
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
              Green Points Balance
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{pointData.balance}</span>
              <span className="text-xs font-semibold text-emerald-300">Rank #{pointData.rank}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Complaints"
          value={complaints.length}
          icon={ShieldAlert}
          color="amber"
          subtitle={`${activeComplaints} Active • ${resolvedComplaints} Resolved`}
        />
        <StatCard
          title="Waste Pickups"
          value={pickups.length}
          icon={Trash2}
          color="teal"
          subtitle={`${pendingPickups} Pending Handover`}
        />
        <StatCard
          title="Reuse Listings"
          value={listings.length}
          icon={Gift}
          color="purple"
          subtitle="Donations & Free Giveaways"
        />
        <StatCard
          title="Green Rank"
          value={`#${pointData.rank}`}
          icon={Trophy}
          color="emerald"
          subtitle="In Community Leaderboard"
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/complaints/new"
            className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition border border-emerald-200"
          >
            <PlusCircle size={18} className="text-emerald-600" />
            <span>Report Issue</span>
          </Link>
          <Link
            to="/pickup"
            className="flex items-center gap-2 p-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition border border-teal-200"
          >
            <Trash2 size={18} className="text-teal-600" />
            <span>Request Pickup</span>
          </Link>
          <Link
            to="/reuse"
            className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition border border-purple-200"
          >
            <Gift size={18} className="text-purple-600" />
            <span>List Reuse Item</span>
          </Link>
          <Link
            to="/assistant"
            className="flex items-center gap-2 p-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold transition border border-cyan-200"
          >
            <Sparkles size={18} className="text-cyan-600" />
            <span>Smart Assistant</span>
          </Link>
        </div>
      </div>

      {/* Main Content Columns: Recent Complaints & Recent Pickups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Complaints */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-amber-500" />
              <h3 className="text-base font-extrabold text-slate-850">My Recent Complaints</h3>
            </div>
            <Link to="/complaints" className="text-xs font-bold text-emerald-600 hover:text-emerald-800">
              View All ({complaints.length})
            </Link>
          </div>

          {complaints.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              You haven't submitted any complaints yet. Report an issue to earn Green Points!
            </p>
          ) : (
            <div className="space-y-3">
              {complaints.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  to={`/complaints/${c.id}`}
                  className="block p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">{c.complaint_id}</span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">{c.title}</h4>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span className="truncate max-w-[160px]">{c.address}</span>
                    </span>
                    <PriorityBadge priority={c.priority} reason={c.priority_reason} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Pickups & Activity */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Trash2 size={18} className="text-teal-500" />
              <h3 className="text-base font-extrabold text-slate-850">Recent Waste Pickups</h3>
            </div>
            <Link to="/pickup" className="text-xs font-bold text-emerald-600 hover:text-emerald-800">
              Manage Pickups ({pickups.length})
            </Link>
          </div>

          {pickups.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No waste pickup requests on file. Book a pickup for your recyclable materials!
            </p>
          ) : (
            <div className="space-y-3">
              {pickups.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">{p.pickup_id}</span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                      {p.waste_type} <span className="font-normal text-slate-500">({p.quantity})</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar size={12} />
                      <span>{p.preferred_date} • {p.preferred_time}</span>
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          )}

          {/* Green Points Recent Activity */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Recent Green Points Earned
            </h4>
            <div className="space-y-2">
              {pointData.transactions.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-slate-600">{t.activity_type}: {t.description}</span>
                  <span className="font-bold text-emerald-600">+{t.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

### 📄 File: `frontend/src/pages/ServiceDashboard.jsx`

**Purpose**: Service Team field operations desk for assigned complaints and waste collections

```jsx
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
```

---

### 📄 File: `frontend/src/pages/AdminDashboard.jsx`

**Purpose**: Municipal Admin portal with platform KPIs, user management, and triage tools

```jsx
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
```

---

### 📄 File: `frontend/src/pages/ComplaintsPage.jsx`

**Purpose**: Civic complaints directory with search, category, status, and priority filters

```jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintAPI } from '../services/api';
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
                      src={`http://localhost:5000${c.photo_url}`}
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
```

---

### 📄 File: `frontend/src/pages/NewComplaintPage.jsx`

**Purpose**: Complaint reporting form with real-time rule-based priority preview and photo upload

```jsx
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
```

---

### 📄 File: `frontend/src/pages/ComplaintDetailsPage.jsx`

**Purpose**: Complaint details page with 6-stage visual lifecycle timeline and audit trail

```jsx
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
```

---

### 📄 File: `frontend/src/pages/WastePickupPage.jsx`

**Purpose**: Doorstep waste pickup booking, time slot selection, and status tracker

```jsx
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
```

---

### 📄 File: `frontend/src/pages/ReuseMarketplacePage.jsx`

**Purpose**: Circular reuse/donation marketplace with item listing and peer request flow

```jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listingAPI } from '../services/api';
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
                      src={`http://localhost:5000${item.photo_url}`}
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
                  src={`http://localhost:5000${selectedListing.photo_url}`}
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
```

---

### 📄 File: `frontend/src/pages/RecyclingCentresPage.jsx`

**Purpose**: Recycling centres directory with material filters and Google Maps integration

```jsx
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
```

---

### 📄 File: `frontend/src/pages/WasteEducationPage.jsx`

**Purpose**: Waste segregation guide with interactive 4-question quiz awarding +15 Green Points

```jsx
import React, { useState, useEffect } from 'react';
import { educationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Apple,
  Package,
  Cpu,
  AlertTriangle,
  Search,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Award
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const WasteEducationPage = () => {
  const { isAuthenticated } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Quiz State
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');

  const quizQuestions = [
    {
      question: 'Which bin should banana peels and leftover cooked rice go into?',
      options: ['Green Bin (Wet Waste / Composting)', 'Blue Bin (Dry Recyclables)', 'Red Bin (Hazardous Waste)', 'Black Bin (Landfill Trash)'],
      correct: 0,
      explanation: 'Food residues and fruit peels are organic biodegradable wet waste suitable for composting.'
    },
    {
      question: 'Before placing greasy plastic takeout food containers into the recycling bin, what must you do?',
      options: ['Throw them away directly with food remaining', 'Rinse them thoroughly with water to remove food grease', 'Burn them at home', 'Wrap them in old clothing'],
      correct: 1,
      explanation: 'Food residues spoil entire batches of recycled paper and plastic pulping.'
    },
    {
      question: 'Where should swollen lithium-ion laptop and smartphone batteries be disposed?',
      options: ['In standard municipal trash cans', 'In household compost piles', 'At authorized certified E-waste drop-off bins', 'Poured with salt water down the sink'],
      correct: 2,
      explanation: 'Lithium batteries can explode or ignite fires in conventional trash compactors.'
    },
    {
      question: 'How should expired prescription medicines and liquid syrups be handled?',
      options: ['Flushed down the toilet sink', 'Returned to pharmacy take-back bins or hazardous waste collections', 'Mixed into vegetable garden compost', 'Dumped on roadside corners'],
      correct: 1,
      explanation: 'Flushing pharmaceuticals poisons river aquifers and encourages antibiotic-resistant bacteria.'
    }
  ];

  useEffect(() => {
    fetchEducation();
  }, [activeCategory]);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const res = await educationAPI.getContent({
        category: activeCategory,
        search
      });
      if (res.data.success) {
        setTopics(res.data.topics);
      }
    } catch (err) {
      console.error('Error fetching educational topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEducation();
  };

  const handleAnswerClick = (optionIdx) => {
    if (optionIdx === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
      if (isAuthenticated) {
        educationAPI.takeQuiz({ quizScore: 100 })
          .then((res) => {
            setClaimMessage(res.data.message);
          })
          .catch((err) => {
            console.error('Quiz reward error:', err);
          });
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizFinished(false);
    setQuizActive(false);
    setClaimMessage('');
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Apple':
        return <Apple size={22} className="text-emerald-500" />;
      case 'Cpu':
        return <Cpu size={22} className="text-teal-500" />;
      case 'AlertTriangle':
        return <AlertTriangle size={22} className="text-amber-500" />;
      default:
        return <Package size={22} className="text-blue-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <BookOpen size={14} className="text-emerald-700" />
          <span>Waste Segregation & Educational Academy</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          How to Segregate Waste Responsibly
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Proper source segregation turns 85% of municipal refuse into valuable bio-fertilizers and circular secondary manufacturing inputs.
        </p>
      </div>

      {/* Quiz Banner / Gamification Section */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black uppercase tracking-wider inline-block">
            +15 Green Points Quiz
          </span>
          <h2 className="text-xl sm:text-2xl font-black">Test Your Segregation Knowledge</h2>
          <p className="text-xs text-slate-300 max-w-lg">
            Answer 4 quick practical questions regarding wet waste, recyclables, e-waste, and household hazards to earn Green Points!
          </p>
        </div>

        <button
          onClick={() => {
            setQuizActive(true);
            setQuizFinished(false);
            setCurrentQuestion(0);
            setScore(0);
          }}
          className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition transform hover:-translate-y-0.5 whitespace-nowrap"
        >
          {quizActive ? 'Restart Quiz' : 'Take 2-Min Quiz'}
        </button>
      </div>

      {/* Interactive Quiz Card */}
      {quizActive && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xl max-w-2xl mx-auto space-y-6">
          {!quizFinished ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span>Score: {score}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900">
                {quizQuestions[currentQuestion].question}
              </h3>

              <div className="space-y-2 pt-2">
                {quizQuestions[currentQuestion].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswerClick(i)}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-xs font-semibold text-slate-800 transition flex items-center justify-between group"
                  >
                    <span>{opt}</span>
                    <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] group-hover:bg-emerald-600 group-hover:text-white transition">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl">
                🏆
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Quiz Completed!</h3>
              <p className="text-sm text-slate-600">
                You scored <strong className="text-emerald-700">{score} out of {quizQuestions.length}</strong>!
              </p>

              {claimMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
                  {claimMessage}
                </div>
              )}

              <button
                onClick={resetQuiz}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Close Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {['All', 'Wet Waste', 'Dry Waste', 'E-Waste', 'Hazardous Waste'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items (e.g. peel, battery)..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </form>
      </div>

      {/* Topics Grid */}
      {loading ? (
        <LoadingSpinner label="Loading Segregation Guidelines..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs">
                    {getIcon(t.icon)}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {t.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{t.title}</h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{t.description}</p>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                <strong className="text-slate-850 font-bold block">Everyday Examples:</strong>
                <p className="text-slate-600">{t.examples}</p>
              </div>

              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1.5 text-xs text-emerald-950">
                <strong className="text-emerald-800 font-bold block flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>Correct Disposal Action:</span>
                </strong>
                <p className="leading-snug">{t.disposal_action}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

### 📄 File: `frontend/src/pages/SmartAssistantPage.jsx`

**Purpose**: "What Should I Do?" interactive guidance tool with quick suggestions and module links

```jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assistantAPI } from '../services/api';
import {
  Sparkles,
  Search,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Lightbulb,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const SmartAssistantPage = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState(null);

  const quickPills = [
    { label: 'Old usable clothes', text: 'I have old clothes that are still usable' },
    { label: 'Kitchen vegetable peels', text: 'I have vegetable peels and leftover food' },
    { label: 'Old mobile phone & chargers', text: 'I have an old mobile phone with dead battery and chargers' },
    { label: 'Cardboard delivery boxes', text: 'I have excess corrugated cardboard boxes' },
    { label: 'Wooden study desk', text: 'I want to get rid of a wooden study desk' },
    { label: 'Expired antibiotics & medicines', text: 'Where to dispose of expired medicines safely?' },
    { label: 'Household paint cans', text: 'Leftover wall paint cans and varnish' }
  ];

  const handleAsk = async (textToAsk) => {
    const q = textToAsk || query;
    if (!q || !q.trim()) return;

    try {
      setLoading(true);
      const res = await assistantAPI.askAssistant({ query: q });
      if (res.data.success) {
        setGuidance(res.data.guidance);
      }
    } catch (err) {
      console.error('Error asking assistant:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAsk(query);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
          <Sparkles size={14} className="text-teal-600" />
          <span>Rule-Based Material & Item Advisor</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          "What Should I Do?" Smart Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Unsure whether to donate, recycle, compost, or request waste collection for an item? Type your item below to receive deterministic ecological recommendations.
        </p>
      </div>

      {/* Input Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 'I have old clothes that are still usable' or 'broken phone'..."
            className="w-full pl-5 pr-28 py-3.5 rounded-2xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>{loading ? 'Analyzing...' : 'Ask Advice'}</span>
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Popular Items to Try:
          </span>
          <div className="flex flex-wrap gap-2">
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(pill.text);
                  handleAsk(pill.text);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 border border-slate-200 text-xs font-medium text-slate-700 transition"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && <LoadingSpinner label="Evaluating Waste Hierarchy & Material Guidelines..." />}

      {/* Guidance Result Card */}
      {guidance && !loading && (
        <div className="bg-gradient-to-b from-white to-teal-50/30 rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-lg space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-teal-100">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-100/70 px-2.5 py-0.5 rounded-full">
                Item Identified: {guidance.itemIdentified}
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Recommended Action: {guidance.recommendedAction}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              🌿
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reason */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Lightbulb size={15} className="text-amber-500" />
                <span>Ecological Reasoning & Impact:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {guidance.reason}
              </p>
            </div>

            {/* Alternative Action */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <RefreshCw size={15} className="text-teal-600" />
                <span>Alternative / Secondary Option:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {guidance.alternativeAction}
              </p>
            </div>
          </div>

          {/* Related Civic Impact Action Gateway */}
          {guidance.relatedModule && (
            <div className="p-5 bg-gradient-to-r from-teal-800 to-emerald-800 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block">
                  Connected Civic Impact Module
                </span>
                <h4 className="text-sm font-bold text-white">{guidance.relatedModule.name}</h4>
              </div>

              <Link
                to={guidance.relatedModule.route}
                className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition shadow-sm flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>{guidance.relatedModule.action}</span>
                <ExternalLink size={13} />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Architecture Note for Examiners */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong>Academic Architecture Note:</strong> This feature is built with an offline-deterministic knowledge graph engine. It guarantees 100% test consistency without external API rate limits or keys, and is modularized for straightforward connection to external LLMs (e.g. Google Gemini API) via the backend controller.
        </p>
      </div>
    </div>
  );
};
```

---

### 📄 File: `frontend/src/pages/LeaderboardPage.jsx`

**Purpose**: Community leaderboard with top 3 podium, timeframe filter, and privacy protection

```jsx
import React, { useState, useEffect } from 'react';
import { pointsAPI } from '../services/api';
import {
  Trophy,
  Award,
  Medal,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeframe, setTimeframe] = useState('overall'); // 'overall' | 'month'
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  useEffect(() => {
    pointsAPI.getRules().then((res) => {
      if (res.data.success) setRules(res.data.rules);
    });
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await pointsAPI.getLeaderboard({ timeframe });
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Trophy size={14} className="text-emerald-700" />
          <span>Community Impact Leaderboard</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Citizen Sustainability Champions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Recognizing active citizens contributing to clean neighborhoods and circular waste segregation.
        </p>

        {/* Timeframe Toggle */}
        <div className="pt-2 flex justify-center">
          <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setTimeframe('overall')}
              className={`px-4 py-1.5 rounded-xl transition ${
                timeframe === 'overall'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All-Time Ranking
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-4 py-1.5 rounded-xl transition ${
                timeframe === 'month'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Month
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Compiling Community Scores..." />
      ) : (
        <>
          {/* Top 3 Podium */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {/* Silver (#2) */}
              {topThree[1] && (
                <div className="order-2 sm:order-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-2 relative flex flex-col justify-end">
                  <div className="w-14 h-14 rounded-2xl bg-slate-200 text-slate-700 font-extrabold text-2xl flex items-center justify-center mx-auto shadow-sm">
                    🥈
                  </div>
                  <span className="text-xs font-bold text-slate-400">Rank #2</span>
                  <h3 className="text-sm font-bold text-slate-900 truncate">{topThree[1].name}</h3>
                  <div className="pt-1">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-black rounded-full inline-block">
                      🌱 {topThree[1].green_points} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{topThree[1].activity_count} civic actions</p>
                </div>
              )}

              {/* Gold (#1) */}
              {topThree[0] && (
                <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-500/10 via-white to-white rounded-3xl p-8 border-2 border-amber-400 shadow-xl text-center space-y-3 relative transform sm:-translate-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 font-black text-3xl flex items-center justify-center mx-auto shadow-md">
                    👑
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider inline-block">
                    #1 Grand Champion
                  </span>
                  <h3 className="text-base font-black text-slate-900 truncate">{topThree[0].name}</h3>
                  <div className="pt-1">
                    <span className="px-4 py-1.5 bg-emerald-600 text-white text-sm font-black rounded-full shadow-xs inline-block">
                      🌱 {topThree[0].green_points} Green Points
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {topThree[0].activity_count} verified contributions
                  </p>
                </div>
              )}

              {/* Bronze (#3) */}
              {topThree[2] && (
                <div className="order-3 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-2 relative flex flex-col justify-end">
                  <div className="w-14 h-14 rounded-2xl bg-amber-700/20 text-amber-900 font-extrabold text-2xl flex items-center justify-center mx-auto shadow-sm">
                    🥉
                  </div>
                  <span className="text-xs font-bold text-slate-400">Rank #3</span>
                  <h3 className="text-sm font-bold text-slate-900 truncate">{topThree[2].name}</h3>
                  <div className="pt-1">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-black rounded-full inline-block">
                      🌱 {topThree[2].green_points} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{topThree[2].activity_count} civic actions</p>
                </div>
              )}
            </div>
          )}

          {/* Full Leaderboard Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Community Civic Ranking</h3>
              <span className="text-xs text-slate-400">Privacy Protected (No Emails Disclosed)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3.5 w-16 text-center">Rank</th>
                    <th className="p-3.5">Eco Citizen</th>
                    <th className="p-3.5 text-center">Actions Logged</th>
                    <th className="p-3.5 text-right">Total Green Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaderboard.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="p-3.5 text-center font-bold text-slate-700">
                        {item.rank === 1 ? '🥇 1' : item.rank === 2 ? '🥈 2' : item.rank === 3 ? '🥉 3' : `#${item.rank}`}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                            {item.name[0]}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{item.name}</span>
                            <span className="text-[10px] text-slate-400">Verified Citizen</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-center font-semibold text-slate-600">
                        {item.activity_count}
                      </td>
                      <td className="p-3.5 text-right font-black text-emerald-700 text-sm">
                        🌱 {item.green_points} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Points Rules Scheme Guide */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-amber-400" size={18} />
              <h3 className="text-base font-bold">How to Earn Green Points in Civic Impact</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {rules.map((rule, idx) => (
                <div key={idx} className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{rule.activity}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-black text-xs">
                      +{rule.points} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{rule.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
```

---

### 📄 File: `frontend/src/pages/ProfilePage.jsx`

**Purpose**: User profile management, personal info update, password change, and activity log

```jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, pointsAPI } from '../services/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Trophy,
  History,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ProfilePage = () => {
  const { user, updateUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pointData, setPointData] = useState({ balance: 0, rank: 1 });
  const [activity, setActivity] = useState(null);

  // Edit profile state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: 'success' });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [ptsRes, actRes] = await Promise.all([
        pointsAPI.getMyPoints(),
        authAPI.getUserActivity()
      ]);
      if (ptsRes.data.success) setPointData(ptsRes.data);
      if (actRes.data.success) setActivity(actRes.data.activity);
    } catch (err) {
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    try {
      setProfileSaving(true);
      const res = await authAPI.updateProfile({ name, phone, address });
      if (res.data.success) {
        updateUserData(res.data.user);
        setProfileMsg('Profile details successfully updated!');
      }
    } catch (err) {
      setProfileMsg(err.response?.data?.message || 'Error updating profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: '', type: 'success' });

    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'New password must be at least 6 characters.', type: 'error' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    try {
      setPasswordSaving(true);
      const res = await authAPI.changePassword({ currentPassword, newPassword, confirmNewPassword });
      if (res.data.success) {
        setPasswordMsg({ text: 'Password changed successfully!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      setPasswordMsg({ text: err.response?.data?.message || 'Error changing password.', type: 'error' });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading Profile Information..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Profile Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-0.5">Joined Civic Impact in {new Date(user?.created_at).getFullYear()}</p>
          </div>
        </div>

        {/* Green Points Card */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-xs">
            🌱
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              Green Points
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-950">{pointData.balance}</span>
              <span className="text-xs font-bold text-emerald-700">Rank #{pointData.rank}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Edit Profile Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User size={18} className="text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
          </div>

          {profileMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
              {profileMsg}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Email (Read Only)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Residential Address *</label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={profileSaving}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition"
              >
                {profileSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock size={18} className="text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">Change Password</h3>
          </div>

          {passwordMsg.text && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold border ${
                passwordMsg.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Current Password *</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={passwordSaving}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-xs transition"
              >
                {passwordSaving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Activity Timeline History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <History size={18} className="text-purple-600" />
          <h3 className="text-base font-bold text-slate-900">Green Points & Activity Record</h3>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {activity?.points?.length === 0 ? (
            <p className="text-slate-400 py-6 text-center">No activity history recorded yet.</p>
          ) : (
            activity?.points?.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-slate-800 block">{item.activity_type}</span>
                  <span className="text-slate-500">{item.description}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-emerald-600 block">+{item.points} pts</span>
                  <span className="text-[10px] text-slate-400">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
```

---

### 📄 File: `start-civic-impact.bat`

**Purpose**: 1-click Windows launcher batch script to start backend, frontend, and open the web browser

```bat
@echo off
title Civic Impact Launcher
echo ===================================================
echo        Civic Impact - Smart City Platform
echo ===================================================
echo.
echo Starting Backend Server on port 5000...
start "Civic Impact Backend" cmd /k "cd /d %~dp0backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server on port 5173...
start "Civic Impact Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo Launching Web Browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ===================================================
echo Civic Impact is now running!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:5000/api
echo ===================================================
echo Keep the backend and frontend terminal windows open.
pause
```

---

