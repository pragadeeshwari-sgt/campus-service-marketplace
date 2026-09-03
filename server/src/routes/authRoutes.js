const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const pool = require("../db");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();
const RESET_SUCCESS_MESSAGE = "If an account exists for that email, a reset link has been sent.";

function createMailTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_FROM) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER && process.env.SMTP_PASS
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

async function sendResetEmail(email, token) {
  const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
  const resetUrl = `${clientUrl}/reset-password?token=${encodeURIComponent(token)}`;

  // Log in development / non-production environments when testing locally
  if (process.env.NODE_ENV !== "production") {
    console.log(`\n==================================================`);
    console.log(`[DEV MODE RESET LINK] Email: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`==================================================\n`);
  }

  const transport = createMailTransport();
  if (!transport) {
    return;
  }

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Reset your CampusMarket password",
    text: `Use this link to reset your CampusMarket password: ${resetUrl}\n\nThis link expires in 30 minutes.`,
  });
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, campus, password } = req.body;

    if (!full_name || !email || !campus || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
      [email.trim()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, campus, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, campus, created_at`,
      [full_name.trim(), email.trim().toLowerCase(), campus.trim(), passwordHash]
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the account",
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.is_suspended) {
      return res.status(403).json({
        success: false,
        message: "Account is suspended",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        campus: user.campus,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while logging in",
    });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address.",
      });
    }

    const userResult = await pool.query(
      "SELECT id, email FROM users WHERE LOWER(email) = $1 AND is_suspended = FALSE",
      [email]
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

      await pool.query("DELETE FROM password_reset_tokens WHERE user_id = $1", [user.id]);
      await pool.query(
        "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL '30 minutes')",
        [user.id, tokenHash]
      );

      try {
        await sendResetEmail(user.email, token);
      } catch (mailError) {
        console.error("Password reset email error:", mailError.message);
      }
    }

    // Requirement 1: Return generic success message regardless of email existence to prevent email enumeration
    return res.json({
      success: true,
      message: RESET_SUCCESS_MESSAGE,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to process that request right now.",
    });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  const client = await pool.connect();
  try {
    const token = typeof req.body.token === "string" ? req.body.token.trim() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "This password reset link is invalid or missing.",
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Your new password must be at least 8 characters long.",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await client.query("BEGIN");

    const resetResult = await client.query(
      `SELECT id, user_id, expires_at, used_at
       FROM password_reset_tokens
       WHERE token_hash = $1
       FOR UPDATE`,
      [tokenHash]
    );

    if (resetResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "This password reset link is invalid or has expired.",
      });
    }

    const resetRecord = resetResult.rows[0];

    if (resetRecord.used_at) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "This password reset link has already been used.",
      });
    }

    if (new Date(resetRecord.expires_at) <= new Date()) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "This password reset link has expired. Please request a new one.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await client.query(
      "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
      [passwordHash, resetRecord.user_id]
    );

    await client.query(
      "UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1",
      [resetRecord.id]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Password updated successfully. You can now log in with your new password.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to reset your password right now.",
    });
  } finally {
    client.release();
  }
});

// GET /api/auth/me
router.get("/me", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, campus, bio, created_at, updated_at, is_suspended
       FROM users WHERE id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user no longer exists",
      });
    }

    const user = result.rows[0];

    if (user.is_suspended) {
      return res.status(403).json({
        success: false,
        message: "Account is suspended",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        campus: user.campus,
        bio: user.bio,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch authenticated user",
    });
  }
});

module.exports = router;
