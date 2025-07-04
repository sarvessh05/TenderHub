# 🔧 Architecture Overview – B2B Tender Management Platform

## 🧰 Tech Stack

- **Frontend**: Next.js (App Router) + Tailwind CSS + TypeScript
- **Backend**: Express.js (Node.js)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth (JWT-based)
- **Storage**: Supabase Storage (for logo uploads)
- **UI**: shadcn/ui + framer-motion
- **API Format**: RESTful endpoints prefixed with `/api`

---

## 🔐 Authentication Flow

1. User registers or logs in via `/api/auth/register` or `/login`
2. Supabase returns a JWT token stored in localStorage
3. All protected requests use: Authorization: Bearer <token>
4. Backend middleware (`verifyToken`) validates JWT
5. On success, user ID is added to `req.user` for downstream use

---

## 📦 File Upload (Logo)

- Frontend submits a `FormData` payload with image
- Express uses `multer.memoryStorage()` to extract `req.file`
- File is uploaded to Supabase Storage via SDK
- Public URL is fetched and stored in the `companies.logo_url` field

---

## 🧪 API Design Highlights

### Company

- `POST /api/company/create` → Create company profile
- `GET /api/company/me` → Fetch own company
- `POST /api/company/upload-logo` → Upload company logo
- `PUT /api/company/update` → Update profile
- `DELETE /api/company/delete` → Remove company

### Tender

- `GET /api/tender` → Fetch all tenders
- `POST /api/tender/create` → Post a new tender
- `PUT /api/tender/update/:id` → Update tender
- `DELETE /api/tender/delete/:id` → Remove tender

### Application

- `POST /api/application/submit` → Submit a proposal
- `GET /api/application/my` → See proposals submitted

---

## 📈 Ready for Production

- .env based configuration
- CORS and security headers enabled
- Scalable RESTful architecture
- Code-split, documented, and minimal coupling

---