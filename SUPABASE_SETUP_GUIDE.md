# 🚀 Supabase Setup Guide for ProposalIQ

Complete step-by-step guide to set up your free Supabase database.

---

## Step 1: Create Supabase Account

1. **Visit Supabase:**
   - Go to: https://supabase.com
   - Click the green **"Start your project"** button

2. **Sign up:**
   - You can sign up with:
     - GitHub account (recommended - fastest)
     - Email and password

3. **Verify your email** (if using email signup)
   - Check your inbox
   - Click the verification link

4. **You're logged in!**
   - You'll see the Supabase dashboard

---

## Step 2: Create Your ProposalIQ Project

1. **On the Supabase Dashboard:**
   - Click **"New Project"** button (green button)

2. **Fill in the project details:**
   - **Name:** `proposaliq` (or any name you prefer)
   - **Database Password:** Create a strong password
     - ⚠️ **IMPORTANT:** Copy this password immediately!
     - You'll need it in a moment
     - Supabase will not show it again
   - **Region:** Choose closest to you
     - US East (recommended for USA)
     - Europe (for EU)
     - Asia Pacific (for Asia)
   - **Pricing Plan:** Free (selected by default)

3. **Click "Create new project"**
   - Wait 2-3 minutes while Supabase sets up your database
   - You'll see a progress indicator

---

## Step 3: Get Your Database Credentials

Once your project is ready:

1. **Go to Project Settings:**
   - Click the **⚙️ Settings** icon in the bottom left
   - Or click your project name → Settings

2. **Navigate to Database:**
   - In the left sidebar under Settings
   - Click **"Database"**

3. **Find Connection Info:**
   - Scroll down to **"Connection info"** section
   - You'll see several fields:

4. **Copy these values:**

   ```
   Host:     db.xxxxxxxxxxxxxx.supabase.co
   Database: postgres
   Port:     5432
   User:     postgres
   Password: [the password you set earlier]
   ```

   **Note:** Keep this tab open, you'll need these values next!

---

## Step 4: Update Your .env File

1. **Open your .env file:**
   - Location: `backend/.env`
   - Open in any text editor (Notepad, VS Code, etc.)

2. **Update the database configuration:**

   Replace these lines:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=proposaliq
   DB_USER=postgres
   DB_PASSWORD=proposaliq_dev_password_2024
   ```

   With your Supabase values:
   ```env
   DB_HOST=db.xxxxxxxxxxxxxx.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your_supabase_password_here
   ```

   **Important changes:**
   - `DB_HOST`: Use the Host from Supabase (db.xxxxx.supabase.co)
   - `DB_NAME`: Change to `postgres` (not `proposaliq`)
   - `DB_PASSWORD`: Use the password you created in Step 2

3. **Save the file** (Ctrl+S)

---

## Step 5: Run the Database Schema

Now we need to create the users table in your Supabase database.

### Method 1: Using Supabase SQL Editor (Recommended)

1. **Go to SQL Editor:**
   - In Supabase dashboard
   - Click **"SQL Editor"** in the left sidebar
   - You'll see an empty SQL query editor

2. **Open your schema file:**
   - On your computer, open: `backend/src/models/schema.sql`
   - Select ALL the content (Ctrl+A)
   - Copy it (Ctrl+C)

3. **Paste into Supabase:**
   - Back in Supabase SQL Editor
   - Paste the schema (Ctrl+V)
   - You should see all the SQL code

4. **Run the query:**
   - Click the **"Run"** button (or press Ctrl+Enter)
   - Wait a few seconds
   - You should see: "Success. No rows returned"

5. **Verify it worked:**
   - Click **"Table Editor"** in the left sidebar
   - You should see a **"users"** table
   - Click on it to see the columns: id, email, password, name, created_at, updated_at

### Method 2: Using Command Line

If you prefer command line:

```bash
# From your project root
cd backend

# Install Supabase CLI (optional)
npm install -g supabase

# Or use psql directly with connection string
psql "postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres" -f src/models/schema.sql
```

---

## Step 6: Test the Connection

Let's verify everything is connected correctly:

1. **Open a terminal in your project:**
   ```bash
   cd backend
   ```

2. **Start the backend server:**
   ```bash
   npm run dev
   ```

3. **Check the output:**
   - ✅ You should see:
     ```
     Server is running on port 5000
     Connected to PostgreSQL database
     ```

   - ❌ If you see an error:
     - Double-check your .env credentials
     - Make sure Host and Password are correct
     - Verify the schema was run successfully

4. **Test the health endpoint:**
   - Open a new terminal
   - Run:
     ```bash
     curl http://localhost:5000/api/health
     ```
   - Should return:
     ```json
     {
       "status": "OK",
       "timestamp": "2024-02-17T..."
     }
     ```

---

## Step 7: Start Your Application

Everything is ready! Now start both servers:

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Expected output:
```
Server is running on port 5000
Connected to PostgreSQL database
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

Expected output:
```
Compiled successfully!
You can now view frontend in the browser.
  Local:            http://localhost:3000
```

### Browser
- Automatically opens to http://localhost:3000
- You should see the ProposalIQ login page

---

## Step 8: Test Authentication

1. **Register a new account:**
   - Click "Register here" (or "Register" tab if using toggle UI)
   - Fill in:
     - Name: Your Name
     - Email: your@email.com
     - Password: password123
     - Confirm Password: password123
   - Click "Register"

2. **You should:**
   - ✅ See a success message
   - ✅ Be redirected to the dashboard
   - ✅ See "Welcome, Your Name!" in the nav

3. **Verify in Supabase:**
   - Go back to Supabase dashboard
   - Click "Table Editor" → "users"
   - You should see your new user!
   - Notice the password is hashed (not plain text) ✅

4. **Test logout:**
   - Click "Logout" button
   - Should redirect to login page

5. **Test login:**
   - Enter your email and password
   - Click "Login"
   - Should redirect to dashboard ✅

---

## 🎉 Success Checklist

- [x] Supabase account created
- [x] ProposalIQ project created
- [x] Database credentials obtained
- [x] .env file updated
- [x] Schema SQL executed
- [x] Backend connects to database
- [x] Frontend loads correctly
- [x] Can register new users
- [x] Can login/logout
- [x] User data appears in Supabase

**If all boxes are checked, you're done!** 🚀

---

## 🔍 Troubleshooting

### "Connection refused" or "Connection timeout"

**Cause:** Wrong host or network issue

**Fix:**
1. Verify `DB_HOST` in .env matches Supabase exactly
2. Check your internet connection
3. Make sure Supabase project is not paused (happens after inactivity)

### "Password authentication failed"

**Cause:** Wrong password

**Fix:**
1. Double-check password in .env
2. Make sure there are no extra spaces
3. If forgotten, you can reset database password in Supabase Settings

### "Database does not exist"

**Cause:** Wrong database name

**Fix:**
1. Make sure `DB_NAME=postgres` (not `proposaliq`)
2. Supabase uses `postgres` as the default database name

### "Table does not exist"

**Cause:** Schema not run

**Fix:**
1. Go to Supabase SQL Editor
2. Re-run the schema.sql content
3. Verify in Table Editor that `users` table exists

### "Supabase project is paused"

**Cause:** Free tier projects pause after 1 week of inactivity

**Fix:**
1. Go to Supabase dashboard
2. Click "Restore" button
3. Wait 1-2 minutes for it to restart

---

## 📊 Supabase Dashboard Features

While you're in Supabase, explore these useful features:

### Table Editor
- View and edit data directly
- See all users, proposals, etc.
- Add/delete rows manually

### SQL Editor
- Run custom SQL queries
- Create reports
- Test queries

### Database → Backups
- Automatic daily backups (free tier)
- Restore if something goes wrong

### Auth (Optional for Later)
- Supabase has built-in auth
- You can migrate to it later if you want
- Currently you're using your custom JWT auth

### API
- Auto-generated REST and GraphQL APIs
- If you want to use them later

---

## 🔒 Security Notes

### Free Tier Limits
- 500 MB database storage
- 1 GB file storage
- 2 GB bandwidth per month
- Unlimited API requests
- Perfect for development!

### Keep Secure
- ✅ .env file is in .gitignore (not committed to git)
- ✅ Never share your database password
- ✅ Database is protected by Supabase firewall
- ✅ SSL/TLS encryption for all connections

### For Production
When you deploy:
1. Use environment variables (not .env file)
2. Use a stronger database password
3. Consider upgrading to Pro tier for better performance
4. Enable database backups

---

## 💰 Pricing (as of 2024)

**Free Tier (what you're using):**
- ✅ 500 MB database
- ✅ Unlimited API requests
- ✅ 50,000 monthly active users
- ✅ 1 GB file storage
- ✅ Perfect for development and small apps

**If you need more:**
- Pro: $25/month (8 GB database, 250 GB bandwidth)
- Scale: Custom pricing

**For ProposalIQ development, Free tier is more than enough!**

---

## 📝 Your Supabase Details (Save These!)

**Project Name:** proposaliq
**Project URL:** https://app.supabase.com/project/xxxxxxxxx
**Database Host:** db.xxxxxxxxxxxxxx.supabase.co
**Database Name:** postgres
**Database User:** postgres
**Database Password:** [your password]

---

## 🎯 Next Steps

Now that your database is set up:

1. ✅ Start building features
2. ✅ Create proposal management
3. ✅ Add RFP parsing
4. ✅ Integrate AI (OpenAI API)
5. ✅ Build analytics

Your authentication system is fully working with a real database! 🎉

---

## 🆘 Need Help?

If something isn't working:
1. Check the troubleshooting section above
2. Verify each step was completed
3. Check Supabase logs: Dashboard → Logs
4. Restart both backend and frontend servers

Everything should work perfectly! You're all set up with Supabase! 🚀
