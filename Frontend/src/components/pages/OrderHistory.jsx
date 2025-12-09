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
    primary: {
      backgroundColor: "var(--primary-solid)",
      color: "var(--primary-foreground)",
    },
    destructive: {
      backgroundColor: "var(--destructive)",
      color: "var(--destructive-foreground)",
    },
    outline: {
      backgroundColor: "var(--background)",
      color: "var(--foreground)",
      border: "1px solid var(--border)",
    },
    ghost: { backgroundColor: "transparent", color: "var(--foreground)" },
  };

  return (
    <button
      className={baseStyle + " " + className}
      style={variants[variant]}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ status }) => {
  const colorMap = {
    Completed: ["var(--accent)", "var(--accent-foreground)", "var(--border)"],
    active: ["var(--accent)", "var(--accent-foreground)", "var(--border)"],
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

  return (
    <span
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
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

  //const BACKEND_URL = "http://localhost:5000";
  const BACKEND_URL = "https://weedit-co.onrender.com";

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
      <div
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
        className="min-h-[400px] flex flex-col items-center justify-center space-y-4"
      >
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="font-medium">Loading your history...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "rgba(15,15,15,0.7)",
        backdropFilter: "blur(20px)",
        color: "var(--foreground)",
      }}
      className="min-h-screen p-4 md:p-8 font-sans"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button
              onClick={onBack}
              style={{ color: "var(--foreground)" }}
              className="flex items-center text-sm hover:opacity-80 transition mb-2"
            >
              <ChevronLeft size={16} className="mr-1" /> Back
            </button>
            <h1
              style={{ color: "var(--foreground)" }}
              className="text-3xl font-bold tracking-tight"
            >
              Order History
            </h1>
            <p style={{ color: "var(--foreground)" }} className="mt-1">
              View your past purchases and subscriptions.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 p-1 rounded-xl w-fit mb-8">
          {["orders", "subscriptions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                backgroundColor:
                  activeTab === tab ? "var(--card)" : "var(--background)",
                color:
                  activeTab === tab
                    ? "var(--primary-foreground)"
                    : "var(--foreground)",
              }}
              className="px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Orders Empty */}
          {activeTab === "orders" && orders.length === 0 && (
            <div
              style={{
                backgroundColor: "var(--card)",
                color: "var(--card-foreground)",
                borderColor: "var(--border)",
              }}
              className="text-center py-20 rounded-2xl border border-dashed"
            >
              <div
                style={{ backgroundColor: "var(--surface-elevated)" }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              >
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
            orders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--card-foreground)",
                  borderColor: "var(--border)",
                }}
                className="rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-4 gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-lg">
                        Order #{order.id}
                      </span>
                      <Badge status={order.status} />
                    </div>
                    <span className="text-sm flex items-center gap-1">
                      <Calendar size={14} /> {formatDate(order.created_at)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Total Amount</p>
                    <p className="font-bold text-xl">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {order.order_items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2 group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            backgroundColor: "var(--surface-elevated)",
                            color: "var(--foreground)",
                          }}
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                        >
                          <Package size={20} />
                        </div>
                        <div>
                          <p>{item.title}</p>
                          <p className="text-xs">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-3">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} />
                    <span>
                      {order.payment_method} <span className="mx-1">•</span>{" "}
                      {order.payment_status}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto text-xs h-9"
                  >
                    View Invoice
                  </Button>
                </div>
              </div>
            ))}

          {/* Subscriptions Empty */}
          {activeTab === "subscriptions" && subscriptions.length === 0 && (
            <div
              style={{
                backgroundColor: "var(--card)",
                color: "var(--card-foreground)",
                borderColor: "var(--border)",
              }}
              className="text-center py-20 rounded-2xl border border-dashed"
            >
              <div
                style={{ backgroundColor: "var(--surface-elevated)" }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              >
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
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--card-foreground)",
                  borderColor: "var(--border)",
                }}
                className="rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all"
              >
                <div style={{ background: "var(--primary)" }} className="h-2" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold">{sub.plan}</h3>
                      <p className="text-sm mt-1">ID: {sub.id}</p>
                    </div>
                    <Badge status={sub.status} />
                  </div>

                  <div
                    style={{ backgroundColor: "var(--surface-overlay)" }}
                    className="grid grid-cols-2 gap-6 p-4 rounded-xl"
                  >
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider mb-1">
                        Started On
                      </p>
                      <p className="font-semibold flex items-center gap-2">
                        <Calendar size={14} /> {formatDate(sub.start_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider mb-1">
                        Next Billing
                      </p>
                      <p className="font-semibold flex items-center gap-2">
                        <Clock size={14} /> {formatDate(sub.next_billing)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    {sub.status === "active" ? (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleCancel(sub.id)}
                      >
                        Cancel Subscription
                      </Button>
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
