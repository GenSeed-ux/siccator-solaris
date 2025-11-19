import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { SolarDryerLogo } from "@/components/SolarDryerLogo";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      if (deviceId && pin) {
        toast.success("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error("Please enter both Device ID and PIN");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <SolarDryerLogo size="lg" variant="full" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Farmer Portal</h1>
          <p className="text-muted-foreground">Access your Siccator Solaris monitoring dashboard</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-8 shadow-lg"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Device ID Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Device ID
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter your device ID"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="pl-11"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Found on your Siccator Solaris control panel
              </p>
            </div>

            {/* PIN Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                PIN Code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter your PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={6}
                  className="pl-11"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                4-6 digit security code
              </p>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-foreground">
                Remember this device
              </label>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full gradient-primary text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                "Access Dashboard"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Help Links */}
          <div className="space-y-2 text-center text-sm">
            <a href="#" className="block text-primary hover:underline">
              Forgot your PIN?
            </a>
            <a href="#" className="block text-primary hover:underline">
              Need help setting up your device?
            </a>
          </div>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/30"
        >
          <p className="text-sm text-center text-muted-foreground mb-2">
            <strong>Demo Access:</strong>
          </p>
          <p className="text-xs text-center text-muted-foreground">
            Device ID: <span className="font-mono font-semibold">DEMO-001</span> | PIN: <span className="font-mono font-semibold">123456</span>
          </p>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Don't have a Siccator Solaris device?{" "}
          <a href="/contact" className="text-primary hover:underline font-medium">
            Request a pilot program
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
