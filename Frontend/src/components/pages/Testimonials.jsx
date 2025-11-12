import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Star } from "lucide-react";
import { testimonials } from "../../data/mockData";

export function Testimonials() {
  const [allTestimonials, setAllTestimonials] = useState([]);

  // Load admin-managed testimonials from localStorage
  useEffect(() => {
    const savedTestimonials = localStorage.getItem("adminTestimonials");
    const adminTestimonials = savedTestimonials
      ? JSON.parse(savedTestimonials)
      : [];
    // Combine admin testimonials with default ones, admin testimonials first
    setAllTestimonials([...adminTestimonials, ...testimonials]);
  }, []);

  return (
    <section className="section-spacing relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-gradient-to-br from-slate-50/50 via-transparent to-blue-50/50 dark:from-slate-950/20 dark:via-transparent dark:to-blue-950/20 absolute inset-0"></div>
        <div className="pattern-grid opacity-10 absolute inset-0"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-gradient-to-l from-pink-400/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl">
            What Our{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Clients Say
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients
            have to say about working with us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {allTestimonials.slice(0, 6).map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="hover:shadow-xl transition-all duration-300 surface-elevated border border-white/20 hover:scale-105"
            >
              <CardContent className="p-6 space-y-4">
                {/* Rating stars */}
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Testimonial content */}
                <p className="text-muted-foreground italic leading-relaxed text-sm">
                  "{testimonial.content}"
                </p>

                {/* Client info - Text only */}
                <div className="pt-3 border-t border-white/20">
                  <p className="font-semibold text-sm">
                    {testimonial.name || testimonial.users?.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional social proof */}
        <div className="text-center mt-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center opacity-60">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-sm text-muted-foreground">
                  Happy Clients
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  5000+
                </div>
                <div className="text-sm text-muted-foreground">
                  Videos Edited
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  98%
                </div>
                <div className="text-sm text-muted-foreground">
                  Satisfaction Rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  24h
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg Delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
