import nodemailer from "nodemailer";
import { env } from "../config/env.js";
export class EmailSenderTool {
  transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    });
  }
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log("\u2705 SMTP connection verified");
      return true;
    } catch (error) {
      console.error("\u274C SMTP connection failed:", error);
      return false;
    }
  }
  async send(input) {
    try {
      const info = await this.transporter.sendMail({
        from: `"${env.FROM_NAME}" <${env.FROM_EMAIL}>`,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html || input.text
      });
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error("Email send error:", error);
      return {
        success: false,
        error: error.message || "Failed to send email"
      };
    }
  }
}
