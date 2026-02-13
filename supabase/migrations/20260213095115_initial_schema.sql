-- Initial schema for Playdate app
-- Multi-tenant architecture with Row Level Security

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
-- Maps Supabase Auth users to family data
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- 2. FAMILIES TABLE  
-- =====================================================
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  primary_contact_name TEXT NOT NULL,
  primary_contact_phone TEXT,
  city TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT families_name_length CHECK (char_length(name) >= 2),
  CONSTRAINT families_phone_format CHECK (primary_contact_phone ~ '^\+?[\d\s\-\(\)]+$' OR primary_contact_phone IS NULL)
);

CREATE INDEX families_profile_id_idx ON families(profile_id);
CREATE INDEX families_city_idx ON families(city);

-- =====================================================
-- 3. CHILDREN TABLE
-- =====================================================
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  birth_date DATE,
  grade TEXT,
  interests JSONB DEFAULT '[]',
  notes TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT children_name_length CHECK (char_length(first_name) >= 1),
  CONSTRAINT children_birth_date_valid CHECK (birth_date <= CURRENT_DATE),
  CONSTRAINT children_birth_date_reasonable CHECK (birth_date >= CURRENT_DATE - INTERVAL '18 years')
);

CREATE INDEX children_family_id_idx ON children(family_id);
CREATE INDEX children_birth_date_idx ON children(birth_date);
CREATE INDEX children_active_idx ON children(is_active);

-- =====================================================
-- 4. CONNECTIONS TABLE
-- =====================================================
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_a UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  family_b UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  initiated_by UUID REFERENCES families(id) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT connections_different_families CHECK (family_a != family_b),
  CONSTRAINT connections_status_valid CHECK (status IN ('pending', 'connected', 'declined', 'blocked')),
  CONSTRAINT connections_order CHECK (family_a < family_b)
);

CREATE UNIQUE INDEX connections_families_unique_idx ON connections(family_a, family_b);
CREATE INDEX connections_family_a_idx ON connections(family_a);
CREATE INDEX connections_family_b_idx ON connections(family_b);
CREATE INDEX connections_status_idx ON connections(status);

-- =====================================================
-- 5. AVAILABILITY WINDOWS TABLE
-- =====================================================
CREATE TABLE availability_windows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER,
  specific_date DATE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  title TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT availability_time_valid CHECK (start_time < end_time),
  CONSTRAINT availability_day_valid CHECK (day_of_week IS NULL OR (day_of_week >= 0 AND day_of_week <= 6)),
  CONSTRAINT availability_date_or_day CHECK (
    (day_of_week IS NOT NULL AND specific_date IS NULL) OR 
    (day_of_week IS NULL AND specific_date IS NOT NULL)
  ),
  CONSTRAINT availability_future_date CHECK (
    specific_date IS NULL OR specific_date >= CURRENT_DATE
  )
);

CREATE INDEX availability_child_id_idx ON availability_windows(child_id);
CREATE INDEX availability_day_of_week_idx ON availability_windows(day_of_week);
CREATE INDEX availability_specific_date_idx ON availability_windows(specific_date);
CREATE INDEX availability_time_range_idx ON availability_windows(start_time, end_time);
CREATE INDEX availability_active_idx ON availability_windows(is_active);

-- =====================================================
-- 6. PLAYDATE EVENTS TABLE
-- =====================================================
CREATE TABLE playdate_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  location_type TEXT DEFAULT 'other',
  max_children INTEGER,
  age_min INTEGER,
  age_max INTEGER,
  notes TEXT,
  status TEXT DEFAULT 'planned',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT playdate_time_valid CHECK (start_time < end_time),
  CONSTRAINT playdate_future_date CHECK (event_date >= CURRENT_DATE),
  CONSTRAINT playdate_age_valid CHECK (
    (age_min IS NULL OR age_min >= 0) AND
    (age_max IS NULL OR age_max >= 0) AND
    (age_min IS NULL OR age_max IS NULL OR age_min <= age_max)
  ),
  CONSTRAINT playdate_status_valid CHECK (status IN ('planned', 'confirmed', 'cancelled', 'completed')),
  CONSTRAINT playdate_location_type_valid CHECK (location_type IN ('home', 'park', 'indoor_activity', 'other'))
);

CREATE INDEX playdate_events_created_by_idx ON playdate_events(created_by);
CREATE INDEX playdate_events_date_idx ON playdate_events(event_date);
CREATE INDEX playdate_events_status_idx ON playdate_events(status);

-- =====================================================
-- 7. PLAYDATE INVITES TABLE
-- =====================================================
CREATE TABLE playdate_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES playdate_events(id) ON DELETE CASCADE NOT NULL,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  invited_children UUID[] DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  response_message TEXT,
  attending_children UUID[] DEFAULT '{}',
  response_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT playdate_invites_status_valid CHECK (status IN ('pending', 'accepted', 'declined', 'maybe')),
  CONSTRAINT playdate_invites_response_time CHECK (
    (status = 'pending' AND response_at IS NULL) OR
    (status != 'pending' AND response_at IS NOT NULL)
  )
);

CREATE UNIQUE INDEX playdate_invites_event_family_unique_idx ON playdate_invites(event_id, family_id);
CREATE INDEX playdate_invites_event_id_idx ON playdate_invites(event_id);
CREATE INDEX playdate_invites_family_id_idx ON playdate_invites(family_id);
CREATE INDEX playdate_invites_status_idx ON playdate_invites(status);

-- =====================================================
-- 8. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_family_id UUID REFERENCES families(id) ON DELETE SET NULL,
  related_event_id UUID REFERENCES playdate_events(id) ON DELETE SET NULL,
  related_connection_id UUID REFERENCES connections(id) ON DELETE SET NULL,
  related_invite_id UUID REFERENCES playdate_invites(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT notifications_type_valid CHECK (type IN (
    'connection_request', 'connection_accepted', 'playdate_invite', 
    'invite_response', 'event_reminder', 'event_cancelled'
  )),
  CONSTRAINT notifications_read_time CHECK (
    (is_read = false AND read_at IS NULL) OR
    (is_read = true AND read_at IS NOT NULL)
  )
);

CREATE INDEX notifications_recipient_idx ON notifications(recipient_family_id);
CREATE INDEX notifications_type_idx ON notifications(type);
CREATE INDEX notifications_read_idx ON notifications(is_read);
CREATE INDEX notifications_created_at_idx ON notifications(created_at DESC);

-- =====================================================
-- 9. UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER families_updated_at BEFORE UPDATE ON families
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  
CREATE TRIGGER children_updated_at BEFORE UPDATE ON children
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  
CREATE TRIGGER connections_updated_at BEFORE UPDATE ON connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  
CREATE TRIGGER availability_updated_at BEFORE UPDATE ON availability_windows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  
CREATE TRIGGER playdate_events_updated_at BEFORE UPDATE ON playdate_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  
CREATE TRIGGER playdate_invites_updated_at BEFORE UPDATE ON playdate_invites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- 10. HELPER FUNCTIONS
-- =====================================================
-- Helper function to get current user's family ID
CREATE OR REPLACE FUNCTION get_current_family_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id FROM families WHERE profile_id = auth.uid();
$$;

-- =====================================================
-- 11. ROW LEVEL SECURITY SETUP
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE playdate_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE playdate_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 12. RLS POLICIES
-- =====================================================

-- PROFILES Policies
CREATE POLICY "profiles_own_access" ON profiles
  FOR ALL USING (id = auth.uid());

-- FAMILIES Policies
-- Basic own-family access
CREATE POLICY "families_own_access" ON families
  FOR ALL USING (profile_id = auth.uid());

-- Connected families read access (requires connections table to exist)
CREATE POLICY "families_connected_read" ON families
  FOR SELECT USING (
    profile_id = auth.uid() OR
    id IN (
      SELECT CASE 
        WHEN family_a = get_current_family_id() THEN family_b
        WHEN family_b = get_current_family_id() THEN family_a
      END
      FROM connections 
      WHERE status = 'connected' AND family_a IS NOT NULL AND family_b IS NOT NULL
    )
  );

-- CHILDREN Policies
CREATE POLICY "children_own_family_access" ON children
  FOR ALL USING (family_id = get_current_family_id());

-- Connected families can view children
CREATE POLICY "children_connected_read" ON children
  FOR SELECT USING (
    family_id = get_current_family_id()
    OR
    family_id IN (
      SELECT CASE 
        WHEN c.family_a = get_current_family_id() THEN c.family_b
        WHEN c.family_b = get_current_family_id() THEN c.family_a
      END
      FROM connections c 
      WHERE c.status = 'connected' AND c.family_a IS NOT NULL AND c.family_b IS NOT NULL
    )
  );

-- CONNECTIONS Policies
CREATE POLICY "connections_participant_access" ON connections
  FOR ALL USING (
    family_a = get_current_family_id() OR
    family_b = get_current_family_id()
  );

-- AVAILABILITY_WINDOWS Policies  
CREATE POLICY "availability_own_family_access" ON availability_windows
  FOR ALL USING (
    child_id IN (
      SELECT c.id FROM children c
      WHERE c.family_id = get_current_family_id()
    )
  );

CREATE POLICY "availability_connected_read" ON availability_windows
  FOR SELECT USING (
    child_id IN (
      SELECT c.id FROM children c
      WHERE c.family_id = get_current_family_id()
      UNION
      SELECT c.id FROM children c
      WHERE c.family_id IN (
        SELECT CASE 
          WHEN conn.family_a = get_current_family_id() THEN conn.family_b
          WHEN conn.family_b = get_current_family_id() THEN conn.family_a
        END
        FROM connections conn 
        WHERE conn.status = 'connected' AND conn.family_a IS NOT NULL AND conn.family_b IS NOT NULL
      )
    )
  );

-- PLAYDATE_EVENTS Policies
CREATE POLICY "playdate_events_creator_access" ON playdate_events
  FOR ALL USING (created_by = get_current_family_id());

CREATE POLICY "playdate_events_invitee_read" ON playdate_events
  FOR SELECT USING (
    created_by = get_current_family_id() OR
    id IN (
      SELECT pi.event_id FROM playdate_invites pi
      WHERE pi.family_id = get_current_family_id()
    )
  );

-- PLAYDATE_INVITES Policies
CREATE POLICY "playdate_invites_participant_access" ON playdate_invites
  FOR ALL USING (
    family_id = get_current_family_id() OR
    event_id IN (
      SELECT pe.id FROM playdate_events pe
      WHERE pe.created_by = get_current_family_id()
    )
  );

-- NOTIFICATIONS Policies
CREATE POLICY "notifications_recipient_access" ON notifications
  FOR ALL USING (recipient_family_id = get_current_family_id());

-- =====================================================
-- 13. AVAILABILITY MATCHING FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION get_availability_matches(
  p_child_id UUID,
  p_date_start DATE DEFAULT CURRENT_DATE,
  p_date_end DATE DEFAULT CURRENT_DATE + INTERVAL '30 days'
)
RETURNS TABLE (
  match_date DATE,
  start_time TIME,
  end_time TIME,
  matching_children UUID[],
  matching_families UUID[]
) AS $$
BEGIN
  RETURN QUERY
  WITH family_connections AS (
    SELECT CASE 
      WHEN c.family_a = (SELECT family_id FROM children WHERE id = p_child_id) THEN c.family_b
      WHEN c.family_b = (SELECT family_id FROM children WHERE id = p_child_id) THEN c.family_a
    END as connected_family_id
    FROM connections c
    WHERE c.status = 'connected'
      AND (
        c.family_a = (SELECT family_id FROM children WHERE id = p_child_id) OR
        c.family_b = (SELECT family_id FROM children WHERE id = p_child_id)
      )
  ),
  date_series AS (
    SELECT generate_series(p_date_start, p_date_end, '1 day'::interval)::date as date_val
  ),
  child_availability AS (
    SELECT 
      CASE 
        WHEN aw.specific_date IS NOT NULL THEN aw.specific_date
        ELSE ds.date_val
      END as available_date,
      aw.start_time,
      aw.end_time
    FROM availability_windows aw
    CROSS JOIN date_series ds
    WHERE aw.child_id = p_child_id
      AND aw.is_active = true
      AND (
        (aw.specific_date IS NOT NULL AND aw.specific_date = ds.date_val) OR
        (aw.day_of_week IS NOT NULL AND aw.day_of_week = EXTRACT(DOW FROM ds.date_val)::integer)
      )
  ),
  connected_children_availability AS (
    SELECT 
      cc.id as child_id,
      cc.family_id,
      CASE 
        WHEN aw.specific_date IS NOT NULL THEN aw.specific_date
        ELSE ds.date_val
      END as available_date,
      aw.start_time,
      aw.end_time
    FROM children cc
    JOIN family_connections fc ON cc.family_id = fc.connected_family_id
    JOIN availability_windows aw ON cc.id = aw.child_id
    CROSS JOIN date_series ds
    WHERE cc.is_active = true
      AND aw.is_active = true
      AND (
        (aw.specific_date IS NOT NULL AND aw.specific_date = ds.date_val) OR
        (aw.day_of_week IS NOT NULL AND aw.day_of_week = EXTRACT(DOW FROM ds.date_val)::integer)
      )
  )
  SELECT DISTINCT
    ca.available_date,
    GREATEST(ca.start_time, cca.start_time) as start_time,
    LEAST(ca.end_time, cca.end_time) as end_time,
    array_agg(DISTINCT cca.child_id) as matching_children,
    array_agg(DISTINCT cca.family_id) as matching_families
  FROM child_availability ca
  JOIN connected_children_availability cca ON ca.available_date = cca.available_date
  WHERE ca.start_time < cca.end_time 
    AND ca.end_time > cca.start_time
    AND GREATEST(ca.start_time, cca.start_time) < LEAST(ca.end_time, cca.end_time)
  GROUP BY ca.available_date, GREATEST(ca.start_time, cca.start_time), LEAST(ca.end_time, cca.end_time)
  ORDER BY ca.available_date, start_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;