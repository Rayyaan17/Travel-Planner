/*
  # Create destinations table
  
  1. New Tables
    - `destinations`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the destination
      - `description` (text) - Detailed description
      - `country` (text) - Country name
      - `city` (text) - City name
      - `image_url` (text) - URL to destination image
      - `popular` (boolean) - Whether destination is popular
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      
  2. Security
    - Enable RLS on `destinations` table
    - Add policy for anyone to read destinations (public data)
    - Add policy for authenticated users to create destinations
    - Add policy for authenticated users to update their own destinations
    - Add policy for authenticated users to delete their own destinations
*/

CREATE TABLE IF NOT EXISTS destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  country text NOT NULL,
  city text NOT NULL,
  image_url text,
  popular boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view destinations"
  ON destinations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create destinations"
  ON destinations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update destinations"
  ON destinations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete destinations"
  ON destinations FOR DELETE
  TO authenticated
  USING (true);