// utils/emailService.js
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // 🧠 Ensure the `to` field is a string (Resend requires this)
    const recipient = Array.isArray(to)
      ? to.join(", ")
      : to?.toString()?.trim();

    if (!recipient) {
      throw new Error("Recipient email (`to`) is missing or invalid.");
    }

    const data = await resend.emails.send({
      from: "WeEditCo <noreply@weeditco.com>", // <-- update here
      to: recipient,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
};
