import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Play, Star, CheckCircle } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
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
              <h1 className="text-4xl lg:text-6xl tracking-tight">
                Professional Video Editing
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Made Simple</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Transform your raw footage into stunning, professional videos that captivate your audience and drive results.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Fast delivery (24-48 hours)</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Unlimited revisions</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Professional quality</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={onGetStarted} 
                className="text-lg px-8 bg-gradient-primary btn-hover-primary btn-pulse shadow-lg relative z-10"
              >
                Get Started Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 glass border-2 btn-hover-secondary relative z-10"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Portfolio
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t">
              <div className="text-center">
                <div className="text-2xl">500+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">24h</div>
                <div className="text-sm text-muted-foreground">Average Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">100%</div>
                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 surface-elevated rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1625961332635-3d18bbad67fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGVkaXRpbmclMjB3b3Jrc3BhY2UlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU3MTY4Mzc1fDA&ixlib=rb-4.1.0&q=80&w=600"
                alt="Professional video editing workspace"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-center justify-center">
                <Button 
                  size="lg" 
                  className="rounded-full p-6 bg-gradient-primary btn-hover-primary shadow-2xl"
                >
                  <Play className="w-8 h-8 ml-1 text-white" />
                </Button>
              </div>
            </div>
            
            {/* Enhanced floating elements */}
            <div className="absolute -top-4 -right-4 bg-gradient-secondary rounded-full p-4 shadow-lg floating">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 glass rounded-lg p-4 shadow-lg border border-white/20">
              <div className="text-sm text-muted-foreground">Latest Project</div>
              <div className="font-medium bg-gradient-accent bg-clip-text text-transparent">Corporate Video</div>
            </div>
            
            {/* Additional floating accents */}
            <div className="absolute top-1/2 -left-8 w-4 h-4 bg-gradient-accent rounded-full floating opacity-60"></div>
            <div className="absolute top-1/4 -right-8 w-6 h-6 bg-gradient-secondary rounded-full floating opacity-40" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 -right-12 w-3 h-3 bg-gradient-primary rounded-full floating opacity-50" style={{ animationDelay: '4s' }}></div>
          </div>
        </div>
      </div>

      {/* Enhanced background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-blue-400/20 via-purple-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-400/15 via-blue-400/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-transparent via-blue-400/5 to-transparent rounded-full blur-3xl"></div>
        
        {/* Subtle geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 border border-blue-400/20 rounded-lg rotate-45"></div>
        <div className="absolute bottom-32 right-20 w-16 h-16 bg-gradient-accent/10 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 border-2 border-purple-400/20 rounded-full"></div>
      </div>
    </section>
  );
}