import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { ArrowLeft, Clock, CheckCircle, Plus } from "lucide-react";
import { addons } from "../../data/mockData";
import { MediaCarousel } from "../ui/MediaCarousel";

export function ServiceDetails({ service, onBack, onAddToCart }) {
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("one-time");

  // --- MANUAL SETTINGS ---
  const videoWidth = "200px";
  const videoHeight = "530px";
  const videoBorderRadius = "1.5rem";
  const horizontalGap = "20px"; // gap between video and service details
  const planCardPadding = "10px";
  const planSectionSpacing = "10px"; // vertical space between plan cards
  const planCardBorderRadius = "12px";

  const videoStyle = {
    width: videoWidth,
    height: videoHeight,
    borderRadius: videoBorderRadius,
    top: "80px",
  };

  // Plan descriptions
  const getPlanDescription = (plan) => {
    const match = service.features[0]?.match(/\d+/);
    const numVideos = match ? match[0] : "";

    if (plan === "one-time") {
      return `Perfect if you need a single batch of ${numVideos} edited videos (up to 1 minute each).`;
    }
    if (plan === "monthly") {
      return `Ideal for creators who want fresh videos. You'll receive ${numVideos} videos every month, spaced out weekly so you always have fresh content.`;
    }
  };

  // Total price
  const totalPrice =
    service.price +
    selectedAddons.reduce((sum, addonName) => {
      const addon = addons.find((a) => a.name === addonName);
      return sum + (addon?.price || 0);
    }, 0);

  // Handle add-on toggle
  const handleAddonToggle = (addonName) => {
    setSelectedAddons((prev) =>
      prev.includes(addonName)
        ? prev.filter((name) => name !== addonName)
        : [...prev, addonName]
    );
  };

  // Add to cart
  const handleAddToCart = () => {
    const cartItem = {
      service,
      quantity: 1,
      plan: selectedPlan,
      addons: selectedAddons,
      stripeMonthlyPriceId:
        selectedPlan === "monthly" ? service.stripeMonthlyPriceId : null,
    };
    onAddToCart(cartItem);
  };

  return (
    <div className="section-spacing">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>

        {/* ---------------- Top Row: Video + Service Details ---------------- */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
          {/* Video */}
          <div
            className="flex-shrink-0 bg-black shadow-2xl overflow-hidden border border-white/10 rounded-2xl mx-auto lg:mx-0"
            style={{
              width: "300px", // desktop width
              height: "500px",
              maxWidth: "100%", // responsive for smaller screens
              aspectRatio: "9/16", // portrait 9:16
            }}
          >
            <MediaCarousel
              items={
                service.videos && service.videos.length > 0
                  ? service.videos.map((video) => ({
                      type: "video",
                      src: video,
                      thumbnail: service.thumbnail,
                    }))
                  : [
                      {
                        type: "image",
                        src: service.thumbnail,
                        alt: service.title,
                      },
                    ]
              }
              className="w-full h-full"
            />
          </div>

          {/* Service Details + Plans */}
          <div className="flex-1 mt-6 lg:mt-0 flex flex-col gap-6">
            {/* Service Details */}
            <h1 className="text-4xl font-bold">{service.title}</h1>
            <p className="text-xl text-muted-foreground mt-2">
              {service.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 mt-4">
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

            {/* Features */}
            <Card className="mt-6 border border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
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

            {/* Plans Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Choose Your Plan</h3>
              <div className="flex flex-col md:flex-row md:space-x-6 gap-4">
                {["one-time", "monthly"].map((plan) => (
                  <div
                    key={plan}
                    onClick={() => setSelectedPlan(plan)}
                    style={{
                      borderRadius: planCardBorderRadius,
                      padding: planCardPadding,
                      minHeight: "150px",
                      width: "100%",
                      maxWidth: "450px",
                    }}
                    className={`cursor-pointer border shadow transition flex-shrink-0 ${
                      selectedPlan === plan
                        ? "ring-2 ring-blue-500 bg-gradient-primary text-white dark:bg-blue-800 dark:text-white dark:border-blue-400"
                        : "hover:shadow-lg dark:hover:bg-white/5"
                    }`}
                  >
                    <h4 className="text-lg font-medium">
                      {plan === "one-time"
                        ? "One-Time Purchase"
                        : "Monthly Subscription"}{" "}
                      {plan === "monthly" && (
                        <span className="text-sm font-semibold text-green-600">
                          (Recommended)
                        </span>
                      )}
                    </h4>
                    <p className="text-2xl font-bold mt-2">
                      ${service.price}{" "}
                      {plan === "monthly" && (
                        <span className="text-base font-normal text-white-500">
                          /month
                        </span>
                      )}
                    </p>
                    <p className="mt-2 text-gray-600 text-sm">
                      {getPlanDescription(plan)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Optional Add-ons Section ---------------- */}
        <div className="mt-12 flex flex-col gap-4">
          <Card className="border border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-sm mb-6">
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
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border border-white/10 hover:bg-surface-elevated transition-colors"
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
                    <div className="text-right mt-2 sm:mt-0">
                      <p className="font-medium">+${addon.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 mt-6">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <span className="text-lg">
                  Base Service (
                  {selectedPlan === "one-time" ? "One-Time" : "Monthly"})
                </span>
                <span className="text-lg font-medium">
                  ${service.price}
                  {selectedPlan === "monthly" && (
                    <span className="text-base font-normal text-gray-500">
                      /month
                    </span>
                  )}
                </span>
              </div>

              {selectedAddons.map((addonName) => {
                const addon = addons.find((a) => a.name === addonName);
                return (
                  <div key={addonName} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {addon?.title}
                    </span>
                    <span className="text-muted-foreground">
                      +${addon?.price}
                    </span>
                  </div>
                );
              })}

              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    ${totalPrice}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full mt-6 bg-gradient-primary text-white btn-hover-primary"
                size="lg"
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
