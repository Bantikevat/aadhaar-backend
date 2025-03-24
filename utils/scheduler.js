const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const sendEmail = require("./email"); // Nodemailer setup

// हर 5 मिनट में चेक करेगा और रिमाइंडर भेजेगा
cron.schedule("*/5 * * * *", async () => {
  try {
    const now = new Date();
    
    // 🔍 सभी अनसेंट रिमाइंडर्स को ढूंढें
    const reminders = await Reminder.find({
      time: { $lte: now },
      isSent: false,
    }).populate("userId");

    console.log(`🔍 Found ${reminders.length} reminders to send.`);

    for (const reminder of reminders) {
      if (reminder.userId && reminder.userId.email) {
        try {
          console.log(`📩 Sending email to: ${reminder.userId.email}`);

          await sendEmail({
            to: reminder.userId.email,
            subject: `💊 ${reminder.medicine} का समय`,
            text: `नमस्ते ${reminder.userId.name},\nआपकी दवा ${reminder.medicine} (${reminder.dosage}) का समय हो गया है।`,
          });

          // ✅ रिमाइंडर को भेजा गया, isSent को true कर दें
          reminder.isSent = true;
          await reminder.save();

          console.log(`✅ Reminder sent & updated for ${reminder.userId.email}`);
        } catch (emailError) {
          console.error(`❌ Email Send Error for ${reminder.userId.email}:`, emailError.message);
        }
      } else {
        console.warn(`⚠️ Reminder skipped: No valid email for user ${reminder.userId?.name || "Unknown"}`);
      }
    }
  } catch (error) {
    console.error("❌ Reminder Cron Job Error:", error);
  }
});
