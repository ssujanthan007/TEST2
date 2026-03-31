# Quick Start Guide - ENHANCED Edition

Get the enhanced vulnerable application running in 2 minutes!

**Now with 30+ vulnerabilities covering OWASP Top 10, CWE/SANS Top 25, and advanced attack scenarios.**

## Prerequisites

- **Node.js** v12 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- A web browser (Chrome, Firefox, Safari, Edge)

## Installation & Startup

### Step 1: Install Dependencies
```bash
cd "Vulnerable Application"
npm install
```

This will install:
- `express` - Web framework
- `sqlite3` - Database
- `body-parser` - Request parsing

### Step 2: Start the Server
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════╗
║   VULNERABLE WEB APPLICATION               ║
║   Started on http://localhost:3000         ║
║   ⚠️  FOR EDUCATIONAL PURPOSES ONLY        ║
╚════════════════════════════════════════════╝
```

### Step 3: Open in Browser
Visit: **http://localhost:3000**

You should see a homepage with 30+ vulnerable endpoints listed.

---

## What's New in Enhanced Version

- **30+ vulnerabilities** (instead of 10)
- **35+ endpoints** covering advanced attack scenarios
- **CSRF, XXE, SSRF** attacks
- **File upload vulnerabilities**
- **Weak encryption** and **insecure session IDs**
- **Mass assignment** and **parameter pollution**
- **And much more...**

**See [ENHANCED_VULNS.md](ENHANCED_VULNS.md) for complete list.**

---

## What to Do Now

### 1. Start with Basics (Start here if new!)
1. Read [README.md](README.md) - Overview of all vulnerabilities
2. Read [ENHANCED_VULNS.md](ENHANCED_VULNS.md) - Complete vulnerability list
3. Read [ENHANCED_TESTING.md](ENHANCED_TESTING.md) - How to test each
4. Test your first vulnerability!

### 2. Documentation Quick Reference

| Document | Purpose |
|----------|---------|
| README.md | Overview + first 10 vulns |
| ENHANCED_VULNS.md | All 30+ vulnerabilities |
| ENHANCED_TESTING.md | How to test each one |
| TESTING_GUIDE.md | Original 10 detailed |
| SECURE_FIXES.md | Secure code examples |

---

## Quick Testing Commands

```bash
# SQL Injection
curl -X POST -d "username=' OR '1'='1' --&password=x" http://localhost:3000/login

# XSS
curl -X POST -d "comment=<img src=x onerror=alert('XSS')>" http://localhost:3000/comment

# IDOR
curl http://localhost:3000/user/1

# Command Injection
curl "http://localhost:3000/ping?host=127.0.0.1; whoami"

# CSRF
curl -X POST -d "amount=1000&recipient=attacker" http://localhost:3000/transfer-money

# SSRF
curl "http://localhost:3000/fetch-url?url=http://localhost:3000/admin"

# Path Traversal
curl "http://localhost:3000/download?file=../app.js"
```

## File Structure

```
Vulnerable Application/
├── app.js                      # 35+ vulnerable endpoints
├── package.json               # Outdated dependencies (intentional!)
├── vulnerable.db              # SQLite database
├── .env.example              # Environment template
├── README.md                 # Overview
├── QUICK_START.md            # This file
├── ENHANCED_VULNS.md         # All 30+ vulnerabilities listed
├── ENHANCED_TESTING.md       # How to test each one
├── TESTING_GUIDE.md          # Original 10 in detail
├── SECURE_FIXES.md           # How to fix them
├── FILES_REFERENCE.md        # File guide
└── folders/
    ├── files/                # Path traversal test files
    ├── uploads/              # File upload destination
    └── temp/                 # Temporary file storage
```

---

## Common Issues & Solutions

### Issue: "Port 3000 already in use"
**Solution**: Change the port in app.js
```javascript
const PORT = 3001; // Change to different port
```

### Issue: "Cannot find module 'sqlite3'"
**Solution**: Ensure dependencies are installed
```bash
npm install
```

### Issue: "npm command not found"
**Solution**: Install Node.js from https://nodejs.org/

### Issue: Database not created
**Solution**: Delete `vulnerable.db` and restart
```bash
rm vulnerable.db
npm start
```

---

## Keyboard Shortcuts

### In Terminal
- `Ctrl + C` - Stop the server
- `Up Arrow` - Repeat last command
- `Ctrl + L` - Clear screen

### In Browser
- `F12` - Open Developer Tools
- `Ctrl + Shift + I` - Open Developer Tools (Windows/Linux)
- `Cmd + Option + I` - Open Developer Tools (Mac)
- `Ctrl + K` - Clear Console

---

## Next Steps

### Option 1: Learn All Vulnerabilities
1. Open http://localhost:3000
2. Follow [ENHANCED_TESTING.md](ENHANCED_TESTING.md)
3. Test each of 30+ vulnerabilities
4. Understand root causes

### Option 2: Use Security Tools
```bash
# Burp Suite Community Edition
# Download from https://portswigger.net/burp/communityedition

# OWASP ZAP
brew install owasp-zap  # macOS

# SQLMap
pip install sqlmap
sqlmap -u "http://localhost:3000/login" --data="username=test&password=test" -p username --dbs
```

### Option 3: Implement Secure Versions
- Study [SECURE_FIXES.md](SECURE_FIXES.md)
- Modify app.js to fix vulnerabilities
- Test that attacks no longer work

### Option 4: Advanced Learning
- Join bug bounty programs
- Contribute to OWASP projects
- Study for certifications (OSCP, CEH, GPEN)

---

## Important Reminders

⚠️ **CRITICAL**:
1. **Local use only** - Never deploy to internet
2. **Your system only** - Don't test others' systems  
3. **Educational** - Learn, don't harm
4. **Legally** - Always get written permission
5. **Ethically** - Practice responsible disclosure

---

## Useful Commands

### Start server in development mode (auto-restarts on code changes)
```bash
npm run dev
```
(Requires `npm install -g nodemon`)

### View the database
```bash
# macOS/Linux
sqlite3 vulnerable.db

# Then in SQLite:
SELECT * FROM users;
.quit
```

### Test from command line
```bash
# SQL Injection test
curl -X POST -d "username=' OR '1'='1' --&password=x" http://localhost:3000/login

# View user data (IDOR)
curl http://localhost:3000/user/1

# View debug info
curl http://localhost:3000/debug
```

### Stop the server
```bash
Ctrl + C
```

---

## Troubleshooting

### Still having issues?
1. Check Node.js: `node --version` (need v12+)
2. Check npm: `npm --version` (need v6+)
3. Reinstall: `rm -rf node_modules && npm install`
4. Clear port: `lsof -i :3000` (on Mac/Linux)
5. Read error messages carefully

---

## Getting Help

### Resources
- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)
- [PortSwigger Academy](https://portswigger.net/web-security)

### Community
- Stack Overflow - Ask with tags [node.js] [security]
- OWASP Community - networking and learning
- Reddit: r/learnprogramming, r/netsec

---

## Ready to Start?

**1.** `npm install` - Install dependencies
**2.** `npm start` - Start the server  
**3.** Open `http://localhost:3000` - View all vulnerabilities
**4.** Pick a vulnerability - Start testing
**5.** Follow the guides - Learn how to exploit and fix

**Begin with [ENHANCED_VULNS.md](ENHANCED_VULNS.md) for the full list!**

**Happy Learning! 🚀**
