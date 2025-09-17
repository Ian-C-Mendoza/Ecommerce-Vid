import { useState } from "react";
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Moon, Sun, ShoppingCart, Menu, X } from "lucide-react";

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
    { id: "portfolio", label: "Portfolio" },
    { id: "about", label: "About" },
    { id: "admin", label: "Admin" },
  ];

  const handleNavClick = (pageId) => {
    onPageChange(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => handleNavClick("home")}
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
              ReelWorks
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
            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-elevated transition-colors">
              <Sun className="h-4 w-4" />
              <Switch checked={isDark} onCheckedChange={onThemeToggle} />
              <Moon className="h-4 w-4" />
            </div>

            {/* Cart button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavClick("cart")}
              className="relative btn-hover-accent"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gradient-accent text-white text-xs">
                  {cartCount}
                </Badge>
              )}
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