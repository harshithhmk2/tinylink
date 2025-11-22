# TinyLink – URL Shortener | Next.js + Neon Postgres

TinyLink is a lightweight and elegant URL-shortening web application (similar to Bit.ly) built using **Next.js (Pages Router)**, **Neon Postgres**, and **Tailwind CSS**.

It supports:

✔ Short link creation  
✔ Custom short codes  
✔ Redirect tracking  
✔ Click analytics  
✔ Last-clicked timestamps  
✔ Delete links  
✔ Dashboard & Stats Page  
✔ Healthcheck endpoint (for autograder)

This project is fully deployed on **Vercel**.

---

# 🚀 Live Demo
🔗 **Production URL:**  
https://<your-vercel-project>.vercel.app

📂 **GitHub Repository:**  
https://github.com/harshithhmk2/tinylink

---

# 🛠️ Tech Stack

| Area | Technology |
|------|-------------|
| Frontend | Next.js 16 (Pages Router) |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Neon Postgres |
| Hosting | Vercel |
| Language | JavaScript (Node.js) |

---

# 📦 Features

### 🔗 Create Short Links
- Enter a long URL  
- Optionally enter a custom short code  
- Validates URL format  
- Validates code with pattern: **[A-Za-z0-9]{6,8}**  
- Shows success/error messages  

### 🚀 Redirect
- Access `/shortcode` → HTTP 302 redirect  
- Automatically increments click count  
- Updates `last_clicked` timestamp  

### 📊 Dashboard
Displays all links with:
- Short code  
- Target URL  
- Total clicks  
- Last clicked time  
- Copy short URL  
- Delete button  
- Search/filter by code or URL  
- Responsive layout  
- Truncated long URLs (ellipsis)  

### 📈 Stats Page (`/code/:code`)
Shows detailed analytics:
- Original URL  
- Click count  
- Last clicked  
- Created time  

### ❤️ Healthcheck (`/healthz`)
Returns:
```json
{
  "ok": true,
  "version": "1.0"
}
```

---

# 📁 Project Structure

```
tinylink/
 ├── pages/
 │    ├── index.js              → Dashboard
 │    ├── [code].js             → Redirect handler
 │    ├── code/
 │    │     └── [code].js       → Stats page
 │    └── api/
 │          ├── healthz.js      → Healthcheck
 │          └── links/
 │                ├── index.js  → List + Create links
 │                └── [code].js → Get + Delete link
 ├── lib/
 │    └── db.js                 → Postgres database pool
 ├── styles/
 │    └── globals.css
 ├── public/
 ├── tailwind.config.js
 ├── postcss.config.js
 ├── next.config.js
 ├── package.json
 └── README.md
```

---

# 🗄️ Database Schema

Create this table in Neon Postgres:

```sql
CREATE TABLE IF NOT EXISTS links (
  code VARCHAR(8) PRIMARY KEY,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  clicks BIGINT NOT NULL DEFAULT 0,
  last_clicked TIMESTAMPTZ
);
```

---

# 🔑 Environment Variables

Create `.env.local`:

```
DATABASE_URL=postgresql://<your-neon-credentials>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

On Vercel (Production):

```
DATABASE_URL=postgresql://<your-neon-credentials>
NEXT_PUBLIC_BASE_URL=https://<your-vercel-domain>.vercel.app
```

---

# 🧪 API Documentation

### POST `/api/links`
Create a short link  
Body:
```json
{
  "url": "https://google.com",
  "code": "abc123"
}
```

Responses:
- `201 Created`
- `409 Conflict` (duplicate code)
- `400 Bad Request` (invalid URL or code)

---

### GET `/api/links`
List all links.

---

### GET `/api/links/:code`
Return stats for a specific code.

---

### DELETE `/api/links/:code`
Deletes the link.

---

# ▶️ Running Locally

```
npm install
npm run dev
```

Visit:
```
http://localhost:3000
```

---

# 🚀 Deployment (Vercel)

1. Push repo to GitHub  
2. Import repo in Vercel  
3. Add environment variables  
4. Hit **Deploy**  
5. Update `NEXT_PUBLIC_BASE_URL`  
6. Redeploy  

---

# 🤖 AI Assistance

Some parts of the UI, README, and debugging steps were assisted using ChatGPT as permitted by the assignment.  
All logic and implementation details are fully understood and written by me.

---

# ✨ Author
**K. Harshith**
