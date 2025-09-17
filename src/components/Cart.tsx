import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, Trash2, CreditCard, Shield } from 'lucide-react';
import { CartItem } from '../types';
import { addons } from '../data/mockData';

interface CartProps {
  cartItems: CartItem[];
  onBack: () => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export function Cart({ cartItems, onBack, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const subtotal = cartItems.reduce((sum, item) => {
    const addonsCost = item.addons.reduce((addonSum, addonName) => {
      const addon = addons.find(a => a.name === addonName);
      return addonSum + (addon?.price || 0);
    }, 0);
    return sum + (item.service.price + addonsCost) * item.quantity;
  }, 0);

  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // In a real app, this would process the payment
    alert('Order placed successfully! You will receive a confirmation email shortly.');
    onCheckout();
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Button variant="ghost" onClick={onBack} className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-2xl">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Browse our services and add them to your cart to get started.
            </p>
            <Button onClick={onBack}>Browse Services</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
          <h1 className="text-3xl">Cart & Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Cart Items */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex space-x-4">
                      <ImageWithFallback
                        src={item.service.thumbnail || ''}
                        alt={item.service.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{item.service.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {item.service.category}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveItem(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`quantity-${index}`} className="text-sm">Qty:</Label>
                            <Input
                              id={`quantity-${index}`}
                              type="number"
                              value={item.quantity}
                              onChange={(e) => onUpdateQuantity(index, parseInt(e.target.value) || 1)}
                              min="1"
                              className="w-16 h-8"
                            />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${item.service.price} base price
                          </div>
                        </div>

                        {item.addons.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Add-ons:</div>
                            {item.addons.map((addonName) => {
                              const addon = addons.find(a => a.name === addonName);
                              return addon ? (
                                <div key={addonName} className="text-xs text-muted-foreground flex justify-between">
                                  <span>• {addon.name}</span>
                                  <span>+${addon.price}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    {index < cartItems.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({...prev, name: e.target.value}))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({...prev, email: e.target.value}))}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({...prev, phone: e.target.value}))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo(prev => ({...prev, cardNumber: e.target.value}))}
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => setPaymentInfo(prev => ({...prev, expiryDate: e.target.value}))}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo(prev => ({...prev, cvv: e.target.value}))}
                      placeholder="123"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    value={paymentInfo.cardholderName}
                    onChange={(e) => setPaymentInfo(prev => ({...prev, cardholderName: e.target.value}))}
                    placeholder="John Doe"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Secure payment processing</span>
                </div>

                <Button 
                  className="w-full bg-gradient-primary btn-hover-primary" 
                  size="lg" 
                  onClick={handleCheckout}
                >
                  Complete Order - ${total.toFixed(2)}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}