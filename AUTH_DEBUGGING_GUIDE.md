# BFF Authentication (401) Debugging Guide

## Issues Found and Fixed

### 1. **Firebase Configuration** ✅ FIXED
- **Issue**: Incomplete Firebase initialization with syntax error (unclosed try block)
- **Fix**: Updated `/bff/src/config/firebase.js` to properly handle both environment variables and fallback to service account file
- **Status**: Your `.env` file has the correct credentials

### 2. **Auth Middleware** ✅ IMPROVED
- **Issue**: Minimal error logging making it hard to debug token verification failures
- **Fix**: Enhanced middleware with:
  - Detailed logging for each step
  - Separate error messages for different failure modes
  - Token expiration tracking

### 3. **Environment Variable Naming** ✅ FIXED
- **Issue**: Frontend using `REACT_APP_API_URL` instead of `REACT_APP_BFF_API_URL`
- **Fix**: Updated `AuthContext.jsx` line 11 to use correct variable

---

## Common 401 Error Causes & Solutions

### A. Token Not Being Sent
**Symptoms**: "No token provided" error in logs
```
Auth failed: No Bearer token provided
```

**Check**:
1. Verify frontend is logged in: `localStorage.getItem('token')` in browser console
2. Check AuthContext is properly getting token: Look for `setToken(idToken)` around line 161
3. Ensure services pass token: `UserService.getProfile(token)` needs the token parameter

**Fix**:
```javascript
// In AuthContext.jsx - should be storing the token
setToken(idToken);  // This must happen
localStorage.setItem("token", idToken);  // And this
```

### B. Invalid or Expired Token
**Symptoms**: "Invalid token" error with Firebase message
```
Firebase token verification failed: ID token has expired
```

**Check**:
1. Token expiration: Firebase ID tokens expire after 1 hour
2. Refresh needed: Call `getIdToken()` again on long sessions
3. Browser storage: Old token in localStorage from previous session

**Fix**:
```javascript
// In service calls, get fresh token
const freshToken = await auth.currentUser.getIdToken(true); // force refresh
```

### C. Firebase Not Initialized
**Symptoms**: "Firebase initialization failed"

**Check**:
1. `.env` file has Firebase credentials (it does ✓)
2. `FIREBASE_PROJECT_ID` matches your project
3. `FIREBASE_PRIVATE_KEY` has correct escaping with `\n`

**Verify**:
```bash
# Run in BFF terminal
npm start

# Should see: "Firebase Admin initialized from environment variables"
```

---

## Testing Authentication Flow

### 1. **Test Token Generation (Frontend)**
```javascript
// In browser console
const token = localStorage.getItem('token');
console.log('Token:', token ? token.substring(0, 50) + '...' : 'NO TOKEN');

// Decode token to see expiration
const decoded = JSON.parse(atob(token.split('.')[1]));
console.log('Token exp:', new Date(decoded.exp * 1000));
```

### 2. **Test BFF Token Verification**
```bash
# In PowerShell (replace TOKEN with actual token)
$token = "YOUR_TOKEN_HERE"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test user endpoint
Invoke-WebRequest -Uri "http://localhost:3001/api/v1/user/me" -Headers $headers

# Should return user profile, not 401
```

### 3. **Test Local Authentication**
1. Run BFF: `npm start` (port 3001)
2. Run Frontend: `npm start` (port 3000)
3. Login with valid Firebase credentials
4. Check browser console for token storage
5. Make API call and monitor BFF logs for auth success/failure

---

## Detailed Logging Output

After fixes, you should see logs like:

**SUCCESS**:
```
Auth successful for user: user@example.com
```

**FAILURE WITH DETAILS**:
```
Firebase token verification failed: ID token has expired
Auth failed: Empty token
Auth failed: No Bearer token provided
```

---

## Step-by-Step Troubleshooting

1. **Clear all storage and refresh**
   ```javascript
   // Browser console
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

2. **Login again** and watch for token in localStorage

3. **Check BFF logs** for auth middleware output:
   - Should show "Auth successful" or specific error
   - Look for "Firebase token verification failed" with error details

4. **Try direct API call** from browser:
   ```javascript
   const token = localStorage.getItem('token');
   fetch('http://localhost:3001/api/v1/user/me', {
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     }
   })
   .then(r => r.json())
   .then(data => console.log('Response:', data))
   .catch(e => console.error('Error:', e))
   ```

5. **Check CORS** - Middleware should list localhost:3000 and localhost:3001

---

## If Still Getting 401

**Try these steps**:

1. Verify `.env` has all Firebase fields (check with `Get-Content .env`)
2. Restart BFF: `npm start` after changes
3. Check if token is being generated: Log in and check localStorage
4. Check timestamp: Is it within last 1 hour?
5. Check Firebase project ID matches between frontend and BFF

**Get more details**:
```javascript
// In browser console when calling API
const token = localStorage.getItem('token');
const headers = new Headers({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

const res = await fetch('http://localhost:3001/api/v1/user/me', { headers });
const data = await res.json();
console.log('Status:', res.status);
console.log('Response:', data);  // Will show exact error message
```

---

## Related Files Modified

- ✅ `/bff/src/config/firebase.js` - Fixed initialization
- ✅ `/bff/src/middlewares/auth.middleware.js` - Enhanced with logging
- ✅ `/bff/src/app.js` - Registered all routes
- ✅ `/web/e-platform-web/src/context/AuthContext.jsx` - Fixed env variable
