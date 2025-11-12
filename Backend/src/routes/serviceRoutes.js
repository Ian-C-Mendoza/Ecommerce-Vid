// src/routes/serviceRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import supabase from "../utils/supabaseClient.js";

const router = express.Router();

/* ────────────────────────────────
   📦 GET ALL SERVICES (Public)
──────────────────────────────── */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("❌ Failed to fetch services:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ────────────────────────────────
   🔍 GET SINGLE SERVICE (Public)
──────────────────────────────── */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("❌ Failed to fetch service:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ────────────────────────────────
   ➕ CREATE SERVICE (Protected)
──────────────────────────────── */
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, price, duration, thumbnail_url, is_active } =
      req.body;

    if (!title || !price) {
      return res
        .status(400)
        .json({ error: "Title and price are required fields." });
    }

    const { data, error } = await supabase
      .from("services")
      .insert([
        {
          title,
          description,
          price,
          duration,
          thumbnail_url,
          is_active: is_active ?? true,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "✅ Service created successfully",
      service: data,
    });
  } catch (err) {
    console.error("❌ Failed to create service:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ────────────────────────────────
   ✏️ EDIT SERVICE (Protected)
──────────────────────────────── */
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from("services")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: "✅ Service updated successfully",
      service: data,
    });
  } catch (err) {
    console.error("❌ Failed to update service:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ────────────────────────────────
   🗑️ DELETE SERVICE (Protected)
──────────────────────────────── */
router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;

    res.json({ message: "✅ Service deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete service:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
