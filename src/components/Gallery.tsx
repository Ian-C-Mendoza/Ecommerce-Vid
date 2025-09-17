import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Play, ExternalLink } from 'lucide-react';
import { portfolioItems } from '../data/mockData';
import { PortfolioItem } from '../types';

interface GalleryProps {
  onViewPortfolio: () => void;
}

export function Gallery({ onViewPortfolio }: GalleryProps) {
  const [allPortfolioItems, setAllPortfolioItems] = useState<PortfolioItem[]>([]);

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
          {featuredItems.map((item) => (
            <Card key={item.id} className="group cursor-pointer hover:shadow-2xl transition-all duration-500 surface-elevated border border-white/20 hover:border-blue-400/30">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="flex space-x-3">
                      <Button size="sm" className="rounded-full bg-gradient-primary hover:scale-110 transition-all duration-300">
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="rounded-full glass hover:scale-110 transition-all duration-300">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Badge className="absolute top-3 left-3 bg-gradient-accent" variant="secondary">
                    {item.category}
                  </Badge>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Client: {item.client}</span>
                    <Button size="sm" variant="ghost" className="p-0 h-auto">
                      View Project
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            onClick={onViewPortfolio} 
            className="bg-gradient-primary btn-hover-primary"
          >
            View Full Portfolio
          </Button>
        </div>
      </div>
    </section>
  );
}