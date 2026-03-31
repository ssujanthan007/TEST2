# Project Files Reference

Complete guide to all files in the Vulnerable Application project.

## Core Application Files

### `app.js`
Main Express server with all the vulnerable code.
- **Size**: ~500 lines
- **Contains**: 10 different vulnerabilities
- **Run**: `node app.js`

### `package.json`
Node.js project configuration and dependencies.
- **Dependencies**: express, sqlite3, body-parser
- **Scripts**: start, dev

### `vulnerable.db`
SQLite database (auto-created on first run).
- **Tables**: users, posts
- **Default users**: admin/admin123, user/password123

---

## Documentation Files

### `README.md`
**Start here!** Complete overview of the project.
- Explains all 10 vulnerabilities
- Shows how each one works
- Recommends security tools
- Provides learning resources

### `QUICK_START.md`
**Quick reference** - Get running in 2 minutes.
- Installation steps
- How to run the app
- Tests to try
- Troubleshooting

### `TESTING_GUIDE.md`
**Detailed testing instructions** for each vulnerability.
- Step-by-step exploitation
- Multiple testing methods (web form, curl, Burp Suite)
- Expected results
- Using automated tools

### `SECURE_FIXES.md`
**Code examples** showing how to fix each vulnerability.
- Vulnerable code shown
- Multiple secure approaches
- Detailed explanations
- Best practices

---

## Configuration Files

### `.env.example`
Template for environment variables.
- Shows what variables should be set
- **IMPORTANT**: Copy to `.env` (never commit `.env`)

### `.gitignore`
Files to exclude from Git version control.
- node_modules/
- *.db
- .env
- Logs

---

## Folders

### `files/`
Directory for file download testing (path traversal).
- `sample.txt` - Example file

---

## Usage Guide

### For Complete Beginners
1. Read: `QUICK_START.md`
2. Run: `npm install && npm start`
3. Test: Open http://localhost:3000
4. Learn: Read `README.md`

### For Intermediate Users
1. Read: `README.md` for vulnerability overview
2. Run: `npm start`
3. Follow: `TESTING_GUIDE.md` for detailed tests
4. Study: `SECURE_FIXES.md` for code patterns

### For Advanced Users
1. Review: `app.js` source code directly
2. Test: Using security tools (Burp Suite, SQLMap, OWASP ZAP)
3. Implement: Fixes from `SECURE_FIXES.md`
4. Verify: Tests pass with fixes

---

## File Summary Table

| File | Purpose | Read Time |
|------|---------|-----------|
| QUICK_START.md | Get started | 3 min |
| README.md | Overview | 10 min |
| TESTING_GUIDE.md | How to test | 15 min |
| SECURE_FIXES.md | How to fix | 20 min |
| app.js | Vulnerable code | 20 min |
| package.json | Dependencies | 1 min |

---

## Important Notes

### `.env` File
- Copy from `.env.example` to `.env`
- Add your own secrets
- **Never commit `.env` to Git**
- Listed in `.gitignore`

### `vulnerable.db`
- Auto-created on first run
- Contains default users
- Reset by deleting and restarting
- Listed in `.gitignore`

### `node_modules/`
- Created by `npm install`
- Contains all dependencies
- ~500MB size
- Listed in `.gitignore`

---

## Recommended Reading Order

1. **This file** (2 min)
2. **QUICK_START.md** (3 min)
3. Start the app: `npm start`
4. **README.md** (10 min)
5. Test first vulnerability
6. **TESTING_GUIDE.md** - Section 1 (5 min)
7. Try SQL injection attack
8. **SECURE_FIXES.md** - Section 1 (5 min)
9. Repeat for remaining vulnerabilities
10. Implement fixes in app.js

---

## Next Steps

After understanding the vulnerabilities:

1. **Implement fixes** from SECURE_FIXES.md
2. **Add logging** to track access
3. **Implement rate limiting** to prevent brute force
4. **Add input validation** as first layer of defense
5. **Test with security tools** (Burp Suite, ZAP)
6. **Review OWASP standards** for best practices

---

## Quick Copy from Template

```bash
# Setup new environment
cp .env.example .env

# Add your secrets to .env
nano .env

# Install and run
npm install
npm start
```

---

## Troubleshooting Files

### If you can't start the server:
1. Check: Is node installed? `node --version`
2. Check: Is npm installed? `npm --version`  
3. Check: Is port 3000 free? `lsof -i :3000`
4. Try: Delete `node_modules`, run `npm install`

### If database seems wrong:
1. Close the server
2. Delete `vulnerable.db`
3. Restart: `npm start`
4. Database recreates with defaults

### If something is broken:
1. Check file permissions: `chmod +x app.js`
2. Check Node.js version: `node --version` (need v12+)
3. Google the error message
4. Check QUICK_START.md troubleshooting section

---

## Version Information

- **Node.js**: v12.0.0 or higher
- **npm**: v6.0.0 or higher
- **Express**: 4.17.1
- **SQLite3**: 5.0.0
- **Status**: Educational/Training version

---

For detailed information on any topic, see the specific markdown files in this directory.
