import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function OrderHistory({ onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    async function fetchOrders() {
      try {
        let accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!accessToken && !refreshToken) {
          console.warn("⚠️ No tokens found — user not signed in.");
          setLoading(false);
          return;
        }

        // ✅ Step 1: Fetch user using access token
        let userRes = await fetch(`${BACKEND_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        // 🔁 If unauthorized, try refresh
        if (userRes.status === 401 && refreshToken) {
          console.warn("♻️ Access token expired — refreshing...");
          const refreshRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: refreshToken }),
          });

          if (!refreshRes.ok) throw new Error("Failed to refresh token");

          const refreshData = await refreshRes.json();
          accessToken = refreshData.accessToken;
          localStorage.setItem("accessToken", accessToken);

          // Retry fetching user after refresh
          userRes = await fetch(`${BACKEND_URL}/api/auth/user`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        }

        if (!userRes.ok) throw new Error("Unauthorized or invalid token");

        const user = await userRes.json();
        console.log("✅ Logged-in user:", user);

        // ✅ Step 2: Fetch order history using updated token
        const orderRes = await fetch(
          `${BACKEND_URL}/api/orders/history/${user.id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!orderRes.ok) throw new Error(`Server returned ${orderRes.status}`);

        const data = await orderRes.json();
        setOrders(data.orders || []);
        console.log("📦 Orders fetched successfully:", data.orders);
      } catch (err) {
        console.error("❌ Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading)
    return (
      <p className="text-center py-10 text-muted-foreground">
        Loading your orders...
      </p>
    );

  if (orders.length === 0)
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-2">No orders found</h2>
        <p className="text-muted-foreground mb-4">
          You haven’t purchased anything yet.
        </p>
        <Button onClick={onBack} className="bg-gradient-primary text-white">
          Go Back
        </Button>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">📦 Order History</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 bg-card hover:bg-muted/50 transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Order #{order.id}</h2>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  order.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : order.status === "In Progress"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mb-2">
              {order.services?.map((s, i) => (
                <div key={i}>
                  <p className="text-sm font-medium">
                    🎞️ {s.service?.title || "Unknown Service"} — ₱{s.price}
                  </p>
                  {s.addons?.length > 0 && (
                    <ul className="text-xs text-muted-foreground list-disc pl-5">
                      {s.addons.map((addon, idx) => (
                        <li key={idx}>
                          {addon.addon_name} — ₱{addon.price}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground mb-1">
              💳 Payment: {order.payment_method} ({order.payment_status})
            </p>
            <p className="text-sm font-semibold text-foreground">
              💰 Total: ₱{order.total}
            </p>
            <p className="text-xs text-muted-foreground">
              📅 Date: {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button
          onClick={onBack}
          className="bg-gradient-primary text-white px-6 py-2"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
