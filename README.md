# Saumarghya Ray — Personal Portfolio
Full-stack personal portfolio with React frontend + Node.js/Express backend + MongoDB + AWS S3.

---

## Folder Structure
```
Saumarghya_Personal_Website/
├── frontend/    ← React + Vite + TypeScript (port 5173)
└── backend/     ← Node.js + Express + MongoDB (port 5000)
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js v18+ → https://nodejs.org
- MongoDB Atlas account (free) → https://mongodb.com/atlas
- AWS account with S3 bucket

---

### Terminal 1 — Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in .env (see section below)
npm run dev
```
✅ Expected: `MongoDB connected` + `Server running on http://localhost:5000`

---

### Terminal 2 — Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set: VITE_API_URL=http://localhost:5000
npm run dev
```
✅ Opens at: `http://localhost:5173`

---

## ⚙️ Backend .env Setup

Open `backend/.env` and fill in:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio?retryWrites=true&w=majority

# JWT — generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_long_random_string
JWT_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=saumarghya-portfolio

# Gmail App Password (Gmail → Security → 2FA → App Passwords)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=samray252102@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_TO=samray252102@gmail.com

# Admin password bcrypt hash
# Generate: node -e "require('bcryptjs').hash('yourpassword',10).then(console.log)"
ADMIN_PASSWORD=$2b$10$your_hash_here

FRONTEND_URL=http://localhost:5173
```

---

## 🔐 Admin Dashboard
URL: `http://localhost:5173/admin`

| Tab | What you can do |
|-----|----------------|
| Overview | Stats across all content |
| Projects | Add/edit/delete projects + images |
| Gallery | Create albums (Travel, Fitness, etc.), upload photos |
| Notes & Posts | Write Markdown posts, publish/draft toggle |
| Messages | View contact form submissions, reply |
| Profile | Edit bio, links, upload profile photos |

---

## URLs
| URL | Description |
|-----|-------------|
| `http://localhost:5173` | Portfolio website |
| `http://localhost:5173/admin` | Admin dashboard |
| `http://localhost:5000/health` | Backend health check |
