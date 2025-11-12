import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Play, ExternalLink, X } from "lucide-react";
import { portfolioItems } from "../../data/mockData";

export function Gallery({ onViewPortfolio }) {
  const [allPortfolioItems, setAllPortfolioItems] = useState([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const navigate = useNavigate();

  // Load admin-uploaded portfolio items from localStorage
  useEffect(() => {
    try {
      const savedPortfolio = localStorage.getItem("adminPortfolioItems");
      const adminItems = savedPortfolio ? JSON.parse(savedPortfolio) : [];
      setAllPortfolioItems([...adminItems, ...portfolioItems]);
    } catch {
      setAllPortfolioItems([...portfolioItems]);
    }
  }, []);

  const featuredItems = allPortfolioItems.slice(0, 6);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Recent Work{" "}
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Showcase
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our latest video editing projects and see the quality we
            deliver to our clients.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredItems.map((item) => (
            <Card
              key={item.id}
              className="group glass-card cursor-pointer hover:shadow-2xl transition-all duration-500 overflow-hidden"
              onClick={() => navigate(`/portfolio/${item.id}`)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0
                               bg-black/40
                               opacity-0 group-hover:opacity-100
                               transition-opacity duration-300
                               flex items-center justify-center"
                  >
                    <div className="flex space-x-3">
                      {/* ▶️ Play Button */}
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full glass"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveVideo(
                            item.videoUrl || "/assets/PROPERTY_TOUR_1.mp4"
                          ); // ✅ correct path

                          setShowPlayer(true);
                        }}
                        aria-label="Play"
                      >
                        <Play className="w-4 h-4" />
                      </Button>

                      {/* 🌐 External Link */}
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full glass"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(item.videoUrl || "#", "_blank");
                        }}
                        aria-label="Open externally"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant="secondary"
                      className="glass border border-white/20"
                    >
                      {item.category}
                    </Badge>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 space-y-3 glass">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm line-clamp-2 text-white/80">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/20">
                    <span className="text-sm text-white/70">{item.client}</span>
                    <span className="text-xs bg-gradient-accent bg-clip-text text-transparent font-medium">
                      View Project
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={onViewPortfolio}
            size="lg"
            className="
              px-8 py-3 
              !bg-white !text-black hover:!bg-gray-100
              dark:!bg-gray-900 dark:!text-white dark:hover:!bg-gray-800
              font-semibold 
              shadow-md hover:shadow-lg 
              transition-all duration-300
              border border-gray-300 dark:border-gray-700
            "
          >
            View Complete Portfolio
          </Button>
        </div>
      </div>

      {/* 🎥 Video Player Modal */}
      {showPlayer && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowPlayer(false)} // click outside closes modal
        >
          <div
            className="relative w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-5xl bg-black rounded-2xl overflow-hidden shadow-lg aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ❌ Close Button */}
            <button
              onClick={() => setShowPlayer(false)}
              className="absolute top-3 right-3 text-white z-10 hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 🎬 Responsive Video */}
            <video
              controls
              autoPlay
              className="w-full h-full object-contain bg-black rounded-2xl"
            >
              <source src={activeVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
