# Mail Webhook — שליחת מייל דרך SMTP של cPanel

Serverless function ל-Vercel שחושפת endpoint אחד:

```
POST /api/send-email
Headers: Content-Type: application/json, x-api-key: <WEBHOOK_SECRET>
Body: { "to": "...", "subject": "...", "html": "..." }
```

## הגדרה ב-Vercel

Settings → Environment Variables, והוסף את המשתנים מ-`.env.example`:
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `WEBHOOK_SECRET` (ואופציונלי `ALLOWED_ORIGIN`).

פרטי ה-SMTP של cPanel נמצאים ב: Email Accounts → Connect Devices → Mail Client Manual Settings.
בדרך כלל: host = `mail.yourdomain.com`, port = 465 (SSL), user = כתובת המייל המלאה.

## בדיקה

```bash
curl -X POST https://YOUR-PROJECT.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_SECRET" \
  -d '{"to":"leon.kipy@gmail.com","subject":"בדיקה","text":"עובד!"}'
```

## שימוש מ-Lovable

```ts
await fetch("https://YOUR-PROJECT.vercel.app/api/send-email", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_MAIL_WEBHOOK_KEY,
  },
  body: JSON.stringify({
    to: "user@example.com",
    subject: "שלום",
    html: "<h1>ההודעה שלך</h1>",
  }),
});
```

הערה: קריאה מהפרונט חושפת את המפתח למי שפותח DevTools. אם האפליקציה משתמשת
ב-Supabase, עדיף לקרוא ל-webhook מתוך Edge Function ולשמור את המפתח בצד השרת.
