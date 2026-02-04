-- Supabase Table Setup for Valentine Greeting Generator
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)

-- Create the greetings table
CREATE TABLE greetings (
  id TEXT PRIMARY KEY,
  sender TEXT NOT NULL CHECK (char_length(sender) <= 100),
  receiver TEXT NOT NULL CHECK (char_length(receiver) <= 100),
  message TEXT NOT NULL CHECK (char_length(message) <= 500),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE greetings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read greetings (needed to view shared links)
CREATE POLICY "Allow public read" 
ON greetings 
FOR SELECT 
USING (true);

-- Allow anyone to create greetings
CREATE POLICY "Allow public insert" 
ON greetings 
FOR INSERT 
WITH CHECK (true);

-- Optional: Add index for faster lookups
CREATE INDEX idx_greetings_created_at ON greetings(created_at DESC);

-- Verify setup
SELECT 'Table created successfully! ✓' as status;
