// src/utils/supabaseClient.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // load .env variables

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or KEY is missing. Check your .env file!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Create a new user
export const createUser = async (
  name,
  email,
  password_hash,
  role = "client"
) => {
  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, password_hash, role }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Find a user by email
export const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return null;
  return data;
};

// Get total number of users (for first-user admin logic)
export const getUserCount = async () => {
  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count;
};

export async function findUserById(id) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export default supabase;
