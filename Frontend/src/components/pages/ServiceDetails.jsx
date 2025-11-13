import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ArrowLeft, Clock, CheckCircle, Plus } from "lucide-react";
import { addons } from "../../data/mockData";
import { services } from "../../data/mockData";

export function ServiceDetails({ service, onBack, onAddToCart }) {
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("one-time"); // default plan

  // Get number of videos based on service
  const getPlanDescription = (plan) => {
    if (plan === "one-time") {
      // Just show the videos count from service.features[0]
      const match = service.features[0].match(/\d+/); // extract the number from string
      const numVideos = match ? match[0] : "";
      return `Perfect if you need a single batch of ${numVideos} edited videos (up to 1 minute each).`;
    }
    if (plan === "monthly") {
      const match = service.features[0].match(/\d+/);
      const numVideos = match ? match[0] : "";
      return `Ideal for creators who want fresh videos every month. You'll receive ${numVideos} videos every billing cycle.`;
    }
  };
  const totalPrice =
    service.price +
    selectedAddons.reduce((sum, addonName) => {
      const addon = addons.find((a) => a.name === addonName);
      return sum + (addon?.price || 0);
    }, 0);

  const handleAddonToggle = (addonName) => {
    setSelectedAddons((prev) =>
      prev.includes(addonName)
        ? prev.filter((name) => name !== addonName)
        : [...prev, addonName]
    );
  };

  const handleAddToCart = () => {
    onAddToCart({
      service,
      quantity: 1,
      plan: selectedPlan, // ✅ save the selected plan
      addons: selectedAddons,
    });
  };

  return (
    <div className="section-spacing">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={onBack} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Service Image */}
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src={service.thumbnail}
                alt={service.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-gradient-primary text-white">
                  {service.category}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose Your Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["one-time", "monthly"].map((plan) => (
                  <div
                    key={plan}
                    onClick={() => setSelectedPlan(plan)}
                    className={`relative rounded-lg overflow-hidden group cursor-pointer border p-6 shadow transition ${
                      selectedPlan === plan
                        ? "ring-2 ring-blue-500 bg-gradient-to-r from-blue-50 to-blue-100"
                        : "hover:shadow-lg"
                    }`}
                  >
                    <h4 className="text-lg font-medium">
                      {plan === "one-time"
                        ? "One-Time Purchase"
                        : "Monthly Subscription"}{" "}
                      {plan === "monthly" && (
                        <span className="text-sm font-semibold text-blue-600">
                          (Recommended)
                        </span>
                      )}
                    </h4>
                    <p className="text-2xl font-bold mt-2">
                      ${service.price}{" "}
                      {plan === "monthly" && (
                        <span className="text-base font-normal text-gray-500">
                          /month
                        </span>
                      )}
                    </p>
                    <p className="mt-4 text-gray-600">
                      {getPlanDescription(plan)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">{service.title}</h1>
              <p className="text-xl text-muted-foreground">
                {service.description}
              </p>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Delivery: {service.duration}
                  </span>
                </div>
                <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  ${service.price}
                </div>
              </div>
            </div>

            {/* Features */}
            <Card className="border border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>What's Included</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Add-ons */}
            <Card className="border border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-primary" />
                  <span>Optional Add-ons</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {addons.slice(0, 6).map((addon) => (
                    <div
                      key={addon.name}
                      className="flex items-center justify-between p-3 rounded-lg border border-white/10 hover:bg-surface-elevated transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedAddons.includes(addon.name)}
                          onCheckedChange={() => handleAddonToggle(addon.name)}
                        />
                        <div>
                          <p className="font-medium">{addon.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {addon.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">+${addon.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Summary */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Base Service Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg">
                      Base Service (
                      {selectedPlan === "one-time" ? "One-Time" : "Monthly"})
                    </span>
                    <span className="text-lg font-medium">
                      $
                      {selectedPlan === "one-time"
                        ? service.price
                        : service.price}
                      {selectedPlan === "monthly" && (
                        <span className="text-base font-normal text-gray-500">
                          /month
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Selected Add-ons */}
                  {selectedAddons.map((addonName) => {
                    const addon = addons.find((a) => a.name === addonName);
                    return (
                      <div
                        key={addonName}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {addon?.title}
                        </span>
                        <span className="text-muted-foreground">
                          +${addon?.price}
                        </span>
                      </div>
                    );
                  })}

                  {/* Total Price */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="bg-gradient-primary bg-clip-text text-transparent">
                        ${totalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    className="w-full mt-6 bg-gradient-primary text-white btn-hover-primary"
                    size="lg"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Guarantee */}
            <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-green-700 dark:text-green-300 mb-1">
                100% Satisfaction Guarantee
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                We'll revise your video until you're completely happy with the
                result.
              </p>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="section-spacing">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Our{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Process
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From concept to completion, here's how we bring your vision to
              life.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Upload & Brief",
                description: "Send us your footage and project requirements",
              },
              {
                step: "2",
                title: "Expert Editing",
                description:
                  "Our professionals work their magic on your content",
              },
              {
                step: "3",
                title: "Review & Refine",
                description: "Review the draft and request any changes needed",
              },
              {
                step: "4",
                title: "Final Delivery",
                description:
                  "Receive your polished video in your preferred format",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
