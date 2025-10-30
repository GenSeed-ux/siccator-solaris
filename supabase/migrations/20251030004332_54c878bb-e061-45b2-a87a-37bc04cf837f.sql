-- Create table for drying sessions
CREATE TABLE public.drying_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  crop_type TEXT NOT NULL,
  target_temperature NUMERIC NOT NULL DEFAULT 45,
  status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'active', 'paused', 'completed')),
  mode TEXT NOT NULL DEFAULT 'auto' CHECK (mode IN ('auto', 'manual')),
  power_mode TEXT NOT NULL DEFAULT 'solar' CHECK (power_mode IN ('solar', 'battery', 'grid')),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  initial_moisture NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.drying_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for drying sessions
CREATE POLICY "Users can view their own sessions"
ON public.drying_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
ON public.drying_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
ON public.drying_sessions
FOR UPDATE
USING (auth.uid() = user_id);

-- Create table for sensor readings
CREATE TABLE public.sensor_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.drying_sessions(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- PZEM-004T Energy Meter
  voltage NUMERIC,
  current NUMERIC,
  power NUMERIC,
  energy NUMERIC,
  power_factor NUMERIC,
  frequency NUMERIC,
  
  -- DHT22 Sensors
  temp_top NUMERIC,
  humidity_top NUMERIC,
  temp_bottom NUMERIC,
  humidity_bottom NUMERIC,
  
  -- LDR Sensor
  light_intensity NUMERIC,
  
  -- MQ-135 Gas Sensor
  voc_level NUMERIC,
  
  -- Soil/Produce Moisture Sensor
  moisture_level NUMERIC,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

-- Create policies for sensor readings
CREATE POLICY "Users can view sensor readings for their sessions"
ON public.sensor_readings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.drying_sessions
    WHERE drying_sessions.id = sensor_readings.session_id
    AND drying_sessions.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert sensor readings for their sessions"
ON public.sensor_readings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.drying_sessions
    WHERE drying_sessions.id = sensor_readings.session_id
    AND drying_sessions.user_id = auth.uid()
  )
);

-- Create index for faster queries
CREATE INDEX idx_sensor_readings_session_timestamp ON public.sensor_readings(session_id, timestamp DESC);
CREATE INDEX idx_drying_sessions_user_status ON public.drying_sessions(user_id, status);

-- Create table for crop profiles
CREATE TABLE public.crop_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_name TEXT NOT NULL UNIQUE,
  optimal_temp_min NUMERIC NOT NULL,
  optimal_temp_max NUMERIC NOT NULL,
  optimal_humidity_max NUMERIC NOT NULL,
  estimated_hours NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crop_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view crop profiles
CREATE POLICY "Anyone can view crop profiles"
ON public.crop_profiles
FOR SELECT
USING (true);

-- Insert default crop profiles
INSERT INTO public.crop_profiles (crop_name, optimal_temp_min, optimal_temp_max, optimal_humidity_max, estimated_hours, description) VALUES
('Maize', 40, 50, 15, 6, 'Corn kernels require moderate heat and low humidity for proper drying'),
('Pepper', 45, 55, 12, 8, 'Hot peppers need higher temperatures and very low humidity'),
('Fish', 50, 60, 10, 10, 'Fish requires high heat and minimal humidity to prevent spoilage'),
('Cassava', 42, 52, 18, 12, 'Cassava chips need consistent moderate heat'),
('Cocoa', 45, 55, 15, 14, 'Cocoa beans require careful temperature control'),
('Tomatoes', 45, 55, 20, 8, 'Tomatoes dry best at moderate-high temperatures'),
('Mango', 50, 60, 15, 10, 'Mangoes require high heat for proper preservation'),
('Banana', 48, 58, 18, 9, 'Bananas need consistent heat and low humidity');

-- Add trigger for updated_at
CREATE TRIGGER update_drying_sessions_updated_at
BEFORE UPDATE ON public.drying_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for sensor readings
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_readings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.drying_sessions;