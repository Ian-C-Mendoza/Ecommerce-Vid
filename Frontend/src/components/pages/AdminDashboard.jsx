import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Progress } from "../ui/progress";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";
import {
  DollarSign,
  Package,
  Users,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Upload,
  Download,
  Filter,
  Bell,
  AlertCircle,
  Search,
  MoreHorizontal,
  Play,
  Video,
  ExternalLink,
  Star,
  Mail,
  Inbox,
} from "lucide-react";
import {
  mockOrders,
  services,
  revenueData,
  customerData,
} from "../../data/mockData";

export function AdminDashboard({ activeTab = "overview", onTabChange }) {
  const [orders, setOrders] = useState(mockOrders);
  const [subscriptions, setSubscriptions] = useState([]); // ✅ must exist
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [servicesList, setServicesList] = useState(services);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useState("all");
  const [dateRange, setDateRange] = useState("30");
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: 0,
    duration: "",
    category: "basic",
    features: [""],
  });
  // State for search and status filter
  const [subscriptionSearch, setSubscriptionSearch] = useState("");
  const [subscriptionStatusFilter, setSubscriptionStatusFilter] =
    useState("all");

  // Portfolio management state
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    thumbnail: "",
    videoUrl: "",
    category: "Corporate",
    client: "",
  });

  // Testimonials management state
  const [testimonialItems, setTestimonialItems] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    company: "",
    content: "",
    rating: 5,
    avatar: "",
  });

  useEffect(() => {
    let isMounted = true;

    const refreshAll = async () => {
      if (!isMounted) return;

      setIsRefreshing(true);
      try {
        await fetchOrders();
        await fetchSubscriptions();
        await loadMessages();
      } catch (err) {
        console.error("Refresh failed:", err);
      } finally {
        setIsRefreshing(false);
        // schedule next refresh only after this one finishes
        if (isMounted) setTimeout(refreshAll, 5000); // 5 seconds
      }
    };

    refreshAll(); // initial fetch

    return () => {
      isMounted = false;
    };
  }, []);

  // Load portfolio items from localStorage on component mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem("adminPortfolioItems");
    if (savedPortfolio) {
      setPortfolioItems(JSON.parse(savedPortfolio));
    }
  }, []);

  // Load testimonials from localStorage on component mount
  useEffect(() => {
    const savedTestimonials = localStorage.getItem("adminTestimonials");
    if (savedTestimonials) {
      const parsedTestimonials = JSON.parse(savedTestimonials);

      // Map userId to actual user name
      const mappedTestimonials = parsedTestimonials.map((testimonial) => {
        const userName =
          customers.find((u) => u.id === testimonial.userId)?.name ||
          "Unknown Client";
        return {
          ...testimonial,
          name: userName, // add 'name' property
        };
      });

      setTestimonialItems(mappedTestimonials);
    }
  }, []);

  // Save portfolio items to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("adminPortfolioItems", JSON.stringify(portfolioItems));
  }, [portfolioItems]);

  // Save testimonials to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("adminTestimonials", JSON.stringify(testimonialItems));
  }, [testimonialItems]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;
  const inProgressOrders = orders.filter(
    (order) => order.status === "In progress"
  ).length;
  const monthlyGrowth = 12.5;
  const avgOrderValue = totalRevenue / orders.length;

  const statusColors = {
    Completed: "#22c55e",
    "In Progress": "#3b82f6",
    Pending: "#eab308",
    Cancelled: "#ef4444",
  };

  const chartData = [
    {
      name: "Completed",
      value: orders.filter((o) => o.status === "Completed").length,
      color: statusColors.Completed,
    },
    {
      name: "In Progress",
      value: orders.filter((o) => o.status === "In Progress").length,
      color: statusColors["In Progress"],
    },
    {
      name: "Pending",
      value: orders.filter((o) => o.status === "Pending").length,
      color: statusColors.Pending,
    },
    {
      name: "Cancelled",
      value: orders.filter((o) => o.status === "Cancelled").length,
      color: statusColors.Cancelled,
    },
  ].filter((item) => item.value > 0);

  const updateOrderStatus = async (orderId, newStatus, setOrders) => {
    // 1️⃣ Update in Supabase
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("❌ Supabase update failed:", error);
      return;
    }

    console.log("✅ Supabase order updated");

    // 2️⃣ Update local state so UI reflects instantly
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  async function loadMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setMessages(data);
  }

  async function markAsRead(id) {
    await supabase.from("messages").update({ read: true }).eq("id", id);
    loadMessages();

    setSelectedMessage((prev) =>
      prev?.id === id ? { ...prev, read: true } : prev
    );
  }

  async function deleteMessage(id) {
    await supabase.from("messages").delete().eq("id", id);
    loadMessages();
    setSelectedMessage(null);
  }

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAllOrders = (checked) => {
    setSelectedOrders(checked ? filteredOrders.map((order) => order.id) : []);
  };

  const handleBulkStatusUpdate = (newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        selectedOrders.includes(order.id)
          ? { ...order, status: newStatus }
          : order
      )
    );
    setSelectedOrders([]);
  };

  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(false);

  //const BACKEND_URL = "http://localhost:5000";
  const BACKEND_URL = "https://we-edit-co.onrender.com";

  useEffect(() => {
    loadMessages(); // initial load

    const channel = supabase
      .channel("admin-messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          console.log("📩 New message change detected");
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    async function fetchOrders() {
      setIsLoadingOrders(true);

      try {
        // 🔹 Try Supabase session first
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        let token = null;

        if (session?.access_token) {
          console.log("🟢 Supabase session found, using access token...");
          token = session.access_token;
        } else {
          const localToken = localStorage.getItem("token");
          if (localToken) {
            console.log("🟠 Using stored JWT token for fetching orders...");
            token = localToken;
          } else {
            console.warn(
              "⚠️ No Supabase or stored token, fallback to cookie..."
            );
          }
        }

        // 🔹 Fetch from backend
        const res = await axios.get(`${BACKEND_URL}/api/orders`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });

        if (res.data) {
          setOrders(res.data || []);
          console.log("✅ Orders fetched successfully:", res.data);
        } else {
          console.warn("⚠️ No orders data received.");
          setOrders([]);
        }
      } catch (err) {
        console.error(
          "❌ Error fetching orders:",
          err.response?.data || err.message
        );
        setOrders([]);
      } finally {
        setIsLoadingOrders(false);
      }
    }

    fetchOrders();

    // 🔁 Optional: Re-fetch when auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          console.log("🔁 Auth state changed — refreshing orders");
          await fetchOrders();
        } else {
          setOrders([]);
        }
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("admin-orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT | UPDATE | DELETE
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("🔁 Order change detected:", payload);

          setOrders((prev) => {
            if (payload.eventType === "INSERT") {
              return [payload.new, ...prev];
            }

            if (payload.eventType === "UPDATE") {
              return prev.map((order) =>
                order.id === payload.new.id ? payload.new : order
              );
            }

            if (payload.eventType === "DELETE") {
              return prev.filter((order) => order.id !== payload.old.id);
            }

            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🔹 Move this outside of useEffect so all effects can access it
  const fetchSubscriptions = async () => {
    setIsLoadingSubscriptions(true);

    try {
      // 🔹 Try Supabase session first
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const token =
        session?.access_token || localStorage.getItem("token") || null;

      if (token) {
        console.log("🟢 Using token for fetching subscriptions...");
      } else {
        console.warn("⚠️ No token found, fallback to cookie...");
      }

      // 🔹 Fetch from backend
      const res = await axios.get(`${BACKEND_URL}/api/subscriptions`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });

      if (res.data) {
        setSubscriptions(res.data);
        console.log("✅ Subscriptions fetched successfully:", res.data);
      } else {
        console.warn("⚠️ No subscriptions data received.");
        setSubscriptions([]);
      }
    } catch (err) {
      console.error(
        "❌ Error fetching subscriptions:",
        err.response?.data || err.message
      );
      setSubscriptions([]);
    } finally {
      setIsLoadingSubscriptions(false);
    }
  };

  // 🔹 Fetch subscriptions on mount and listen to auth changes
  useEffect(() => {
    fetchSubscriptions();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          console.log("🔁 Auth state changed — refreshing subscriptions");
          await fetchSubscriptions();
        } else {
          setSubscriptions([]);
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  // 🔹 Listen for realtime changes in subscriptions
  useEffect(() => {
    const channel = supabase
      .channel("admin-subscriptions-realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT | UPDATE | DELETE
          schema: "public",
          table: "subscriptions",
        },
        () => {
          console.log("🔁 Subscription change detected");
          fetchSubscriptions(); // ✅ now works
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // 🧩 Add or replace this useEffect in AdminDashboard.jsx
  useEffect(() => {
    const loadCustomerData = async () => {
      if (!orders || orders.length === 0) {
        setCustomerData([]);
        return;
      }

      // fetch communication data separately
      const { data: details, error } = await supabase
        .from("order_details")
        .select("customer_email, communication");

      const communicationMap = {};
      if (details) {
        details.forEach((d) => {
          communicationMap[d.customer_email] = d.communication;
        });
      }

      const customerMap = {};
      orders.forEach((order) => {
        const name = order.customerName || "Unknown";
        const email = order.email || "no-email@example.com";
        const total = Number(order.total) || 0;

        if (!customerMap[email]) {
          customerMap[email] = {
            name,
            email,
            totalOrders: 0,
            totalSpent: 0,
            lastOrder: null,
            communication: communicationMap[email] || "N/A", // ✅ add here
          };
        }

        const cust = customerMap[email];
        cust.totalOrders += 1;
        cust.totalSpent += total;

        const created =
          order.created_at || order.createdAt || order.deliveryDate || null;
        const ts = created ? Number(new Date(created)) : NaN;
        if (!isNaN(ts)) {
          if (!cust.lastOrder || ts > Number(new Date(cust.lastOrder))) {
            cust.lastOrder = new Date(ts).toISOString();
          }
        }
      });

      const formatted = Object.values(customerMap).map((cust) => {
        let status = "active";
        if (!cust.lastOrder) {
          status = "inactive";
        } else {
          const lastTs = Number(new Date(cust.lastOrder));
          const daysSince = (Date.now() - lastTs) / (1000 * 60 * 60 * 24);
          status = daysSince > 30 ? "inactive" : "active";
        }

        return { ...cust, status };
      });

      setCustomerData(formatted);
    };

    loadCustomerData();
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    const name = order.users?.name?.toLowerCase() || "";
    const email = order.users?.email?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    const matchesSearch = name.includes(search) || email.includes(search);
    const matchesStatus =
      statusFilter === "all" ? true : order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const [customers, setCustomers] = useState([]); // ✅ this is what you were missing

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const name = sub.customerName?.toLowerCase() || "";
    const email = sub.email?.toLowerCase() || "";
    const search = subscriptionSearch.toLowerCase();

    const matchesSearch = name.includes(search) || email.includes(search);
    const matchesStatus =
      subscriptionStatusFilter === "all"
        ? true
        : sub.status === subscriptionStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // ✅ Fetch customers on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name")
        .eq("role", "client"); // ✅ only fetch clients, not admins

      if (error) {
        console.error(error);
        toast.error("Failed to load customers");
      } else {
        setCustomers(data);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*, users(id, name)") // <-- include the users table
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading testimonials:", error.message);
      } else {
        setTestimonialItems(data);
      }
    };

    fetchTestimonials();
  }, []);

  // Testimonials management functions
  const saveNewTestimonial = async () => {
    if (newTestimonial.user_id && newTestimonial.content) {
      try {
        const testimonial = {
          user_id: newTestimonial.user_id,
          content: newTestimonial.content,
          rating: newTestimonial.rating || 5,
        };

        // Insert into Supabase
        const { data, error } = await supabase
          .from("testimonials")
          .insert([testimonial])
          .select("*, users(name)") // Optional: fetch user's name for UI
          .single();

        if (error) throw error;

        // Update UI instantly
        setTestimonialItems((prev) => [data, ...prev]);
        setNewTestimonial({
          user_id: "",
          content: "",
          rating: 5,
        });

        toast.success("✅ Testimonial added successfully!");
      } catch (err) {
        console.error("Supabase insert error:", err.message);
        toast.error("❌ Failed to add testimonial");
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const deleteTestimonial = async (testimonialId) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", testimonialId);

      if (error) throw error;

      setTestimonialItems((prev) =>
        prev.filter((item) => item.id !== testimonialId)
      );
      toast.success("🗑️ Testimonial removed successfully");
    } catch (err) {
      console.error("Supabase delete error:", err.message);
      toast.error("❌ Failed to delete testimonial");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "In Progress":
        return "bg-blue-500";
      case "Pending":
        return "bg-yellow-500";
      case "Cancelled":
        return "bg-red-500";
    }
  };
  const exportOrdersToCSV = () => {
    const headers = [
      "Order ID",
      "Customer Name",
      "Email",
      "Services",
      "Add-ons",
      "Total",
      "Status",
      "Delivery Date",
    ];

    const rows = filteredOrders.map((order) => {
      const services = order.services
        ?.map(
          (s) =>
            `${s.service?.title || "Unnamed"} (x${s.quantity || 1}) - ₱${
              s.service?.price || 0
            }`
        )
        .join("; ");

      const addons = order.addons
        ?.map((a) => `${a.name || a.title} - ₱${a.price || 0}`)
        .join("; ");

      return [
        order.id,
        order.customerName,
        order.email,
        services,
        addons,
        `₱${order.total?.toFixed(2) || "0.00"}`,
        order.status,
        order.deliveryDate
          ? new Date(order.deliveryDate).toLocaleDateString()
          : "N/A",
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((x) => `"${x}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "orders_with_addons.csv";
    link.click();
  };
  const exportSubscriptionsToCSV = () => {
    const headers = [
      "Subscription ID",
      "Customer Name",
      "Email",
      "Plan",
      "Status",
      "Start Date",
      "Next Billing",
    ];

    const rows = filteredSubscriptions.map((sub) => [
      sub.id,
      sub.customerName || "Unknown",
      sub.email || "—",
      sub.plan || "Unknown Plan",
      sub.status || "Unknown",
      sub.start_date ? new Date(sub.start_date).toLocaleDateString() : "—",
      sub.next_billing ? new Date(sub.next_billing).toLocaleDateString() : "—",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((x) => `"${x}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "subscriptions.csv";
    link.click();
  };

  return (
    <div className="p-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />+{monthlyGrowth}% from last
              month
            </p>
            <Progress value={75} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inProgressOrders + pendingOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingOrders} pending, {inProgressOrders} in progress
            </p>
            <Progress
              value={((inProgressOrders + pendingOrders) / orders.length) * 100}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerData.length}</div>
            <p className="text-xs text-muted-foreground">
              {customerData.filter((c) => c.status === "active").length} active
              customers
            </p>
            <Progress
              value={
                (customerData.filter((c) => c.status === "active").length /
                  customerData.length) *
                100
              }
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Order Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(avgOrderValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((completedOrders / orders.length) * 100)}% completion
              rate
            </p>
            <Progress
              value={(completedOrders / orders.length) * 100}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <div className="mb-8">
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20 glass">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  {pendingOrders} orders pending review
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  Review and update order statuses to keep customers informed
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              >
                <Bell className="w-4 h-4 mr-2" />
                View Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content based on active tab */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {revenueData && revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Revenue",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No revenue data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No order data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg glass"
                >
                  {getStatusIcon(order.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.id} - ${order.total}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "orders" && (
        <Card className="glass">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>Orders Management</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="btn-hover-secondary"
                  onClick={exportOrdersToCSV}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="btn-hover-secondary"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Add-ons</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredOrders.map((order) => {
                  // Get totals from nested arrays safely
                  const serviceTotal =
                    order.services?.reduce(
                      (sum, s) =>
                        sum +
                        (s.price || s.service?.price || 0) * (s.quantity || 1),
                      0
                    ) || 0;

                  // Combine all add-ons from each service
                  const allAddons =
                    order.services?.flatMap((s) => s.addons || []) || [];
                  const addonTotal = allAddons.reduce(
                    (sum, a) => sum + (a.price || 0),
                    0
                  );

                  const overallTotal = serviceTotal + addonTotal;

                  return (
                    <TableRow key={order.id}>
                      {/* ORDER ID */}
                      <TableCell className="font-medium">{order.id}</TableCell>

                      {/* CUSTOMER INFO */}
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {order.customerName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.email}
                          </div>
                        </div>
                      </TableCell>

                      {/* SERVICES */}
                      <TableCell>
                        {order.services?.length ? (
                          order.services.map((item, index) => (
                            <div key={index} className="mb-1">
                              {item.service?.title || "Unnamed Service"} (x
                              {item.quantity || 1}) — ₱
                              {(
                                (item.price || item.service?.price || 0) *
                                (item.quantity || 1)
                              ).toFixed(2)}
                            </div>
                          ))
                        ) : (
                          <span className="text-muted-foreground">
                            No services
                          </span>
                        )}
                      </TableCell>

                      {/* ADD-ONS */}
                      <TableCell>
                        {allAddons.length > 0 ? (
                          allAddons.map((addon, i) => (
                            <div key={i} className="text-sm">
                              • {addon.addon_name || addon.name} — ₱
                              {addon.price?.toFixed(2) || "0.00"}
                            </div>
                          ))
                        ) : (
                          <span className="text-muted-foreground">
                            No add-ons
                          </span>
                        )}
                      </TableCell>

                      {/* TOTAL */}
                      <TableCell>
                        <div className="text-base font-semibold">
                          ₱{overallTotal.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          (Services ₱{serviceTotal.toFixed(2)} + Add-ons ₱
                          {addonTotal.toFixed(2)})
                        </div>
                      </TableCell>

                      {/* STATUS */}
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>

                          {/* Show "NEW" if this order is the latest or created within 24 hours */}
                          {(() => {
                            const orderDate = new Date(
                              order.deliveryDate || order.created_at
                            );
                            const now = new Date();
                            const hoursDiff =
                              (now - orderDate) / (1000 * 60 * 60);

                            // Mark as new if created within the last 24 hours
                            if (hoursDiff <= 24) {
                              return (
                                <Badge
                                  variant="outline"
                                  className="border-none bg-blue-500 text-white dark:bg-blue-400 dark:text-black animate-pulse"
                                >
                                  NEW
                                </Badge>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </TableCell>

                      {/* ORDER DATE */}
                      <TableCell>
                        {order.deliveryDate
                          ? new Date(order.deliveryDate).toLocaleDateString()
                          : "N/A"}
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            updateOrderStatus(order.id, value, setOrders)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "subscriptions" && (
        <Card className="glass">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>Subscription Management</CardTitle>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="btn-hover-secondary"
                  onClick={exportSubscriptionsToCSV}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="btn-hover-secondary"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search subscriptions..."
                  value={subscriptionSearch}
                  onChange={(e) => setSubscriptionSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={subscriptionStatusFilter}
                onValueChange={setSubscriptionStatusFilter}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="past_due">Past Due</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subscription ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredSubscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    {/* SUBSCRIPTION ID */}
                    <TableCell className="font-medium">{sub.id}</TableCell>

                    {/* CUSTOMER */}
                    <TableCell>
                      <div className="font-medium">{sub.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {sub.email}
                      </div>
                    </TableCell>

                    {/* PLAN */}
                    <TableCell className="font-semibold">
                      {sub.plan || "Unknown"}
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>
                      <Badge
                        className={
                          sub.status === "active"
                            ? "bg-green-600 !text-black"
                            : sub.status === "past_due"
                            ? "bg-yellow-500 !text-black"
                            : sub.status === "canceled"
                            ? "bg-red-600 !text-black"
                            : "bg-gray-500 !text-black"
                        }
                      >
                        {sub.status}
                      </Badge>
                    </TableCell>

                    {/* START DATE */}
                    <TableCell>
                      {sub.start_date
                        ? new Date(sub.start_date).toLocaleString()
                        : "—"}
                    </TableCell>

                    {/* NEXT BILLING */}
                    <TableCell>
                      {sub.next_billing
                        ? new Date(sub.next_billing).toLocaleString()
                        : "—"}
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell>
                      <Select
                        value={sub.status}
                        onValueChange={(value) =>
                          updateSubscriptionStatus(
                            sub.id,
                            value,
                            setSubscriptions
                          )
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="past_due">Past Due</SelectItem>
                          <SelectItem value="canceled">Canceled</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "customers" && (
        <Card className="glass">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>Customer Management</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="btn-hover-secondary"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="btn-hover-secondary"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Preferred Communication</TableHead>{" "}
                  {/* ✅ new column */}
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {customerData && customerData.length > 0 ? (
                  customerData.map((customer) => (
                    <TableRow key={customer.email}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {customer.email}
                          </div>
                        </div>
                      </TableCell>

                      {/* ✅ Communication column */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {customer.communication === "Email" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-blue-500"
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
                          )}
                          {customer.communication === "WhatsApp" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-green-500"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.868-2.031-.967-.273-.099-.472-.148-.671.15-.198.297-.767.967-.941 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.654-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.074-.149-.671-1.611-.92-2.205-.242-.579-.487-.5-.671-.51l-.573-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            </svg>
                          )}
                          {customer.communication === "iMessage" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-sky-500"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M2 2v20l4-4h16V2H2zm16 9h-8v-2h8v2zm0-4h-8V5h8v2zm-10 0H4V5h4v2zm0 4H4v-2h4v2z" />
                            </svg>
                          )}
                          <span>{customer.communication || "N/A"}</span>
                        </div>
                      </TableCell>

                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell>₱{customer.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>
                        {customer.lastOrder
                          ? new Date(customer.lastOrder).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            customer.status === "active"
                              ? "bg-green-100 text-green-800 border-green-400"
                              : "bg-red-100 text-red-800 border-red-400"
                          }`}
                        >
                          {customer.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan="6"
                      className="text-center text-muted-foreground"
                    >
                      No customers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "inbox" && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* ---------------- INBOX LIST ---------------- */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Inbox Messages</span>
                  <Badge variant="secondary">{messages.length} messages</Badge>
                </CardTitle>
              </CardHeader>

              <CardContent>
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No messages yet</p>
                    <p className="text-sm text-muted-foreground">
                      When users send a message, it will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-4 border rounded-lg space-y-3 glass cursor-pointer transition-all ${
                          msg.read
                            ? "opacity-80"
                            : "border-primary shadow-md shadow-primary/20"
                        }`}
                        onClick={() => {
                          setSelectedMessage(msg);
                          if (!msg.read) markAsRead(msg.id);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium">{msg.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {msg.email}
                            </p>
                          </div>

                          <Badge
                            className={
                              msg.read ? "bg-gray-400" : "bg-green-600"
                            }
                          >
                            {msg.read ? "Read" : "New"}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {msg.message}
                        </p>

                        <p className="text-[10px] text-muted-foreground text-right">
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ---------------- VIEW MESSAGE ---------------- */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Inbox className="w-5 h-5" />
                  <span>Message Details</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {!selectedMessage ? (
                  <div className="text-center py-10">
                    <Inbox className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Select a message to view details
                    </p>
                  </div>
                ) : (
                  <>
                    {/* NAME / EMAIL */}
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Sender</p>
                      <p className="text-lg font-medium">
                        {selectedMessage.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedMessage.email}
                      </p>
                    </div>

                    {/* MESSAGE */}
                    <div>
                      <p className="text-xs text-muted-foreground">Message</p>
                      <p className="bg-background border p-3 rounded-md mt-1 text-sm">
                        {selectedMessage.message}
                      </p>
                    </div>

                    {/* DATE */}
                    <p className="text-xs text-muted-foreground text-right">
                      Received:{" "}
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>

                    <div className="flex items-center gap-3 pt-4">
                      {/* MARK AS READ */}
                      {!selectedMessage.read && (
                        <Button
                          variant="secondary"
                          onClick={() => markAsRead(selectedMessage.id)}
                          className="flex-1"
                        >
                          Mark as Read
                        </Button>
                      )}

                      {/* DELETE */}
                      <Button
                        variant="destructive"
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="flex-1"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "testimonials" && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* ---------------- CLIENT TESTIMONIALS LIST ---------------- */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Client Testimonials</span>
                  <Badge variant="secondary">
                    {testimonialItems.length} testimonials
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testimonialItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No testimonials yet</p>
                    <p className="text-sm text-muted-foreground">
                      Add your first testimonial to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {testimonialItems.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="p-4 border rounded-lg space-y-3 glass"
                      >
                        <div className="flex items-start space-x-4">
                          {/* Removed client image */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">
                                  {testimonial.users?.name || "Unknown Client"}
                                </h4>
                                <div className="flex items-center mt-1">
                                  {[...Array(testimonial.rating)].map(
                                    (_, i) => (
                                      <Star
                                        key={i}
                                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                                      />
                                    )
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                                onClick={() =>
                                  deleteTestimonial(testimonial.id)
                                }
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              "{testimonial.content}"
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ---------------- ADD NEW TESTIMONIAL ---------------- */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Add New Testimonial</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* CLIENT DROPDOWN */}
                <div>
                  <Label htmlFor="testimonial-name">Select Client *</Label>
                  <Select
                    value={newTestimonial.user_id?.toString() || ""}
                    onValueChange={(value) =>
                      setNewTestimonial((prev) => ({
                        ...prev,
                        user_id: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger className="--card border rounded-md focus:ring-2 focus:ring-primary focus:outline-none ">
                      <SelectValue placeholder="Choose a client..." />
                    </SelectTrigger>
                    <SelectContent className="--card bg-popover text-foreground shadow-lg border rounded-md">
                      {customers.length > 0 ? (
                        customers.map((customer) => (
                          <SelectItem
                            key={customer.id}
                            value={customer.id.toString()}
                            className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {customer.name}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No clients found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* CONTENT */}
                <Textarea
                  id="testimonial-content"
                  value={newTestimonial.content}
                  onChange={(e) =>
                    setNewTestimonial((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="Write the client's testimonial here..."
                  rows={4}
                  className="bg-background border rounded-md focus:ring-2 focus:ring-primary focus:outline-none opacity-80"
                />

                {/* RATING */}
                <div>
                  <Label htmlFor="testimonial-rating">Rating</Label>
                  <Select
                    value={newTestimonial.rating?.toString() || "5"}
                    onValueChange={(value) =>
                      setNewTestimonial((prev) => ({
                        ...prev,
                        rating: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Stars - Excellent</SelectItem>
                      <SelectItem value="4">4 Stars - Very Good</SelectItem>
                      <SelectItem value="3">3 Stars - Good</SelectItem>
                      <SelectItem value="2">2 Stars - Fair</SelectItem>
                      <SelectItem value="1">1 Star - Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* BUTTON */}
                <Button
                  onClick={saveNewTestimonial}
                  className="w-full btn-hover-primary bg-gradient-primary"
                  disabled={!newTestimonial.user_id || !newTestimonial.content}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Conversion Rate</span>
                <span className="font-bold">12.5%</span>
              </div>
              <Progress value={12.5} className="h-2" />

              <div className="flex items-center justify-between">
                <span>Customer Satisfaction</span>
                <span className="font-bold">98%</span>
              </div>
              <Progress value={98} className="h-2" />

              <div className="flex items-center justify-between">
                <span>Repeat Customers</span>
                <span className="font-bold">65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
