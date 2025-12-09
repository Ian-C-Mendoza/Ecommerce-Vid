import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import { services } from "../../data/mockData"; // ✅ import services from mockData

export function Footer({ onSelectService }) {
  return (
    <footer className="relative overflow-hidden">
      {/* Enhanced footer background */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-950/20 dark:to-purple-950/20 absolute inset-0"></div>
        <div className="pattern-dots opacity-10 absolute inset-0"></div>
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-400/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="border-t border-white/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="bg-gradient-primary rounded-lg p-2 shadow-lg">
                  <div className="w-6 h-6 bg-white rounded shadow-sm"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  WeEdit Co.
                </span>
              </div>
              <p className="text-muted-foreground">
                Professional video editing services that bring your vision to
                life. Fast, reliable, and creative solutions for all your video
                needs.
              </p>
              <div className="flex space-x-2">
                <a
                  href="https://www.instagram.com/we.editco/?igsh=b3N6ZnJkb2dwaXZ3#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-surface-elevated"
                  >
                    <Instagram className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="font-semibold">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {services.map((service) => (
                  <li
                    key={service.id}
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={() => onSelectService(service)}
                  >
                    {service.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li
                  className="hover:text-foreground transition-colors cursor-pointer"
                  onClick={() => {
                    const section = document.getElementById("services");
                    if (section)
                      section.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                >
                  Pricing
                </li>
                <li
                  className="hover:text-foreground transition-colors cursor-pointer"
                  onClick={() => {
                    const section = document.getElementById("contact");
                    if (section)
                      section.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                >
                  FAQ
                </li>
                <li
                  className="hover:text-foreground transition-colors cursor-pointer"
                  onClick={() => {
                    const section = document.getElementById("home");
                    if (section)
                      section.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                >
                  Blog
                </li>
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div className="space-y-4">
              <h3 className="font-semibold">Get in Touch</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>management@weeditco.network</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (323) 238-2758</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Your Address Here</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-white/10" />

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Weeditco. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <span className="hover:text-foreground transition-colors cursor-pointer">
                Privacy Policy
              </span>
              <span className="hover:text-foreground transition-colors cursor-pointer">
                Terms of Service
              </span>
              <span className="hover:text-foreground transition-colors cursor-pointer">
                Cookie Policy
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
