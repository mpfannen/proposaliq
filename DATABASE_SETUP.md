# Database Setup Guide for ProposalIQ

Your `.env` file has been created with secure credentials! Now choose your database setup method:

---

## ⭐ Option 1: Docker (RECOMMENDED - Easiest)

### Prerequisites
- Install Docker Desktop for Windows: https://www.docker.com/products/docker-desktop/

### Setup Steps

1. **Start PostgreSQL with Docker:**
   ```bash
   docker-compose up -d
   ```

2. **Verify it's running:**
   ```bash
   docker ps
   ```
   You should see `proposaliq-postgres` running

3. **Check database logs:**
   ```bash
   docker logs proposaliq-postgres
   ```

4. **Connect to database (optional):**
   ```bash
   docker exec -it proposaliq-postgres psql -U postgres -d proposaliq
   ```

5. **Start your backend:**
   ```bash
   cd backend
   npm run dev
   ```

### Database Management

**Stop database:**
```bash
docker-compose down
```

**Stop and remove data:**
```bash
docker-compose down -v
```

**Restart database:**
```bash
docker-compose restart
```

**View logs:**
```bash
docker-compose logs -f postgres
```

### Advantages
✅ No local PostgreSQL installation needed
✅ Isolated from your system
✅ Easy to reset and start fresh
✅ Same environment for all developers
✅ Schema automatically applied on first start
✅ Data persists between restarts

---

## Option 2: Local PostgreSQL Installation

### For Windows

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Download version 15 or later
   - Run the installer

2. **During installation:**
   - Remember the password you set for the `postgres` user
   - Default port: 5432 (keep it)
   - Install pgAdmin (recommended for database management)

3. **Update .env file:**
   ```env
   DB_PASSWORD=your_postgres_password_here
   ```
   Replace with the password you set during installation

4. **Create the database:**
   ```bash
   # Open Command Prompt or PowerShell
   psql -U postgres
   # Enter your password when prompted

   # In PostgreSQL prompt:
   CREATE DATABASE proposaliq;
   \q
   ```

5. **Run the schema:**
   ```bash
   psql -U postgres -d proposaliq -f backend/src/models/schema.sql
   ```

6. **Start your backend:**
   ```bash
   cd backend
   npm run dev
   ```

### Advantages
✅ Native performance
✅ GUI management with pgAdmin
✅ No Docker required

### Disadvantages
❌ Requires full PostgreSQL installation
❌ More system resources
❌ Harder to reset/clean

---

## Option 3: Cloud Database (Free Tier)

Perfect if you don't want to install anything locally!

### Using Supabase (Recommended Free Tier)

1. **Sign up:**
   - Visit: https://supabase.com
   - Create a free account
   - Create a new project

2. **Get connection details:**
   - Project Settings → Database
   - Copy the connection info

3. **Update .env:**
   ```env
   DB_HOST=db.xxxxxx.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your_supabase_password
   ```

4. **Run schema in Supabase:**
   - Go to SQL Editor in Supabase dashboard
   - Copy/paste contents of `backend/src/models/schema.sql`
   - Run the query

5. **Start your backend:**
   ```bash
   cd backend
   npm run dev
   ```

### Alternative: ElephantSQL

1. Visit: https://www.elephantsql.com
2. Create free "Tiny Turtle" plan
3. Copy the connection URL
4. Update .env with the credentials

### Advantages
✅ No local installation
✅ Free tier available
✅ Accessible from anywhere
✅ Automatic backups
✅ Web-based management

### Disadvantages
❌ Requires internet connection
❌ Free tier has limitations
❌ Slightly higher latency

---

## Option 4: SQLite (For Testing Only)

If you want the absolute simplest setup, we can use SQLite instead of PostgreSQL. However, this would require code changes and is not recommended for production.

Let me know if you want me to set this up.

---

## Recommended Approach

**For your situation, I recommend:**

### If you have Docker Desktop or can install it:
→ **Use Option 1 (Docker)** - Fastest and cleanest

### If you can't install Docker:
→ **Use Option 3 (Supabase)** - No installation needed

### If you want full control:
→ **Use Option 2 (Local PostgreSQL)** - Native performance

---

## Testing Your Database Connection

After setting up with any option, test the connection:

```bash
cd backend
npm run dev
```

You should see:
```
Server is running on port 5000
Connected to PostgreSQL database
```

If you see connection errors, check:
1. Database is running
2. Credentials in `.env` match your database
3. Port 5432 is not blocked by firewall

---

## Your Current .env Configuration

✅ `.env` file created at: `backend/.env`

**Current settings:**
- Port: 5000
- Database: localhost:5432
- Database name: proposaliq
- Database user: postgres
- Password: proposaliq_dev_password_2024
- JWT Secret: Secure random string (64 chars)
- JWT Expiry: 7 days

**Security Note:** The JWT secret has been randomly generated. This is fine for development. For production, use a different secret and store it securely.

---

## Quick Start (Using Docker)

```bash
# 1. Install Docker Desktop for Windows
# Download from: https://www.docker.com/products/docker-desktop/

# 2. Start the database
docker-compose up -d

# 3. Start the backend
cd backend
npm run dev

# 4. Start the frontend (in another terminal)
cd frontend
npm start

# 5. Open http://localhost:3000
```

That's it! 🚀

---

## Troubleshooting

### "Port 5432 already in use"
Another PostgreSQL instance is running. Either:
- Use the existing PostgreSQL
- Stop the existing instance
- Change port in `.env` and `docker-compose.yml`

### "Connection refused"
- Check database is running
- Verify credentials in `.env`
- Check firewall settings

### "Database does not exist"
- Run the database creation command
- Or use Docker which creates it automatically

### "Permission denied"
- Check password in `.env` matches database
- Verify user has proper permissions

---

Need help with any of these options? Let me know which approach you'd like to use!
