import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Play, Star, CheckCircle } from "lucide-react";
import { MediaCarousel } from "../ui/MediaCarousel";

export function Hero({ onGetStarted }) {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Animated hexagon background */}
      <div className="absolute inset-0 -z-10"></div>

      {/* Base gradient/background */}
      <div className="absolute inset-0 bg-[var(--background)] dark:bg-transparent">
        {/* Light background */}
        <div className="absolute inset-0 bg-[#FAF7F0] dark:hidden" />

        {/* Dark gradient */}
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-blue-950/10 via-transparent to-purple-950/10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-lg">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-white text-white" />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  Rated 5.0 by 500+ clients
                </span>
              </div>

              {/* Hero heading */}
              <h1 className="text-4xl lg:text-6xl tracking-tight font-redhat font-extrabold">
                Your Vision. Our Precision.{" "}
                <span
                  className="bg-gradient-primary bg-clip-text text-transparent"
                  style={{
                    fontFamily: '"Times New Roman", serif',
                    fontWeight: 700,
                  }}
                >
                  {" "}
                  Zero Burnout.{" "}
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg">
                WeEditCo helps busy entrepreneurs and creators stay consistent
                online without the editing stress. Let WeEdit Co. handle the
                editing grind while you focus on what really moves the needle.
                We bring the polish, pacing, and presence that make your videos
                shine.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-3">
              {[
                "We care about your brand as much as you do",
                " Consistent, high-quality edits that ",
                "Reliable turnaround within 48-72 hours",
                "Consultation meetings to align with your brand style and goals Schedule a free brand consultation meeting",
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-gradient-primary text-white btn-hover-primary btn-pulse"
              >
                Get Started Today
              </Button>
              <a
                href="https://calendly.com/management-weeditco/weedit-co-free-brand-consultation-meeting?month=2025-11"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/20 hover:border-primary/50 btn-hover-secondary"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Schedule a Free Brand Consultation Meeting
                </Button>
              </a>
            </div>

            {/* Social proof */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                    500+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Happy Clients
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                    24h
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg. Delivery
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                    98%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Satisfaction
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative max-w-4xl mx-auto">
            <div className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] overflow-hidden rounded-2xl">
              <MediaCarousel
                items={[
                  {
                    type: "video",
                    src: "/assets/COMPANY EDIT.mp4",
                    thumbnail: "/videos/intro-thumbnail.jpg",
                  },
                  {
                    type: "video",
                    src: "/assets/CLOSING 1.mp4",
                    thumbnail: "/videos/intro-thumbnail.jpg",
                  },
                  {
                    type: "video",
                    src: "/assets/CLOSING 2.mp4",
                    thumbnail: "/videos/intro-thumbnail.jpg",
                  },
                  {
                    type: "video",
                    src: "/assets/PROPERTY TOUR 1.mp4",
                    thumbnail: "/videos/intro-thumbnail.jpg",
                  },
                  {
                    type: "video",
                    src: "/assets/PROPERTY TOUR 2 (2).mp4",
                    thumbnail: "/videos/intro-thumbnail.jpg",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
