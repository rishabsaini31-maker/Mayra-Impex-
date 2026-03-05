const nodemailer = require("nodemailer");

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP only when explicitly enabled to avoid startup timeouts on some hosts.
if (process.env.EMAIL_VERIFY_ON_STARTUP === "true") {
  transporter.verify((error) => {
    if (error) {
      console.error("❌ Email configuration error:", error.message);
    } else {
      console.log("✅ Email service is ready");
    }
  });
}

module.exports = transporter;
