# Saumarghya Portfolio — Backend API

Node.js + Express + MongoDB + AWS S3 backend for the personal portfolio website.

---

## Tech Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Image Storage**: AWS S3
- **Auth**: JWT (single admin)
- **Email**: Nodemailer (Gmail SMTP)

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.ts          # MongoDB connection
│   │   └── s3.ts          # AWS S3 client
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── profileController.ts
│   │   ├── projectController.ts
│   │   └── contactController.ts
│   ├── middleware/
│   │   ├── auth.ts        # JWT middleware
│   │   └── upload.ts      # Multer + S3 upload
│   ├── models/
│   │   ├── Profile.ts
│   │   ├── Project.ts
│   │   └── Contact.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── profile.ts
│   │   ├── projects.ts
│   │   └── contact.ts
│   └── server.ts
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```
Fill in all values in `.env`:
- `MONGODB_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — any long random string
- `ADMIN_PASSWORD` — bcrypt hash of your admin password (generate below)
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION` / `AWS_S3_BUCKET_NAME`
- `EMAIL_USER` / `EMAIL_PASS` — Gmail + App Password (enable 2FA → App Passwords)

### 3. Generate bcrypt hash for ADMIN_PASSWORD
```bash
node -e "const b=require('bcryptjs'); b.hash('your_password',10).then(console.log)"
```
Paste the output as `ADMIN_PASSWORD` in `.env`.

### 4. Run in development
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
npm start
```

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login → returns JWT token |

### Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/profile` | ❌ | Get profile info + image URLs |
| PUT | `/api/profile` | ✅ | Update profile text info |
| POST | `/api/profile/images` | ✅ | Upload profile image to S3 |
| DELETE | `/api/profile/images/:key` | ✅ | Delete profile image from S3 |

### Projects
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects` | ❌ | Get all projects |
| GET | `/api/projects/featured` | ❌ | Get featured projects only |
| GET | `/api/projects/:id` | ❌ | Get single project |
| POST | `/api/projects` | ✅ | Create project (with optional image) |
| PUT | `/api/projects/:id` | ✅ | Update project |
| DELETE | `/api/projects/:id` | ✅ | Delete project + S3 image |

### Contact
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/contact` | ❌ | Submit contact form (saves to DB + sends email) |
| GET | `/api/contact` | ✅ | Get all messages (admin) |
| PATCH | `/api/contact/:id/read` | ✅ | Mark message as read |

### Health Check
```
GET /health
```

---

## AWS S3 Setup
1. Create an S3 bucket (e.g. `saumarghya-portfolio`)
2. Set bucket region to `ap-south-1` (Mumbai) or your preferred region
3. Enable **public read** on the bucket (or use pre-signed URLs)
4. Create an IAM user with `AmazonS3FullAccess` and copy the credentials to `.env`

---

## Deployment Options
- **Render** — free tier, easy Node.js deploy, connect env vars via dashboard
- **Railway** — fast deploys, great DX
- **AWS EC2** — full control, pair with your existing AWS setup
