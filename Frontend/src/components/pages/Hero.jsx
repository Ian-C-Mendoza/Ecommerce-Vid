import { Button } from "../ui/button";
import { Play, Star, CheckCircle } from "lucide-react";
import { MediaCarousel } from "../ui/MediaCarousel";

export function Hero({ onGetStarted }) {
  return (
    <section className="relative py-12 lg:py-20 overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#FAF7F0] dark:hidden" />
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-blue-950/10 via-transparent to-purple-950/10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Flex container: mobile column, desktop row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-16">
          {/* Text container */}
          <div className="w-full lg:w-1/2 backdrop-blur-lg bg-white/20 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl p-6 sm:p-8 lg:p-12 max-w-full">
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-lg">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-white text-white" />
                ))}
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Your Vision. Our Precision.{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent font-serif font-bold">
                Zero Burnout.
              </span>
            </h1>

            {/* Paragraph */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-6">
              WeEditCo helps busy entrepreneurs and creators stay consistent
              online without the editing stress. Let WeEdit Co. handle the
              editing grind while you focus on what really moves the needle.
            </p>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {[
                "We care about your brand as much as you do",
                "Consistent, high-quality edits that elevate your content",
                "Reliable turnaround within 48-72 hours",
                "Consultation meetings to align with your brand style and goals",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3">
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
                  className="border-2 border-white/20 hover:border-primary/50 btn-hover-secondary flex items-center justify-center  text-xs"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Schedule a Free Brand Consultation
                </Button>
              </a>
            </div>
          </div>

          {/* Video container with 9:16 aspect ratio */}
          <div
            className="flex-shrink-0 rounded-2xl bg-black shadow-2xl border border-white/10 ring-1 ring-black/5 overflow-hidden mx-auto lg:mx-0"
            style={{
              width: "300px", // adjusts for mobile
              maxWidth: "100%",
              aspectRatio: "9/16", // portrait 9:16
            }}
          >
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
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
