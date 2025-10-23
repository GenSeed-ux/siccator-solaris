# Smart Solar Dryer Admin CMS - Complete Guide

## 🎯 Overview

The Admin CMS provides complete control over your Smart Solar Dryer organization's website content, pilot requests, blog management, and analytics.

---

## 🔐 Getting Started

### Admin Login
1. Navigate to `/admin/login`
2. Use your admin credentials to sign in
3. You'll be redirected to the admin dashboard

**Default Setup**: Create your first admin user using Supabase Auth (email/password signup).

---

## 📚 Admin Features

### 1. **Dashboard Overview** (`/admin/dashboard`)
- View key metrics at a glance:
  - Total pilot requests
  - Pending requests
  - Published blog posts
  - Crop applications
  - Stories & testimonials
- Quick action buttons for common tasks

### 2. **Home Page Management** (`/admin/home`)
**Manage:**
- Hero section content
  - Main headline
  - Subtext
  - CTA button text
  - Hero video URL
- Impact metrics (dynamic statistics shown on homepage)
  - Add/edit/delete metrics
  - Set values, labels, and units
  - Reorder display

**Example Impact Metrics:**
- Post-harvest loss reduction (%)
- Farmers empowered (#)
- Income increase (%)
- CO₂ saved (tons)

### 3. **About Page Management** (`/admin/about`)
**Manage:**
- Mission statement
- Vision statement
- Team members
  - Name, title, expertise
  - Profile images
  - Display order
- Timeline events
  - Year, title, description
  - Historical milestones

### 4. **Blog Management** (`/admin/blog`)
**Features:**
- Create new blog posts
- Edit existing posts
- Delete posts
- Set publish status
- Mark posts as featured
- Rich text content editing
- Add featured images
- Categorize and tag posts
- Set author and read time

**Blog Post Fields:**
- Title (auto-generates slug)
- Summary
- Full content
- Author
- Category
- Tags
- Featured image URL
- Published status
- Featured status

### 5. **Pilot Requests Management** (`/admin/pilots`)
**Features:**
- View all pilot program applications
- Filter by status (Pending/Approved/Rejected)
- Approve or reject requests
- Export to CSV for reporting
- View applicant details:
  - Name, email, phone
  - Location, organization
  - Farm size
  - Message

**Actions:**
- Approve pending requests
- Reject pending requests
- Export all data to CSV

### 6. **Settings** (`/admin/settings`)
**Features:**
- Export database backups (JSON format)
- System information
- Data management tools

**Available Exports:**
- Home content
- Impact metrics
- Stories & testimonials
- Team members
- Timeline events
- Blog posts
- Pilot requests
- Crop applications

---

## 🗄️ Database Structure

### Tables Created:
1. **home_content** - Hero section data
2. **impact_metrics** - Homepage statistics
3. **stories_testimonials** - Farmer stories and testimonials
4. **team_members** - Leadership team
5. **timeline_events** - Organization history
6. **technology_content** - Tech descriptions
7. **crop_applications** - Crop drying profiles
8. **blog_posts** - Blog articles
9. **pilot_requests** - Pilot program applications
10. **about_content** - Mission/vision statements

### Storage:
- **media** bucket - Public bucket for images, videos, and files

---

## 🎨 Design System

### Brand Colors:
- **Primary**: Deep Eco Green (#2E8B57)
- **Accent 1**: Light Leaf Green (#A8E6A1)
- **Accent 2**: Solar Yellow (#FFD43B)

### Theme:
- Clean, modern eco-technology aesthetic
- Glass-card effects
- Smooth animations via Framer Motion
- Responsive design for all devices

---

## 📝 Content Management Workflow

### Adding a New Blog Post:
1. Go to `/admin/blog`
2. Click "New Post"
3. Fill in title, summary, content
4. Add author and category
5. Upload featured image (optional)
6. Toggle "Published" to make it live
7. Click "Save Post"

### Managing Pilot Requests:
1. Go to `/admin/pilots`
2. Review pending requests
3. Click "Approve" or "Reject"
4. Export to CSV for reporting
5. Status updates reflect immediately

### Updating Home Page:
1. Go to `/admin/home`
2. Edit hero section text
3. Modify or add impact metrics
4. Click "Save Changes"
5. Changes appear on public site immediately

---

## 🔒 Security Features

### Authentication:
- JWT-based session management
- Protected routes (admin-only access)
- Automatic session refresh
- Secure logout

### Row Level Security (RLS):
- Public pages: Read-only access
- Admin operations: Authentication required
- Storage: Public read, authenticated write

---

## 🚀 Next Steps

### To Complete the System:
1. **Create Admin User**:
   ```
   - Go to your Supabase project
   - Use Auth > Users to create an admin account
   - Sign in at /admin/login
   ```

2. **Add Remaining Pages** (if needed):
   - Technology management (`/admin/technology`)
   - Applications management (`/admin/applications`)
   - Impact data management (`/admin/impact`)

3. **Customize Content**:
   - Upload your organization's images
   - Write blog posts
   - Update mission/vision
   - Add team member profiles

4. **Configure Storage**:
   - Upload media files to the `media` bucket
   - Reference URLs in content fields

---

## 📊 Sample Data Included

The system comes with sample data:
- 5 impact metrics
- 3 team members
- 4 timeline events
- 3 testimonials
- 1 home content entry
- Mission and vision statements

**Note**: Replace this sample data with your actual organization's content.

---

## 💡 Tips & Best Practices

1. **Images**: Use the `media` storage bucket for all images
2. **Blog Posts**: Write compelling summaries (160 chars max)
3. **Metrics**: Update regularly to show current impact
4. **Pilot Requests**: Review and respond promptly
5. **Backups**: Regularly export data via Settings

---

## 🆘 Troubleshooting

### Can't login?
- Ensure you've created an admin user in Supabase Auth
- Check that auto-confirm email is enabled

### Data not showing?
- Check RLS policies in Supabase
- Ensure authentication is working
- Review browser console for errors

### Need help?
- Check Lovable documentation: https://docs.lovable.dev
- Review Supabase docs: https://supabase.com/docs

---

## 🎉 Features Implemented

✅ Admin authentication (JWT-based)
✅ Dashboard with statistics
✅ Home page content management
✅ Impact metrics management
✅ Blog post CRUD operations
✅ Pilot request management & export
✅ About page management (team, timeline, mission/vision)
✅ Settings & data export
✅ File storage configuration
✅ Responsive admin UI
✅ Protected routes
✅ Real-time updates
✅ Sample data seeding

---

## 📱 Public Website Integration

The admin CMS controls content for:
- `/` - Homepage (hero, metrics)
- `/about` - About page (team, timeline, mission)
- `/blog` - Blog listing (published posts only)
- `/technology` - Technology page
- `/applications` - Crop applications
- `/impact` - Impact metrics & charts

All public pages pull data from the database in real-time.

---

**Built with:**
- React + Vite + TypeScript
- Tailwind CSS + ShadCN UI
- Supabase (Lovable Cloud)
- Framer Motion
- React Router v6

**Admin URL**: `https://your-domain.com/admin/login`
