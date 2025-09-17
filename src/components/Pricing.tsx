import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Check, Star } from 'lucide-react';
import { services } from '../data/mockData';
import { Service } from '../types';

interface PricingProps {
  onSelectService: (service: Service) => void;
}

export function Pricing({ onSelectService }: PricingProps) {
  return (
    <section className="py-20 relative overflow-hidden" id="pricing">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gradient-to-l from-purple-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="pattern-dots opacity-20 absolute inset-0"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl">
            Simple, <span className="bg-gradient-primary bg-clip-text text-transparent">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect package for your video editing needs. All plans include professional quality and fast delivery.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={service.id} 
              className={`relative transition-all duration-300 hover:shadow-xl ${
                index === 1 
                  ? 'border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 shadow-2xl scale-105 ring-1 ring-blue-200/50 dark:ring-blue-400/20' 
                  : 'hover:scale-105 surface-elevated border border-white/20'
              }`}
            >
              {index === 1 && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-secondary text-white shadow-lg">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold">${service.price}</div>
                  <div className="text-muted-foreground">Delivery: {service.duration}</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-center text-muted-foreground">{service.description}</p>
                
                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <Button 
                    className={`w-full ${
                      index === 1 
                        ? 'bg-gradient-primary btn-hover-primary' 
                        : 'border-2 glass btn-hover-secondary'
                    }`}
                    variant={index === 1 ? 'default' : 'outline'}
                    onClick={() => onSelectService(service)}
                  >
                    Order Now
                  </Button>
                </div>

                {index === 1 && (
                  <div className="flex items-center justify-center space-x-1 pt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">Most chosen by clients</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">Need something custom?</p>
          <Button 
            variant="ghost" 
            size="lg"
            className="glass border border-white/20 btn-hover-accent"
          >
            Contact us for a custom quote
          </Button>
        </div>
      </div>
    </section>
  );
}