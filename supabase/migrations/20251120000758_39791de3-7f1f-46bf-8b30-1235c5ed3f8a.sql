-- Ensure all RLS policies are correctly set for public website

-- Home content: Anyone can view, admins can manage
DROP POLICY IF EXISTS "Anyone can view home content" ON home_content;
DROP POLICY IF EXISTS "Authenticated admins can manage home content" ON home_content;

CREATE POLICY "Anyone can view home content"
ON home_content FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated admins can manage home content"
ON home_content FOR ALL
TO authenticated
USING (true);

-- Blog posts: Anyone can view published, admins manage all
DROP POLICY IF EXISTS "Anyone can view published blogs" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated admins can manage blogs" ON blog_posts;

CREATE POLICY "Anyone can view published blogs"
ON blog_posts FOR SELECT
TO public
USING (is_published = true);

CREATE POLICY "Authenticated admins can manage blogs"
ON blog_posts FOR ALL
TO authenticated
USING (true);

-- Impact metrics: Anyone can view, admins manage
DROP POLICY IF EXISTS "Anyone can view metrics" ON impact_metrics;
DROP POLICY IF EXISTS "Authenticated admins can manage metrics" ON impact_metrics;

CREATE POLICY "Anyone can view metrics"
ON impact_metrics FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated admins can manage metrics"
ON impact_metrics FOR ALL
TO authenticated
USING (true);

-- Technology content: Anyone can view, admins manage
DROP POLICY IF EXISTS "Anyone can view technology content" ON technology_content;
DROP POLICY IF EXISTS "Authenticated admins can manage technology" ON technology_content;

CREATE POLICY "Anyone can view technology content"
ON technology_content FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated admins can manage technology"
ON technology_content FOR ALL
TO authenticated
USING (true);

-- Crop applications: Anyone can view, admins manage
DROP POLICY IF EXISTS "Anyone can view crop applications" ON crop_applications;
DROP POLICY IF EXISTS "Authenticated admins can manage crops" ON crop_applications;

CREATE POLICY "Anyone can view crop applications"
ON crop_applications FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated admins can manage crops"
ON crop_applications FOR ALL
TO authenticated
USING (true);

-- Stories/testimonials: Anyone can view, admins manage
DROP POLICY IF EXISTS "Anyone can view stories" ON stories_testimonials;
DROP POLICY IF EXISTS "Authenticated admins can manage stories" ON stories_testimonials;

CREATE POLICY "Anyone can view stories"
ON stories_testimonials FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated admins can manage stories"
ON stories_testimonials FOR ALL
TO authenticated
USING (true);

-- About content: Anyone can view, admins manage
DROP POLICY IF EXISTS "Anyone can view about content" ON about_content;
DROP POLICY IF EXISTS "Authenticated admins can manage about" ON about_content;

CREATE POLICY "Anyone can view about content"
ON about_content FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated admins can manage about"
ON about_content FOR ALL
TO authenticated
USING (true);

-- Team members: Anyone can view, admins manage
DROP POLICY IF EXISTS "Anyone can view team members" ON team_members;
DROP POLICY IF EXISTS "Authenticated admins can manage team" ON team_members;

CREATE POLICY "Anyone can view team members"
ON team_members FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated admins can manage team"
ON team_members FOR ALL
TO authenticated
USING (true);

-- Timeline events: Anyone can view, admins manage
DROP POLICY IF EXISTS "Anyone can view timeline" ON timeline_events;
DROP POLICY IF EXISTS "Authenticated admins can manage timeline" ON timeline_events;

CREATE POLICY "Anyone can view timeline"
ON timeline_events FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated admins can manage timeline"
ON timeline_events FOR ALL
TO authenticated
USING (true);

-- Pilot requests: Public can insert, admins can view and manage
DROP POLICY IF EXISTS "Anyone can submit pilot requests" ON pilot_requests;
DROP POLICY IF EXISTS "Authenticated admins can view and manage requests" ON pilot_requests;

CREATE POLICY "Anyone can submit pilot requests"
ON pilot_requests FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Authenticated admins can view and manage requests"
ON pilot_requests FOR ALL
TO authenticated
USING (true);

-- Storage policies for media bucket (if not exists)
-- Allow public read access to media bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.objects WHERE bucket_id = 'media'
  ) THEN
    -- Create media bucket if it doesn't exist
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('media', 'media', true, 52428800, ARRAY['image/*', 'video/*'])
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Public can view media
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Authenticated users can upload media
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Authenticated users can update their uploads
DROP POLICY IF EXISTS "Authenticated users can update media" ON storage.objects;
CREATE POLICY "Authenticated users can update media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media');

-- Authenticated users can delete media
DROP POLICY IF EXISTS "Authenticated users can delete media" ON storage.objects;
CREATE POLICY "Authenticated users can delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');