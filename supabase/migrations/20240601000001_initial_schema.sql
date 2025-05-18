-- Create tables for the booking system

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Service providers table
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id),
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id),
  service_id UUID NOT NULL REFERENCES services(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Providers policies
CREATE POLICY "Providers can view their own data" 
  ON providers FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can update their own data" 
  ON providers FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can insert their own data" 
  ON providers FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view provider data" 
  ON providers FOR SELECT 
  USING (true);

-- Services policies
CREATE POLICY "Providers can manage their own services" 
  ON services FOR ALL 
  USING (auth.uid() IN (SELECT user_id FROM providers WHERE id = provider_id));

CREATE POLICY "Anyone can view services" 
  ON services FOR SELECT 
  USING (true);

-- Bookings policies
CREATE POLICY "Providers can view their own bookings" 
  ON bookings FOR SELECT 
  USING (provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can create bookings" 
  ON bookings FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Providers can update their own bookings" 
  ON bookings FOR UPDATE 
  USING (provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid()));

-- Enable realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE services;
ALTER PUBLICATION supabase_realtime ADD TABLE providers;
