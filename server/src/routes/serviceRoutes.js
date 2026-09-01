const express = require("express");
const pool = require("../db");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();
const serviceStatuses = ["active", "inactive", "archived", "flagged"];

// Get all active services
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        services.id,
        services.title,
        services.description,
        services.category,
        services.price,
        services.status,
        services.created_at,
        users.id AS provider_id,
        users.full_name AS provider_name,
        users.campus
      FROM services
      JOIN users ON services.provider_id = users.id
      WHERE services.status = 'active'
      ORDER BY services.created_at DESC
    `);

    res.json({
      success: true,
      services: result.rows,
    });
  } catch (error) {
    console.error("Get services error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch services",
    });
  }
});

// Create a service
router.post("/", authenticate, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
    } = req.body;

    const providerId = req.user.userId;

    if (
      !title ||
      !description ||
      !category ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!providerId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    const userResult = await pool.query(
      "SELECT id, is_suspended FROM users WHERE id = $1",
      [providerId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user no longer exists",
      });
    }

    if (userResult.rows[0].is_suspended) {
      return res.status(403).json({
        success: false,
        message: "Suspended users cannot create services",
      });
    }

    const result = await pool.query(
      `INSERT INTO services
       (provider_id, title, description, category, price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [providerId, title, description, category, price]
    );

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service: result.rows[0],
    });
  } catch (error) {
    console.error("Create service error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create service",
    });
  }
});

// Get services owned by the logged-in provider. This must precede /:id.
router.get("/my", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, provider_id, title, description, category, price, status, created_at, updated_at
       FROM services
       WHERE provider_id = $1
       ORDER BY created_at DESC`,
      [req.user.userId]
    );

    res.json({ success: true, services: result.rows });
  } catch (error) {
    console.error("Get my services error:", error);
    res.status(500).json({ success: false, message: "Unable to fetch your services" });
  }
});

// Get one service with its provider information
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        services.id,
        services.title,
        services.description,
        services.category,
        services.price,
        services.status,
        services.created_at,
        users.id AS provider_id,
        users.full_name AS provider_name,
        users.campus
      FROM services
      JOIN users ON services.provider_id = users.id
      WHERE services.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      service: result.rows[0],
    });
  } catch (error) {
    console.error("Get service error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch service",
    });
  }
});

// Update a service owned by the authenticated user
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { title, description, category, price, status } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      typeof status !== "string" ||
      !status.trim() ||
      price === undefined ||
      price === null ||
      String(price).trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a non-negative number",
      });
    }

    if (!serviceStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service status",
      });
    }

    const serviceResult = await pool.query(
      "SELECT id, provider_id FROM services WHERE id = $1",
      [req.params.id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    if (serviceResult.rows[0].provider_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this service",
      });
    }

    const result = await pool.query(
      `UPDATE services
      SET title = $1,
          description = $2,
          category = $3,
          price = $4,
          status = $5
      WHERE id = $6
      RETURNING *`,
      [title, description, category, numericPrice, status, req.params.id]
    );

    res.json({
      success: true,
      message: "Service updated successfully",
      service: result.rows[0],
    });
  } catch (error) {
    console.error("Update service error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update service",
    });
  }
});

// Delete a service owned by the authenticated user
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const serviceResult = await pool.query(
      "SELECT id, provider_id FROM services WHERE id = $1",
      [req.params.id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    if (serviceResult.rows[0].provider_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this service",
      });
    }

    await pool.query("DELETE FROM services WHERE id = $1", [req.params.id]);

    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete service",
    });
  }
});

module.exports = router;
