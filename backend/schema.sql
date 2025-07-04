-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Goods and Services offered by companies
CREATE TABLE IF NOT EXISTS goods_and_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL
);

-- Tenders posted by companies
CREATE TABLE IF NOT EXISTS tenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  deadline DATE NOT NULL,
  budget NUMERIC NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Applications submitted by companies to tenders
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  tender_id UUID REFERENCES tenders(id) ON DELETE CASCADE,
  proposal TEXT NOT NULL,
  proposed_budget NUMERIC,
  proposed_timeline TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Optional: Seed data for testing
INSERT INTO companies (id, user_id, name, industry, description)
VALUES (
  gen_random_uuid(),
  '1b011f2d-c371-47b7-8be0-a6f32f62baf2',
  'Takatak Technologies',
  'Information Technology',
  'We build spicy stuff for serious people'
);

INSERT INTO companies (id, user_id, name, industry, description)
VALUES (
  gen_random_uuid(),
  'some-valid-user-uuid',
  'TestCo',
  'Tech',
  'Testing insert manually'
);