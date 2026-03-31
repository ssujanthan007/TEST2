# Secure Code Examples - How to Fix the Vulnerabilities

This file shows how to properly fix each vulnerability in the application.

---

## 1. SQL Injection - FIXED

### ❌ VULNERABLE CODE
```javascript
const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
db.get(query, (err, row) => { ... });
```

### ✅ SECURE CODE - Using Parameterized Queries
```javascript
// Using parameterized query with placeholders
const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
db.get(query, [username, password], (err, row) => {
  if (err) {
    // Handle error
  } else if (row) {
    // Process authenticated user
  }
});
```

### ✅ SECURE CODE - Using ORM (Sequelize/Prisma)
```javascript
const user = await User.findOne({
  where: { username, password }
});
```

**Key Points**:
- Always use parameterized queries or prepared statements
- Never concatenate user input into SQL strings
- Use ORMs when possible
- Input validation is NOT a substitute for parameterized queries

---

## 2. XSS (Cross-Site Scripting) - FIXED

### ❌ VULNERABLE CODE
```javascript
res.send(`<h2>Your comment:</h2><p>${comment}</p>`);
```

### ✅ SECURE CODE - HTML Escaping
```javascript
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, char => map[char]);
};

res.send(`<h2>Your comment:</h2><p>${escapeHtml(comment)}</p>`);
```

### ✅ SECURE CODE - Using Template Engines
```javascript
// Using EJS with automatic escaping
res.render('comment', { comment }); // comment is auto-escaped

// template: <h2>Your comment:</h2><p><%= comment %></p>
```

### ✅ SECURE CODE - Using xss Package
```javascript
const xss = require('xss');
const clean = xss(userInput);
res.send(`<h2>Your comment:</h2><p>${clean}</p>`);
```

### ✅ SECURE CODE - Using Content Security Policy Header
```javascript
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

**Key Points**:
- Always HTML-escape user input when rendering HTML
- Use template engines that auto-escape by default
- Implement Content Security Policy (CSP) headers
- Validate and sanitize input
- Never use `innerHTML` with user data in client-side code

---

## 3. IDOR (Insecure Direct Object References) - FIXED

### ❌ VULNERABLE CODE
```javascript
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  db.get(query, (err, row) => {
    if (row) {
      res.send(`User: ${row.username}, Email: ${row.email}`);
    }
  });
});
```

### ✅ SECURE CODE - Add Authorization Check
```javascript
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const currentUserId = req.session.userId; // From session/JWT
  
  // Check if user is accessing their own data or is admin
  if (currentUserId !== parseInt(userId) && !req.session.isAdmin) {
    return res.status(403).send('Forbidden: Cannot access this user');
  }
  
  const query = `SELECT * FROM users WHERE id = ?`;
  db.get(query, [userId], (err, row) => {
    if (row) {
      // Don't expose password
      res.send(`User: ${row.username}, Email: ${row.email}`);
    }
  });
});
```

### ✅ SECURE CODE - Never Expose Sensitive Data
```javascript
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const currentUserId = req.session.userId;
  
  if (currentUserId !== parseInt(userId) && !req.session.isAdmin) {
    return res.status(403).send('Forbidden');
  }
  
  const query = `SELECT id, username, email FROM users WHERE id = ?`;
  // Never select password in response
  db.get(query, [userId], (err, row) => {
    res.json(row);
  });
});
```

**Key Points**:
- Always verify user authorization before exposing data
- Never trust the ID from URL parameters alone
- Use session/JWT to verify current user identity
- Only return data the user is authorized to see
- Never expose passwords, API keys, or sensitive fields

---

## 4. Command Injection - FIXED

### ❌ VULNERABLE CODE
```javascript
app.get('/ping', (req, res) => {
  const host = req.query.host;
  exec(`ping -c 4 ${host}`, (error, stdout, stderr) => {
    res.send(`<pre>${stdout}</pre>`);
  });
});
```

### ✅ SECURE CODE - Use Safe APIs with Arguments Array
```javascript
const { execFile } = require('child_process');

app.get('/ping', (req, res) => {
  const host = req.query.host;
  
  // Validate input (whitelist allowed hosts)
  if (!/^[a-zA-Z0-9.-]+$/.test(host)) {
    return res.status(400).send('Invalid hostname');
  }
  
  // Use execFile with arguments array (not shell=true)
  execFile('ping', ['-c', '4', host], (error, stdout, stderr) => {
    if (error) {
      return res.send(`Error: ${error.message}`);
    }
    res.send(`<pre>${stdout}</pre>`);
  });
});
```

### ✅ SECURE CODE - Using a Node.js Library
```javascript
const ping = require('ping');

app.get('/ping', (req, res) => {
  const host = req.query.host;
  
  // Whitelist validation
  const allowedHosts = ['8.8.8.8', 'cloudflare.com', 'google.com'];
  if (!allowedHosts.includes(host)) {
    return res.status(400).send('Host not allowed');
  }
  
  ping.promise.probe(host)
    .then(result => {
      res.send(`Ping result: ${result.alive ? 'Alive' : 'Dead'}`);
    })
    .catch(error => {
      res.send(`Error: ${error.message}`);
    });
});
```

**Key Points**:
- Never use `exec()` with shell=true for user input
- Use `execFile()` with arguments array instead
- Use dedicated libraries instead of shell commands
- Implement whitelist validation
- Avoid command execution altogether when possible

---

## 5. Path Traversal - FIXED

### ❌ VULNERABLE CODE
```javascript
app.get('/download', (req, res) => {
  const file = req.query.file;
  const filepath = path.join(__dirname, 'files', file);
  
  if (fs.existsSync(filepath)) {
    res.download(filepath);
  }
});
```

### ✅ SECURE CODE - Validate and Normalize Path
```javascript
const path = require('path');
const fs = require('fs');

app.get('/download', (req, res) => {
  const file = req.query.file;
  const baseDir = path.resolve(__dirname, 'files'); // Absolute path
  const filepath = path.resolve(baseDir, file);    // Normalize
  
  // Ensure the resolved path is within the base directory
  if (!filepath.startsWith(baseDir)) {
    return res.status(403).send('Forbidden');
  }
  
  if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
    res.download(filepath);
  } else {
    res.status(404).send('File not found');
  }
});
```

### ✅ SECURE CODE - Using Whitelist
```javascript
const allowedFiles = {
  'sample.txt': '/files/sample.txt',
  'guide.pdf': '/files/guide.pdf',
  'document.docx': '/files/document.docx'
};

app.get('/download', (req, res) => {
  const fileId = req.query.file;
  
  if (!allowedFiles[fileId]) {
    return res.status(403).send('File not allowed');
  }
  
  res.download(allowedFiles[fileId]);
});
```

**Key Points**:
- Always use `path.resolve()` to normalize paths
- Check that resolved path is within intended directory
- Use whitelist approach when possible
- Validate file extensions
- Check file existence and type (is it a file, not a directory?)

---

## 6. Hardcoded Credentials - FIXED

### ❌ VULNERABLE CODE
```javascript
app.get('/api-key', (req, res) => {
  const apiKey = 'sk-1234567890abcdefghijklmnop';
  const dbPassword = 'SuperSecret@2023';
  res.send(`API Key: ${apiKey}`);
});
```

### ✅ SECURE CODE - Use Environment Variables
```javascript
// app.js
require('dotenv').config();

app.get('/api-key', (req, res) => {
  // This endpoint shouldn't even exist
  return res.status(404).send('Not Found');
});

// Usage in other parts of code
const apiKey = process.env.API_KEY;
const dbPassword = process.env.DB_PASSWORD;
```

### .env File (git ignored)
```
API_KEY=sk-1234567890abcdefghijklmnop
DB_PASSWORD=SuperSecret@2023
DB_HOST=localhost
DB_USER=dbuser
```

### ✅ SECURE CODE - Using a Secret Manager
```javascript
// Using AWS Secrets Manager
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

async function getApiKey() {
  const secret = await secretsManager.getSecretValue({
    SecretId: 'api-key-secret'
  }).promise();
  
  return JSON.parse(secret.SecretString).api_key;
}
```

### ✅ SECURE CODE - Never Expose Credentials in Responses
```javascript
// ❌ WRONG
res.json({ apiKey: process.env.API_KEY });

// ✅ RIGHT - Generate temporary tokens instead
app.get('/token', (req, res) => {
  const token = jwt.sign(
    { userId: req.user.id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.json({ token });
});
```

**Key Points**:
- Never hardcode credentials in source code
- Use environment variables (`.env` file)
- Use secrets management services (AWS Secrets, HashiCorp Vault)
- Never expose sensitive data in API responses
- Rotate credentials regularly
- Use different credentials for different environments

---

## 7. Missing Authentication - FIXED

### ❌ VULNERABLE CODE
```javascript
app.get('/admin', (req, res) => {
  // No authentication check
  res.send('<h1>Admin Panel</h1>...');
});
```

### ✅ SECURE CODE - Add Authentication Middleware
```javascript
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).send('Access Denied: No token');
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
};

app.get('/admin', authenticateToken, (req, res) => {
  res.send('<h1>Admin Panel</h1>...');
});
```

### ✅ SECURE CODE - With Session-Based Auth
```javascript
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, httpOnly: true } // HTTPS only
}));

const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).redirect('/login');
  }
  next();
};

app.get('/admin', requireLogin, (req, res) => {
  res.send('<h1>Admin Panel</h1>...');
});
```

### ✅ SECURE CODE - With Authorization Check
```javascript
const requireAdmin = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send('Not authenticated');
  }
  
  if (!req.session.isAdmin) {
    return res.status(403).send('Not authorized');
  }
  
  next();
};

app.get('/admin', requireAdmin, (req, res) => {
  res.send('<h1>Admin Panel</h1>...');
});
```

**Key Points**:
- Implement authentication for sensitive endpoints
- Use JWT or sessions for maintaining authentication state
- Set `httpOnly` flag on cookies to prevent XSS theft
- Use HTTPS to prevent man-in-the-middle attacks
- Implement authorization checks (role-based access control)
- Always verify authentication state on the server side

---

## 8. Weak Password Storage - FIXED

### ❌ VULNERABLE CODE
```javascript
db.run(
  `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`,
  // Plaintext password!
);
```

### ✅ SECURE CODE - Using bcrypt
```javascript
const bcrypt = require('bcrypt');

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  
  try {
    // Hash password with salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`,
      [username, hashedPassword, email],
      (err) => {
        if (err) res.status(500).send('Error registering');
        else res.send('User registered successfully');
      }
    );
  } catch (error) {
    res.status(500).send('Error hashing password');
  }
});
```

### ✅ SECURE CODE - Login with Password Verification
```javascript
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  db.get(
    `SELECT id, username, password, isAdmin FROM users WHERE username = ?`,
    [username],
    async (err, row) => {
      if (!row) {
        return res.status(401).send('Invalid credentials');
      }
      
      try {
        // Compare provided password with stored hash
        const passwordMatch = await bcrypt.compare(password, row.password);
        
        if (passwordMatch) {
          // Create session or JWT
          req.session.userId = row.id;
          req.session.isAdmin = row.isAdmin;
          res.send(`Welcome ${row.username}!`);
        } else {
          res.status(401).send('Invalid credentials');
        }
      } catch (error) {
        res.status(500).send('Error comparing passwords');
      }
    }
  );
});
```

### ✅ SECURE CODE - Using Argon2
```javascript
const argon2 = require('argon2');

// Hash
const hashedPassword = await argon2.hash(password);

// Verify
const passwordMatch = await argon2.verify(hashedPassword, password);
```

**Key Points**:
- Always hash passwords using bcrypt, Argon2, or PBKDF2
- Never store plaintext passwords
- Use appropriate salt rounds (bcrypt: 10-12)
- Never log or display password hashes
- Use constant-time comparison to prevent timing attacks
- Implement password requirements (complexity, length)

---

## 9. Information Disclosure - FIXED

### ❌ VULNERABLE CODE
```javascript
app.get('/debug', (req, res) => {
  res.send(`
    Debug Info:
    Admin User: admin / admin123
    Database: vulnerable.db
    Node Version: ${process.version}
  `);
});
```

### ✅ SECURE CODE - Remove Debug Endpoints
```javascript
// Simply remove this endpoint in production

// Or use NODE_ENV to conditionally serve
if (process.env.NODE_ENV === 'development') {
  app.get('/debug', (req, res) => {
    res.send('Debug info (development only)');
  });
}
```

### ✅ SECURE CODE - Proper Error Handling
```javascript
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    // Don't expose stack traces in production
    res.status(500).send('Internal Server Error');
  } else {
    // Detailed errors in development
    res.status(500).send(`Error: ${err.message}`);
  }
});
```

### ✅ SECURE CODE - Security Headers
```javascript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  res.removeHeader('X-Powered-By'); // Don't reveal tech stack
  next();
});
```

**Key Points**:
- Remove debug endpoints before production
- Don't expose error stack traces to users
- Don't reveal technology stack (X-Powered-By header)
- Don't expose database names or credentials
- Implement proper logging for internal debugging
- Use security headers to prevent information leakage

---

## 10. Open Redirect - FIXED

### ❌ VULNERABLE CODE
```javascript
app.get('/redirect', (req, res) => {
  const url = req.query.url;
  res.redirect(url); // No validation
});
```

### ✅ SECURE CODE - Whitelist Validation
```javascript
app.get('/redirect', (req, res) => {
  const url = req.query.url;
  const allowedDomains = [
    'example.com',
    'trusted-partner.com'
  ];
  
  try {
    const parsedUrl = new URL(url);
    if (!allowedDomains.includes(parsedUrl.hostname)) {
      return res.status(400).send('Redirect destination not allowed');
    }
    res.redirect(url);
  } catch (error) {
    res.status(400).send('Invalid URL');
  }
});
```

### ✅ SECURE CODE - Only Allow Relative URLs
```javascript
app.get('/redirect', (req, res) => {
  const path = req.query.redirect;
  
  // Only allow relative paths within your site
  if (path.startsWith('/') && !path.startsWith('//')) {
    res.redirect(path);
  } else {
    res.status(400).send('Invalid redirect path');
  }
});
```

### ✅ SECURE CODE - User Confirmation
```javascript
app.get('/leaving', (req, res) => {
  const url = req.query.url;
  
  // Show confirmation page before redirecting
  res.send(`
    <h1>You are leaving our site</h1>
    <p>You will be redirected to: <strong>${escapeHtml(url)}</strong></p>
    <p>Are you sure?</p>
    <a href="${url}">Continue</a> | <a href="/">Go back</a>
  `);
});
```

**Key Points**:
- Use whitelist of allowed redirect destinations
- Only allow relative URLs when possible
- Validate URLs using URL constructor
- Show user confirmation before external redirects
- Never trust user-supplied URLs for redirects

---

## Summary Table

| Vulnerability | Fix | Prevention |
|---|---|---|
| SQL Injection | Parameterized queries | Input validation + Parameterized queries |
| XSS | HTML escaping | Output encoding + CSP |
| IDOR | Authorization checks | Proper access control |
| Command Injection | Avoid command execution | Use safe APIs, Input validation |
| Path Traversal | Path normalization | Whitelist validation |
| Hardcoded Credentials | Environment variables | Secrets management |
| Missing Authentication | Add auth middleware | JWT/Sessions |
| Weak Password Storage | Bcrypt/Argon2 | Hash with salt |
| Information Disclosure | Remove debug endpoints | Error handling, Security headers |
| Open Redirect | Whitelist URLs | URL validation |

---

## Additional Resources

- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
