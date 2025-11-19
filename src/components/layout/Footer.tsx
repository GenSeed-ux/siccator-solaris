import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { SolarDryerLogo } from "@/components/SolarDryerLogo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest text-forest-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <SolarDryerLogo size="sm" variant="icon" />
              <div>
                <div className="text-lg font-bold">Siccator Solaris</div>
                <div className="text-xs opacity-80">Smart Agriculture</div>
              </div>
            </div>
            <p className="text-sm opacity-90">
              Revolutionizing agriculture with intelligent solar drying technology for a sustainable future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-smooth">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-accent transition-smooth">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-accent transition-smooth">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm hover:text-accent transition-smooth">About Us</Link></li>
              <li><Link to="/technology" className="text-sm hover:text-accent transition-smooth">Technology</Link></li>
              <li><Link to="/applications" className="text-sm hover:text-accent transition-smooth">Applications</Link></li>
              <li><Link to="/impact" className="text-sm hover:text-accent transition-smooth">Impact</Link></li>
              <li><Link to="/blog" className="text-sm hover:text-accent transition-smooth">Blog</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-sm hover:text-accent transition-smooth">Farmer Portal</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-accent transition-smooth">Request Pilot</Link></li>
              <li><a href="#" className="text-sm hover:text-accent transition-smooth">Documentation</a></li>
              <li><a href="#" className="text-sm hover:text-accent transition-smooth">Support Center</a></li>
              <li><a href="#" className="text-sm hover:text-accent transition-smooth">Partner Program</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Agricultural Innovation Hub, Ghana</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+233 XX XXX XXXX</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@siccatorsolaris.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-forest-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm opacity-80">
              © {currentYear} Siccator Solaris. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-accent transition-smooth">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-smooth">Terms of Service</a>
              <a href="#" className="hover:text-accent transition-smooth">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
