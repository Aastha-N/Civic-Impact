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
