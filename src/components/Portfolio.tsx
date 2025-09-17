import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PortfolioModal } from './PortfolioModal';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, Play, ExternalLink, Search, Filter, Grid, List, ChevronDown } from 'lucide-react';
import { portfolioItems } from '../data/mockData';
import { PortfolioItem } from '../types';

interface PortfolioProps {
  onBack: () => void;
}

export function Portfolio({ onBack }: PortfolioProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [allPortfolioItems, setAllPortfolioItems] = useState<PortfolioItem[]>([]);

  // Load admin-uploaded portfolio items from localStorage
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('adminPortfolioItems');
    const adminItems = savedPortfolio ? JSON.parse(savedPortfolio) : [];
    // Combine admin items with default portfolio items, admin items first
    setAllPortfolioItems([...adminItems, ...portfolioItems]);
  }, []);

  const categories = ['all', ...new Set(allPortfolioItems.map(item => item.category))];

  const filteredItems = allPortfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.id.localeCompare(a.id);
      case 'oldest':
        return a.id.localeCompare(b.id);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'client':
        return a.client.localeCompare(b.client);
      default:
        return 0;
    }
  });

  const handleItemClick = (item: PortfolioItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handlePlayVideo = () => {
    alert('Video player would open here in a real application');
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-4xl mb-2">Our Portfolio</h1>
                <p className="text-xl text-muted-foreground">
                  Explore our complete collection of video editing projects
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="client">Client A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'masonry' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('masonry')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All Projects' : category}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {sortedItems.length} of {allPortfolioItems.length} projects</span>
              <span>Updated recently</span>
            </div>
          </div>
        </div>

        {sortedItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No projects found matching your criteria.</p>
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSortBy('newest');
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' 
              : 'columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8'
          }`}>
            {sortedItems.map((item, index) => (
              <Card 
                key={item.id} 
                className={`group cursor-pointer hover:shadow-xl transition-all duration-300 ${
                  viewMode === 'masonry' ? 'break-inside-avoid mb-8' : ''
                }`}
                onClick={() => handleItemClick(item)}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <ImageWithFallback
                      src={item.thumbnail}
                      alt={item.title}
                      className={`w-full object-cover transition-transform duration-300 group-hover:scale-110 ${
                        viewMode === 'grid' ? 'h-56' : `h-${48 + (index % 3) * 16}`
                      }`}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex space-x-3">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayVideo();
                          }}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open('#', '_blank');
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 right-4 flex justify-between">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {item.category}
                      </Badge>
                      <Badge variant="outline" className="bg-white/90 text-black">
                        2:30
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Client</p>
                        <p className="font-medium">{item.client}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-auto p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <PortfolioModal
          item={selectedItem}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
          }}
          onPlayVideo={handlePlayVideo}
        />

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Ready to start your own project?
          </p>
          <Button size="lg" onClick={onBack}>
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
}