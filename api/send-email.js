import nodemailer from "nodemailer";

// CORS — מאפשר קריאה ישירות מהפרונט של Lovable
function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // אימות — מונע שכל אחד ישלח מיילים דרך השרת שלך
  if (req.headers["x-api-key"] !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { to, subject, html, text, replyTo } = req.body || {};
  if (!to || !subject || (!html && !text)) {
    return res.status(400).json({ error: "Missing fields: to, subject, html/text" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,          // למשל mail.yourdomain.com
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465, // 465=SSL, 587=STARTTLS
      auth: {
        user: process.env.SMTP_USER,        // כתובת המייל המלאה
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
      replyTo,
    });

    return res.status(200).json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error("SMTP error:", err.message);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
