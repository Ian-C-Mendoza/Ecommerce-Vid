import supabase from "../utils/supabaseClient.js";

export const getAllSubscriptions = async (req, res) => {
  try {
    console.log("📥 Fetching subscriptions...");

    const { data, error } = await supabase
      .from("subscriptions")
      .select(
        `
        id,
        plan_name,
        status,
        date_created,
        next_billing,
        users:user_id (
          name,
          email
        )
      `
      )
      .order("date_created", { ascending: false });

    if (error) throw error;

    console.log("📦 Raw subscription data from Supabase:", data);

    // FORMAT TO MATCH FRONTEND
    const formattedSubs = data.map((sub) => ({
      id: sub.id, // 🔥 FIXED
      customerName: sub.users?.name || "Unknown",
      email: sub.users?.email || "N/A",
      plan: sub.plan_name || "No Plan",
      status: sub.status,

      // 🔥 BACKEND → FRONTEND NAME MATCH FIX
      start_date: sub.date_created ? sub.date_created : null,
      next_billing: sub.next_billing ? sub.next_billing : null,
    }));

    console.log("📤 Formatted subscription data:", formattedSubs);

    res.status(200).json(formattedSubs);
  } catch (err) {
    console.error("❌ Error fetching subscriptions:", err.message);
    res.status(500).json({ error: err.message });
  }
};
