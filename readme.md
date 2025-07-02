# 🚀 B2B Tender Management Platform

A full-stack web application to manage tenders, company profiles, and proposals — tailored for B2B efficiency and scale.

---

## ✨ Features

- 🔐 User authentication with JWT
- 🏢 Company profile creation, update, delete
- 🖼️ Logo upload with Supabase Storage
- 📑 Tender listing with pagination
- 📨 Submit & track proposals
- 🔎 Company search (by name/industry/services)
- 📊 Personalized company dashboard
- 💅 Clean UI using TailwindCSS + shadcn/ui

---

## 🛠️ Tech Stack

**Frontend:**

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Axios
- Framer Motion
- React Hot Toast

**Backend:**

- Express.js + TypeScript
- PostgreSQL
- Supabase (for logo storage)
- JWT, Bcrypt
- Multer, CORS, dotenv

---

## 🧱 Project Structure

```
tender-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── index.ts
│   └── package.json
├── frontend/
│   ├── src/app/
│   ├── components/
│   ├── styles/
│   └── next.config.ts
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```
git clone https://github.com/your-username/tender-platform.git
cd tender-platform
```

---

## 🔧 Backend Setup

```
cd backend
npm install
cp .env.example .env
npm run dev
```

Make sure your `.env` file includes:

```
PORT=5000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

---

## 💻 Frontend Setup

```
cd frontend
npm install
npm install framer-motion
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npm run dev
```

Ensure `next.config.ts` allows Supabase images:

```ts
const nextConfig = {
  images: {
    domains: ['swqbbhdqhdophsbzzwbo.supabase.co'],
  },
}
```

---

## 🔌 Key API Endpoints

**Auth:**

- `POST /api/auth/register`
- `POST /api/auth/login`

**Company:**

- `POST /api/company/create`
- `GET /api/company/me`
- `PUT /api/company/update`
- `DELETE /api/company/delete`
- `POST /api/company/upload-logo`
- `GET /api/company/search`

**Tenders:**

- `GET /api/tender/all?page=1&limit=3`

**Proposals:**

- `POST /api/application/submit`
- `GET /api/application/my-proposals`

---

## 🧩 Install Everything in One Command

```
cd backend && npm install && cd ../frontend && npm install && npm install framer-motion && npx shadcn-ui@latest init && npx shadcn-ui@latest add button
```

---

## 🪪 License

MIT © 2025 Sarvesh Ghotekar