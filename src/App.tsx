import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Technology from "./pages/Technology";
import Applications from "./pages/Applications";
import Impact from "./pages/Impact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import SuccessStories from "./pages/SuccessStories";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardAnalytics from "./pages/dashboard/Analytics";
import DashboardHistory from "./pages/dashboard/History";
import DashboardAlerts from "./pages/dashboard/Alerts";
import DashboardSettings from "./pages/dashboard/Settings";
import DashboardControls from "./pages/dashboard/Controls";
import NotFound from "./pages/NotFound";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminPilots from "./pages/admin/AdminPilots";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminTechnology from "./pages/admin/AdminTechnology";
import AdminImpact from "./pages/admin/AdminImpact";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminSuccessStories from "./pages/admin/AdminSuccessStories";
import AdminPartnerships from "./pages/admin/AdminPartnerships";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Pages with Layout */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/technology" element={<Layout><Technology /></Layout>} />
            <Route path="/applications" element={<Layout><Applications /></Layout>} />
            <Route path="/impact" element={<Layout><Impact /></Layout>} />
            <Route path="/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
            <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
            <Route path="/success-stories" element={<Layout><SuccessStories /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            
            {/* Pages without Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/controls" element={<DashboardControls />} />
            <Route path="/dashboard/analytics" element={<DashboardAnalytics />} />
            <Route path="/dashboard/history" element={<DashboardHistory />} />
            <Route path="/dashboard/alerts" element={<DashboardAlerts />} />
            <Route path="/dashboard/settings" element={<DashboardSettings />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="home" element={<AdminHome />} />
              <Route path="about" element={<AdminAbout />} />
              <Route path="technology" element={<AdminTechnology />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="impact" element={<AdminImpact />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="success-stories" element={<AdminSuccessStories />} />
              <Route path="partnerships" element={<AdminPartnerships />} />
              <Route path="pilots" element={<AdminPilots />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;
