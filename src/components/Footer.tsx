import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
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
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-primary rounded-lg p-2 shadow-lg">
                  <div className="w-6 h-6 bg-white rounded shadow-sm"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">ReelWorks</span>
              </div>
            <p className="text-muted-foreground">
              Professional video editing services that bring your vision to life. Fast, reliable, and creative solutions for all your video needs.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-500/20 hover:scale-110 transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-cyan-500/20 hover:scale-110 transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-pink-500/20 hover:scale-110 transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-500/20 hover:scale-110 transition-all duration-300">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">Services</h3>
            <div className="space-y-2 text-sm">
              <div><Button variant="ghost" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground">Basic Video Editing</Button></div>
              <div><Button variant="ghost" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground">Advanced Editing</Button></div>
              <div><Button variant="ghost" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground">Motion Graphics</Button></div>
              <div><Button variant="ghost" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground">Color Grading</Button></div>
              <div><Button variant="ghost" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground">Audio Mixing</Button></div>
              <div><Button variant="ghost" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground">Custom Animations</Button></div>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <div className="space-y-2 text-sm">
              <div><Button variant="ghost" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground">Help Center</Button></div>
              <div><Button variant="ghost" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground">Contact Us</Button></div>
              <div><Button variant="ghost" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground">FAQ</Button></div>
              <div><Button variant="ghost" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground">Privacy Policy</Button></div>
              <div><Button variant="ghost" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground">Terms of Service</Button></div>
              <div><Button variant="ghost" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground">Refund Policy</Button></div>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Get in Touch</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>hello@videoeditpro.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>New York, NY</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Stay Updated</h4>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Your email" 
                  className="text-sm h-8"
                />
                <Button size="sm" className="h-8 bg-gradient-primary btn-hover-primary">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get the latest updates and special offers
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 VideoEdit Pro. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Button variant="ghost" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground">
              Privacy
            </Button>
            <Button variant="ghost" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground">
              Terms
            </Button>
            <Button variant="ghost" className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground">
              Cookies
            </Button>
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
}