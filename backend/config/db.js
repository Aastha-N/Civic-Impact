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
