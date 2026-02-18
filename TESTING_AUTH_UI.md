# Testing the Authentication UI

## Quick Start (5 minutes)

### Prerequisites

1. **Database Setup** (if not done yet):
```bash
# Create database
createdb proposaliq

# Run schema
psql -U postgres -d proposaliq -f backend/src/models/schema.sql
```

2. **Environment Variables**:
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Frontend
cd ../frontend
cp .env.example .env
# Default values should work
```

### Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Expected output: `Server is running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Expected output: Opens http://localhost:3000 automatically

---

## Testing Option 1: Separate Components (Default - Currently Active)

### What You'll See:
- Beautiful purple gradient background
- Clean white card with login form
- "Register here" link at the bottom

### Test Flow:

1. **Open:** http://localhost:3000
   - Should redirect to `/login`

2. **Try to submit empty form:**
   - Click "Login" button
   - ❌ Should see error: "Please fill in all fields"

3. **Click "Register here" link:**
   - Should navigate to `/register` page
   - Form now has 4 fields: Name, Email, Password, Confirm Password

4. **Create a new account:**
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - Click "Register"
   - ✅ Should redirect to `/dashboard`

5. **See the Dashboard:**
   - Top nav shows "Welcome, Test User!"
   - User info card shows your details
   - Four feature cards displayed

6. **Test Logout:**
   - Click "Logout" button
   - ✅ Should redirect to `/login`

7. **Test Login:**
   - Email: `test@example.com`
   - Password: `password123`
   - Click "Login"
   - ✅ Should redirect to `/dashboard`

8. **Test Protected Route:**
   - Logout if logged in
   - Try to visit: http://localhost:3000/dashboard
   - ✅ Should redirect to `/login`

---

## Testing Option 2: Unified Form with Toggle (New Feature)

### Switch to Toggle Version:

```bash
cd frontend/src
mv App.tsx App-Original.tsx
mv App-WithToggle.tsx App.tsx
# Restart frontend (Ctrl+C then npm start)
```

### What You'll See:
- Same beautiful gradient background
- Two toggle buttons at the top: "Login" | "Register"
- Form fields change when you toggle

### Test Flow:

1. **Open:** http://localhost:3000
   - Should show `/auth` with Login tab active

2. **Toggle to Register:**
   - Click "Register" button in the tabs
   - ✨ Form smoothly transitions
   - Now shows: Name, Email, Password, Confirm Password fields

3. **Toggle back to Login:**
   - Click "Login" button in the tabs
   - ✨ Form transitions back
   - Shows: Email, Password fields only

4. **Register a new user:**
   - Click "Register" tab
   - Fill in form with new email
   - Click "Register" button
   - ✅ Redirects to `/dashboard`

5. **Test the link toggle:**
   - Logout
   - At bottom: "Don't have an account? Sign up here"
   - Click "Sign up here"
   - ✨ Toggle switches to Register mode

---

## Error Handling Tests

### Test Validation:

1. **Empty Fields:**
   - Submit without filling fields
   - ❌ Error: "Please fill in all required fields"

2. **Invalid Email:**
   - Email: `notanemail`
   - ❌ Backend will reject invalid email format

3. **Password Too Short (Register only):**
   - Password: `abc`
   - ❌ Error: "Password must be at least 6 characters long"

4. **Passwords Don't Match (Register only):**
   - Password: `password123`
   - Confirm: `password456`
   - ❌ Error: "Passwords do not match"

5. **Duplicate Email (Register):**
   - Try registering with existing email
   - ❌ Error: "User with this email already exists"

6. **Wrong Credentials (Login):**
   - Enter wrong password
   - ❌ Error: "Invalid credentials"

---

## API Testing (Optional)

### Test Backend Directly:

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "email": "apitest@example.com",
    "password": "testpass123"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "apitest@example.com",
      "name": "API Test User"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "testpass123"
  }'
```

**Get Current User:**
```bash
# Replace YOUR_TOKEN with token from login response
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Visual Checklist

Both versions should have:
- ✅ Purple/violet gradient background
- ✅ White rounded card with shadow
- ✅ ProposalIQ logo at top
- ✅ Clean, professional styling
- ✅ Responsive design (try resizing browser)
- ✅ Smooth animations
- ✅ Error messages shake when displayed
- ✅ Buttons change color on hover
- ✅ Loading states (buttons show "Logging in...")
- ✅ Disabled state during API calls

---

## Troubleshooting

### "Cannot connect to backend"
- Check backend is running on port 5000
- Check `frontend/.env` has correct `REACT_APP_API_URL`

### "Database connection error"
- Verify PostgreSQL is running
- Check `backend/.env` credentials
- Ensure `proposaliq` database exists

### "Token not working"
- Clear localStorage: Open DevTools → Application → Local Storage → Clear All
- Logout and login again

### "Port 3000 already in use"
- Kill existing process or choose different port when prompted

---

## Success Criteria

✅ Can register new users
✅ Passwords are hashed in database
✅ Can login with correct credentials
✅ JWT token stored in localStorage
✅ Can access dashboard after login
✅ Cannot access dashboard without login
✅ Error messages display correctly
✅ Form validation works
✅ Can logout successfully
✅ UI is clean and professional

---

## Switch Back to Original

To return to separate component version:

```bash
cd frontend/src
mv App.tsx App-WithToggle.tsx
mv App-Original.tsx App.tsx
# Restart frontend
```

Both versions are fully functional! Choose the one you prefer. 🎉
