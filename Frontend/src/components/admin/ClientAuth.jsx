import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Eye, EyeOff, Users } from "lucide-react";
import { toast } from "sonner@2.0.3";

export default function ClientAuth({ onSuccess }) {
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

  // ✅ Backend base URL
  const BACKEND_URL = "http://localhost:5000";

  // 🔹 Handle Client Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Invalid credentials");
        return;
      }

      toast.success("Welcome back!");

      // ✅ Store both tokens
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // ✅ Store user info
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Continue as before
      if (onSuccess) {
        onSuccess(data.user); // close modal
      } else {
        window.location.href = "/checkout"; // fallback redirect
      }
    } catch (error) {
      console.error(error);
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
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          role: "client", // ✅ force client
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("Account created! You can now login.");

      // ✅ Switch to login tab
      setTimeout(() => {
        document.querySelector('[data-value="login"]').click();
      }, 1000);
    } catch (error) {
      toast.error("Something went wrong during registration");
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <Card className="w-full max-w-md glass border-2 mx-auto">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Client Portal</CardTitle>
          <p className="text-muted-foreground">
            Sign in or create an account to continue
          </p>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-muted/40 p-1 rounded-xl">
              <TabsTrigger
                value="login"
                className="rounded-lg py-2 text-sm font-medium transition-all duration-300
               data-[state=active]:bg-gradient-primary data-[state=active]:text-white
               data-[state=active]:shadow-md data-[state=active]:scale-[1.02]
               hover:bg-muted/60"
              >
                Sign In
              </TabsTrigger>

              <TabsTrigger
                value="register"
                className="rounded-lg py-2 text-sm font-medium transition-all duration-300
               data-[state=active]:bg-gradient-secondary data-[state=active]:text-white
               data-[state=active]:shadow-md data-[state=active]:scale-[1.02]
               hover:bg-muted/60"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            {/* 🔹 Login Form */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="client@example.com"
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
                  className="w-full h-12 btn-hover-primary 
                           bg-gradient-to-r from-pink-500 to-purple-500 
                           text-white border-0"
                >
                  Sign In to Client Portal
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
                  className="w-full h-12 btn-hover-accent 
                           bg-gradient-to-r from-purple-500 to-pink-500 
                           text-white border-0"
                >
                  Create Client Account
                </Button>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    By signing up, you agree to our Terms of Service and Privacy
                    Policy
                  </p>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
