const twilio = require("twilio");

const sid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Twilio client configuration (optional in development)
const twilioClient =
  sid && sid.startsWith("AC") && authToken ? twilio(sid, authToken) : null;

module.exports = twilioClient;
