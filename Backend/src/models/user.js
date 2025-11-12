import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Create a new user
export async function createUser(email, password, role = "client") {
  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password_hash: password, role }])
    .select();

  if (error) throw error;
  return data[0];
}

// Find user by email
export async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) throw error;
  return data;
}

// Update user role
export async function updateUserRole(userId, newRole) {
  const { data, error } = await supabase
    .from("users")
    .update({ role: newRole })
    .eq("id", userId)
    .select();

  if (error) throw error;
  return data[0];
}
