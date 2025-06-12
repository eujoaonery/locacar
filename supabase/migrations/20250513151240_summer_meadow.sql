
CREATE TABLE IF NOT EXISTS statuses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  daily_rate DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  license_plate TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL,
  status_id INTEGER REFERENCES statuses(id),
  category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  rg TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS contracts (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id),
  vehicle_id INTEGER REFERENCES vehicles(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


INSERT INTO statuses (name, description) VALUES 
('Available', 'Vehicle is available for rent'),
('Rented', 'Vehicle is currently rented'),
('In Maintenance', 'Vehicle is in maintenance'),
('Reserved', 'Vehicle is reserved for a future rental');


INSERT INTO categories (name, description, daily_rate) VALUES 
('Economy', 'Budget friendly smaller vehicles', 75.00),
('Compact', 'Compact vehicles with good fuel economy', 100.00),
('Intermediate', 'Medium sized vehicles with more space', 150.00),
('Full Size', 'Larger vehicles with more comfort', 200.00),
('Premium', 'Luxury vehicles with all amenities', 300.00),
('SUV', 'Sport utility vehicles with more space and practicality', 250.00);


ALTER TABLE statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Allow authenticated users to read statuses"
  ON statuses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert statuses"
  ON statuses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update statuses"
  ON statuses
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete statuses"
  ON statuses
  FOR DELETE
  TO authenticated
  USING (true);


CREATE POLICY "Allow authenticated users to read categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (true);


CREATE POLICY "Allow authenticated users to read vehicles"
  ON vehicles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert vehicles"
  ON vehicles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update vehicles"
  ON vehicles
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete vehicles"
  ON vehicles
  FOR DELETE
  TO authenticated
  USING (true);


CREATE POLICY "Allow authenticated users to read clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete clients"
  ON clients
  FOR DELETE
  TO authenticated
  USING (true);


CREATE POLICY "Allow authenticated users to read contracts"
  ON contracts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert contracts"
  ON contracts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update contracts"
  ON contracts
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete contracts"
  ON contracts
  FOR DELETE
  TO authenticated
  USING (true);