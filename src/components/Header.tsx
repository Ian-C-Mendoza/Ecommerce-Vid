import { useState } from "react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Moon, Sun, ShoppingCart, Menu, X } from "lucide-react";

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  cartCount: number;
}

export function Header({
  currentPage,
  onPageChange,
  isDark,
  onThemeToggle,
  cartCount,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Portfolio" },
    { id: "about", label: "About" },
    { id: "admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b glass backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-primary rounded-lg p-2 shadow-lg">
              <div className="w-6 h-6 bg-white rounded shadow-sm"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">ReelWorks</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={
                  currentPage === item.id ? "default" : "ghost"
                }
                onClick={() => onPageChange(item.id)}
                className={`relative ${
                  currentPage === item.id 
                    ? "bg-gradient-primary text-white shadow-lg btn-hover-primary" 
                    : "btn-hover-secondary"
                }`}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={isDark}
                onCheckedChange={onThemeToggle}
              />
              <Moon className="h-4 w-4" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange("cart")}
              className="relative btn-hover-secondary"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange("cart")}
              className="relative btn-hover-secondary"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
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
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={
                    currentPage === item.id
                      ? "default"
                      : "ghost"
                  }
                  onClick={() => {
                    onPageChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`justify-start ${
                    currentPage === item.id 
                      ? "bg-gradient-primary btn-hover-primary" 
                      : "btn-hover-secondary"
                  }`}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <span className="text-sm">Theme</span>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch
                  checked={isDark}
                  onCheckedChange={onThemeToggle}
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}