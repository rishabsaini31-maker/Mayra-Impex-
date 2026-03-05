const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { supabase } = require("../config/supabase");

class PDFService {
  async generateOrderPDF(orderDetails) {
    return new Promise((resolve, reject) => {
      try {
        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, "../../temp");
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }

        const fileName = `order-${orderDetails.orderId}-${Date.now()}.pdf`;
        const filePath = path.join(tempDir, fileName);

        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        // Header
        doc
          .fontSize(24)
          .font("Helvetica-Bold")
          .text("Mayra Impex", { align: "center" })
          .moveDown(0.5);

        doc
          .fontSize(16)
          .font("Helvetica")
          .text("Wholesale Order Request", { align: "center" })
          .moveDown(1);

        // Divider
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

        // Order Info
        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .text(`Order ID: #${orderDetails.orderId}`)
          .font("Helvetica")
          .text(`Date: ${orderDetails.orderDate}`)
          .moveDown(1);

        // Divider
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

        // Customer Details
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text("Customer Details:")
          .moveDown(0.5);

        doc
          .fontSize(12)
          .font("Helvetica")
          .text(`Name: ${orderDetails.customer.name}`)
          .text(`Phone: ${orderDetails.customer.phone}`)
          .moveDown(1);

        if (orderDetails.delivery) {
          doc
            .fontSize(14)
            .font("Helvetica-Bold")
            .text("Delivery Details:")
            .moveDown(0.5);

          doc
            .fontSize(12)
            .font("Helvetica")
            .text(`Name: ${orderDetails.delivery.name || "-"}`)
            .text(`Phone: ${orderDetails.delivery.phone || "-"}`)
            .text(`Shop Name: ${orderDetails.delivery.shopName || "-"}`)
            .text(`Address: ${orderDetails.delivery.address || "-"}`)
            .moveDown(1);
        }

        // Divider
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

        // Products Header
        doc.fontSize(14).font("Helvetica-Bold").text("Products:").moveDown(0.5);

        // Table Header
        const tableTop = doc.y;
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text("Product Name", 50, tableTop, { width: 200 })
          .text("SKU", 255, tableTop, { width: 120 })
          .text("Quantity", 380, tableTop, { width: 70 })
          .text("Price", 455, tableTop, { width: 85 });

        doc
          .moveTo(50, tableTop + 20)
          .lineTo(550, tableTop + 20)
          .stroke();

        // Table Rows
        let yPosition = tableTop + 30;
        doc.font("Helvetica");

        orderDetails.items.forEach((item, index) => {
          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
          }

          const sku = item.serialNumber || item.serial_number || null;
          const productDisplayName = item.name;

          doc
            .fontSize(10)
            .text(productDisplayName, 50, yPosition, { width: 200 })
            .text(sku || "-", 255, yPosition, { width: 120 })
            .text(item.quantity.toString(), 380, yPosition, { width: 70 })
            .text(`₹${item.price.toFixed(2)}`, 455, yPosition, { width: 85 });

          yPosition += 25;
        });

        // Calculate total
        const total = orderDetails.items.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0,
        );
        const totalQuantity = orderDetails.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );

        yPosition += 10;
        doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();

        yPosition += 15;
        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .text("Total Quantity:", 320, yPosition)
          .text(totalQuantity.toString(), 420, yPosition);

        yPosition += 20;
        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .text("Total Amount:", 320, yPosition)
          .text(`₹${total.toFixed(2)}`, 420, yPosition);

        // Footer
        doc
          .moveDown(3)
          .fontSize(10)
          .font("Helvetica-Oblique")
          .text("This is an order request, not a confirmed invoice.", {
            align: "center",
          })
          .moveDown(0.5)
          .text("Payment and delivery terms will be confirmed separately.", {
            align: "center",
          });

        doc.end();

        stream.on("finish", () => {
          resolve(filePath);
        });

        stream.on("error", reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  async uploadPDFToStorage(pdfPath, orderId) {
    try {
      const fileName = `order-${orderId}-${Date.now()}.pdf`;
      const fileBuffer = fs.readFileSync(pdfPath);

      const { data, error } = await supabase.storage
        .from("order-pdfs")
        .upload(fileName, fileBuffer, {
          contentType: "application/pdf",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("order-pdfs").getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Upload PDF error:", error);
      throw error;
    }
  }

  deleteTempPDF(pdfPath) {
    try {
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    } catch (error) {
      console.error("Delete temp PDF error:", error);
    }
  }
}

module.exports = new PDFService();
