import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Check, Star } from "lucide-react";
import { services } from "../../data/mockData";

export function Pricing({ onSelectService }) {
  return (
    <section className="section-spacing relative overflow-hidden" id="pricing">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gradient-to-l from-purple-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="pattern-dots opacity-20 absolute inset-0"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl">
            Simple,{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect package for your video editing needs. All plans
            include professional quality and fast delivery.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={service.id}
              className={`relative transition-all duration-300 hover:shadow-xl h-full flex flex-col ${
                index === 1
                  ? "border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 shadow-2xl scale-105 ring-1 ring-blue-200/50 dark:ring-blue-400/20"
                  : "hover:scale-105 surface-elevated border border-white/20"
              }`}
            >
              {index === 1 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-secondary text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4 flex-shrink-0">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <p className="text-muted-foreground text-sm h-10 flex items-center justify-center">
                    {service.description}
                  </p>
                </div>
                <div className="pt-3">
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      ${service.price}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      / Package
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Delivery in {service.duration}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-2 flex-1">
                  {service.features.slice(0, 4).map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-start space-x-2"
                    >
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground leading-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => onSelectService(service)}
                  className={`w-full transition-all duration-300 mt-auto ${
                    index === 1
                      ? "bg-gradient-primary text-white btn-hover-primary"
                      : "btn-hover-secondary"
                  }`}
                  variant={index === 1 ? "default" : "outline"}
                >
                  Get Started
                </Button>

                <div className="text-center pt-2 border-t border-white/20">
                  <p className="text-xs text-muted-foreground">
                    ✓ 100% Satisfaction Guarantee
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional info - Reduced spacing */}
        <div className="text-center mt-12 space-y-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl mb-6">
              Why Choose{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Weeditco
              </span>
              ?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-2xl">⚡</div>
                <h4 className="font-semibold text-sm">Lightning Fast</h4>
                <p className="text-xs text-muted-foreground">
                  Most projects delivered within 24-48 hours
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">🎨</div>
                <h4 className="font-semibold text-sm">Professional Quality</h4>
                <p className="text-xs text-muted-foreground">
                  Edited by professionals with 5+ years experience
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">🔄</div>
                <h4 className="font-semibold text-sm">Unlimited Revisions</h4>
                <p className="text-xs text-muted-foreground">
                  We work until you're 100% satisfied
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
