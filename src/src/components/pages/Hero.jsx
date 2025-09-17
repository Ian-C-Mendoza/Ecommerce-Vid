import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Play, Star, CheckCircle } from 'lucide-react';

export function Hero({ onGetStarted }) {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Enhanced background with patterns and effects */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/10 dark:via-transparent dark:to-purple-950/10 absolute inset-0"></div>
        <div className="pattern-grid opacity-20 absolute inset-0"></div>
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-transparent rounded-full blur-3xl floating"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-l from-purple-400/10 to-transparent rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-br from-pink-400/10 to-transparent rounded-full blur-3xl floating" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-lg">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-white text-white" />
                  ))}
                </div>
                <span className="text-muted-foreground">Rated 5.0 by 500+ clients</span>
              </div>
              <h1 className="text-4xl lg:text-6xl tracking-tight font:Times new roman"  
                style={{ fontFamily: '"Times New Roman", serif' }}
                >
                Professional Video Editing
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Made Simple</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Transform your raw footage into stunning, professional videos that captivate your audience and drive results.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-3">
              {[
                'Lightning-fast 24-48 hour delivery',
                'Professional editors with 5+ years experience',
                'Unlimited revisions until you\'re satisfied'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-gradient-primary text-white btn-hover-primary btn-pulse"
              >
                Get Started Today
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/20 hover:border-primary/50 btn-hover-secondary"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">500+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">24h</div>
                  <div className="text-sm text-muted-foreground">Avg. Delivery</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Main hero image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1625961332635-3d18bbad67fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGVkaXRpbmclMjB3b3Jrc3BhY2UlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU3MTY4Mzc1fDA&ixlib=rb-4.1.0&q=80&w=600"
                alt="Professional video editing workspace"
                className="w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Play button overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button 
                  size="lg" 
                  className="bg-white/90 hover:bg-white text-black rounded-full w-16 h-16 p-0"
                >
                  <Play className="w-6 h-6 ml-1" />
                </Button>
              </div>

              {/* Floating elements */}
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Editing</span>
                </div>
              </div>
            </div>

            {/* Floating testimonial card */}
            <div className="absolute -bottom-4 -left-4 bg-white/95 dark:bg-black/95 backdrop-blur-sm p-4 rounded-lg shadow-xl max-w-xs border border-white/20">
              <div className="flex items-center space-x-3">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1494790108755-2616b612d9fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFufGVufDF8fHx8MTc1NzI1OTAzNXww&ixlib=rb-4.1.0&q=80&w=150"
                  alt="Client testimonial"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">"Exceptional quality!"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}