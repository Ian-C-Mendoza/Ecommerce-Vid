// src/layouts/AdminLayout.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ux/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { supabase } from "@/lib/supabaseClient";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "../ux/sidebar";
import {
  BarChart3,
  Package,
  Repeat,
  Users,
  Settings,
  Shield,
  Star,
  Video,
  Home,
  Moon,
  Sun,
  Mail,
} from "lucide-react";
import { Switch } from "../ui/switch";
import { toast } from "sonner@2.0.3";

const sidebarItems = [
  {
    title: "Overview",
    icon: Home,
    id: "overview",
    description: "Dashboard analytics and metrics",
  },
  {
    title: "Orders",
    icon: Package,
    id: "orders",
    description: "Manage customer orders",
  },
  {
    title: "Subscriptions",
    icon: Repeat,
    id: "subscriptions",
    description: "Manage customer subscriptions",
  },
  {
    title: "Customers",
    icon: Users,
    id: "customers",
    description: "Customer management",
  },
  {
    title: "Inbox",
    icon: Mail,
    id: "inbox",
    description: "User messages and inquiries",
  },
];

export function AdminLayout({
  onLogout,
  onBack,
  isDark,
  onThemeToggle,
  children,
  activeTab,
  onTabChange,
}) {
  const [notifications] = useState([
    { id: 1, message: "New order received", time: "2 min ago", unread: true },
    { id: 2, message: "Project completed", time: "1 hour ago", unread: true },
    { id: 3, message: "Payment received", time: "3 hours ago", unread: false },
  ]);

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const unreadCount = notifications.filter((n) => n.unread).length;

  //const BACKEND_URL = "http://localhost:5000";
  const BACKEND_URL = "https://we-edit-co.onrender.com";

  // ✅ Fetch user (Supabase first → fallback API)
  useEffect(() => {
    async function fetchUser() {
      setIsLoadingUser(true);
      try {
        // 🔹 1. Try Supabase session first
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.access_token) {
          console.log(
            "🟢 Supabase session found, fetching user from backend..."
          );
          const res = await axios.get(`${BACKEND_URL}/api/auth/user`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
            withCredentials: true,
          });

          if (res.data) {
            setCurrentUser(res.data);
            console.log("✅ User fetched via Supabase token:", res.data);
            return;
          }
        }

        // 🔹 2. Try access token from localStorage
        let accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (accessToken) {
          try {
            console.log("🟠 Using stored access token for user fetch...");
            const res = await axios.get(`${BACKEND_URL}/api/auth/user`, {
              headers: { Authorization: `Bearer ${accessToken}` },
              withCredentials: true,
            });

            setCurrentUser(res.data);
            console.log("✅ User fetched via stored token:", res.data);
            return;
          } catch (err) {
            // 🔁 Token expired? Try refresh
            if (
              err.response?.status === 401 &&
              err.response?.data?.message === "Access token expired" &&
              refreshToken
            ) {
              console.warn("♻️ Access token expired — refreshing...");
              const refreshRes = await axios.post(
                `${BACKEND_URL}/api/auth/refresh`,
                { token: refreshToken }
              );

              accessToken = refreshRes.data.accessToken;
              localStorage.setItem("accessToken", accessToken);

              // Retry user fetch with new access token
              const res = await axios.get(`${BACKEND_URL}/api/auth/user`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
              });

              setCurrentUser(res.data);
              console.log("✅ User refreshed and fetched:", res.data);
              return;
            }

            throw err;
          }
        }

        // 🔹 3. Fallback: cookie-based API session
        console.warn(
          "⚠️ No active Supabase session or tokens. Checking backend cookie..."
        );
        const res = await axios.get(`${BACKEND_URL}/api/auth/user`, {
          withCredentials: true,
        });

        if (res.data) {
          setCurrentUser(res.data);
          console.log("✅ User fetched via API cookie:", res.data);
        } else {
          console.warn("⚠️ Backend returned no user data.");
          setCurrentUser(null);
        }
      } catch (err) {
        console.error(
          "❌ Error fetching user:",
          err.response?.data || err.message
        );
        setCurrentUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    }

    fetchUser();

    // 🔁 Listen for Supabase auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          console.log("🔁 Auth change detected — refreshing user info");
          await fetchUser();
        } else {
          setCurrentUser(null);
        }
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      await axios.post(
        `${BACKEND_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      toast.success("Logged out successfully");
      onLogout?.();
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar className="border-r border-border/50 bg-gradient-to-b from-background to-muted/20">
          {/* Header */}
          <SidebarHeader className="border-b border-border/50 p-6 flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h2 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                  WeEdit.Co{" "}
                </h2>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            </button>

            {/* Theme toggle */}
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch checked={isDark} onCheckedChange={onThemeToggle} />
              <Moon className="h-4 w-4" />
            </div>
          </SidebarHeader>

          {/* Content */}
          <SidebarContent className="p-4">
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.id} className="mb-2">
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className={`w-full justify-start p-3 h-auto transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-gradient-primary text-white shadow-lg scale-105"
                        : "hover:bg-muted hover:scale-102"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 mr-3 ${
                        activeTab === item.id
                          ? "text-white"
                          : "text-muted-foreground"
                      }`}
                    />
                    <div className="flex-1 text-left">
                      <div
                        className={`font-medium ${
                          activeTab === item.id
                            ? "text-white"
                            : "text-foreground"
                        }`}
                      >
                        {item.title}
                      </div>
                      <div
                        className={`text-xs ${
                          activeTab === item.id
                            ? "text-white"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <Separator className="my-6" />
          </SidebarContent>

          {/* Footer */}
          <SidebarFooter className="border-t border-border/50 p-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser?.avatar_url || ""} />
                <AvatarFallback className="bg-gradient-primary text-white text-sm">
                  {currentUser?.name?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {isLoadingUser
                    ? "Loading..."
                    : currentUser?.name || "Admin User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {isLoadingUser ? "Please wait..." : currentUser?.email || ""}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-red-500 hover:text-red-700"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-muted/20 to-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
