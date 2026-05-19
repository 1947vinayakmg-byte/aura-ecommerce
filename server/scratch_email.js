const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

async function testEmail() {
  console.log("Creating transporter...");
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "PRESENT" : "MISSING");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    console.log("Sending test email...");
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "AURA - SMTP Connection Test",
      html: "<h3>SMTP Connection Successful!</h3>",
    });
    console.log("Email sent successfully!", info.messageId);
  } catch (err) {
    console.error("SMTP sending failed with error:", err);
  }
}

testEmail();
