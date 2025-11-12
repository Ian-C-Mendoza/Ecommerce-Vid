// src/controllers/orderController.js
import {
  createOrder as createOrderDB,
  getOrdersByUser as getOrdersByUserDB,
  addOrderItem,
  getOrderItems,
} from "../utils/db.js";
import supabase from "../utils/supabaseClient.js";

// Create a new order
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, total, payment_method } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing userId or items." });
    }

    // 1️⃣ Create main order record
    const newOrder = await createOrderDB(userId, total, "pending");

    // 2️⃣ Add order items to order_items table
    for (const item of items) {
      await addOrderItem(
        newOrder.id,
        item.service_id,
        item.quantity,
        item.addons || []
      );
    }

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId)
      return res.status(400).json({ message: "User ID is required." });

    const orders = await getOrdersByUserDB(userId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single order (with its items)
export const getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError) throw orderError;
    if (!order) return res.status(404).json({ message: "Order not found" });

    const items = await getOrderItems(orderId);

    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status (admin)
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    const { data, error } = await supabase
      .from("orders")
      .update({ status, payment_status })
      .eq("id", id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0)
      return res.status(404).json({ message: "Order not found" });

    res.json({
      message: "Order updated successfully",
      order: data[0],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all orders for Admin Dashboard
export const getAllOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        total,
        status,
        payment_status,
        payment_method,
        created_at,
        users (
          name,
          email
        ),
        order_details (
          customer_email,
          phone,
          communication,
          created_at
        ),
        order_items (
          id,
          title,
          quantity,
          price,
          order_item_addons (
            addon_name,
            price
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    // 🧩 Transform data for frontend
    const formattedOrders = data.map((order) => ({
      id: order.id,
      customerName: order.users?.name || "Unknown",
      email:
        order.order_details?.[0]?.customer_email || order.users?.email || "N/A",
      total: order.total,
      status: order.status,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      deliveryDate:
        order.order_details?.[0]?.created_at || order.created_at || null,

      services:
        order.order_items?.map((item) => ({
          service: { title: item.title },
          quantity: item.quantity,
          price: item.price,
          addons: item.order_item_addons || [],
        })) || [],
    }));

    res.status(200).json(formattedOrders);
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ error: err.message });
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    res.status(200).json({ success: true, message: "Order status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
