import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  CreditCard,
  Shield,
  Clock,
} from "lucide-react";
import { addons } from "../../data/mockData";

export function Cart({
  cartItems,
  onBack,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) {
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  // Subtotal calculates each item based on its plan and addons
  const subtotal = cartItems.reduce((sum, item) => {
    if (!item.service) return sum;

    const addonsCost = (item.addons || []).reduce((addonSum, addonName) => {
      const addon = addons.find((a) => a.name === addonName);
      return addonSum + (addon?.price || 0);
    }, 0);

    // Monthly price is same as service.price here; Stripe subscription handled separately
    const planPrice =
      item.plan === "monthly" ? item.service.price : item.service.price;

    return sum + (planPrice + addonsCost) * item.quantity;
  }, 0);

  const discount = isPromoApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setIsPromoApplied(true);
    }
  };

  const handleCheckout = () => {
    // Pass full cart with plan info to backend / checkout
    onCheckout(cartItems);
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={onBack} className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-2">Your Cart is Empty</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Add some services to get started.
            </p>
            <Button
              onClick={onBack}
              size="lg"
              className="bg-gradient-primary text-white btn-hover-primary"
            >
              Browse Services
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={onBack} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <Badge variant="secondary">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </Badge>
            </div>

            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <Card
                  key={index}
                  className="border border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={item.service.thumbnail}
                          alt={item.service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {item.service.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {item.service.description}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {item.service.category}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              Plan:{" "}
                              <span className="text-blue-600">
                                {item.plan === "monthly"
                                  ? "Monthly Subscription"
                                  : "One-Time Purchase"}
                              </span>
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveItem(index)}
                            className="hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </Button>
                        </div>

                        {/* Add-ons */}
                        {item.addons.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Add-ons:</p>
                            <div className="flex flex-wrap gap-2">
                              {item.addons.map((addonName) => {
                                const addon = addons.find(
                                  (a) => a.name === addonName
                                );
                                return (
                                  <Badge
                                    key={addonName}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {addon?.title} (+${addon?.price})
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                onUpdateQuantity(index, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                onUpdateQuantity(index, item.quantity + 1)
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-semibold">
                              $
                              {((item.plan === "monthly"
                                ? item.service.price
                                : item.service.price) +
                                item.addons.reduce((sum, addonName) => {
                                  const addon = addons.find(
                                    (a) => a.name === addonName
                                  );
                                  return sum + (addon?.price || 0);
                                }, 0)) *
                                item.quantity}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ${item.service.price} × {item.quantity}
                              {item.addons.length > 0 && " + add-ons"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>

                {isPromoApplied && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span>-${discount}</span>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    ${total}
                  </span>
                </div>

                {/* Promo Code */}
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={isPromoApplied}
                    />
                    <Button
                      variant="outline"
                      onClick={handlePromoCode}
                      disabled={isPromoApplied}
                      className="btn-hover-secondary"
                    >
                      Apply
                    </Button>
                  </div>
                  {isPromoApplied && (
                    <p className="text-sm text-green-600">
                      Promo code applied successfully!
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-primary text-white btn-hover-primary"
                  size="lg"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>

            {/* Security & Guarantees */}
            <Card className="border border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>100% Secure Checkout</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Fast Delivery Guaranteed</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
