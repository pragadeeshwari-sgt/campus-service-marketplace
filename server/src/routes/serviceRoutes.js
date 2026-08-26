const express = require("express");
const pool = require("../db");

const router = express.Router();

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
router.post("/", async (req, res) => {
  try {
    const {
      provider_id,
      title,
      description,
      category,
      price,
    } = req.body;

    if (
      !provider_id ||
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

    const result = await pool.query(
      `INSERT INTO services
        (provider_id, title, description, category, price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [provider_id, title, description, category, price]
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

module.exports = router;