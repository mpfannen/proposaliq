# ProposalIQ Setup Guide

## Database Setup

### 1. Install PostgreSQL

If you haven't already, install PostgreSQL:
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql`

### 2. Create the Database

Open PostgreSQL command line or pgAdmin and run:

```sql
CREATE DATABASE proposaliq;
```

### 3. Run the Database Schema

Navigate to the backend directory and run the schema file:

```bash
cd backend
psql -U postgres -d proposaliq -f src/models/schema.sql
```

Or if you prefer, you can copy the contents of `backend/src/models/schema.sql` and run it in pgAdmin or your PostgreSQL client.

### 4. Configure Environment Variables

#### Backend Configuration

1. Copy the example environment file:
```bash
cd backend
cp .env.example .env
```

2. Edit `.env` and update with your PostgreSQL credentials:
```env
PORT=5000
NODE_ENV=development

# Update these with your PostgreSQL settings
DB_HOST=localhost
DB_PORT=5432
DB_NAME=proposaliq
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Generate a secure random string for JWT_SECRET
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRE=7d

# Optional: Add AI API keys when ready
OPENAI_API_KEY=your_openai_api_key_here
```

#### Frontend Configuration

1. Copy the example environment file:
```bash
cd frontend
cp .env.example .env
```

2. The default values should work, but verify:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

## Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```

The backend will start on http://localhost:5000

### Start the Frontend

In a new terminal:

```bash
cd frontend
npm start
```

The frontend will start on http://localhost:3000

## Testing the Authentication System

### 1. Register a New User

1. Open http://localhost:3000 in your browser
2. Click "Register here" link
3. Fill in the registration form:
   - Full Name: Your Name
   - Email: your@email.com
   - Password: (minimum 6 characters)
   - Confirm Password: (same as password)
4. Click "Register"

You should be automatically logged in and redirected to the dashboard.

### 2. Test Login

1. Click "Logout" in the top navigation
2. Enter your email and password
3. Click "Login"

You should be redirected to the dashboard.

### 3. API Endpoints

The following authentication endpoints are available:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires JWT token)
- `GET /api/health` - Health check endpoint

### Testing with cURL

Register a user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Get current user (replace YOUR_TOKEN with the token from login):
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Database Connection Issues

If you get a database connection error:
1. Verify PostgreSQL is running
2. Check your credentials in `backend/.env`
3. Ensure the database `proposaliq` exists
4. Test connection: `psql -U postgres -d proposaliq`

### Port Already in Use

If port 5000 or 3000 is already in use:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port when prompted or set `PORT` environment variable

### CORS Issues

If you encounter CORS errors, ensure:
1. Backend is running on port 5000
2. Frontend `.env` has correct `REACT_APP_API_URL`
3. Both servers are running

## Next Steps

Now that authentication is set up, you can:
1. Create additional protected routes
2. Add proposal management features
3. Integrate AI services for RFP processing
4. Build out the dashboard functionality

For more information, see the main [README.md](./README.md)
