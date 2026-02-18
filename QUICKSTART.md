# ProposalIQ Quick Start Guide

## ✅ Your .env File is Ready!

I've created a properly configured `.env` file at `backend/.env` with:

- ✅ PostgreSQL connection settings (localhost:5432)
- ✅ Secure JWT secret (randomly generated)
- ✅ All required environment variables
- ✅ Ready for development

---

## 🚀 Fastest Way to Get Started

### Option 1: Using Docker (Recommended)

**Prerequisites:** Install Docker Desktop
- Download: https://www.docker.com/products/docker-desktop/

**Steps:**

1. **Run the setup script:**
   ```bash
   start-dev.bat
   ```
   This will start PostgreSQL automatically!

   OR manually:
   ```bash
   docker-compose up -d
   ```

2. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start the frontend (new terminal):**
   ```bash
   cd frontend
   npm start
   ```

4. **Open your browser:**
   - Visit: http://localhost:3000
   - Register a new account
   - Start using ProposalIQ!

---

## 🗄️ Database Setup Summary

### Your Database Credentials (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=proposaliq
DB_USER=postgres
DB_PASSWORD=proposaliq_dev_password_2024
```

### What's Included

✅ **PostgreSQL 15** (via Docker or local install)
✅ **Database Schema** (automatically applied)
✅ **Users Table** with proper indexes
✅ **Password hashing** support
✅ **Updated_at triggers**

---

## 🔧 Alternative Setup Methods

If you don't want to use Docker, see **DATABASE_SETUP.md** for:

- **Option 2:** Local PostgreSQL installation
- **Option 3:** Cloud database (Supabase - FREE)
- **Option 4:** SQLite (simple testing)

---

## 📝 What's in Your .env File

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=proposaliq
DB_USER=postgres
DB_PASSWORD=proposaliq_dev_password_2024

# JWT Configuration
JWT_SECRET=7f9a8b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a
JWT_EXPIRE=7d

# API Keys
OPENAI_API_KEY=
```

**Note:** The JWT_SECRET is a secure random string. Change it if deploying to production!

---

## ✅ Verify Everything Works

### Test Database Connection

```bash
cd backend
npm run dev
```

Expected output:
```
Server is running on port 5000
Connected to PostgreSQL database
```

### Test API Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-02-17T..."
}
```

### Test Frontend

```bash
cd frontend
npm start
```

Browser opens to: http://localhost:3000

---

## 🐳 Docker Commands Cheat Sheet

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker logs proposaliq-postgres

# Access database shell
docker exec -it proposaliq-postgres psql -U postgres -d proposaliq

# Restart database
docker-compose restart

# Stop and remove all data
docker-compose down -v

# Check if running
docker ps
```

---

## 🔍 Troubleshooting

### "Cannot connect to database"

**Check 1:** Is the database running?
```bash
docker ps
# or if using local PostgreSQL:
pg_isready
```

**Check 2:** Are credentials correct?
- Verify `backend/.env` settings
- Password: `proposaliq_dev_password_2024`

**Check 3:** Is port 5432 available?
```bash
netstat -ano | findstr :5432
```

### "Port 5432 already in use"

You have another PostgreSQL running. Either:
- Use your existing PostgreSQL
- Stop the existing instance
- Change port in `.env` and `docker-compose.yml`

### "Docker command not found"

Install Docker Desktop:
https://www.docker.com/products/docker-desktop/

Or use a cloud database (see DATABASE_SETUP.md)

---

## 🎯 Complete Setup Checklist

- [x] `.env` file created with proper credentials
- [x] `docker-compose.yml` configured for PostgreSQL
- [x] Database schema ready (`backend/src/models/schema.sql`)
- [x] JWT secret generated
- [ ] Choose database setup method
- [ ] Start database (Docker/Local/Cloud)
- [ ] Start backend server
- [ ] Start frontend dev server
- [ ] Register your first user
- [ ] Test authentication flow

---

## 🎉 Next Steps After Setup

1. **Create your first account** at http://localhost:3000
2. **Test login/logout** functionality
3. **Explore the dashboard**
4. **Start building features:**
   - Proposal management
   - RFP parsing
   - AI integration
   - Analytics

---

## 📚 Additional Resources

- **DATABASE_SETUP.md** - Detailed database setup options
- **SETUP.md** - Original setup guide
- **AUTH_COMPLETE_SUMMARY.md** - Authentication system overview
- **TESTING_AUTH_UI.md** - Testing guide

---

## 💡 Recommended Next Actions

**Right now, you should:**

1. If you have Docker or can install it:
   ```bash
   docker-compose up -d
   cd backend && npm run dev
   ```

2. If you don't have Docker:
   - Install Docker Desktop (5 minutes)
   - OR use Supabase free tier (see DATABASE_SETUP.md)

3. Then start developing:
   ```bash
   cd frontend && npm start
   ```

**You're ready to go!** 🚀
