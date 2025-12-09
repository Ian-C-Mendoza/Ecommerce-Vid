import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { CreditCard } from "lucide-react";
import ClientAuth from "../admin/ClientAuth";
import { addons as HARDCODED_ADDONS } from "../../data/mockData";

const BACKEND_URL = "http://localhost:5000";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function Checkout({
  cartItems,
  setCartItems,
  total,
  onBack,
  onSelectService,
}) {
  const navigate = useNavigate();

  const [step, setStep] = useState("details");
  const [user, setUser] = useState(null);
  const [billing, setBilling] = useState({
    phone: "",
    address: "",
    company: "",
    communication: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [authOpen, setAuthOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [loadingClientSecret, setLoadingClientSecret] = useState(false);

  // Fetch current user
  const fetchUser = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken) return setStep("auth");

      let res = await fetch(`${BACKEND_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.status === 401 && refreshToken) {
        const refreshRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: refreshToken }),
        });
        const { accessToken: newAccessToken } = await refreshRes.json();
        localStorage.setItem("accessToken", newAccessToken);
        accessToken = newAccessToken;

        res = await fetch(`${BACKEND_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setUser(data);
      setStep("details");
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
      setStep("auth");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && cartItems?.length) setSelectedService(cartItems[0]);
  }, [user, cartItems]);

  // Fetch clientSecret for both one-time and monthly payments
  useEffect(() => {
    const fetchClientSecret = async () => {
      if (!user || !selectedService || paymentMethod !== "card") return;

      setLoadingClientSecret(true);
      try {
        const route =
          selectedService.plan === "monthly"
            ? "create-subscription"
            : "create-payment-intent";

        const body =
          selectedService.plan === "monthly"
            ? {
                email: user.email,
                priceId: selectedService.stripeMonthlyPriceId,
              }
            : {
                amount: total * 100,
                email: user.email,
              };

        const res = await fetch(`${BACKEND_URL}/api/payment/${route}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (data.error) throw new Error(data.error);

        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Error fetching client secret:", err);
        setClientSecret("");
      } finally {
        setLoadingClientSecret(false);
      }
    };

    if (step === "payment") fetchClientSecret();
  }, [step, paymentMethod, selectedService, total, user]);

  // Place order after successful payment
  const handleCheckoutAfterPayment = async () => {
    if (!user) return;

    const payload = {
      user_id: user.id,
      total,
      payment_method: "credit_card",
      payment_status: "paid",
      status: "processing",
      billing,
      customer: user.email,
      cartItems: cartItems.map((item) => ({
        quantity: item.quantity,
        plan: item.plan,
        service_code: item.service.id,
        service_key: item.service.key,
        title: item.service.title,
        price: item.plan === "one-time" ? item.service.price : undefined,
        stripePriceId:
          item.plan === "monthly" ? item.stripeMonthlyPriceId : undefined,
        addons: (item.addons || []).map((addonName) => {
          const matched = HARDCODED_ADDONS.find((a) => a.name === addonName);
          return {
            name: addonName,
            title: matched?.title || addonName,
            price: matched?.price || 0,
          };
        }),
      })),
    };

    const response = await fetch(`${BACKEND_URL}/api/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (response.ok) {
      setCartItems([]);
      localStorage.removeItem("cart");
      setStep("success");
    } else {
      alert(`Failed to place order: ${result.error || JSON.stringify(result)}`);
    }
  };

  const handleNonCardPayment = async () => {
    if (!user) return alert("You must be logged in to place an order.");

    const payload = {
      user_id: user.id,
      total,
      payment_method: paymentMethod,
      payment_status: "unpaid",
      status: "processing",
      billing,
      customer: user.email,
      cartItems: cartItems.map((item) => ({
        quantity: item.quantity,
        plan: item.plan,
        service_code: item.service.id,
        service_key: item.service.key,
        title: item.service.title,
        price: item.plan === "one-time" ? item.service.price : undefined,
        stripePriceId:
          item.plan === "monthly" ? item.stripeMonthlyPriceId : undefined,
        addons: (item.addons || []).map((addonName) => {
          const matched = HARDCODED_ADDONS.find((a) => a.name === addonName);
          return {
            name: addonName,
            title: matched?.title || addonName,
            price: matched?.price || 0,
          };
        }),
      })),
    };

    const response = await fetch(`${BACKEND_URL}/api/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (response.ok) {
      setCartItems([]);
      localStorage.removeItem("cart");
      setStep("success");
    } else {
      alert(`Failed to place order: ${result.error || JSON.stringify(result)}`);
    }
  };

  const handleAuthRequired = () => setAuthOpen(true);
  const handleAuthSuccess = async () => {
    await fetchUser();
    setAuthOpen(false);
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-md">
        {step !== "success" && (
          <Button variant="ghost" onClick={onBack} className="mb-6">
            ← Back to Cart
          </Button>
        )}

        <Card className="border shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Auth Step */}
            {step === "auth" && (
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 text-center px-4 py-3 rounded-md shadow-md mb-6">
                <h6 className="text-sm font-semibold">
                  👋 Welcome! Please login or register to continue
                </h6>

                <ClientAuth onSuccess={handleAuthSuccess} />
              </div>
            )}

            {/* Details Step */}
            {step === "details" && user && (
              <div className="space-y-6">
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={billing.phone}
                    onChange={(e) =>
                      setBilling({ ...billing, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex gap-4 mt-2">
                  {["Email", "WhatsApp", "iMessage"].map((method) => {
                    const isSelected = billing.communication === method;
                    return (
                      <div
                        key={method}
                        onClick={() =>
                          setBilling({ ...billing, communication: method })
                        }
                        className={`cursor-pointer flex-1 rounded-xl p-4 text-center border transition-all flex flex-col items-center justify-center gap-2
          ${
            isSelected
              ? "bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg text-white dark:text-gray-100"
              : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400"
          }`}
                      >
                        <span className="font-semibold">{method}</span>
                        {isSelected && (
                          <span className="mt-1 font-bold text-white dark:text-gray-100">
                            ✔
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Button
                  onClick={() => setStep("payment")}
                  className="w-full bg-gradient-primary text-white mt-4"
                >
                  Continue to Payment
                </Button>
              </div>
            )}

            {/* Payment Step */}
            {step === "payment" && user && (
              <div className="space-y-6">
                <h3 className="font-semibold">Select Payment Method</h3>
                <div className="flex flex-col space-y-3">
                  {["card"].map((method) => (
                    <label
                      key={method}
                      className={`p-4 border rounded-lg cursor-pointer ${
                        paymentMethod === method
                          ? "border-primary"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="hidden"
                      />
                      <span className="capitalize">{method}</span>
                    </label>
                  ))}
                </div>

                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${total}</span>
                </div>

                {/* Stripe Payment */}
                {paymentMethod === "card" &&
                  selectedService &&
                  clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <StripePaymentForm
                        onOneTimeSuccess={handleCheckoutAfterPayment}
                        onSubscriptionSuccess={() => setStep("success")}
                        userEmail={user?.email}
                        selectedService={selectedService}
                        BACKEND_URL={BACKEND_URL}
                      />
                    </Elements>
                  )}

                {/* Non-card Payment */}
                {paymentMethod !== "card" && (
                  <Button
                    onClick={handleNonCardPayment}
                    className="w-full bg-gradient-primary text-white"
                    size="lg"
                  >
                    <CreditCard className="w-4 h-4 mr-2" /> Pay & Place Order
                  </Button>
                )}
              </div>
            )}

            {/* Success Step */}
            {step === "success" && (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-green-600">
                  🎉 Thank you for your purchase!
                </h2>
                <p className="text-gray-600">
                  Your order has been placed successfully. We appreciate your
                  business!
                </p>
                <Button
                  className="w-full bg-gradient-primary text-white"
                  onClick={onSelectService}
                >
                  Make Another Purchase
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ================= StripePaymentForm =================
function StripePaymentForm({
  onOneTimeSuccess,
  onSubscriptionSuccess,
  userEmail,
  selectedService,
  BACKEND_URL,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    try {
      // ============================
      // 🌙 MONTHLY SUBSCRIPTION FLOW
      // ============================
      if (selectedService.plan === "monthly") {
        const { setupIntent, error } = await stripe.confirmSetup({
          elements,
          confirmParams: { return_url: window.location.href },
          redirect: "if_required",
        });

        if (error) {
          setMessage(error.message);
        } else {
          console.log("✅ SetupIntent confirmed:", setupIntent.id);

          // Send payment method to backend to create Stripe subscription
          const res = await fetch(
            `${BACKEND_URL}/api/payment/create-subscription`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: userEmail,
                priceId: selectedService.stripeMonthlyPriceId,
                paymentMethodId: setupIntent.payment_method,
              }),
            }
          );

          const data = await res.json();

          if (data.error) {
            setMessage(data.error);
          } else {
            console.log("🎉 Subscription created:", data.subscriptionId);

            // ⭐ IMPORTANT ⭐
            // Monthly subscriptions should NOT create an order
            onSubscriptionSuccess();
          }
        }

        setLoading(false);
        return; // stop here to avoid running one-time logic
      }

      // ============================
      // 💵 ONE-TIME PAYMENT FLOW
      // ============================
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.href },
        redirect: "if_required",
      });

      if (error) {
        setMessage(error.message);
      } else {
        // One-time purchases create an order
        onOneTimeSuccess();
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong during payment.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-gradient-primary text-white"
      >
        {loading ? "Processing..." : "Pay Now"}
      </Button>

      {message && <p className="text-center text-sm mt-2">{message}</p>}
    </form>
  );
}
