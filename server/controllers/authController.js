const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { credential, accessToken } = req.body;
    let email, name;

    if (credential) {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
    } else if (accessToken) {
      const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error_description || "Failed to fetch user info from Google");
      }
      email = data.email;
      name = data.name;
    } else {
      return res.status(400).json({ message: "No Google credential or access token provided" });
    }

    if (!email) {
      return res.status(400).json({ message: "Could not retrieve email from Google" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        name: name || "Google User",
        email,
        password: hashedPassword,
        role: "user",
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      message: error.message || "Google login failed",
    });
  }
};

// ─── Forgot Password ─────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    // Force the forgot password flow to always target and reset the master admin account 'neetvinayakmg@gmail.com'
    const targetEmail = "neetvinayakmg@gmail.com";
    const user = await User.findOne({ email: targetEmail });

    if (!user) {
      return res.status(404).json({
        message: `Master administrator account '${targetEmail}' not found in the database.`,
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: `Access denied. The master account '${targetEmail}' does not have administrator privileges.`,
      });
    }

    // Generate raw token and its hashed form
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    // Dynamically detect the requesting website's origin to build the perfect reset URL
    let adminBaseUrl = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : "https://aura-ecommerce-ouuz.vercel.app");
    if (adminBaseUrl.endsWith("/")) {
      adminBaseUrl = adminBaseUrl.slice(0, -1);
    }
    const resetUrl = `${adminBaseUrl}/reset-password/${rawToken}`;

    const html = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid rgba(212,175,55,0.2);">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 32px; color: #d4af37; margin: 0; letter-spacing: 4px;">AURA</h1>
          <p style="color: #a1a1aa; font-size: 11px; letter-spacing: 4px; margin: 4px 0 0; text-transform: uppercase;">Maison de Luxe — Admin</p>
        </div>
        <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 12px;">Password Reset Request</h2>
        <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">You requested to reset your administrator password. Click the button below to proceed. This link expires in <strong style="color:#d4af37;">30 minutes</strong>.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: #d4af37; color: #000000; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 36px; border-radius: 12px; letter-spacing: 2px; text-transform: uppercase;">Reset Password</a>
        </div>
        <p style="color: #71717a; font-size: 12px; text-align: center;">If you did not request this, please ignore this email — your password will remain unchanged.</p>
        <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;" />
        <p style="color: #3f3f46; font-size: 11px; text-align: center;">© ${new Date().getFullYear()} AURA Maison de Luxe. All rights reserved.</p>
      </div>
    `;

    // Send email in the background so the request doesn't hang if SMTP times out
    sendEmail(user.email, "AURA Admin — Password Reset", html).catch((err) => {
      console.error("Background sendEmail failed:", err);
    });

    res.status(200).json({
      message: "A password reset link has been successfully sent to the master admin email (neetvinayakmg@gmail.com).",
    });
  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(500).json({ message: "Failed to send reset email. Please try again." });
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or has expired." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully. You may now log in." });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  googleLogin,
  forgotPassword,
  resetPassword,
};