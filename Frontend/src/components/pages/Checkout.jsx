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
import ClientAuthModal from "../auth/ClientAuthModal";
import { addons as HARDCODED_ADDONS } from "../../data/mockData"; // or wherever it's defined

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
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [authOpen, setAuthOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [selectedService, setSelectedService] = useState([]);

  // ✅ Fetch logged-in user with new token setup
  const fetchUser = async () => {
    try {
      let accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken) {
        setUser(null);
        setStep("auth");
        return;
      }

      // Try fetching user
      let res = await fetch(`${BACKEND_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // If 401, try refreshing the access token
      if (res.status === 401 && refreshToken) {
        const refreshRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: refreshToken }),
        });

        if (!refreshRes.ok) throw new Error("Refresh token failed");

        const { accessToken: newAccessToken } = await refreshRes.json();
        localStorage.setItem("accessToken", newAccessToken);
        accessToken = newAccessToken;

        // Retry fetching user with new token
        res = await fetch(`${BACKEND_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setUser(data);
      setStep("details");
    } catch (err) {
      console.error("❌ Failed to fetch user:", err);
      setUser(null);
      setStep("auth");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Create Stripe payment intent when moving to payment step
  useEffect(() => {
    if (step === "payment" && paymentMethod === "card" && user) {
      const totalAmountInCents = Math.round(total * 100);

      fetch(`${BACKEND_URL}/api/payment/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmountInCents,
          email: user.email, // ✅ Send user's email to backend
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          //console.log("Client Secret:", data.clientSecret);
          setClientSecret(data.clientSecret);
        })
        .catch((err) =>
          console.error("❌ Error creating payment intent:", err)
        );
    }
  }, [step, paymentMethod, total, user]);

  const handleAuthRequired = () => setAuthOpen(true);
  const handleAuthSuccess = async () => {
    await fetchUser();
    setAuthOpen(false);
  };

  async function handleCheckout() {
    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }

    let payment_method = "credit_card";
    if (paymentMethod === "paypal") payment_method = "paypal";
    else if (paymentMethod === "bank") payment_method = "bank_transfer";

    const payment_status = payment_method === "credit_card" ? "paid" : "unpaid";

    console.log("🧩 Cart items before checkout:", cartItems);

    const response = await fetch(`${BACKEND_URL}/api/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        total,
        payment_method,
        payment_status,
        status: "processing",
        billing,
        cartItems: cartItems.map((item) => ({
          quantity: item.quantity,
          price: item.service.price,
          service_code: item.service.id,
          service_key: item.service.key,
          title: item.service.title,
          addons: (item.addons || []).map((addonName) => {
            // Look up from mock data
            const matched = HARDCODED_ADDONS.find((a) => a.name === addonName);
            return {
              name: addonName,
              title: matched?.title || addonName,
              price: matched?.price || 0,
            };
          }),
        })),
        customer: user.email,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("✅ Order created:", result);
      setCartItems([]);
      localStorage.removeItem("cart");
      setStep("success");
    } else {
      console.error("❌ Order creation failed:", result);
      alert(`❌ Failed to place order: ${result.error}`);
    }
  }

  function handleNonCardPayment() {
    handleCheckout(); // For paypal / gcash / bank_transfer
  }

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
            {step === "auth" && (
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  You need an account to continue checkout.
                </p>
                <Button
                  className="bg-gradient-primary text-white"
                  onClick={handleAuthRequired}
                >
                  Login / Register
                </Button>
              </div>
            )}

            {step === "details" && user && (
              <div className="space-y-6">
                {/* Phone */}
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

                {/* Preferred Communication */}
                <div>
                  <Label>Preferred Way of Communication</Label>
                  <div className="flex gap-4 mt-2">
                    {[
                      {
                        method: "Email",
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 8H3V8h18v8z"
                            />
                          </svg>
                        ),
                      },
                      {
                        method: "WhatsApp",
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-green-500"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.868-2.031-.967-.273-.099-.472-.148-.671.15-.198.297-.767.967-.941 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.654-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.074-.149-.671-1.611-.92-2.205-.242-.579-.487-.5-.671-.51l-.573-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z" />
                          </svg>
                        ),
                      },
                      {
                        method: "iMessage",
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M2 2v20l4-4h16V2H2zm16 9h-8v-2h8v2zm0-4h-8V5h8v2zm-10 0H4V5h4v2zm0 4H4v-2h4v2z" />
                          </svg>
                        ),
                      },
                    ].map(({ method, icon }) => {
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
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg text-Green"
                    : "bg-white text-gray-800 border-gray-300 hover:border-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:border-gray-400"
                }
              `}
                        >
                          {icon}
                          <span className="font-semibold">{method}</span>
                          {isSelected && (
                            <span className="mt-1 font-bold text-white">✔</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button
                  onClick={() => setStep("payment")}
                  className="w-full bg-gradient-primary text-white mt-4"
                >
                  Continue to Payment
                </Button>
              </div>
            )}

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

                {paymentMethod === "card" && clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripePaymentForm onSuccess={handleCheckout} />
                  </Elements>
                )}

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
                  onClick={onSelectService} // Redirect to homepage
                >
                  Make Another Purchase
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ClientAuthModal
        open={authOpen}
        onClose={setAuthOpen}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

function StripePaymentForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("✅ Payment successful!");
      onSuccess(); // triggers order placement and success step
    } else {
      setMessage("Processing payment...");
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

      {message && (
        <p className="text-center text-sm text-gray-600 mt-2">{message}</p>
      )}
    </form>
  );
}
