// src/utils/db.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// -------- USERS --------
export async function createUser(email, passwordHash, role = "client") {
  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password_hash: passwordHash, role }])
    .select();
  if (error) throw error;
  return data[0];
}

export async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (error) throw error;
  return data;
}

// -------- SERVICES --------
export async function createService(name, description, price) {
  const { data, error } = await supabase
    .from("services")
    .insert([{ name, description, price }])
    .select();
  if (error) throw error;
  return data[0];
}

export async function getAllServices() {
  const { data, error } = await supabase.from("services").select("*");
  if (error) throw error;
  return data;
}

// -------- ORDERS --------
export async function createOrder(userId, total, status = "pending") {
  const { data, error } = await supabase
    .from("orders")
    .insert([{ user_id: userId, total, status }])
    .select();
  if (error) throw error;
  return data[0];
}

export async function getOrdersByUser(userId) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}

// -------- ORDER ITEMS --------
export async function addOrderItem(orderId, serviceId, quantity, addons = []) {
  const { data, error } = await supabase
    .from("order_items")
    .insert([{ order_id: orderId, service_id: serviceId, quantity, addons }])
    .select();
  if (error) throw error;
  return data[0];
}

export async function getOrderItems(orderId) {
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);
  if (error) throw error;
  return data;
}
