# 🚀 Supabase Setup - Quick Reference Card

## Step-by-Step Checklist

### □ Step 1: Create Account (2 minutes)
- Go to: **https://supabase.com**
- Click: **"Start your project"**
- Sign up with GitHub or Email
- Verify email if needed

### □ Step 2: Create Project (3 minutes)
- Click: **"New Project"**
- Enter:
  - Name: `proposaliq`
  - Password: [CREATE & SAVE THIS!]
  - Region: Closest to you
- Click: **"Create new project"**
- Wait 2-3 minutes

### □ Step 3: Get Credentials (1 minute)
- Click: **⚙️ Settings** (bottom left)
- Click: **Database**
- Find: **"Connection info"**
- Keep this tab open!

### □ Step 4: Update .env File (2 minutes)
Open: `backend/.env`

Change these lines:
```env
DB_HOST=db.xxxxxxxxxxxxxx.supabase.co  ← Copy from Supabase
DB_NAME=postgres                        ← Change to "postgres"
DB_PASSWORD=your_supabase_password      ← From Step 2
```

Save the file (Ctrl+S)

### □ Step 5: Run Schema (2 minutes)
In Supabase:
- Click: **SQL Editor**
- Open: `backend/src/models/schema.sql` on your computer
- Copy all content (Ctrl+A, Ctrl+C)
- Paste in SQL Editor (Ctrl+V)
- Click: **"Run"** (or Ctrl+Enter)
- See: "Success. No rows returned" ✅

Verify:
- Click: **Table Editor**
- See: **users** table ✅

### □ Step 6: Test Connection (1 minute)
```bash
cd backend
node validate-env.js
```

Should see: "✅ Database connection SUCCESSFUL!"

### □ Step 7: Start Application (1 minute)

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Terminal 2:**
```bash
cd frontend
npm start
```

**Browser:** http://localhost:3000

### □ Step 8: Test Registration
- Register a new account
- Should redirect to dashboard ✅
- Check Supabase Table Editor → users ✅

---

## 🎯 Total Time: ~12 minutes

---

## 📋 What You Need from Supabase

Copy these from **Settings → Database → Connection info:**

| Field | Value | Where to use |
|-------|-------|--------------|
| Host | `db.xxxxx.supabase.co` | `DB_HOST` in .env |
| Database | `postgres` | `DB_NAME` in .env |
| Port | `5432` | `DB_PORT` in .env |
| User | `postgres` | `DB_USER` in .env |
| Password | [you created this] | `DB_PASSWORD` in .env |

---

## 🔍 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Connection refused | Check DB_HOST in .env |
| Password auth failed | Check DB_PASSWORD in .env |
| Table doesn't exist | Run schema.sql again |
| Project paused | Click "Restore" in Supabase |

---

## ✅ Validation Commands

**Test environment:**
```bash
cd backend
node validate-env.js
```

**Test backend:**
```bash
cd backend
npm run dev
# Should see: "Connected to PostgreSQL database"
```

**Test API:**
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"OK",...}
```

---

## 🆘 Need Help?

Full detailed guide: **SUPABASE_SETUP_GUIDE.md**

Quick questions:
- Can't find Settings? Look bottom left (⚙️ icon)
- Lost password? Settings → Database → Reset password
- Project paused? Dashboard → Restore button

---

Ready? Let's start! Open: https://supabase.com
