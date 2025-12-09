import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Eye,
  EyeOff,
  Users,
  TrendingUp,
  BarChart3,
  Shield,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";

export default function ClientAuth({ onSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const BACKEND_URL = "http://localhost:5000";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Invalid credentials");
      toast.success("Welcome back!");
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (onSuccess) onSuccess(data.user);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during login");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword)
      return toast.error("Passwords do not match");
    if (registerData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...registerData, role: "client" }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Registration failed");
      toast.success("Account created! You can now login.");
      setTimeout(
        () => document.querySelector('[data-value="login"]').click(),
        1000
      );
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during registration");
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto glass border-2">
      <CardHeader className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl">Client Login</CardTitle>
        <p className="text-muted-foreground">
          Sign in or create an account to continue
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" data-value="login">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="client@example.com"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input
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
                Sign In
              </Button>
            </form>
          </TabsContent>

          {/* Register Form */}
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Create a strong password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                  className="h-12"
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                  className="h-12"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 btn-hover-accent bg-gradient-secondary text-white border-0"
              >
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
