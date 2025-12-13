import { useEffect, useState } from "react";
import {
  Package,
  Calendar,
  CreditCard,
  ChevronLeft,
  Clock,
  CheckCircle,
  XCircle,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { SubscriptionCancel } from "../modals/SubscriptionCancel";

// --- UI Components ---

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1";

  const variants = {
    primary: "bg-primary text-primary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "bg-background text-foreground border border-border",
    ghost: "bg-transparent text-foreground",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
const Badge = ({ status }) => {
  const colorMap = {
    Completed: ["#22c55e", "#ffffff", "var(--border)"], // green
    active: ["#22c55e", "#ffffff", "var(--border)"], // green
    "In Progress": [
      "var(--primary)",
      "var(--primary-foreground)",
      "var(--border)",
    ],
    Cancelled: [
      "var(--destructive)",
      "var(--destructive-foreground)",
      "var(--border)",
    ],
    Pending: [
      "var(--secondary)",
      "var(--secondary-foreground)",
      "var(--border)",
    ],
    default: ["var(--muted)", "var(--muted-foreground)", "var(--border)"],
  };

  const [bg, fg, border] = colorMap[status] || colorMap.default;

  let Icon = Clock;
  if (status === "Completed" || status === "active") Icon = CheckCircle;
  if (status === "Cancelled") Icon = XCircle;

  // Add pulsing animation for green badges
  const pulseClass =
    status === "Completed" || status === "active" ? "animate-pulse" : "";

  return (
    <span
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${pulseClass}`}
      style={{ backgroundColor: bg, color: fg, borderColor: border }}
    >
      <Icon size={12} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// --- Main Component ---

export function OrderHistory({ onBack }) {
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  const BACKEND_URL = "https://we-edit-co.onrender.com";

  useEffect(() => {
    async function fetchHistory() {
      try {
        let accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!accessToken && !refreshToken) {
          setLoading(false);
          return;
        }

        let userRes = await fetch(`${BACKEND_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (userRes.status === 401 && refreshToken) {
          const newToken = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: refreshToken }),
          });
          const tokenData = await newToken.json();
          accessToken = tokenData.accessToken;
          localStorage.setItem("accessToken", accessToken);

          userRes = await fetch(`${BACKEND_URL}/api/auth/user`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        }

        if (!userRes.ok) throw new Error("Unauthorized");
        const user = await userRes.json();

        const hisRes = await fetch(
          `${BACKEND_URL}/api/orders/history/${user.id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!hisRes.ok) throw new Error("Failed to load history");

        const data = await hisRes.json();

        const formattedOrders = (data.orders || []).map((order) => ({
          ...order,
          order_items: order.order_items.map((item) => ({
            ...item,
            total_price: item.price * item.quantity,
          })),
        }));
        setOrders(formattedOrders);

        const formattedSubs = (data.subscriptions || []).map((sub) => ({
          id: sub.id,
          plan: sub.plan || "Unknown Plan",
          status: sub.status || "Unknown",
          start_date: sub.start_date || null,
          next_billing: sub.next_billing || null,
        }));
        setSubscriptions(formattedSubs);
      } catch (err) {
        console.error("❌ History load error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  async function handleCancel(subId) {
    try {
      const confirmCancel = window.confirm("Cancel this subscription?");
      if (!confirmCancel) return;

      const res = await fetch(
        `${BACKEND_URL}/api/payment/cancel-subscription/${subId}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to cancel subscription.");
        return;
      }

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subId
            ? { ...sub, status: "canceled", next_billing: data.nextBilling }
            : sub
        )
      );

      alert("Subscription canceled successfully.");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while canceling.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4 bg-background dark:bg-gray-900 text-foreground dark:text-white">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="font-medium">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#D8D2C2] dark:bg-[#0F0F0F]/70text-foreground dark:text-white font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button
              onClick={onBack}
              className="flex items-center text-sm hover:opacity-80 transition mb-2"
            >
              <ChevronLeft size={16} className="mr-1" /> Back
            </button>
            <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
            <p className="mt-1 text-muted-foreground dark:text-gray-300">
              View your past purchases and subscriptions.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 p-1 rounded-xl bg-muted/30 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200/40 dark:border-gray-700/40 mb-8 w-fit">
          {["orders", "subscriptions"].map((tab) => {
            const active = activeTab === tab;
            const isSub = tab === "subscriptions";

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
          px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 border relative
          ${
            active
              ? `
                scale-[1.05]
                text-white
                ${
                  isSub
                    ? "bg-blue-600 dark:bg-blue-500"
                    : "bg-blue-600 dark:bg-blue-500"
                }
                shadow-md
              `
              : `
                bg-transparent
                text-gray-700 dark:text-gray-300
                hover:bg-white/10 dark:hover:bg-gray-900/40
              `
          }
        `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Orders Empty */}
          {activeTab === "orders" && orders.length === 0 && (
            <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card dark:bg-gray-800">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-surface-elevated dark:bg-gray-700">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-lg font-semibold">No orders yet</h3>
              <p className="mb-6 max-w-sm mx-auto">
                Looks like you haven't made any purchases yet.
              </p>
              <Button onClick={onBack}>Go Back</Button>
            </div>
          )}

          {/* Orders List */}
          {activeTab === "orders" &&
            orders.map((order) => {
              // Determine highlight color based on status
              let highlightColor;
              switch (order.status.toLowerCase()) {
                case "completed":
                case "paid":
                  highlightColor = "rgba(34,197,94,0.3)"; // green
                  break;
                case "pending":
                case "processing":
                  highlightColor = "rgba(250, 204, 21, 0.84)"; // yellow
                  break;
                case "failed":
                case "cancelled":
                  highlightColor = "rgba(239,68,68,0.3)"; // red
                  break;
                default:
                  highlightColor = "rgba(255, 255, 255, 0.95)"; // neutral
              }

              return (
                <div
                  key={order.id}
                  className={`
          rounded-2xl p-6 border border-gray-200/50 bg-white/70 backdrop-blur-md
          shadow-lg hover:shadow-2xl transition-all duration-300
          dark:border-gray-700/50 dark:bg-gray-800/70
        `}
                  style={{
                    // Dark mode highlight
                    ...(typeof window !== "undefined" &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches
                      ? { boxShadow: `0 0 20px ${highlightColor}` }
                      : {}),
                  }}
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-300/30 dark:border-gray-600/30 pb-4 mb-4 gap-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-lg text-foreground dark:text-white">
                          Order #{order.id}
                        </span>
                        <Badge status={order.status} />
                      </div>
                      <span className="text-sm text-muted-foreground dark:text-gray-300 flex items-center gap-1">
                        <Calendar size={14} /> {formatDate(order.created_at)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground dark:text-gray-300">
                        Total Amount
                      </p>
                      <p className="font-bold text-xl text-foreground dark:text-white">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {order.order_items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-2 px-3 rounded-lg 
                bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm 
                shadow-sm border border-gray-200/30 dark:border-gray-700/30"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center 
                  bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm shadow"
                          >
                            <Package
                              size={20}
                              className="text-foreground dark:text-white"
                            />
                          </div>
                          <div>
                            <p className="text-foreground dark:text-white">
                              {item.title}
                            </p>
                            <p className="text-xs text-muted-foreground dark:text-gray-300">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-foreground dark:text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-300/30 dark:border-gray-600/30 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-3">
                    <div className="flex items-center gap-2 text-foreground dark:text-white">
                      <CreditCard size={16} />
                      <span>
                        {order.payment_method} <span className="mx-1">•</span>{" "}
                        {order.payment_status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Subscriptions Empty */}
          {activeTab === "subscriptions" && subscriptions.length === 0 && (
            <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card dark:bg-gray-800">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-surface-elevated dark:bg-gray-700">
                <RefreshCw size={28} />
              </div>
              <h3 className="text-lg font-semibold">No active subscriptions</h3>
              <p>You are not subscribed to any plans.</p>
            </div>
          )}

          {/* Subscriptions List */}
          {activeTab === "subscriptions" &&
            subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 
                 shadow-lg hover:shadow-2xl transition-all bg-white/70 dark:bg-gray-800/70 
                 backdrop-blur-md"
              >
                {/* Top accent bar */}
                <div className="h-2" style={{ background: "var(--primary)" }} />

                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-foreground dark:text-white">
                        {sub.plan}
                      </h3>
                      <p className="text-sm text-muted-foreground dark:text-gray-300 mt-1">
                        ID: {sub.id}
                      </p>
                    </div>
                    <Badge status={sub.status} />
                  </div>

                  {/* Dates */}
                  <div
                    className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-white/30 dark:bg-gray-900/30 
                        backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30"
                  >
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider mb-1 text-muted-foreground dark:text-gray-300">
                        Started On
                      </p>
                      <p className="font-semibold flex items-center gap-2 text-foreground dark:text-white">
                        <Calendar size={14} /> {formatDate(sub.start_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider mb-1 text-muted-foreground dark:text-gray-300">
                        Next Billing
                      </p>
                      <p className="font-semibold flex items-center gap-2 text-foreground dark:text-white">
                        <Clock size={14} /> {formatDate(sub.next_billing)}
                      </p>
                    </div>
                  </div>
                  {/* Action Button */}
                  <div className="mt-6">
                    {sub.status === "active" ? (
                      <SubscriptionCancel
                        subId={sub.id}
                        onCancel={(subId, nextBilling) => {
                          // Update subscriptions state after cancel
                          setSubscriptions((prev) =>
                            prev.map((s) =>
                              s.id === subId
                                ? {
                                    ...s,
                                    status: "canceled",
                                    next_billing: nextBilling,
                                  }
                                : s
                            )
                          );
                        }}
                      />
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        Subscription Ended
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
