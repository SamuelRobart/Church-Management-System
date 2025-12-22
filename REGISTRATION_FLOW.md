# Registration & Email Verification Flow

## 📋 Complete Registration Process

### Step 1: User Submits Registration Form
User fills in:
- Full Name
- Username
- Email Address
- Password
- Confirm Password

**Validation:**
- All fields required
- Name: min 3 characters
- Username: min 4 characters, alphanumeric + underscore/hyphen only
- Email: valid email format
- Password: min 8 characters
- Passwords must match

### Step 2: Send Verification Code
When user clicks "Continue":
1. Form validation runs
2. If valid, calls: `api.auth.sendVerificationCode(email)`
3. Backend sends 6-digit code to email
4. Frontend shows Step 2: Email Verification

**API Call:**
```javascript
POST /api/auth/send-verification-code
{
  "email": "user@example.com"
}
```

### Step 3: Email Verification
User receives email with 6-digit code and enters it:
1. Auto-focus between digits
2. Backspace navigation between fields
3. Submit verification code

**API Call:**
```javascript
POST /api/auth/verify-email
{
  "email": "user@example.com",
  "verificationCode": "123456"
}
```

### Step 4: Create User Account
After email verification succeeds:
1. Create user record by calling: `api.users.create(userData)`
2. User data includes verified flag

**API Call:**
```javascript
POST /api/users/create
{
  "name": "John Doe",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "HashedPassword",
  "role": "Member",
  "verified": true
}
```

### Step 5: Success & Redirect
- Show success message: "✓ Account created successfully!"
- Redirect to signin page after 2 seconds

---

## 🔌 API Service Methods

Located in `src/services/api.js`:

### Authentication Endpoints
```javascript
// Send verification code to email
api.auth.sendVerificationCode(email)

// Verify email code
api.auth.verifyEmail(email, code)

// Login user
api.auth.login(username, password)

// Logout user
api.auth.logout()

// Get current user from localStorage
api.auth.getCurrentUser()

// Get auth token from localStorage
api.auth.getToken()
```

### User Endpoints
```javascript
// Create new user
api.users.create(userData)

// Get all users
api.users.getAll()

// Update user
api.users.update(id, userData)

// Delete user
api.users.delete(id)

// Count users
api.users.count()
```

---

## 🔧 Backend API Requirements

Your Spring Boot backend needs these endpoints:

### 1. Send Verification Code
```
POST /api/auth/send-verification-code
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "Verification code sent to email",
  "status": "success"
}
```

### 2. Verify Email Code
```
POST /api/auth/verify-email
Content-Type: application/json

{
  "email": "user@example.com",
  "verificationCode": "123456"
}

Response:
{
  "success": true,
  "message": "Email verified",
  "status": "success"
}
```

### 3. Register User (Create User)
```
POST /api/users/create
Content-Type: application/json

{
  "name": "John Doe",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "HashedPassword",
  "role": "Member",
  "verified": true
}

Response:
{
  "success": true,
  "message": "User created successfully",
  "status": "success",
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "Member",
    "verified": true
  }
}
```

---

## 📁 File Structure

```
src/
├── app/
│   └── (auth)/
│       ├── register/
│       │   └── page.jsx ← Registration page with verification
│       └── login/
│           └── page.jsx
├── services/
│   └── api.js ← Centralized API calls
└── ...
```

---

## 🚀 Frontend Flow

### Register Page States

**State 1: Registration Form**
```jsx
const [step, setStep] = useState(1)
```
- Show name, username, email, password fields
- Password strength indicator
- Terms checkbox
- Button: "Continue"

**State 2: Email Verification**
```jsx
const [step, setStep] = useState(2)
```
- Show 6 digit input fields
- Resend button with countdown
- Back button
- Button: "Verify Email"

### Error Handling
```javascript
{
  name: "Name is required",
  username: "Username must be at least 4 characters",
  email: "Invalid email format",
  password: "Password must be at least 8 characters",
  confirmPassword: "Passwords do not match",
  code: "Invalid verification code",
  submit: "Failed to send verification code"
}
```

---

## ✅ Testing Checklist

- [ ] User fills registration form
- [ ] Validation works for each field
- [ ] Verification code email is sent
- [ ] User enters code and verification passes
- [ ] User account is created with verified flag
- [ ] Redirect to login page
- [ ] Can login with new credentials
- [ ] Resend code works with countdown
- [ ] Error messages display correctly

---

## 🔐 Security Notes

1. **Password Handling:**
   - Never send plain password to frontend
   - Backend must hash passwords before storage
   - Use bcrypt or similar

2. **Verification Code:**
   - Generate random 6-digit code
   - Expire after 10 minutes
   - Limit to 3 attempts per email
   - Store with expiration time in database

3. **Email Verification:**
   - Only allow registration if email verified
   - Set verified flag in database
   - Allow login only after verification

4. **Token Management:**
   - Store JWT token in localStorage
   - Include in Authorization header for API calls
   - Refresh token when expired

---

## 📞 Support

If you need to modify the registration flow:

1. **Change password requirements:** Edit `validateForm()` in register page
2. **Change verification code length:** Edit verification code state
3. **Change API endpoints:** Edit endpoints in `api.js`
4. **Add new fields:** Add to formData state and validation
