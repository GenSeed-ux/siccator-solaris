-- Create admins table for authentication
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Admin can access their own data
CREATE POLICY "Admins can view their own data"
ON public.admins FOR SELECT
USING (auth.uid() = id);

-- Create home_content table
CREATE TABLE public.home_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_video_url TEXT,
  headline TEXT NOT NULL,
  subtext TEXT,
  cta_primary_text TEXT,
  cta_secondary_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view home content"
ON public.home_content FOR SELECT
USING (true);

CREATE POLICY "Authenticated admins can manage home content"
ON public.home_content FOR ALL
USING (auth.role() = 'authenticated');

-- Create impact_metrics table
CREATE TABLE public.impact_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_key TEXT NOT NULL UNIQUE,
  metric_label TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.impact_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view metrics"
ON public.impact_metrics FOR SELECT
USING (true);

CREATE POLICY "Authenticated admins can manage metrics"
ON public.impact_metrics FOR ALL
USING (auth.role() = 'authenticated');

-- Create stories_testimonials table
CREATE TABLE public.stories_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('farmer_story', 'ngo_endorsement', 'testimonial')),
  name TEXT NOT NULL,
  location TEXT,
  role TEXT,
  quote TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.stories_testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stories"
ON public.stories_testimonials FOR SELECT
USING (true);

CREATE POLICY "Authenticated admins can manage stories"
ON public.stories_testimonials FOR ALL
USING (auth.role() = 'authenticated');

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  expertise TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view team members"
ON public.team_members FOR SELECT
USING (true);

CREATE POLICY "Authenticated admins can manage team"
ON public.team_members FOR ALL
USING (auth.role() = 'authenticated');

-- Create timeline_events table
CREATE TABLE public.timeline_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view timeline"
ON public.timeline_events FOR SELECT
USING (true);

CREATE POLICY "Authenticated admins can manage timeline"
ON public.timeline_events FOR ALL
USING (auth.role() = 'authenticated');

-- Create technology_content table
CREATE TABLE public.technology_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  features JSONB,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.technology_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view technology content"
ON public.technology_content FOR SELECT
USING (true);

CREATE POLICY "Authenticated admins can manage technology"
ON public.technology_content FOR ALL
USING (auth.role() = 'authenticated');

-- Create crop_applications table
CREATE TABLE public.crop_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_name TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  temperature_range TEXT,
  humidity_range TEXT,
  drying_time TEXT,
  benefits TEXT[],
  roi_percentage NUMERIC,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.crop_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view crop applications"
ON public.crop_applications FOR SELECT
USING (true);

CREATE POLICY "Authenticated admins can manage crops"
ON public.crop_applications FOR ALL
USING (auth.role() = 'authenticated');

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  read_time INTEGER,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blogs"
ON public.blog_posts FOR SELECT
USING (is_published = true);

CREATE POLICY "Authenticated admins can manage blogs"
ON public.blog_posts FOR ALL
USING (auth.role() = 'authenticated');

-- Create pilot_requests table
CREATE TABLE public.pilot_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  location TEXT NOT NULL,
  farm_size TEXT,
  crop_types TEXT[],
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pilot_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit pilot requests"
ON public.pilot_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated admins can view and manage requests"
ON public.pilot_requests FOR ALL
USING (auth.role() = 'authenticated');

-- Create about_content table
CREATE TABLE public.about_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mission TEXT,
  vision TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view about content"
ON public.about_content FOR SELECT
USING (true);

CREATE POLICY "Authenticated admins can manage about"
ON public.about_content FOR ALL
USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_home_content_updated_at BEFORE UPDATE ON public.home_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_impact_metrics_updated_at BEFORE UPDATE ON public.impact_metrics
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON public.stories_testimonials
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_timeline_updated_at BEFORE UPDATE ON public.timeline_events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_technology_updated_at BEFORE UPDATE ON public.technology_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crop_applications_updated_at BEFORE UPDATE ON public.crop_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pilot_requests_updated_at BEFORE UPDATE ON public.pilot_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON public.about_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON public.admins
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();