import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Eye,
  EyeOff,
  Shield,
  Users,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";

export function AdminAuth({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 🔹 Set backend base URL
  //const BACKEND_URL = "http://localhost:5000";
  const BACKEND_URL = "https://weedit-co.onrender.com";

  // 🔹 Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        toast.error(data.message || "Invalid credentials");
        return;
      }

      toast.success("Login successful!");

      // Save tokens
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // Save user (backend sends user data directly)
      localStorage.setItem("user", JSON.stringify(data));

      // ROLE CHECK 🔥
      if (data.role !== "admin") {
        toast.error("Access denied. Admins only.");
        return;
      }

      // Proceed
      if (onLogin) {
        onLogin(data);
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      toast.error("Something went wrong during login");
    }
  };

  // 🔹 Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerData.name, // ✅ include name
          email: registerData.email,
          password: registerData.password,
          role: "admin", // force admin
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("Admin account created! You can now login.");

      // Switch to login tab after successful registration
      setTimeout(() => {
        document.querySelector('[data-value="login"]').click();
      }, 1000);
    } catch (error) {
      toast.error("Something went wrong during registration");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0  from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900" />
      <div className="absolute inset-0 pattern-grid opacity-30" />

      {/* Floating elements for modern look */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-gradient-primary rounded-full opacity-20 floating" />
      <div
        className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-secondary rounded-full opacity-15 floating"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-accent rounded-full opacity-25 floating"
        style={{ animationDelay: "4s" }}
      />

      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl w-full relative z-10 mx-auto">
        {/* Left side - Branding & Features */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-4">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  WeEdit Co{" "}
                </h1>
                <p className="text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">
                Manage your video editing business with ease
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Access powerful tools to track orders, manage services, view
                analytics, and grow your creative business—all in one modern
                dashboard.
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">Real-time Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Track revenue, orders, and performance metrics
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold">Customer Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage clients and their project requirements
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold">Secure & Reliable</h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security for your data
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold">Business Growth</h3>
                <p className="text-sm text-muted-foreground">
                  Tools to scale and optimize your services
                </p>
              </div>
            </div>
          </div>

          {/* Diverse team image */}
          <div className="rounded-2xl overflow-hidden glass p-6">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
              alt="Diverse team working together"
              className="w-full h-48 object-cover rounded-xl"
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                "This platform transformed how we manage our video editing
                projects. The analytics and client management features are
                game-changers."
              </p>
              <p className="text-sm font-medium mt-2">
                - Sarah Chen, Creative Director
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Auth Forms */}
        <div className="flex items-center justify-center px-4">
          <Card className="w-full max-w-md glass border-2 mx-auto">
            <CardHeader className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">WeEdit Co Admin Portal</CardTitle>
              <p className="text-muted-foreground">
                Sign in to access your professional dashboard
              </p>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" data-value="login">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>

                {/* 🔹 Login Form */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@reelworks.pro"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) =>
                            setLoginData((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                          className="h-12 pr-12"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 btn-hover-primary bg-gradient-primary text-white border-0"
                    >
                      Sign In to Dashboard
                    </Button>
                  </form>
                </TabsContent>

                {/* 🔹 Register Form */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={registerData.name}
                        onChange={(e) =>
                          setRegisterData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email Address</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Create a strong password"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="h-12"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className="h-12"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 btn-hover-accent bg-gradient-secondary text-white border-0"
                    >
                      Create Admin Account
                    </Button>

                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        By signing up, you agree to our Terms of Service and
                        Privacy Policy
                      </p>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
