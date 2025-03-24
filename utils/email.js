const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send Email Function
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient Email Address
 * @param {string} options.subject - Email Subject
 * @param {string} options.text - Email Body (Plain Text)
 */
const sendEmail = async ({ to, subject, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Health Tracker" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
    });

    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    
    // Additional error debugging
    if (error.response) {
      console.error("📩 Server Response:", error.response);
    }
  }
};

module.exports = sendEmail;
