-- RIZON Platform Supabase DDL & RLS Policy Schema

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Ensure RLS Policies for Notes, Tasks, Comments (Allows Public Anon Inserts & Reads)
ALTER TABLE IF EXISTS notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all notes" ON notes;
CREATE POLICY "Allow public all notes" ON notes FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE IF EXISTS tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all tasks" ON tasks;
CREATE POLICY "Allow public all tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE IF EXISTS comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all comments" ON comments;
CREATE POLICY "Allow public all comments" ON comments FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE IF EXISTS subjects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all subjects" ON subjects;
CREATE POLICY "Allow public all subjects" ON subjects FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE IF EXISTS vocab_sets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all vocab_sets" ON vocab_sets;
CREATE POLICY "Allow public all vocab_sets" ON vocab_sets FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE IF EXISTS vocab_cards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all vocab_cards" ON vocab_cards;
CREATE POLICY "Allow public all vocab_cards" ON vocab_cards FOR ALL USING (true) WITH CHECK (true);
