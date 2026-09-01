const express = require("express");
const pool = require("../db");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

const requestStatuses = [
  "REQUESTED",
  "ACCEPTED",
  "IN_PROGRESS",
  "COMPLETED",
  "REVIEWED",
  "REJECTED",
  "CANCELLED",
];

// Create a service request
router.post("/", authenticate, async (req, res) => {
  try {
    const { service_id, notes } = req.body;
    const requesterId = req.user.userId;

    if (!service_id) {
      return res.status(400).json({
        success: false,
        message: "Service ID is required",
      });
    }

    // Check requester
    const userResult = await pool.query(
      "SELECT id, is_suspended FROM users WHERE id = $1",
      [requesterId]
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
        message: "Suspended users cannot request services",
      });
    }

    // Find the service and provider
    const serviceResult = await pool.query(
      `SELECT id, provider_id, status
       FROM services
       WHERE id = $1`,
      [service_id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const service = serviceResult.rows[0];

    if (service.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This service is not currently available",
      });
    }

    if (service.provider_id === requesterId) {
      return res.status(400).json({
        success: false,
        message: "You cannot request your own service",
      });
    }

    // Prevent duplicate active requests
    const existingRequest = await pool.query(
      `SELECT id
       FROM service_requests
       WHERE service_id = $1
         AND requester_id = $2
         AND status IN (
           'REQUESTED',
           'ACCEPTED',
           'IN_PROGRESS'
         )`,
      [service_id, requesterId]
    );

    if (existingRequest.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "You already have an active request for this service",
      });
    }

    const result = await pool.query(
      `INSERT INTO service_requests
       (service_id, requester_id, provider_id, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        service_id,
        requesterId,
        service.provider_id,
        notes || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Service request created successfully",
      request: result.rows[0],
    });
  } catch (error) {
    console.error("Create request error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create service request",
    });
  }
});


// Get requests made by the logged-in user
router.get("/my", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        sr.id,
        sr.service_id,
        sr.requester_id,
        sr.provider_id,
        sr.status,
        sr.notes,
        sr.requested_at,
        sr.accepted_at,
        sr.in_progress_at,
        sr.completed_at,
        sr.rejected_at,
        sr.cancelled_at,
        sr.updated_at,

        s.title AS service_title,
        s.category,
        s.price,

        u.full_name AS provider_name,
        u.email AS provider_email

      FROM service_requests sr

      JOIN services s
        ON sr.service_id = s.id

      JOIN users u
        ON sr.provider_id = u.id

      WHERE sr.requester_id = $1

      ORDER BY sr.requested_at DESC`,
      [req.user.userId]
    );

    res.json({
      success: true,
      requests: result.rows,
    });
  } catch (error) {
    console.error("Get my requests error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch your requests",
    });
  }
});


// Get requests received by the logged-in provider
router.get("/provider", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        sr.id,
        sr.service_id,
        sr.requester_id,
        sr.provider_id,
        sr.status,
        sr.notes,
        sr.requested_at,
        sr.accepted_at,
        sr.in_progress_at,
        sr.completed_at,
        sr.rejected_at,
        sr.cancelled_at,
        sr.updated_at,

        s.title AS service_title,
        s.category,
        s.price,

        u.full_name AS requester_name,
        u.email AS requester_email

      FROM service_requests sr

      JOIN services s
        ON sr.service_id = s.id

      JOIN users u
        ON sr.requester_id = u.id

      WHERE sr.provider_id = $1

      ORDER BY sr.requested_at DESC`,
      [req.user.userId]
    );

    res.json({
      success: true,
      requests: result.rows,
    });
  } catch (error) {
    console.error("Get provider requests error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch provider requests",
    });
  }
});


// Update request status
router.patch("/:id/status", authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;
    const userId = req.user.userId;

    if (!requestStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request status",
      });
    }

    const requestResult = await pool.query(
      `SELECT *
       FROM service_requests
       WHERE id = $1`,
      [requestId]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    const request = requestResult.rows[0];

    const isProvider = request.provider_id === userId;
    const isRequester = request.requester_id === userId;

    if (!isProvider && !isRequester) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this request",
      });
    }

    // Provider actions
    if (isProvider) {
      const providerAllowed =
        (request.status === "REQUESTED" &&
          ["ACCEPTED", "REJECTED"].includes(status)) ||
        (request.status === "ACCEPTED" &&
          status === "IN_PROGRESS") ||
        (request.status === "IN_PROGRESS" &&
          status === "COMPLETED");

      if (!providerAllowed) {
        return res.status(400).json({
          success: false,
          message: "Invalid status transition",
        });
      }
    }

    // Requester can cancel an active request
    if (isRequester) {
      if (
        !(
          ["REQUESTED", "ACCEPTED", "IN_PROGRESS"].includes(
            request.status
          ) &&
          status === "CANCELLED"
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid status transition",
        });
      }
    }

    let timestampColumn = null;

    if (status === "ACCEPTED") timestampColumn = "accepted_at";
    if (status === "IN_PROGRESS") timestampColumn = "in_progress_at";
    if (status === "COMPLETED") timestampColumn = "completed_at";
    if (status === "REJECTED") timestampColumn = "rejected_at";
    if (status === "CANCELLED") timestampColumn = "cancelled_at";

    let query;
    let values;

    if (timestampColumn) {
      query = `
        UPDATE service_requests
        SET status = $1,
            ${timestampColumn} = NOW(),
            updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `;

      values = [status, requestId];
    } else {
      query = `
        UPDATE service_requests
        SET status = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `;

      values = [status, requestId];
    }

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: "Request status updated successfully",
      request: result.rows[0],
    });
  } catch (error) {
    console.error("Update request status error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update request status",
    });
  }
});

// A requester may review a completed request once. The review table's unique
// constraint is retained as a second line of protection against duplicates.
router.post("/:id/review", authenticate, async (req, res) => {
  const client = await pool.connect();
  try {
    const requestId = req.params.id;
    const reviewerId = req.user.userId;
    const rating = Number(req.body.rating);
    const comment = typeof req.body.comment === "string" ? req.body.comment.trim() : "";

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be a whole number from 1 to 5" });
    }

    await client.query("BEGIN");
    const requestResult = await client.query(
      `SELECT id, requester_id, status FROM service_requests WHERE id = $1 FOR UPDATE`,
      [requestId]
    );

    if (!requestResult.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Service request not found" });
    }

    const request = requestResult.rows[0];
    if (request.requester_id !== reviewerId) {
      await client.query("ROLLBACK");
      return res.status(403).json({ success: false, message: "Only the requester can leave a review" });
    }
    if (request.status !== "COMPLETED") {
      await client.query("ROLLBACK");
      return res.status(400).json({ success: false, message: "Only completed requests can be reviewed" });
    }

    const reviewResult = await client.query(
      `INSERT INTO reviews (service_request_id, reviewer_id, rating, comment)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [requestId, reviewerId, rating, comment || null]
    );
    await client.query(
      `UPDATE service_requests SET status = 'REVIEWED', updated_at = NOW() WHERE id = $1`,
      [requestId]
    );
    await client.query("COMMIT");
    res.status(201).json({ success: true, message: "Review submitted successfully", review: reviewResult.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      return res.status(409).json({ success: false, message: "A review already exists for this request" });
    }
    console.error("Create review error:", error);
    res.status(500).json({ success: false, message: "Unable to submit review" });
  } finally {
    client.release();
  }
});


module.exports = router;
