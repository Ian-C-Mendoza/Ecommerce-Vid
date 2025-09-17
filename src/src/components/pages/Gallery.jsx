import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Play, ExternalLink } from 'lucide-react';
import { portfolioItems } from '../../data/mockData';

export function Gallery({ onViewPortfolio }) {
  const [allPortfolioItems, setAllPortfolioItems] = useState([]);

  // Load admin-uploaded portfolio items from localStorage
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('adminPortfolioItems');
    const adminItems = savedPortfolio ? JSON.parse(savedPortfolio) : [];
    // Combine admin items with default portfolio items, admin items first
    setAllPortfolioItems([...adminItems, ...portfolioItems]);
  }, []);

  const featuredItems = allPortfolioItems.slice(0, 6);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/10 dark:via-transparent dark:to-purple-950/10 absolute inset-0"></div>
        <div className="pattern-grid opacity-20 absolute inset-0"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-cyan-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-l from-purple-400/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl">
            Recent Work <span className="bg-gradient-secondary bg-clip-text text-transparent">Showcase</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our latest video editing projects and see the quality we deliver to our clients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredItems.map((item, index) => (
            <Card 
              key={item.id} 
              className="group cursor-pointer hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-sm"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-3">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="rounded-full bg-white/90 hover:bg-white text-black backdrop-blur-sm"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="rounded-full bg-white/90 hover:bg-white text-black backdrop-blur-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <Badge 
                      variant="secondary" 
                      className="bg-black/70 text-white backdrop-blur-sm border-white/20"
                    >
                      {item.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6 space-y-3 bg-gradient-to-br from-white/80 to-white/60 dark:from-black/80 dark:to-black/60 backdrop-blur-sm">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/20">
                    <span className="text-sm text-muted-foreground">{item.client}</span>
                    <span className="text-xs bg-gradient-accent bg-clip-text text-transparent font-medium">
                      View Project
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={onViewPortfolio}
            size="lg"
            className="bg-gradient-primary text-white btn-hover-primary"
          >
            View Complete Portfolio
          </Button>
        </div>
      </div>
    </section>
  );
}