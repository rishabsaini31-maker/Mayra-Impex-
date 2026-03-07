// SendGrid email service for Node.js
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send an email using SendGrid
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} [options.html] - HTML content (optional)
 * @param {Array} [options.attachments] - Attachments (optional, see SendGrid docs)
 */
async function sendEmail({ to, subject, text, html, attachments }) {
  const msg = {
    to,
    from: process.env.ORDER_NOTIFICATION_EMAIL || process.env.EMAIL_USER,
    subject,
    text,
    html,
    attachments: attachments?.map((att) => ({
      content: att.content, // base64 string
      filename: att.filename,
      type: att.type,
      disposition: att.disposition || "attachment",
    })),
  };
  try {
    await sgMail.send(msg);
    console.log("✅ SendGrid email sent");
  } catch (error) {
    console.error("❌ SendGrid send error:", error);
    throw error;
  }
}

module.exports = { sendEmail };
