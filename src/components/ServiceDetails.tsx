import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, Clock, CheckCircle, Plus } from 'lucide-react';
import { Service, CartItem } from '../types';
import { addons } from '../data/mockData';

interface ServiceDetailsProps {
  service: Service;
  onBack: () => void;
  onAddToCart: (item: CartItem) => void;
}

export function ServiceDetails({ service, onBack, onAddToCart }: ServiceDetailsProps) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  
  const totalPrice = service.price + selectedAddons.reduce((sum, addonName) => {
    const addon = addons.find(a => a.name === addonName);
    return sum + (addon?.price || 0);
  }, 0);

  const handleAddonToggle = (addonName: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonName)
        ? prev.filter(name => name !== addonName)
        : [...prev, addonName]
    );
  };

  const handleAddToCart = () => {
    onAddToCart({
      service,
      quantity: 1,
      addons: selectedAddons
    });
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <Badge className="mb-4" variant="secondary">
                {service.category.charAt(0).toUpperCase() + service.category.slice(1)} Package
              </Badge>
              <h1 className="text-4xl mb-4">{service.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{service.description}</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">${service.price}</div>
                    <div className="text-sm text-muted-foreground">Base Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{service.duration}</div>
                    <div className="text-sm text-muted-foreground">Delivery Time</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">What's Included:</h3>
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="relative">
              <ImageWithFallback
                src={service.thumbnail || ''}
                alt={service.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Add-ons & Extras</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addons.map((addon) => (
                  <div key={addon.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedAddons.includes(addon.name)}
                        onCheckedChange={() => handleAddonToggle(addon.name)}
                      />
                      <div>
                        <div className="font-medium">{addon.name}</div>
                        <div className="text-sm text-muted-foreground">+${addon.price}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{service.title}</span>
                    <span>${service.price}</span>
                  </div>
                  {selectedAddons.map((addonName) => {
                    const addon = addons.find(a => a.name === addonName);
                    return addon ? (
                      <div key={addonName} className="flex justify-between text-sm text-muted-foreground">
                        <span>{addon.name}</span>
                        <span>+${addon.price}</span>
                      </div>
                    ) : null;
                  })}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Estimated delivery: {service.duration}</span>
                </div>

                <Button 
                  className="w-full bg-gradient-primary btn-hover-primary" 
                  size="lg" 
                  onClick={handleAddToCart}
                >
                  Add to Cart - ${totalPrice}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}