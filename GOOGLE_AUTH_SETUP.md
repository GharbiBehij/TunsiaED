# 🚀 Google Authentication Setup & Verification Guide

## ⚠️ IMPORTANT: Missing Configuration Detected

Your BFF (Backend For Frontend) requires Firebase Admin credentials to verify Google sign-in tokens. Currently:

❌ **firebase-credentials.json** NOT found  
❌ **Environment variables** NOT set  

**Choose ONE of these options:**

---

## Option 1: Local Development (Recommended for Testing)

### Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click gear icon ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the file as `firebase-credentials.json`

### Step 2: Place Credentials File

```bash
# Move file to repo root
Move-Item path\to\downloaded\file.json c:\Users\behij\e-platform\firebase-credentials.json

# Verify it's in the right place
Test-Path c:\Users\behij\e-platform\firebase-credentials.json
# Should return: True
```

### Step 3: Verify .gitignore

The file should already be ignored (check `.gitignore`):
```gitignore
# Firebase credentials (DO NOT COMMIT)
firebase-credentials.json
```

---

## Option 2: Production/Render (Environment Variables)

### Set these environment variables in your hosting platform:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Note:** For `FIREBASE_PRIVATE_KEY`, keep the newlines as `\n` in the string.

---

## 🧪 Verification Steps

### 1. Verify Frontend Configuration

```powershell
cd c:\Users\behij\e-platform\web\e-platform-web

# Check if .env exists
Test-Path .env

# View Firebase config (without showing sensitive values)
Get-Content .env | Select-String "REACT_APP_FIREBASE" | ForEach-Object { $_.ToString().Split('=')[0] }
```

**Expected output:**
```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID
```

### 2. Verify BFF Configuration

```powershell
cd c:\Users\behij\e-platform\bff

# Check for credentials file (Option 1)
Test-Path ..\firebase-credentials.json

# OR check environment variables (Option 2)
$env:FIREBASE_PROJECT_ID
$env:FIREBASE_CLIENT_EMAIL
```

### 3. Test BFF Startup

```powershell
cd c:\Users\behij\e-platform\bff
npm run dev
```

**Expected output:**
```
Firebase Admin initialized from serviceAccountKey.json
# OR
Firebase Admin initialized from environment variables

Server running on port 3001
✅ Event system initialized
```

**If you see errors:**
```
❌ Firebase initialization failed
```
→ Go back and complete Option 1 or Option 2 above.

### 4. Test Frontend

```powershell
cd c:\Users\behij\e-platform\web\e-platform-web
npm start
```

**Expected:**
- Opens browser at http://localhost:3000
- No console errors related to Firebase

---

## 🧪 Manual Google Auth Test

### Test 1: New User Sign Up

1. **Open:** http://localhost:3000/signup
2. **Click:** "Continue with Google"
3. **Expected behavior:**
   - Redirects to Google sign-in page
   - Shows your Google accounts
   - After selecting account → redirects back to app
   - You're logged in and see home page

**Browser Console Should Show:**
```javascript
🔵 Google login started...
✅ Google redirect initiated
// Page redirects to Google...
// After redirect back:
🔄 Auth state changed: your-email@gmail.com
✅ Auth complete, navigating...
```

**BFF Console Should Show:**
```
Auth successful for user: your-email@gmail.com
POST /api/v1/user/onboard - 201 Created
GET /api/v1/user/me - 200 OK
```

### Test 2: Existing User Login

1. **Open:** http://localhost:3000/login
2. **Click:** "Continue with Google"
3. **Select same account** as Test 1
4. **Expected:**
   - Quick redirect (already authorized)
   - Logged in immediately
   - No new profile created

**BFF Console Should Show:**
```
Auth successful for user: your-email@gmail.com
GET /api/v1/user/me - 200 OK
```

### Test 3: Access Student Dashboard

1. **After login, navigate to:** http://localhost:3000/pages/student/studentdashboard
2. **Expected:**
   - ✅ Dashboard loads (you're a student by default)
   - ✅ No redirect to login

### Test 4: Try Instructor Dashboard (Should Fail)

1. **Navigate to:** http://localhost:3000/pages/instructor/instructordashboard
2. **Expected:**
   - ❌ Redirected to home page (you're not an instructor)

---

## 🐛 Troubleshooting

### Issue: "Firebase initialization failed"

**Cause:** BFF can't find credentials

**Fix:**
```powershell
# Verify file exists
Test-Path c:\Users\behij\e-platform\firebase-credentials.json

# Check file contents (should be valid JSON)
Get-Content c:\Users\behij\e-platform\firebase-credentials.json | ConvertFrom-Json
```

### Issue: "CORS error" or "Network request failed"

**Cause:** BFF not running or wrong URL

**Fix:**
```powershell
# Check if BFF is running
Test-NetConnection -ComputerName localhost -Port 3001

# If not running:
cd c:\Users\behij\e-platform\bff
npm run dev
```

### Issue: "Profile not found" after Google sign-in

**Cause:** BFF `onboard` endpoint failed

**Debug:**
```powershell
# Check BFF logs for errors
# Look for 500 errors or exceptions

# Test endpoint directly (get a token first from browser console)
# localStorage.getItem('token')
```

### Issue: Redirect loop (keeps going back to login)

**Cause:** Token not being stored

**Fix:**
```javascript
// In browser console (after Google sign-in)
localStorage.getItem('token')
localStorage.getItem('user')

// Both should have values
// If not, check AuthContext logic
```

### Issue: Google sign-in popup blocked

**Cause:** You're using `signInWithPopup` instead of `signInWithRedirect`

**Status:** ✅ Already using `signInWithRedirect` - this should not happen

### Issue: "auth/unauthorized-domain"

**Cause:** Your domain not added to Firebase authorized domains

**Fix:**
1. Go to Firebase Console → Authentication → Settings
2. Click **Authorized domains** tab
3. Add `localhost` (should already be there)
4. For production, add your Netlify domain

---

## 📝 Quick Setup Checklist

- [ ] Firebase credentials file created: `firebase-credentials.json`
- [ ] File placed in repo root: `c:\Users\behij\e-platform\`
- [ ] File added to .gitignore (already done)
- [ ] BFF starts without errors
- [ ] Frontend .env file configured
- [ ] Frontend starts without errors
- [ ] Google sign-in button visible on login page
- [ ] Clicking button redirects to Google
- [ ] After auth, redirected back to app
- [ ] User profile created in Firestore
- [ ] User logged in and can access dashboard
- [ ] Logout works correctly
- [ ] Can log in again with same account

---

## 🎯 Next Steps After Setup

1. **Test the flow manually** (see Manual Google Auth Test above)
2. **Check browser console** for any errors
3. **Check BFF console** for API request logs
4. **Verify Firestore** has user documents in `users` collection
5. **Test role-based access** by trying different dashboards

---

## 🔐 Security Reminders

- ✅ **Never commit** `firebase-credentials.json`
- ✅ **Never commit** `.env` with real values
- ✅ Use `.env.example` as template only
- ✅ Rotate credentials if accidentally exposed
- ✅ Use environment variables in production (Render, Netlify)
- ✅ Keep Firebase Console access restricted

---

## ✅ Expected Final State

After following this guide:

1. ✅ BFF running on http://localhost:3001
2. ✅ Frontend running on http://localhost:3000
3. ✅ Google sign-in button works
4. ✅ Users can authenticate with Google
5. ✅ Profiles created automatically
6. ✅ Role-based access working
7. ✅ No console errors
8. ✅ Token stored in localStorage
9. ✅ Can log out and log back in

**Status:** 🟢 **READY FOR GOOGLE AUTHENTICATION TESTING**

---

## 📞 Support

If you encounter issues not covered here:

1. Check `GOOGLE_AUTH_TEST_REPORT.md` for detailed flow explanation
2. Check browser console for frontend errors
3. Check terminal for BFF errors
4. Verify Firebase Console settings (Authentication enabled, Google provider enabled)
5. Ensure you're using the correct Firebase project

**Most Common Fix:** Make sure `firebase-credentials.json` exists in the repo root!
