// src/models/serviceModel.js
import pool from "../uitls/db.js";

// 🟩 Fetch all active services
export const getAllServices = async () => {
  const result = await pool.query(`
    SELECT * 
    FROM services 
    WHERE is_active = true 
    ORDER BY created_at DESC
  `);
  return result.rows;
};

// 🟦 Fetch single service by ID
export const getServiceById = async (id) => {
  const result = await pool.query("SELECT * FROM services WHERE id = $1", [id]);
  return result.rows[0];
};

// 🟨 Create new service
export const createService = async ({
  title,
  description,
  price,
  duration,
  thumbnail_url,
}) => {
  const result = await pool.query(
    `INSERT INTO services (title, description, price, duration, thumbnail_url, is_active, created_at)
     VALUES ($1, $2, $3, $4, $5, true, NOW())
     RETURNING *`,
    [title, description, price, duration, thumbnail_url]
  );
  return result.rows[0];
};

// 🟧 Update service details
export const updateService = async (
  id,
  { title, description, price, duration, thumbnail_url, is_active }
) => {
  const result = await pool.query(
    `UPDATE services 
     SET 
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       price = COALESCE($3, price),
       duration = COALESCE($4, duration),
       thumbnail_url = COALESCE($5, thumbnail_url),
       is_active = COALESCE($6, is_active),
       updated_at = NOW()
     WHERE id = $7
     RETURNING *`,
    [title, description, price, duration, thumbnail_url, is_active, id]
  );
  return result.rows[0];
};

// 🟥 Delete service (hard delete)
export const deleteService = async (id) => {
  await pool.query("DELETE FROM services WHERE id = $1", [id]);
};
