import { useState } from "react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Moon, Sun, ShoppingCart, Menu, X, Clock } from "lucide-react";

export function Header({
  currentPage,
  onPageChange,
  isDark,
  onThemeToggle,
  cartCount,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "admin", label: "Admin" },
  ];

  const handleNavClick = (pageId) => {
    onPageChange(pageId);
    setMobileMenuOpen(false);
  };

  // 🚫 Don’t render header at all if on Admin page
  if (currentPage === "admin") {
    return null;
  }

  return (
    <header
      className="sticky top-0 z-50 border-b 
                 bg-[#D8D2C2] dark:bg-[#0F0F0F]/70 
                 backdrop-blur-lg shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => handleNavClick("home")}
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <img
                src="/assets/Business Logo.png" // path to your logo in public folder
                alt="WeEditCo Logo" // accessibility text
                className="h-10 w-auto" // adjust size with Tailwind classes
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
                {currentPage === item.id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-secondary rounded-full" />
                )}
              </Button>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Theme toggle */}
            {/* < div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-elevated transition-colors">
              <Sun className="h-4 w-4" />
              <Switch checked={isDark} onCheckedChange={onThemeToggle} />
              <Moon className="h-4 w-4" />
            </div>*/}

            {/* Cart button */}
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

            {/* Mobile menu button */}
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
                  className={`justify-start transition-all duration-300 ${
                    currentPage === item.id
                      ? "bg-gradient-primary text-white"
                      : "hover:bg-surface-elevated"
                  }`}
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
