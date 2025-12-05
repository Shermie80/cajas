-- Fix case_items schema mismatch
-- Drop the existing table which likely has incorrect columns (drop_chance, item_id)
DROP TABLE IF EXISTS case_items;

-- Recreate the table with the columns expected by the application code
CREATE TABLE case_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  name text NOT NULL,
  value numeric NOT NULL CHECK (value >= 0),
  image_url text NOT NULL,
  probability numeric NOT NULL CHECK (probability >= 0 AND probability <= 100),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE case_items ENABLE ROW LEVEL SECURITY;

-- Re-apply RLS Policies
CREATE POLICY "Public read case_items" ON case_items FOR SELECT USING (true);

CREATE POLICY "Admins insert case_items" ON case_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins update case_items" ON case_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins delete case_items" ON case_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
