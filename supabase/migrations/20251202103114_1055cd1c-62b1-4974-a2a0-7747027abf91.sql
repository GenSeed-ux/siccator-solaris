-- Create gallery_media table for photos and videos
CREATE TABLE public.gallery_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL DEFAULT 'image', -- 'image' or 'video'
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'general', -- 'dryer_in_action', 'installation', 'farmers', 'crops', 'events'
  location TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create success_stories table for farmer case studies
CREATE TABLE public.success_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_name TEXT NOT NULL,
  location TEXT NOT NULL,
  farm_size TEXT,
  crop_types TEXT[],
  story_title TEXT NOT NULL,
  story_content TEXT NOT NULL,
  challenge TEXT,
  solution TEXT,
  results TEXT,
  income_increase_percentage INTEGER,
  loss_reduction_percentage INTEGER,
  image_url TEXT,
  video_url TEXT,
  quote TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create partnership_inquiries table for different partner types
CREATE TABLE public.partnership_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_type TEXT NOT NULL, -- 'farmer', 'ngo_government', 'investor'
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  location TEXT,
  -- Farmer specific fields
  farm_size TEXT,
  crop_types TEXT[],
  current_drying_method TEXT,
  -- NGO/Government specific fields
  organization_type TEXT,
  target_region TEXT,
  estimated_beneficiaries INTEGER,
  -- Investor specific fields
  investment_range TEXT,
  investment_type TEXT,
  portfolio_focus TEXT,
  -- Common fields
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_inquiries ENABLE ROW LEVEL SECURITY;

-- Gallery media policies
CREATE POLICY "Anyone can view gallery media" ON public.gallery_media FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery media" ON public.gallery_media FOR ALL USING (true);

-- Success stories policies
CREATE POLICY "Anyone can view success stories" ON public.success_stories FOR SELECT USING (true);
CREATE POLICY "Admins can manage success stories" ON public.success_stories FOR ALL USING (true);

-- Partnership inquiries policies
CREATE POLICY "Anyone can submit partnership inquiry" ON public.partnership_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view partnership inquiries" ON public.partnership_inquiries FOR SELECT USING (true);
CREATE POLICY "Admins can manage partnership inquiries" ON public.partnership_inquiries FOR ALL USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_gallery_media_updated_at BEFORE UPDATE ON public.gallery_media FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_success_stories_updated_at BEFORE UPDATE ON public.success_stories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_partnership_inquiries_updated_at BEFORE UPDATE ON public.partnership_inquiries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();