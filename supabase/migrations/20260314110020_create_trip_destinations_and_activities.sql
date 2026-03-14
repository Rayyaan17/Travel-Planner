/*
  # Create trip_destinations and activities tables
  
  1. New Tables
    - `trip_destinations`
      - `id` (uuid, primary key)
      - `trip_id` (uuid) - Reference to trips table
      - `destination_id` (uuid) - Reference to destinations table
      - `order` (integer) - Order of destination in trip
      - `notes` (text) - Notes about this destination in the trip
      - `created_at` (timestamptz) - Creation timestamp
      
    - `activities`
      - `id` (uuid, primary key)
      - `trip_id` (uuid) - Reference to trips table
      - `destination_id` (uuid) - Reference to destinations table
      - `title` (text) - Activity title
      - `description` (text) - Activity description
      - `scheduled_date` (date) - Scheduled date for activity
      - `scheduled_time` (time) - Scheduled time for activity
      - `completed` (boolean) - Whether activity is completed
      - `created_at` (timestamptz) - Creation timestamp
      
  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own trip-related data
*/

CREATE TABLE IF NOT EXISTS trip_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  destination_id uuid NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  order_num integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(trip_id, destination_id)
);

CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  destination_id uuid REFERENCES destinations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  scheduled_date date,
  scheduled_time time,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trip_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trip destinations"
  ON trip_destinations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_destinations.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own trip destinations"
  ON trip_destinations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_destinations.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own trip destinations"
  ON trip_destinations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_destinations.trip_id
      AND trips.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_destinations.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own trip destinations"
  ON trip_destinations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_destinations.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = activities.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = activities.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own activities"
  ON activities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = activities.trip_id
      AND trips.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = activities.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own activities"
  ON activities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = activities.trip_id
      AND trips.user_id = auth.uid()
    )
  );