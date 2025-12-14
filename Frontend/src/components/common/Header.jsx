import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ShoppingCart, Menu, X, Clock, Settings } from "lucide-react";

export function Header({ currentPage, onPageChange, cartCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "contact", label: "Contact Us" },
    { id: "about", label: "About" },
  ];

  // 🔐 Reveal Admin only when pressing CTRL + SHIFT + A
  useEffect(() => {
    function handleKey(e) {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        setShowAdmin(true);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleNavClick = (pageId) => {
    onPageChange(pageId);
    setMobileMenuOpen(false);
  };

  // 🚫 Don't render header if on admin page
  if (currentPage === "admin") return null;

  return (
    <header className="sticky top-0 z-50 border-b bg-[#D8D2C2] dark:bg-[#0F0F0F]/70 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => handleNavClick("home")}
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <img
                src="/assets/Business Logo.png"
                alt="WeEditCo Logo"
                className="h-10 w-auto"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
              WeEdit Co
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                onClick={() => handleNavClick(item.id)}
                className={`relative transition-all duration-300 ${
                  currentPage === item.id
                    ? "bg-gradient-primary text-white"
                    : "hover:bg-surface-elevated btn-hover-secondary"
                }`}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavClick("cart")}
              className="relative btn-hover-accent"
            >
              <div className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gradient-accent text-white text-xs">
                    {cartCount}
                  </Badge>
                )}
              </div>
            </Button>

            {/* ⏱ Orders Icon (Mobile only) */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavClick("orders")}
              className={`relative btn-hover-accent md:hidden ${
                currentPage === "orders" ? "bg-gradient-primary text-white" : ""
              }`}
            >
              <Clock className="h-4 w-4" />
            </Button>

            {/* Orders (Desktop) */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavClick("orders")}
              className={`hidden md:flex btn-hover-accent ${
                currentPage === "orders" ? "bg-gradient-primary text-white" : ""
              }`}
            >
              <Clock className="h-4 w-4 mr-1" />
              History
            </Button>

            {/* 🔐 Admin (Desktop only) */}
            {showAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavClick("admin")}
                className="hidden md:flex btn-hover-accent"
              >
                <Settings className="h-4 w-4 mr-1" />
                Admin
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-1 py-4">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => handleNavClick(item.id)}
                  className="justify-start"
                >
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
