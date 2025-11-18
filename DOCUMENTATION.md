# Smart Solar Dryer Platform - Complete Documentation

**Version:** 1.0  
**Last Updated:** 2025  
**Platform:** React + TypeScript + Lovable Cloud (Supabase)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [Public Website](#public-website)
6. [Admin CMS](#admin-cms)
7. [IoT Dashboard](#iot-dashboard)
8. [Authentication & Security](#authentication--security)
9. [Components Documentation](#components-documentation)
10. [Design System](#design-system)
11. [API & Backend](#api--backend)
12. [Deployment & Setup](#deployment--setup)
13. [User Guides](#user-guides)
14. [Troubleshooting](#troubleshooting)

---

## 1. Executive Summary

### 1.1 Project Overview

The Smart Solar Dryer Platform is a comprehensive web application designed to revolutionize agricultural post-harvest processing in Africa. It combines a public-facing marketing website, an administrative content management system, and a real-time IoT dashboard for monitoring and controlling solar drying equipment.

### 1.2 Key Features

- **Public Website**: Marketing and information platform showcasing the solar dryer technology
- **Admin CMS**: Full-featured content management for website administrators
- **IoT Dashboard**: Real-time monitoring and control of solar drying processes
- **Authentication System**: Secure user and admin authentication
- **Real-time Data**: Live sensor data visualization and analytics
- **Responsive Design**: Mobile-first, fully responsive across all devices

### 1.3 Target Users

1. **General Public**: Farmers, agricultural businesses, and stakeholders
2. **Administrators**: Content managers and system administrators
3. **Equipment Users**: Farmers operating the smart solar dryer hardware

---

## 2. System Architecture

### 2.1 Application Structure

```
┌─────────────────────────────────────────────────────────┐
│                     React Frontend                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Public    │  │    Admin    │  │     IoT     │    │
│  │   Website   │  │     CMS     │  │  Dashboard  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Lovable Cloud (Supabase)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  PostgreSQL  │  │     Auth     │  │   Storage    │ │
│  │   Database   │  │              │  │   (Media)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │  Realtime    │  │     Edge     │                   │
│  │  Subscr.     │  │  Functions   │                   │
│  └──────────────┘  └──────────────┘                   │
└─────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              IoT Hardware Devices                        │
│  (Solar Dryer with Sensors & Controllers)                │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Frontend Architecture

**Routing Structure:**
- `/` - Home page
- `/about` - About page
- `/technology` - Technology information
- `/applications` - Crop applications
- `/impact` - Impact metrics
- `/blog` - Blog listing
- `/blog/:slug` - Individual blog posts
- `/contact` - Contact form
- `/login` - User authentication
- `/admin/*` - Admin CMS routes
- `/dashboard/*` - IoT Dashboard routes

**State Management:**
- React Hooks (useState, useEffect, useCallback)
- Custom hooks for business logic
- Context API for auth state
- TanStack Query for server state (when applicable)

### 2.3 Data Flow

```
User Interaction → React Component → Supabase Client → 
Lovable Cloud Database → Response → State Update → UI Update
```

---

## 3. Technology Stack

### 3.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| TypeScript | Latest | Type safety |
| Vite | Latest | Build tool & dev server |
| React Router | 6.30.1 | Client-side routing |
| Tailwind CSS | Latest | Utility-first styling |
| Framer Motion | 12.23.24 | Animations |
| Shadcn UI | Latest | Component library |
| Radix UI | Latest | Headless UI primitives |

### 3.2 Backend Technologies

| Technology | Purpose |
|------------|---------|
| Lovable Cloud (Supabase) | Backend platform |
| PostgreSQL | Relational database |
| Row Level Security (RLS) | Data access control |
| Supabase Auth | Authentication |
| Supabase Storage | File storage |
| Edge Functions | Serverless functions |

### 3.3 Additional Libraries

- **lucide-react** (0.462.0): Icon library
- **recharts** (3.3.0): Chart visualization
- **react-countup** (6.5.3): Animated counters
- **date-fns** (3.6.0): Date manipulation
- **zod** (3.25.76): Schema validation
- **react-hook-form** (7.61.1): Form management
- **sonner** (1.7.4): Toast notifications

---

## 4. Database Schema

### 4.1 Tables Overview

#### **home_content**
Stores homepage content for the marketing site.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| headline | text | Hero headline |
| subtext | text | Hero subtext |
| hero_video_url | text | Hero video URL |
| cta_primary_text | text | Primary CTA text |
| cta_secondary_text | text | Secondary CTA text |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

**RLS Policies:**
- SELECT: Public (anyone can view)
- INSERT/UPDATE/DELETE: Authenticated admins only

#### **about_content**
Stores About page content.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| mission | text | Mission statement |
| vision | text | Vision statement |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

**RLS Policies:**
- SELECT: Public (anyone can view)
- INSERT/UPDATE/DELETE: Authenticated admins only

#### **team_members**
Stores team member profiles for About page.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Member name |
| title | text | Job title |
| bio | text | Biography |
| expertise | text | Areas of expertise |
| image_url | text | Profile image URL |
| display_order | integer | Display order |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

**RLS Policies:**
- SELECT: Public (anyone can view)
- INSERT/UPDATE/DELETE: Authenticated admins only

#### **timeline_events**
Stores company timeline events for About page.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| year | text | Event year |
| title | text | Event title |
| description | text | Event description |
| display_order | integer | Display order |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

**RLS Policies:**
- SELECT: Public (anyone can view)
- INSERT/UPDATE/DELETE: Authenticated admins only

#### **technology_content**
Stores technology section content.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| section_key | text | Section identifier |
| title | text | Section title |
| description | text | Section description |
| image_url | text | Section image URL |
| features | jsonb | Features array |
| display_order | integer | Display order |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

**RLS Policies:**
- SELECT: Public (anyone can view)
- INSERT/UPDATE/DELETE: Authenticated admins only

#### **crop_applications**
Stores crop-specific drying information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| crop_name | text | Crop name |
| category | text | Crop category |
| image_url | text | Crop image URL |
| temperature_range | text | Optimal temperature |
| humidity_range | text | Optimal humidity |
| drying_time | text | Estimated drying time |
| benefits | text[] | Benefits array |
| roi_percentage | numeric | ROI percentage |
| display_order | integer | Display order |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

**RLS Policies:**
- SELECT: Public (anyone can view)
- INSERT/UPDATE/DELETE: Authenticated admins only

#### **blog_posts**
Stores blog articles.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Post title |
| slug | text | URL slug (unique) |
| summary | text | Post summary |
| content | text | Post content (Markdown) |
| featured_image_url | text | Featured image URL |
| author | text | Author name |
| category | text | Post category |
| tags | text[] | Tags array |
| is_published | boolean | Publication status |
| is_featured | boolean | Featured status |
| published_at | timestamp | Publication date |
| read_time | integer | Estimated read time |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

**RLS Policies:**
- SELECT: Published posts only (public)
- INSERT/UPDATE/DELETE: Authenticated admins only

#### **impact_metrics**
Stores impact statistics and metrics.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| metric_key | text | Metric identifier |
| metric_label | text | Display label |
| metric_value | numeric | Metric value |
| metric_unit | text | Unit of measurement |
| icon | text | Icon name |
| display_order | integer | Display order |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

**RLS Policies:**
- SELECT: Public (anyone can view)
- INSERT/UPDATE/DELETE: Authenticated admins only

#### **stories_testimonials**
Stores user stories and testimonials.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| type | text | "story" or "testimonial" |
| name | text | Person name |
| location | text | Location |
| role | text | Role/occupation |
| quote | text | Quote/story text |
| image_url | text | Person image URL |
| video_url | text | Video URL (optional) |
| is_featured | boolean | Featured status |
| display_order | integer | Display order |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

**RLS Policies:**
- SELECT: Public (anyone can view)
- INSERT/UPDATE/DELETE: Authenticated admins only

#### **pilot_requests**
Stores pilot program requests from contact form.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| full_name | text | Requester name |
| email | text | Email address |
| phone | text | Phone number |
| organization | text | Organization name |
| location | text | Location |
| farm_size | text | Farm size |
| crop_types | text[] | Crops to dry |
| message | text | Additional message |
| status | text | Request status |
| admin_notes | text | Admin notes |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

**RLS Policies:**
- INSERT: Public (anyone can submit)
- SELECT/UPDATE/DELETE: Authenticated admins only

#### **admins**
Stores admin user credentials.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| email | text | Admin email |
| password_hash | text | Hashed password |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

**RLS Policies:**
- SELECT: Own data only (auth.uid() = id)
- No INSERT/UPDATE/DELETE (managed separately)

#### **drying_sessions**
Stores IoT drying session data.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | User ID (from auth) |
| crop_type | text | Crop being dried |
| target_temperature | numeric | Target temperature (°C) |
| status | text | Session status |
| mode | text | "auto" or "manual" |
| power_mode | text | "solar", "battery", "grid" |
| start_time | timestamp | Session start time |
| end_time | timestamp | Session end time |
| estimated_completion | timestamp | Estimated completion |
| initial_moisture | numeric | Initial moisture % |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

**RLS Policies:**
- SELECT/INSERT/UPDATE: Own sessions only (user_id = auth.uid())
- No DELETE

#### **sensor_readings**
Stores real-time sensor data from IoT devices.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| session_id | uuid | Foreign key to drying_sessions |
| timestamp | timestamp | Reading timestamp |
| voltage | numeric | Voltage (V) |
| current | numeric | Current (A) |
| power | numeric | Power (W) |
| energy | numeric | Energy (kWh) |
| power_factor | numeric | Power factor |
| frequency | numeric | Frequency (Hz) |
| temp_top | numeric | Top temperature (°C) |
| humidity_top | numeric | Top humidity (%) |
| temp_bottom | numeric | Bottom temperature (°C) |
| humidity_bottom | numeric | Bottom humidity (%) |
| light_intensity | numeric | Light intensity (lux) |
| voc_level | numeric | VOC level (ppm) |
| moisture_level | numeric | Moisture level (%) |
| created_at | timestamp | Creation timestamp |

**RLS Policies:**
- SELECT/INSERT: Own sessions only (via drying_sessions)
- No UPDATE/DELETE

#### **crop_profiles**
Stores optimal drying profiles for different crops.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| crop_name | text | Crop name |
| description | text | Crop description |
| optimal_temp_min | numeric | Min optimal temp (°C) |
| optimal_temp_max | numeric | Max optimal temp (°C) |
| optimal_humidity_max | numeric | Max optimal humidity |
| estimated_hours | numeric | Estimated drying hours |
| created_at | timestamp | Creation timestamp |

**RLS Policies:**
- SELECT: Public (anyone can view)
- No INSERT/UPDATE/DELETE

### 4.2 Database Relationships

```
drying_sessions (user_id) ────┐
                               ├──> auth.users (Supabase Auth)
pilot_requests (admin review)──┘

drying_sessions (id) ──┐
                       └──> sensor_readings (session_id)

crop_profiles (crop_name) ──> Referenced by drying_sessions (crop_type)
```

---

## 5. Public Website

### 5.1 Pages Overview

#### **Home Page (`/`)**
The main landing page showcasing the solar dryer solution.

**Features:**
- Hero section with video background and CTA buttons
- Impact metrics with animated counters
- Success stories carousel
- Technology highlights
- Call-to-action sections

**Data Sources:**
- `home_content` table
- `impact_metrics` table
- `stories_testimonials` table

**Key Components:**
- Hero section with video/image
- CountUp animations for metrics
- Testimonial cards
- Responsive grid layouts

#### **About Page (`/about`)**
Information about the company, team, and mission.

**Features:**
- Mission and vision statements
- Team member profiles with images
- Company timeline
- Core values section

**Data Sources:**
- `about_content` table
- `team_members` table
- `timeline_events` table

**Key Components:**
- Team member cards
- Timeline visualization
- Mission/vision sections

#### **Technology Page (`/technology`)**
Detailed information about the solar dryer technology.

**Features:**
- Technology overview
- Feature highlights
- Technical specifications
- Innovation showcase

**Data Sources:**
- `technology_content` table

**Key Components:**
- Feature cards
- Technical specifications grid
- Image galleries

#### **Applications Page (`/applications`)**
Showcase of different crop applications.

**Features:**
- Crop categories (Grains, Spices, Fruits, etc.)
- Crop-specific drying information
- Temperature and humidity ranges
- ROI calculations
- Benefits listings

**Data Sources:**
- `crop_applications` table

**Key Components:**
- Crop category filters
- Crop application cards
- Detail modals/sections

#### **Impact Page (`/impact`)**
Environmental and social impact metrics.

**Features:**
- Impact statistics
- Environmental benefits
- Economic impact
- Social impact stories

**Data Sources:**
- `impact_metrics` table
- `stories_testimonials` table

**Key Components:**
- Metric cards with animations
- Impact visualizations
- Success stories

#### **Blog Page (`/blog`)**
Blog listing and individual blog posts.

**Features:**
- Blog post listing with pagination
- Featured posts
- Category filtering
- Tag filtering
- Search functionality
- Individual post view with markdown rendering

**Data Sources:**
- `blog_posts` table

**Key Components:**
- Blog card grid
- Category badges
- Markdown renderer
- Related posts

#### **Contact Page (`/contact`)**
Contact form and pilot program request.

**Features:**
- Pilot request form
- Form validation
- Success/error notifications
- Contact information display

**Data Sources:**
- Inserts to `pilot_requests` table

**Key Components:**
- Form with validation
- Toast notifications
- Success confirmation

### 5.2 SEO Implementation

All public pages implement SEO best practices:

- **Meta tags**: Title, description, keywords
- **Open Graph tags**: Social media sharing
- **Semantic HTML**: Proper heading hierarchy (h1, h2, h3)
- **Alt text**: All images have descriptive alt attributes
- **Responsive images**: Optimized loading
- **Clean URLs**: Descriptive, crawlable URLs
- **Structured data**: JSON-LD where applicable

### 5.3 Responsive Design

The website is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Large Desktop: > 1440px

---

## 6. Admin CMS

### 6.1 Overview

The Admin CMS provides a comprehensive interface for managing all website content without requiring technical knowledge.

**Access:** `/admin/login`  
**Authentication:** Supabase Auth with admin role verification

### 6.2 Admin Pages

#### **Admin Dashboard (`/admin/dashboard`)**
Central hub for content management overview.

**Features:**
- Quick stats (total blog posts, pilot requests, etc.)
- Recent activity
- Quick actions
- System status

#### **Home Management (`/admin/home`)**
Manage homepage content.

**Editable Fields:**
- Hero headline
- Hero subtext
- Hero video URL
- Primary CTA text
- Secondary CTA text

**Features:**
- Live preview
- Save & publish
- Media library integration

#### **About Management (`/admin/about`)**
Manage About page content.

**Sections:**
1. **Mission & Vision**
   - Mission statement editor
   - Vision statement editor

2. **Team Members**
   - Add/edit/delete team members
   - Upload profile images
   - Reorder team members
   - Fields: name, title, bio, expertise, image

3. **Timeline**
   - Add/edit/delete timeline events
   - Reorder events
   - Fields: year, title, description

#### **Technology Management (`/admin/technology`)**
Manage Technology page content.

**Features:**
- Add/edit technology sections
- Upload images
- Manage features list (JSON)
- Reorder sections

**Fields:**
- Section key
- Title
- Description
- Image URL
- Features (array)
- Display order

#### **Applications Management (`/admin/applications`)**
Manage crop applications.

**Features:**
- Add/edit/delete crop applications
- Upload crop images
- Category management
- Reorder applications

**Fields:**
- Crop name
- Category
- Image URL
- Temperature range
- Humidity range
- Drying time
- Benefits (array)
- ROI percentage
- Display order

#### **Blog Management (`/admin/blog`)**
Comprehensive blog management system.

**Features:**
- Create/edit/delete blog posts
- Rich text/Markdown editor
- Upload featured images
- Publish/unpublish posts
- Featured post selection
- Category and tag management
- SEO meta fields

**Fields:**
- Title
- Slug (auto-generated or custom)
- Summary
- Content (Markdown)
- Featured image URL
- Author
- Category
- Tags (array)
- Publication status
- Featured status
- Published date
- Read time (auto-calculated)

**Post Status:**
- Draft
- Published
- Featured

#### **Impact Management (`/admin/impact`)**
Manage impact metrics.

**Features:**
- Add/edit/delete metrics
- Icon selection
- Reorder metrics

**Fields:**
- Metric key
- Metric label
- Metric value
- Metric unit
- Icon name
- Display order

#### **Stories Management (`/admin/stories`)**
Manage testimonials and success stories.

**Features:**
- Add/edit/delete stories
- Upload images/videos
- Featured story selection
- Reorder stories

**Fields:**
- Type (story/testimonial)
- Name
- Location
- Role
- Quote/story text
- Image URL
- Video URL
- Featured status
- Display order

#### **Pilot Requests (`/admin/pilots`)**
Manage pilot program requests from contact form.

**Features:**
- View all requests
- Filter by status (pending, approved, rejected)
- Update request status
- Add admin notes
- Contact information display
- Export data

**Fields (View Only):**
- Full name
- Email
- Phone
- Organization
- Location
- Farm size
- Crop types
- Message
- Submission date

**Fields (Editable):**
- Status
- Admin notes

#### **Settings (`/admin/settings`)**
General admin settings.

**Features:**
- Profile management
- Password change
- System preferences
- User management (if applicable)

### 6.3 Admin Navigation

**Sidebar Menu:**
- Dashboard
- Home
- About
- Technology
- Applications
- Blog
- Impact
- Stories
- Pilot Requests
- Settings
- Logout

### 6.4 Admin Authentication

**Login Flow:**
1. User visits `/admin/login`
2. Enters email and password
3. Supabase Auth validates credentials
4. Admin role verified via RLS policies
5. Redirected to `/admin/dashboard`

**Protected Routes:**
All `/admin/*` routes are protected and require authentication.

**Session Management:**
- Sessions persist across browser refreshes
- Auto-logout on token expiration
- Secure token storage in localStorage

---

## 7. IoT Dashboard

### 7.1 Overview

The IoT Dashboard provides real-time monitoring and control of solar dryer equipment.

**Access:** `/dashboard` (requires user authentication)

### 7.2 Dashboard Pages

#### **Main Dashboard (`/dashboard`)**
Real-time overview of drying session and sensor data.

**Layout:**
- Sidebar navigation
- Main content area with sensor cards
- Status indicator
- Power mode indicator

**Sensor Components:**

1. **Energy Meter**
   - Voltage (V)
   - Current (A)
   - Power (W)
   - Energy (kWh)
   - Power Factor
   - Frequency (Hz)

2. **Temperature & Humidity**
   - Top chamber temperature
   - Top chamber humidity
   - Bottom chamber temperature
   - Bottom chamber humidity
   - Trend indicators

3. **Light Sensor**
   - Light intensity (lux)
   - Solar availability indicator

4. **Gas Sensor (VOC)**
   - VOC level (ppm)
   - Air quality indicator
   - Alerts for high levels

5. **Moisture Sensor**
   - Current moisture level (%)
   - Initial moisture level
   - Progress indicator

**Additional Components:**
- Drying timeline visualization
- Real-time chart (temperature, humidity, moisture)
- AI insights panel
- Alert notifications

#### **Controls Page (`/dashboard/controls`)**
Drying session control panel.

**Features:**

1. **Session Status**
   - Current status display (Idle, Active, Paused, Completed)
   - Session duration timer

2. **Session Configuration**
   - Crop type input (custom text entry)
   - Target temperature slider (30°C - 70°C)
   - Mode toggle (Auto/Manual)

3. **Drying Controls**
   - Start button (starts new session)
   - Pause button (pauses active session)
   - Stop button (ends session)

4. **Fan Control**
   - Fan speed slider (0-100%)
   - Only adjustable in Manual mode
   - Auto-adjusts in Auto mode based on temperature

5. **Alerts**
   - Alert reset button
   - Alert history

**Mode Descriptions:**

- **Auto Mode:**
  - System automatically adjusts fan speed based on temperature
  - Maintains target temperature within ±2°C
  - Optimal for consistent drying
  
- **Manual Mode:**
  - User controls fan speed directly
  - Full control over drying process
  - Requires monitoring

#### **Analytics Page (`/dashboard/analytics`)**
Historical data analysis and insights.

**Features:**
- Session history
- Performance metrics
- Energy consumption charts
- Drying efficiency analysis
- Comparison between sessions
- Export data functionality

**Charts:**
- Temperature trends over time
- Humidity trends over time
- Moisture reduction curves
- Energy consumption patterns
- Efficiency metrics

#### **History Page (`/dashboard/history`)**
Complete session history.

**Features:**
- List of all past sessions
- Session details
- Sensor data playback
- Filter by date range
- Filter by crop type
- Export session data

**Session Details:**
- Crop type
- Start/end time
- Duration
- Initial/final moisture
- Energy consumed
- Average temperature
- Status

#### **Alerts Page (`/dashboard/alerts`)**
Alert management and notification center.

**Alert Types:**
- High temperature warnings
- Low temperature warnings
- High VOC levels
- Power mode changes
- Session completion
- System errors

**Features:**
- Alert history
- Filter by type
- Filter by severity
- Mark as read
- Clear alerts
- Alert preferences

#### **Settings Page (`/dashboard/settings`)**
Dashboard user settings.

**Features:**
- Profile information
- Notification preferences
- Temperature unit (Celsius/Fahrenheit)
- Language preferences
- Data export
- Account management

### 7.3 Real-time Features

**Data Update Frequency:**
- Sensor readings: Every 3 seconds (simulated)
- Database saves: Every 30 seconds
- Chart updates: Real-time

**WebSocket/Realtime:**
- Uses Supabase Realtime for live updates
- Subscribes to sensor_readings table changes
- Automatic reconnection on disconnect

### 7.4 Session Management

**Starting a Session:**
1. Navigate to Controls page
2. Enter crop type (custom text)
3. Set target temperature
4. Choose mode (Auto/Manual)
5. Click Start button
6. Session begins, sensors start collecting data

**Auto Mode Operation:**
- System monitors temperature sensors
- Calculates average temperature
- Adjusts fan speed to maintain target
- Formula: `fanSpeed = 60 + (avgTemp - targetTemp) * 5`
- Clamped between 30-100%

**Manual Mode Operation:**
- User controls fan speed directly
- No automatic adjustments
- Requires active monitoring
- Useful for specific drying techniques

**Pausing a Session:**
- Click Pause button
- Fan stops
- Data collection continues
- Can resume later

**Stopping a Session:**
- Click Stop button
- Session marked as completed
- Final data saved
- Session report generated

### 7.5 Sensor Data Simulation

**Note:** Current implementation uses simulated sensor data for demonstration purposes.

**Simulation Logic:**
```typescript
// Temperature: Target ± random variation
tempTop = targetTemp + random(-2, +2)
tempBottom = targetTemp + random(-4, 0)

// Humidity: 40% ± random variation
humidity = 40 + random(-5, +5)

// Moisture: Decreases 0.5% per reading
moisture = max(10, previousMoisture - 0.5)

// VOC: 80 ppm ± random variation
voc = 80 + random(-20, +20)

// Light: 800 lux ± random variation
light = 800 + random(-100, +100)

// Energy: Incrementally increases
energy = previousEnergy + 0.001
```

**Real Hardware Integration:**
When connecting to actual IoT hardware, replace simulation with:
- MQTT broker subscription
- HTTP API polling
- WebSocket connection
- Direct database writes from hardware

---

## 8. Authentication & Security

### 8.1 Authentication System

**Provider:** Supabase Auth

**Authentication Methods:**
- Email/Password
- Magic Link (email)
- OAuth providers (Google, GitHub, etc.) - configurable

### 8.2 User Types

1. **Public Users** (Unauthenticated)
   - View public website
   - Submit contact forms
   - Cannot access dashboard or admin

2. **Authenticated Users**
   - Access IoT dashboard
   - Manage own drying sessions
   - View own sensor data
   - Cannot access admin CMS

3. **Admin Users**
   - Access admin CMS
   - Manage all website content
   - View all pilot requests
   - Cannot access IoT dashboard (separate user base)

### 8.3 Row Level Security (RLS)

**Principle:** All database tables have RLS enabled with specific policies.

**Policy Examples:**

```sql
-- Public read access to published content
CREATE POLICY "Anyone can view published blogs"
ON blog_posts FOR SELECT
TO public
USING (is_published = true);

-- Admin full access
CREATE POLICY "Authenticated admins can manage blogs"
ON blog_posts FOR ALL
TO authenticated
USING (auth.role() = 'authenticated');

-- User can only access own data
CREATE POLICY "Users can view their own sessions"
ON drying_sessions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

### 8.4 Security Best Practices

1. **Password Requirements:**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

2. **Session Management:**
   - JWT tokens with expiration
   - Automatic token refresh
   - Secure token storage (localStorage)
   - Session timeout after inactivity

3. **API Security:**
   - All API calls authenticated
   - RLS policies enforced at database level
   - CORS configured for allowed origins
   - Rate limiting on sensitive endpoints

4. **Input Validation:**
   - Client-side validation with Zod schemas
   - Server-side validation with RLS
   - SQL injection prevention (parameterized queries)
   - XSS prevention (React auto-escaping)

5. **File Upload Security:**
   - File type restrictions
   - File size limits
   - Secure storage URLs
   - Public access only for approved files

### 8.5 Data Privacy

**GDPR Compliance:**
- User data minimization
- Right to access data
- Right to deletion
- Data export functionality
- Privacy policy disclosure

**Data Retention:**
- Active sessions: Indefinitely
- Completed sessions: 1 year (configurable)
- Sensor readings: 1 year (configurable)
- Logs: 30 days

---

## 9. Components Documentation

### 9.1 Component Structure

```
src/
├── components/
│   ├── layout/           # Layout components
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── dashboard/        # Dashboard components
│   │   ├── DashboardSidebar.tsx
│   │   ├── MetricCard.tsx
│   │   ├── DryingTimeline.tsx
│   │   ├── RealtimeChart.tsx
│   │   ├── AIInsights.tsx
│   │   ├── PowerModeIndicator.tsx
│   │   ├── controls/
│   │   │   └── ControlPanel.tsx
│   │   └── sensors/
│   │       ├── EnergyMeter.tsx
│   │       ├── TemperatureHumidity.tsx
│   │       ├── LightSensor.tsx
│   │       ├── GasSensor.tsx
│   │       └── MoistureSensor.tsx
│   ├── admin/            # Admin CMS components
│   │   ├── AdminSidebar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── ui/               # Reusable UI components (Shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ... (30+ components)
│   ├── ThemeToggle.tsx
│   └── PilotRequestDialog.tsx
```

### 9.2 Key Components

#### **Layout Components**

**Layout.tsx**
- Main layout wrapper
- Includes Navbar and Footer
- Outlet for child routes
- Responsive container

**Navbar.tsx**
- Responsive navigation menu
- Logo and brand
- Navigation links
- Mobile hamburger menu
- Theme toggle
- Login button

**Footer.tsx**
- Footer content
- Social media links
- Copyright information
- Quick links

#### **Dashboard Components**

**DashboardSidebar.tsx**
- Dashboard navigation menu
- Icons from lucide-react
- Active route highlighting
- Logout button

**MetricCard.tsx**
- Reusable card for displaying metrics
- Props: title, value, unit, icon, trend
- Animated values with CountUp

**DryingTimeline.tsx**
- Visualizes drying progress
- Steps: Start, Processing, Monitoring, Complete
- Progress bar
- Estimated completion time
- Current step highlighting

**RealtimeChart.tsx**
- Live chart using Recharts
- Multi-line chart (temperature, humidity, moisture)
- Responsive
- Auto-scrolling time axis
- Legend

**AIInsights.tsx**
- AI-powered recommendations
- Based on sensor data
- Actionable suggestions
- Icon-based insights

**PowerModeIndicator.tsx**
- Shows current power source (solar, battery, grid)
- Visual indicator with icons
- Color-coded status

**ControlPanel.tsx**
- Session control interface
- Start/Pause/Stop buttons
- Temperature slider
- Crop type input (text field)
- Mode toggle (Auto/Manual)
- Fan speed slider
- Alert management

**Sensor Components:**

Each sensor component displays:
- Current reading
- Unit of measurement
- Icon representation
- Trend indicator (up/down/stable)
- Min/max values
- Status color coding

**EnergyMeter.tsx**
- Voltage, Current, Power, Energy
- Power Factor, Frequency
- Real-time updates

**TemperatureHumidity.tsx**
- Top and bottom chamber readings
- Temperature and humidity
- Trend arrows

**LightSensor.tsx**
- Light intensity in lux
- Solar availability indicator

**GasSensor.tsx**
- VOC level in ppm
- Air quality status
- Alert threshold

**MoistureSensor.tsx**
- Current moisture percentage
- Initial moisture reference
- Progress bar

#### **Admin Components**

**AdminSidebar.tsx**
- Admin navigation menu
- Content management sections
- Active route highlighting

**ProtectedRoute.tsx**
- Route protection HOC
- Checks authentication
- Redirects to login if not authenticated

#### **Shared UI Components**

**Button**
- Variants: default, destructive, outline, secondary, ghost, link
- Sizes: default, sm, lg, icon
- Fully accessible

**Card**
- Card container with header, content, footer
- Responsive padding
- Shadow effects

**Input**
- Styled text input
- Error states
- Label integration

**Dialog**
- Modal dialog
- Accessible
- Overlay backdrop

**Form**
- React Hook Form integration
- Zod validation
- Error display
- Field management

### 9.3 Custom Hooks

**useDryingSession.ts**
- Manages drying session state
- Sensor data simulation
- Session CRUD operations
- Auto-save to database
- Returns:
  - sessionId
  - status
  - config
  - sensorData
  - fanSpeed
  - powerMode
  - startSession()
  - pauseSession()
  - stopSession()
  - updateConfig()
  - setFanSpeed()

**use-toast.ts**
- Toast notification hook
- Success/error/info messages
- Automatic dismiss
- Position customization

**use-mobile.tsx**
- Detects mobile viewport
- Returns boolean
- Responsive behavior

### 9.4 Context Providers

**AdminAuthContext.tsx**
- Admin authentication state
- Login/logout functions
- Admin verification
- Session persistence

**ThemeProvider** (next-themes)
- Dark/light theme management
- System preference detection
- Theme toggle

---

## 10. Design System

### 10.1 Color Palette

**Design System Colors (HSL):**

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: 142.1 76.2% 36.3%;
  --primary-foreground: 355.7 100% 97.3%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 142.1 76.2% 36.3%;
  --radius: 0.5rem;
}

.dark {
  --background: 20 14.3% 4.1%;
  --foreground: 0 0% 95%;
  --card: 24 9.8% 10%;
  --card-foreground: 0 0% 95%;
  --popover: 0 0% 9%;
  --popover-foreground: 0 0% 95%;
  --primary: 142.1 70.6% 45.3%;
  --primary-foreground: 144.9 80.4% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 15%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 12 6.5% 15.1%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 85.7% 97.3%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 142.4 71.8% 29.2%;
}
```

**Brand Colors:**
- Primary: Green (#22c55e) - Represents sustainability
- Secondary: Dark gray/brown tones
- Accent: Warm earth tones

### 10.2 Typography

**Font Family:**
- System font stack for optimal performance
- Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, etc.

**Font Sizes:**
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)
- 5xl: 3rem (48px)

**Font Weights:**
- normal: 400
- medium: 500
- semibold: 600
- bold: 700

### 10.3 Spacing

**Tailwind Spacing Scale:**
- 0: 0px
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 6: 1.5rem (24px)
- 8: 2rem (32px)
- 12: 3rem (48px)
- 16: 4rem (64px)

### 10.4 Breakpoints

```javascript
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

### 10.5 Animations

**Framer Motion Variants:**

```typescript
// Container animation
container: {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Item animation
item: {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

// Fade in animation
fadeIn: {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
}
```

**CSS Animations:**
- tailwindcss-animate plugin for utility animations
- Spin, pulse, bounce, fade effects

### 10.6 Shadows

```css
sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
2xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
```

### 10.7 Border Radius

```css
DEFAULT: '0.5rem',
sm: '0.25rem',
md: '0.5rem',
lg: '0.75rem',
xl: '1rem',
2xl: '1.5rem',
full: '9999px'
```

---

## 11. API & Backend

### 11.1 Supabase Client

**Configuration:**
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

### 11.2 Common API Patterns

#### **Fetching Data**

```typescript
// Fetch all published blog posts
const { data, error } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('is_published', true)
  .order('published_at', { ascending: false });

// Fetch single record
const { data, error } = await supabase
  .from('home_content')
  .select('*')
  .single();

// Fetch with filters
const { data, error } = await supabase
  .from('crop_applications')
  .select('*')
  .eq('category', 'Grains')
  .order('display_order');
```

#### **Inserting Data**

```typescript
// Insert new record
const { data, error } = await supabase
  .from('drying_sessions')
  .insert({
    user_id: userId,
    crop_type: 'Maize',
    target_temperature: 45,
    status: 'active',
    mode: 'auto',
    power_mode: 'solar'
  })
  .select()
  .single();

// Batch insert
const { data, error } = await supabase
  .from('sensor_readings')
  .insert([
    { session_id: id, temp_top: 45, ... },
    { session_id: id, temp_top: 46, ... }
  ]);
```

#### **Updating Data**

```typescript
// Update record
const { data, error } = await supabase
  .from('blog_posts')
  .update({
    title: 'New Title',
    updated_at: new Date().toISOString()
  })
  .eq('id', postId);

// Conditional update
const { data, error } = await supabase
  .from('drying_sessions')
  .update({ status: 'paused' })
  .eq('id', sessionId)
  .eq('user_id', userId); // RLS check
```

#### **Deleting Data**

```typescript
// Delete record
const { error } = await supabase
  .from('blog_posts')
  .delete()
  .eq('id', postId);
```

#### **Authentication**

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Sign out
const { error } = await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Check session
const { data: { session } } = await supabase.auth.getSession();
```

#### **File Upload**

```typescript
// Upload file to storage
const { data, error } = await supabase.storage
  .from('media')
  .upload(`images/${fileName}`, file);

// Get public URL
const { data } = supabase.storage
  .from('media')
  .getPublicUrl(`images/${fileName}`);

// Delete file
const { error } = await supabase.storage
  .from('media')
  .remove([`images/${fileName}`]);
```

#### **Realtime Subscriptions**

```typescript
// Subscribe to table changes
const channel = supabase
  .channel('sensor_readings')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'sensor_readings',
      filter: `session_id=eq.${sessionId}`
    },
    (payload) => {
      console.log('New reading:', payload.new);
      setSensorData(payload.new);
    }
  )
  .subscribe();

// Unsubscribe
channel.unsubscribe();
```

### 11.3 Error Handling

**Standard Error Handling Pattern:**

```typescript
try {
  const { data, error } = await supabase
    .from('table')
    .select('*');
  
  if (error) throw error;
  
  // Process data
  return data;
  
} catch (error) {
  console.error('Error:', error);
  toast({
    title: 'Error',
    description: error.message,
    variant: 'destructive'
  });
}
```

### 11.4 Edge Functions

**Location:** `supabase/functions/`

**Use Cases:**
- Email notifications
- Complex calculations
- Third-party API integrations
- Scheduled tasks
- Custom authentication logic

**Example Structure:**
```typescript
// supabase/functions/send-notification/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  try {
    const { email, message } = await req.json();
    
    // Send email logic
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
});
```

---

## 12. Deployment & Setup

### 12.1 Local Development Setup

**Prerequisites:**
- Node.js 18+ or Bun
- Git
- Supabase account (for Lovable Cloud)

**Installation Steps:**

```bash
# Clone repository
git clone <repository-url>
cd smart-solar-dryer

# Install dependencies
npm install
# or
bun install

# Setup environment variables
# .env file is auto-configured by Lovable Cloud

# Start development server
npm run dev
# or
bun dev

# Open browser
# Navigate to http://localhost:5173
```

### 12.2 Environment Variables

**Automatically Configured:**
```env
VITE_SUPABASE_URL=https://qjadqzjvzypftynvtgvi.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
VITE_SUPABASE_PROJECT_ID=qjadqzjvzypftynvtgvi
```

**Custom Variables (if needed):**
Add to `.env.local`:
```env
VITE_APP_NAME=Smart Solar Dryer
VITE_SUPPORT_EMAIL=support@smartsolardryer.com
```

### 12.3 Build Process

**Production Build:**

```bash
# Build for production
npm run build
# or
bun run build

# Output: dist/ directory
```

**Build Configuration:**
- Vite bundler
- TypeScript compilation
- Asset optimization
- Code splitting
- Tree shaking

### 12.4 Deployment Options

#### **Option 1: Lovable Deployment (Recommended)**
- Automatic deployment via Lovable platform
- Continuous deployment from Git
- Automatic HTTPS
- CDN distribution
- Zero configuration

#### **Option 2: Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

#### **Option 3: Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### **Option 4: Custom Server**
```bash
# Build
npm run build

# Serve with static server
npx serve -s dist -l 3000
```

### 12.5 Database Migrations

**Automatic via Lovable Cloud:**
- Migrations auto-generated
- Version controlled in `supabase/migrations/`
- Applied automatically on deployment

**Manual Migration:**
```sql
-- Example migration
-- supabase/migrations/20250101000000_add_new_table.sql

CREATE TABLE public.new_table (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
ON public.new_table FOR SELECT
TO public USING (true);
```

### 12.6 Monitoring & Analytics

**Built-in Monitoring:**
- Supabase Dashboard (via Lovable Cloud UI)
- Database performance metrics
- API usage statistics
- Error tracking

**Optional Third-Party:**
- Google Analytics
- Sentry for error tracking
- LogRocket for session replay
- Posthog for product analytics

### 12.7 Performance Optimization

**Implemented:**
- Code splitting
- Lazy loading
- Image optimization
- Tailwind CSS purging
- Gzip compression
- CDN delivery

**Best Practices:**
- Minimize bundle size
- Optimize images (WebP, lazy loading)
- Cache static assets
- Use production build
- Enable HTTP/2
- Implement service workers (PWA)

---

## 13. User Guides

### 13.1 Public User Guide

#### **Browsing the Website**

1. **Home Page**
   - View hero section with video
   - Read impact metrics
   - Explore success stories
   - Click CTAs to learn more

2. **About Page**
   - Learn about mission and vision
   - Meet the team
   - View company timeline

3. **Technology Page**
   - Understand the solar dryer technology
   - View technical specifications
   - See innovation features

4. **Applications Page**
   - Browse crop categories
   - View crop-specific drying information
   - Learn about ROI and benefits

5. **Impact Page**
   - View environmental impact metrics
   - Read success stories
   - Understand social impact

6. **Blog**
   - Browse blog posts
   - Filter by category
   - Read articles
   - Share on social media

7. **Contact**
   - Fill out pilot request form
   - Submit inquiry
   - Receive confirmation

#### **Requesting a Pilot Program**

1. Navigate to Contact page
2. Fill out form:
   - Full name
   - Email address
   - Phone number (optional)
   - Organization (optional)
   - Location
   - Farm size (optional)
   - Crop types
   - Additional message
3. Click "Submit Request"
4. Receive confirmation message
5. Wait for admin to review and contact you

### 13.2 Dashboard User Guide

#### **Getting Started**

1. **Create Account**
   - Click "Login" in navbar
   - Click "Sign Up"
   - Enter email and password
   - Verify email (if required)
   - Log in with credentials

2. **First Session Setup**
   - Navigate to Controls page
   - Enter your crop type (e.g., "Maize")
   - Set target temperature (recommended: 45°C)
   - Choose mode (Auto recommended for beginners)
   - Click "Start Session"

#### **Monitoring Your Drying Session**

1. **Dashboard Overview**
   - View all sensor readings
   - Monitor temperature and humidity
   - Check moisture level progress
   - View estimated completion time
   - Track energy consumption

2. **Sensor Readings**
   - **Energy Meter**: Power consumption metrics
   - **Temperature**: Top and bottom chamber temps
   - **Humidity**: Moisture in the air
   - **Light Sensor**: Solar availability
   - **Gas Sensor**: Air quality (VOC levels)
   - **Moisture Sensor**: Product moisture content

3. **Real-time Charts**
   - View trends over time
   - Compare temperature, humidity, moisture
   - Identify patterns

4. **AI Insights**
   - Receive smart recommendations
   - Optimize drying process
   - Improve efficiency

#### **Controlling Your Session**

1. **Auto Mode (Recommended)**
   - System automatically adjusts fan speed
   - Maintains optimal temperature
   - Best for consistent results
   - Minimal user intervention required

2. **Manual Mode (Advanced)**
   - Full control over fan speed
   - Adjust based on your experience
   - Monitor carefully
   - Requires active management

3. **Session Actions**
   - **Pause**: Temporarily stop drying (can resume)
   - **Stop**: End session permanently (marks complete)
   - **Adjust Temperature**: Change target temp during session
   - **Toggle Mode**: Switch between Auto and Manual

#### **Viewing History & Analytics**

1. **History Page**
   - View all past sessions
   - Filter by date or crop type
   - View session details
   - Export data

2. **Analytics Page**
   - Compare sessions
   - Analyze efficiency
   - Track energy usage
   - Identify improvements

3. **Alerts Page**
   - View all alerts and notifications
   - Filter by type
   - Mark as read
   - Clear old alerts

#### **Settings & Preferences**

1. **Profile**
   - Update personal information
   - Change password
   - Manage account

2. **Notifications**
   - Configure alert preferences
   - Choose notification methods
   - Set thresholds

3. **Preferences**
   - Temperature units (Celsius/Fahrenheit)
   - Language settings
   - Theme (Light/Dark)

### 13.3 Admin User Guide

#### **Logging In**

1. Navigate to `/admin/login`
2. Enter admin email and password
3. Click "Login"
4. Redirected to Admin Dashboard

#### **Dashboard Overview**

- Quick stats
- Recent activity
- System health
- Quick actions

#### **Managing Homepage Content**

1. Navigate to "Home" in sidebar
2. Edit fields:
   - Hero headline
   - Hero subtext
   - Video URL
   - CTA text
3. Click "Save Changes"
4. Changes appear immediately on public site

#### **Managing About Page**

1. **Mission & Vision**
   - Edit text in rich text editor
   - Save changes

2. **Team Members**
   - Click "Add Team Member"
   - Upload profile image
   - Fill in details (name, title, bio, expertise)
   - Set display order
   - Save
   - Edit/Delete existing members

3. **Timeline**
   - Click "Add Event"
   - Enter year, title, description
   - Set display order
   - Save
   - Edit/Delete existing events

#### **Managing Blog**

1. **Creating a Post**
   - Click "New Post"
   - Enter title (slug auto-generated)
   - Write summary
   - Write content (Markdown supported)
   - Upload featured image
   - Enter author name
   - Select category
   - Add tags
   - Choose status (Draft/Published)
   - Mark as featured (optional)
   - Save

2. **Editing a Post**
   - Click post in list
   - Edit fields
   - Update
   - Publish/Unpublish

3. **Deleting a Post**
   - Click delete icon
   - Confirm deletion

#### **Managing Crop Applications**

1. Click "Add Crop"
2. Enter crop details:
   - Crop name
   - Category
   - Upload image
   - Temperature range
   - Humidity range
   - Drying time
   - Benefits (array)
   - ROI percentage
3. Set display order
4. Save
5. Edit/Delete existing crops

#### **Managing Impact Metrics**

1. Click "Add Metric"
2. Enter:
   - Metric key (identifier)
   - Label (display text)
   - Value (number)
   - Unit (e.g., "tons", "farms")
   - Icon name
3. Set display order
4. Save
5. Update values as needed

#### **Managing Pilot Requests**

1. View all requests in table
2. Filter by status:
   - Pending
   - Approved
   - Rejected
3. Click request to view details
4. Update status
5. Add admin notes
6. Contact requester
7. Export data (CSV/Excel)

#### **Settings**

1. Profile management
2. Change password
3. System preferences
4. User management (if multi-admin)

### 13.4 Troubleshooting Common Issues

#### **Public Website**

**Issue:** Content not loading
- **Solution:** Check internet connection, refresh page, clear browser cache

**Issue:** Images not displaying
- **Solution:** Check image URLs in admin, ensure images are uploaded to storage

**Issue:** Form submission failed
- **Solution:** Check all required fields, validate email format, retry

#### **Dashboard**

**Issue:** Can't start session
- **Solution:** Ensure logged in, check crop type is entered, verify target temperature is set

**Issue:** Sensor data not updating
- **Solution:** Refresh page, check session is active, verify internet connection

**Issue:** Charts not displaying
- **Solution:** Wait for data to accumulate, refresh page, check browser console

#### **Admin CMS**

**Issue:** Can't login
- **Solution:** Verify credentials, check admin role, reset password

**Issue:** Changes not saving
- **Solution:** Check all required fields, verify internet connection, check for error messages

**Issue:** Images not uploading
- **Solution:** Check file size (max 5MB), verify file type (JPG, PNG, WebP), retry

#### **General**

**Issue:** Page not found (404)
- **Solution:** Check URL, navigate from home page

**Issue:** Slow performance
- **Solution:** Clear browser cache, close other tabs, check internet speed

**Issue:** Layout broken on mobile
- **Solution:** Update browser, rotate device, report bug if persists

---

## 14. API Reference

### 14.1 Supabase Tables

#### **home_content**
```typescript
// Fetch
GET /rest/v1/home_content?select=*

// Update
PATCH /rest/v1/home_content?id=eq.{id}
Body: { headline, subtext, hero_video_url, ... }
```

#### **blog_posts**
```typescript
// List published
GET /rest/v1/blog_posts?select=*&is_published=eq.true&order=published_at.desc

// Get by slug
GET /rest/v1/blog_posts?select=*&slug=eq.{slug}&is_published=eq.true

// Create
POST /rest/v1/blog_posts
Body: { title, slug, summary, content, ... }

// Update
PATCH /rest/v1/blog_posts?id=eq.{id}
Body: { title, content, ... }

// Delete
DELETE /rest/v1/blog_posts?id=eq.{id}
```

#### **drying_sessions**
```typescript
// List user's sessions
GET /rest/v1/drying_sessions?select=*&user_id=eq.{userId}&order=created_at.desc

// Create session
POST /rest/v1/drying_sessions
Body: {
  user_id,
  crop_type,
  target_temperature,
  status: 'active',
  mode: 'auto',
  power_mode: 'solar'
}

// Update session
PATCH /rest/v1/drying_sessions?id=eq.{id}
Body: { status: 'paused', ... }
```

#### **sensor_readings**
```typescript
// Insert reading
POST /rest/v1/sensor_readings
Body: {
  session_id,
  voltage,
  current,
  power,
  temp_top,
  humidity_top,
  ...
}

// Get session readings
GET /rest/v1/sensor_readings?select=*&session_id=eq.{sessionId}&order=timestamp.desc
```

### 14.2 Authentication Endpoints

```typescript
// Sign Up
POST /auth/v1/signup
Body: { email, password }

// Sign In
POST /auth/v1/token?grant_type=password
Body: { email, password }

// Sign Out
POST /auth/v1/logout

// Get User
GET /auth/v1/user
Headers: { Authorization: Bearer {token} }

// Refresh Token
POST /auth/v1/token?grant_type=refresh_token
Body: { refresh_token }
```

### 14.3 Storage Endpoints

```typescript
// Upload File
POST /storage/v1/object/{bucket}/{path}
Headers: { Content-Type: image/jpeg }
Body: FormData with file

// Get Public URL
GET /storage/v1/object/public/{bucket}/{path}

// Delete File
DELETE /storage/v1/object/{bucket}/{path}
```

---

## 15. Future Enhancements

### 15.1 Planned Features

1. **Mobile App**
   - React Native version
   - Push notifications
   - Offline mode

2. **Advanced Analytics**
   - Machine learning predictions
   - Crop quality scoring
   - Energy optimization AI

3. **Multi-language Support**
   - i18n implementation
   - Translation management
   - RTL support

4. **Social Features**
   - Community forum
   - Farmer collaboration
   - Knowledge sharing

5. **E-commerce Integration**
   - Equipment sales
   - Spare parts ordering
   - Subscription plans

6. **Advanced Reporting**
   - PDF report generation
   - Custom dashboards
   - Data export (Excel, CSV)

7. **Integration APIs**
   - Weather data integration
   - Market price APIs
   - IoT device management

8. **Enhanced Admin Tools**
   - User management
   - Role-based permissions
   - Audit logs
   - Analytics dashboard

### 15.2 Technical Improvements

1. **Performance**
   - Server-side rendering (SSR)
   - Progressive Web App (PWA)
   - Advanced caching strategies

2. **Testing**
   - Unit tests (Jest/Vitest)
   - Integration tests
   - E2E tests (Playwright/Cypress)
   - Visual regression tests

3. **DevOps**
   - CI/CD pipelines
   - Automated testing
   - Staging environments
   - Blue-green deployments

4. **Security**
   - Two-factor authentication
   - Advanced RLS policies
   - API rate limiting
   - DDoS protection

---

## 16. Support & Maintenance

### 16.1 Getting Help

**Documentation:**
- This comprehensive guide
- Inline code comments
- Component documentation

**Support Channels:**
- Email: support@smartsolardryer.com
- GitHub Issues: [repository]/issues
- Community Forum: forum.smartsolardryer.com

### 16.2 Reporting Bugs

**Bug Report Template:**
```markdown
**Description:**
Clear description of the bug

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
If applicable

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Device: Desktop

**Additional Context:**
Any other relevant information
```

### 16.3 Feature Requests

**Feature Request Template:**
```markdown
**Feature Description:**
Clear description of the proposed feature

**Use Case:**
Why this feature is needed

**Proposed Solution:**
How it could be implemented

**Alternatives:**
Other ways to achieve the same goal

**Additional Context:**
Mockups, examples, etc.
```

### 16.4 Maintenance Schedule

**Regular Tasks:**
- Weekly: Dependency updates
- Monthly: Security patches
- Quarterly: Performance optimization
- Annually: Major version upgrades

**Monitoring:**
- 24/7 uptime monitoring
- Error tracking
- Performance metrics
- Security scanning

---

## 17. License & Credits

### 17.1 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 Smart Solar Dryer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 17.2 Credits

**Technologies:**
- React - Meta
- TypeScript - Microsoft
- Vite - Evan You
- Tailwind CSS - Tailwind Labs
- Supabase - Supabase Inc.
- Shadcn UI - shadcn
- Radix UI - WorkOS
- Framer Motion - Framer
- Recharts - Recharts
- Lucide Icons - Lucide

**Contributors:**
- Development Team
- Design Team
- Testing Team
- Documentation Team

---

## 18. Appendices

### 18.1 Glossary

**Terms:**
- **RLS**: Row Level Security - Database access control
- **CRUD**: Create, Read, Update, Delete operations
- **IoT**: Internet of Things - Connected devices
- **CMS**: Content Management System
- **VOC**: Volatile Organic Compounds - Air quality measure
- **PWA**: Progressive Web App - Web app with native-like features
- **SSR**: Server-Side Rendering - Rendering on server
- **API**: Application Programming Interface
- **JWT**: JSON Web Token - Authentication token
- **CORS**: Cross-Origin Resource Sharing

### 18.2 Acronyms

- **CSS**: Cascading Style Sheets
- **HTML**: HyperText Markup Language
- **HTTP**: HyperText Transfer Protocol
- **JSON**: JavaScript Object Notation
- **SQL**: Structured Query Language
- **UI**: User Interface
- **UX**: User Experience
- **URL**: Uniform Resource Locator
- **UUID**: Universally Unique Identifier
- **GDPR**: General Data Protection Regulation

### 18.3 Resources

**Official Documentation:**
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Vite: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com
- Supabase: https://supabase.com/docs
- Shadcn UI: https://ui.shadcn.com

**Learning Resources:**
- React Tutorial: https://react.dev/learn
- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook
- Tailwind CSS Guides: https://tailwindcss.com/docs
- Supabase Tutorials: https://supabase.com/docs/guides

**Community:**
- React Discord
- TypeScript Discord
- Tailwind CSS Discord
- Supabase Discord

---

## Document Information

**Document Version:** 1.0  
**Last Updated:** 2025  
**Maintained By:** Development Team  
**Contact:** support@smartsolardryer.com

---

**End of Documentation**
