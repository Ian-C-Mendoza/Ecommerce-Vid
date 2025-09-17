import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../../../components/ui/sidebar";
import {
  ArrowLeft,
  BarChart3,
  Package,
  Users,
  Settings,
  PlusCircle,
  MessageSquare,
  TrendingUp,
  Shield,
  LogOut,
  User,
  Bell,
  Moon,
  Sun,
  Menu,
  Home,
  Calendar,
  FileText,
  Star,
  Video,
} from "lucide-react";
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
    title: "Customers",
    icon: Users,
    id: "customers",
    description: "Customer management",
  },
  {
    title: "Services",
    icon: Settings,
    id: "services",
    description: "Manage service offerings",
  },
  {
    title: "Portfolio",
    icon: Video,
    id: "portfolio",
    description: "Showcase your work",
  },
  {
    title: "Testimonials",
    icon: Star,
    id: "testimonials",
    description: "Customer feedback",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    id: "analytics",
    description: "Detailed business insights",
  },
];

export function AdminLayout({
  user,
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

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    toast.success("Logged out successfully");
    onLogout();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar className="border-r border-border/50 bg-gradient-to-b from-background to-muted/20">
          <SidebarHeader className="border-b border-border/50 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                  ReelWorks
                </h2>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
          </SidebarHeader>

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
                            ? "text-white/80"
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

            {/* Quick Stats */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground px-3">
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    24
                  </div>
                  <div className="text-xs text-blue-600/80 dark:text-blue-400/80">
                    Active Orders
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-950/50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    $12.5k
                  </div>
                  <div className="text-xs text-green-600/80 dark:text-green-400/80">
                    This Month
                  </div>
                </div>
              </div>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-border/50 p-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100" />
                <AvatarFallback className="bg-gradient-primary text-white text-sm">
                  {user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </SidebarTrigger>

                <Button
                  variant="ghost"
                  onClick={onBack}
                  className="hidden lg:flex"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Site
                </Button>

                <Separator
                  orientation="vertical"
                  className="h-6 hidden lg:block"
                />

                <div className="hidden lg:block">
                  <h1 className="text-xl font-semibold">
                    {sidebarItems.find((item) => item.id === activeTab)
                      ?.title || "Dashboard"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {
                      sidebarItems.find((item) => item.id === activeTab)
                        ?.description
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center bg-red-500">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex items-start space-x-3 p-3"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            notification.unread ? "bg-blue-500" : "bg-muted"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme Toggle */}
                <Button variant="ghost" size="sm" onClick={onThemeToggle}>
                  {isDark ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100" />
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {user?.name?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">
                          {user?.name || "Admin User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Preferences
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-muted/20 to-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
