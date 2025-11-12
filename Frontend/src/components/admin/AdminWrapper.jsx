import { useState } from "react";
import { AdminAuth } from "./AdminAuth";
import { AdminLayout } from "./AdminLayout";
import { AdminDashboard } from "../pages/AdminDashboard";

export function AdminWrapper({ onBack, isDark, onThemeToggle }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setActiveTab("overview");
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  if (!isAuthenticated) {
    return <AdminAuth onLogin={handleLogin} />;
  }

  return (
    <AdminLayout
      user={user}
      onLogout={handleLogout}
      onBack={onBack}
      isDark={isDark}
      onThemeToggle={onThemeToggle}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      <AdminDashboard activeTab={activeTab} onTabChange={handleTabChange} />
    </AdminLayout>
  );
}
