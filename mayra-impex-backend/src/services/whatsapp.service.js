const twilioClient = require("../config/twilio");

class WhatsAppService {
  async sendOrderWhatsApp(orderDetails, pdfUrl) {
    if (!twilioClient) {
      console.warn("⚠️ Twilio not configured. Skipping WhatsApp notification.");
      return null;
    }

    try {
      const destinationWhatsApp =
        process.env.ORDER_NOTIFICATION_WHATSAPP || "whatsapp:+917276193438";

      const itemsList = orderDetails.items
        .map((item) => `• ${item.name} (Qty: ${item.quantity})`)
        .join("\n");

      const message = `
🛍️ *New Order - Mayra Impex*

📋 *Order ID:* #${orderDetails.orderId}
📅 *Date:* ${orderDetails.orderDate}

👤 *Customer Details:*
Name: ${orderDetails.customer.name}
Phone: ${orderDetails.customer.phone}

🚚 *Delivery Details:*
Name: ${orderDetails.delivery?.name || "-"}
Phone: ${orderDetails.delivery?.phone || "-"}
Shop: ${orderDetails.delivery?.shopName || "-"}
Address: ${orderDetails.delivery?.address || "-"}

📦 *Products:*
${itemsList}

📄 *PDF Link:*
${pdfUrl}

---
_Mayra Impex B2B Ordering System_
      `.trim();

      const result = await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: destinationWhatsApp,
        body: message,
        mediaUrl: pdfUrl ? [pdfUrl] : undefined,
      });

      console.log("✅ WhatsApp sent:", result.sid);
      return result;
    } catch (error) {
      console.error("❌ WhatsApp error:", error);
      // Don't throw error - WhatsApp is optional
      // The order should still succeed even if WhatsApp fails
    }
  }
}

module.exports = new WhatsAppService();
