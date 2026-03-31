const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

// Database setup
const db = new sqlite3.Database('./vulnerable.db', (err) => {
  if (err) console.error(err);
  else console.log('Connected to SQLite database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Initialize database
db.serialize(() => {
  // Create users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT,
    email TEXT,
    isAdmin INTEGER
  )`);

  // Create posts table
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    title TEXT,
    content TEXT
  )`);

  // Create default users
  db.run("INSERT OR IGNORE INTO users (id, username, password, email, isAdmin) VALUES (1, 'admin', 'admin123', 'admin@example.com', 1)");
  db.run("INSERT OR IGNORE INTO users (id, username, password, email, isAdmin) VALUES (2, 'user', 'password123', 'user@example.com', 0)");
});

// ============================================
// VULNERABILITY 1: SQL INJECTION
// ============================================
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // VULNERABLE: Direct string concatenation allows SQL injection
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  db.get(query, (err, row) => {
    if (err) {
      return res.send('Database error: ' + err.message);
    }
    
    if (row) {
      res.send(`Welcome ${row.username}! You are admin: ${row.isAdmin}`);
    } else {
      res.send('Invalid credentials');
    }
  });
});

// ============================================
// VULNERABILITY 2: XSS (Cross-Site Scripting)
// ============================================
app.post('/comment', (req, res) => {
  const { comment } = req.body;
  
  // VULNERABLE: No sanitization of user input
  res.send(`<h2>Your comment:</h2><p>${comment}</p>`);
});

// ============================================
// VULNERABILITY 3: Insecure Direct Object References (IDOR)
// ============================================
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  
  // VULNERABLE: No authorization check - user can access any user's data
  const query = `SELECT username, email, password FROM users WHERE id = ${userId}`;
  
  db.get(query, (err, row) => {
    if (row) {
      res.send(`User Info: ${row.username}, Email: ${row.email}, Password: ${row.password}`);
    } else {
      res.send('User not found');
    }
  });
});

// ============================================
// VULNERABILITY 4: Command Injection
// ============================================
app.get('/ping', (req, res) => {
  const host = req.query.host;
  
  // VULNERABLE: Unsanitized command execution
  exec(`ping -c 4 ${host}`, (error, stdout, stderr) => {
    if (error) {
      res.send(`Error: ${error.message}`);
    }
    res.send(`<pre>${stdout}</pre>`);
  });
});

// ============================================
// VULNERABILITY 5: Path Traversal
// ============================================
app.get('/download', (req, res) => {
  const file = req.query.file;
  
  // VULNERABLE: No path validation allows access to any file
  const filepath = path.join(__dirname, 'files', file);
  
  if (fs.existsSync(filepath)) {
    res.download(filepath);
  } else {
    res.send('File not found');
  }
});

// ============================================
// VULNERABILITY 6: Hardcoded Credentials
// ============================================
app.get('/api-key', (req, res) => {
  const apiKey = 'sk-1234567890abcdefghijklmnop';
  const dbPassword = 'SuperSecret@2023';
  
  // VULNERABLE: Sensitive data in code
  res.send(`API Key: ${apiKey}, DB Password: ${dbPassword}`);
});

// ============================================
// VULNERABILITY 7: No Authentication
// ============================================
app.get('/admin', (req, res) => {
  // VULNERABLE: No session or authentication check
  res.send(`
    <h1>Admin Panel</h1>
    <p>This should be protected but isn't!</p>
    <form method="POST" action="/admin/update">
      <input type="text" name="user_id" placeholder="User ID">
      <input type="text" name="new_role" placeholder="New Role">
      <button type="submit">Update User</button>
    </form>
  `);
});

app.post('/admin/update', (req, res) => {
  const { user_id, new_role } = req.body;
  
  // VULNERABLE: No authentication + SQL injection
  db.run(`UPDATE users SET isAdmin = ${new_role} WHERE id = ${user_id}`, (err) => {
    if (err) res.send('Error');
    else res.send('User updated');
  });
});

// ============================================
// VULNERABILITY 8: Weak Password Storage
// ============================================
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  
  // VULNERABLE: Plain text password storage
  db.run(
    `INSERT INTO users (username, password, email, isAdmin) VALUES ('${username}', '${password}', '${email}', 0)`,
    (err) => {
      if (err) {
        res.send('Registration error: ' + err.message);
      } else {
        res.send('User registered successfully');
      }
    }
  );
});

// ============================================
// VULNERABILITY 9: Information Disclosure
// ============================================
app.get('/debug', (req, res) => {
  // VULNERABLE: Exposing sensitive debug information
  res.send(`
    <h2>Debug Info</h2>
    <p>Database: vulnerable.db</p>
    <p>Admin User: admin / admin123</p>
    <p>Test User: user / password123</p>
    <p>Node Version: ${process.version}</p>
    <p>Platform: ${process.platform}</p>
  `);
});

// ============================================
// VULNERABILITY 10: CRLF Injection / Response Splitting
// ============================================
app.get('/redirect', (req, res) => {
  const url = req.query.url;
  
  // VULNERABLE: No validation of redirect URL
  res.redirect(url);
});

// ============================================
// VULNERABILITY 11: CSRF (Cross-Site Request Forgery)
// ============================================
app.post('/transfer-money', (req, res) => {
  const { amount, recipient } = req.body;
  
  // VULNERABLE: No CSRF token verification
  // Anyone can forge a request to transfer money
  res.send(`Transferred $${amount} to ${recipient}`);
});

// ============================================
// VULNERABILITY 12: File Upload Without Validation
// ============================================
app.post('/upload', (req, res) => {
  const filename = req.body.filename;
  const content = req.body.content;
  
  // VULNERABLE: No file extension validation or sanitization
  fs.writeFileSync(path.join(__dirname, 'uploads', filename), content);
  
  res.send(`File uploaded: ${filename}`);
});

// ============================================
// VULNERABILITY 13: Insecure Session IDs
// ============================================
let sessionCounter = 0;
const sessions = {};

app.post('/login-session', (req, res) => {
  const { username } = req.body;
  
  // VULNERABLE: Predictable session ID (sequential)
  sessionCounter++;
  const sessionId = sessionCounter; // Just a number!
  
  sessions[sessionId] = {
    username: username,
    createdAt: Date.now()
  };
  
  res.send(`Login successful. Session ID: ${sessionId}`);
});

// ============================================
// VULNERABILITY 14: XXE (XML External Entity)
// ============================================
app.post('/parse-xml', (req, res) => {
  const xml = req.body.xml;
  
  // VULNERABLE: Direct XML parsing without DTD validation
  // Allows XXE attacks to read files or cause DOS
  res.send(`Parsed XML: ${xml}`);
});

// ============================================
// VULNERABILITY 15: SSRF (Server-Side Request Forgery)
// ============================================
const http = require('http');

app.get('/fetch-url', (req, res) => {
  const url = req.query.url;
  
  // VULNERABLE: Fetch any URL, including internal services
  // Can access internal APIs, metadata services, etc.
  http.get(url, (response) => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => res.send(data));
  }).on('error', (err) => {
    res.send(`Error: ${err.message}`);
  });
});

// ============================================
// VULNERABILITY 16: Mass Assignment / Over-posting
// ============================================
app.post('/update-profile', (req, res) => {
  const userId = req.body.user_id;
  const userData = req.body; // VULNERABLE: Takes ALL fields
  
  // VULNERABLE: User can modify isAdmin, isStaff, etc.
  const query = `UPDATE users SET ${Object.keys(userData).map(k => k + '=?').join(',')} WHERE id=?`;
  
  db.run(query, [...Object.values(userData), userId], (err) => {
    if (err) res.send('Error: ' + err.message);
    else res.send('Profile updated');
  });
});

// ============================================
// VULNERABILITY 17: Weak Encryption
// ============================================
const crypto = require('crypto');

app.post('/encrypt', (req, res) => {
  const data = req.body.data;
  
  // VULNERABLE: Using ECB mode (deterministic encryption)
  // Same plaintext always produces same ciphertext
  const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from('0123456789abcdef'), null);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  res.send(`Encrypted: ${encrypted}`);
});

// ============================================
// VULNERABILITY 18: Uncontrolled Recursion / DOS
// ============================================
app.post('/process-json', (req, res) => {
  const json = req.body.json;
  
  // VULNERABLE: No depth limit on JSON parsing
  // Can cause stack overflow with deeply nested JSON
  try {
    const parsed = JSON.parse(json);
    res.send('JSON parsed successfully');
  } catch (e) {
    res.send('Parse error');
  }
});

// ============================================
// VULNERABILITY 19: Insecure Password Reset
// ============================================
app.get('/reset-password', (req, res) => {
  const token = req.query.token;
  
  // VULNERABLE: Predictable token (just user ID or sequential)
  const userId = parseInt(token); // Just parse token as number!
  
  res.send(`
    <form method="POST" action="/set-new-password">
      <input type="hidden" name="token" value="${token}">
      <input type="password" name="new_password" placeholder="New Password">
      <button>Reset Password</button>
    </form>
  `);
});

app.post('/set-new-password', (req, res) => {
  const { token, new_password } = req.body;
  const userId = parseInt(token);
  
  // VULNERABLE: No token validation or expiration
  db.run(
    `UPDATE users SET password = ? WHERE id = ?`,
    [new_password, userId],
    (err) => {
      if (err) res.send('Error');
      else res.send('Password reset successful');
    }
  );
});

// ============================================
// VULNERABILITY 20: HTTP Parameter Pollution
// ============================================
app.get('/process', (req, res) => {
  const id = req.query.id;
  
  // VULNERABLE: Takes only first value, ignores duplicates
  // Different servers handle duplicates differently
  // id=1&id=2 - which one gets used?
  const query = `SELECT * FROM users WHERE id = ${id}`;
  
  db.get(query, (err, row) => {
    if (row) {
      res.send(`User: ${row.username}`);
    } else {
      res.send('Not found');
    }
  });
});

// ============================================
// VULNERABILITY 21: Missing Input Validation
// ============================================
app.post('/create-post', (req, res) => {
  const { title, content, user_id } = req.body;
  
  // VULNERABLE: No length validation, type checking, or sanitization
  // Could cause buffer overflow, injection, or DOS
  db.run(
    `INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)`,
    [title, content, user_id],
    (err) => {
      if (err) res.send('Error: ' + err.message);
      else res.send('Post created');
    }
  );
});

// ============================================
// VULNERABILITY 22: Insecure Logging / Log Injection
// ============================================
const logFile = fs.createWriteStream('app.log', { flags: 'a' });

app.get('/search', (req, res) => {
  const query = req.query.q;
  
  // VULNERABLE: User input written directly to log
  // Can inject newlines and fake log entries
  logFile.write(`[${new Date().toISOString()}] Search query: ${query}\n`);
  
  res.send(`Searched for: ${query}`);
});

// ============================================
// VULNERABILITY 23: No Rate Limiting / Brute Force
// ============================================
app.post('/brute-force-login', (req, res) => {
  const { username, password } = req.body;
  
  // VULNERABLE: No rate limiting, brute force protection
  db.get(
    `SELECT * FROM users WHERE username = ? AND password = ?`,
    [username, password],
    (err, row) => {
      if (row) {
        res.send('Login successful');
      } else {
        res.send('Invalid credentials');
      }
    }
  );
});

// ============================================
// VULNERABILITY 24: Public Sensitive Data Exposure
// ============================================
app.get('/config', (req, res) => {
  // VULNERABLE: Config file exposed over HTTP
  res.sendFile(path.join(__dirname, '.env'));
});

// ============================================
// VULNERABILITY 25: No HTTPS / Plaintext Data
// ============================================
// VULNERABLE: Server runs on HTTP, not HTTPS
// All data transmitted in plaintext (see app.listen at bottom)

// ============================================
// VULNERABILITY 26: Vulnerable Dependencies
// ============================================
// VULNERABLE: Using old versions of vulnerable packages
// Run: npm audit - will show many issues

// ============================================
// VULNERABILITY 27: Unsafe Redirects with Custom Protocol
// ============================================
app.get('/open-link', (req, res) => {
  const link = req.query.link;
  
  // VULNERABLE: Allows javascript:, data:, file: protocols
  res.send(`<a href="${link}">Click here</a>`);
});

// ============================================
// VULNERABILITY 28: Timing Attack / Weak Comparison
// ============================================
app.post('/timing-attack', (req, res) => {
  const providedSecret = req.body.secret;
  const realSecret = 'super-secret-key-12345';
  
  // VULNERABLE: String comparison is timing-safe vulnerable
  // Time taken reveals information about the secret
  if (providedSecret == realSecret) {
    res.send('Correct');
  } else {
    res.send('Wrong');
  }
});

// ============================================
// VULNERABILITY 29: JSON Serialization Injection
// ============================================
app.get('/userdata', (req, res) => {
  const userId = req.query.id;
  
  // VULNERABLE: Directly embedding user input in response
  res.send(`{"user_id": ${userId}, "role": "user"}`);
  
  // Try: /userdata?id=1, "isAdmin": true}//
});

// ============================================
// VULNERABILITY 30: Insecure Temporary File
// ============================================
app.get('/download-temp', (req, res) => {
  const filename = 'temp-' + Math.random().toString(36);
  
  // VULNERABLE: Predictable temp file names
  fs.writeFileSync(path.join(__dirname, 'temp', filename), 'sensitive data');
  
  res.send(`Temp file: ${filename}`);
});

// Homepage
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Vulnerable Web Application</title>
      <style>
        body { font-family: Arial; margin: 20px; }
        .section { margin: 20px 0; padding: 10px; border: 1px solid #ccc; }
        code { background: #f0f0f0; padding: 5px; }
      </style>
    </head>
    <body>
      <h1>Educational Vulnerable Web Application</h1>
      <p><strong>⚠️ WARNING: This application is intentionally vulnerable for educational purposes only.</strong></p>
      
      <div class="section">
        <h2>1. SQL Injection</h2>
        <form method="POST" action="/login">
          <input type="text" name="username" placeholder="Username" required>
          <input type="password" name="password" placeholder="Password" required>
          <button>Login</button>
        </form>
        <p><code>Try: username: ' OR '1'='1</code></p>
      </div>

      <div class="section">
        <h2>2. XSS (Cross-Site Scripting)</h2>
        <form method="POST" action="/comment">
          <input type="text" name="comment" placeholder="Enter comment" required>
          <button>Submit</button>
        </form>
        <p><code>Try: &lt;script&gt;alert('XSS')&lt;/script&gt;</code></p>
      </div>

      <div class="section">
        <h2>3. Insecure Direct Object References (IDOR)</h2>
        <p><a href="/user/1">View User 1</a> | <a href="/user/2">View User 2</a></p>
      </div>

      <div class="section">
        <h2>4. Command Injection</h2>
        <p><a href="/ping?host=8.8.8.8">Ping Google DNS</a></p>
        <p><code>Try: /ping?host=8.8.8.8; cat /etc/passwd</code></p>
      </div>

      <div class="section">
        <h2>5. Path Traversal</h2>
        <p><code>Try: /download?file=../app.js</code></p>
      </div>

      <div class="section">
        <h2>6. Hardcoded Credentials</h2>
        <p><a href="/api-key">View API Key (should never be exposed)</a></p>
      </div>

      <div class="section">
        <h2>7. No Authentication</h2>
        <p><a href="/admin">Access Admin Panel</a></p>
      </div>

      <div class="section">
        <h2>8. User Registration (with SQL Injection & Plain Text Passwords)</h2>
        <form method="POST" action="/register">
          <input type="text" name="username" placeholder="Username" required>
          <input type="password" name="password" placeholder="Password" required>
          <input type="email" name="email" placeholder="Email" required>
          <button>Register</button>
        </form>
      </div>

      <div class="section">
        <h2>9. Information Disclosure</h2>
        <p><a href="/debug">View Debug Info</a></p>
      </div>

      <div class="section">
        <h2>10. Open Redirect</h2>
        <p><a href="/redirect?url=https://google.com">Redirect to Google</a></p>
        <p><code>Try: /redirect?url=https://attacker.com</code></p>
      </div>

      <div class="section">
        <h2>11. CSRF (Cross-Site Request Forgery)</h2>
        <form method="POST" action="/transfer-money">
          <input type="number" name="amount" placeholder="Amount" value="100" required>
          <input type="text" name="recipient" placeholder="Recipient" required>
          <button>Transfer Money</button>
        </form>
        <p><code>No CSRF token - can be triggered from other sites</code></p>
      </div>

      <div class="section">
        <h2>12. File Upload Validation</h2>
        <form method="POST" action="/upload">
          <input type="text" name="filename" placeholder="Filename" required>
          <textarea name="content" placeholder="File content" required></textarea>
          <button>Upload</button>
        </form>
        <p><code>Try: shell.php as filename</code></p>
      </div>

      <div class="section">
        <h2>13. Insecure Session IDs</h2>
        <form method="POST" action="/login-session">
          <input type="text" name="username" placeholder="Username" required>
          <button>Login</button>
        </form>
        <p><code>Session IDs are sequential: 1, 2, 3...</code></p>
      </div>

      <div class="section">
        <h2>14. XXE (XML External Entity)</h2>
        <form method="POST" action="/parse-xml">
          <textarea name="xml" placeholder="XML content" required></textarea>
          <button>Parse</button>
        </form>
      </div>

      <div class="section">
        <h2>15. SSRF (Server-Side Request Forgery)</h2>
        <p><a href="/fetch-url?url=http://localhost:3000">Fetch localhost</a></p>
        <p><code>Try: /fetch-url?url=http://169.254.169.254/latest/meta-data/</code></p>
      </div>

      <div class="section">
        <h2>16. Mass Assignment / Over-posting</h2>
        <form method="POST" action="/update-profile">
          <input type="text" name="user_id" placeholder="User ID" required>
          <input type="text" name="username" placeholder="New username">
          <button>Update</button>
        </form>
        <p><code>Try adding: isAdmin=1, isStaff=1</code></p>
      </div>

      <div class="section">
        <h2>17. Weak Encryption</h2>
        <form method="POST" action="/encrypt">
          <input type="text" name="data" placeholder="Data to encrypt" required>
          <button>Encrypt</button>
        </form>
        <p><code>Uses ECB mode - same plaintext = same ciphertext</code></p>
      </div>

      <div class="section">
        <h2>18. Uncontrolled Recursion / DOS</h2>
        <form method="POST" action="/process-json">
          <textarea name="json" placeholder="JSON data" required></textarea>
          <button>Process</button>
        </form>
        <p><code>No depth limit - can cause stack overflow</code></p>
      </div>

      <div class="section">
        <h2>19. Insecure Password Reset</h2>
        <p><a href="/reset-password?token=1">Reset Token for User 1</a></p>
        <p><code>Tokens are predictable (just user IDs)</code></p>
      </div>

      <div class="section">
        <h2>20. HTTP Parameter Pollution</h2>
        <p><a href="/process?id=1&id=2">Test Parameter Duplication</a></p>
      </div>

      <div class="section">
        <h2>21. Missing Input Validation</h2>
        <form method="POST" action="/create-post">
          <input type="text" name="title" placeholder="Title" required>
          <textarea name="content" placeholder="Content" required></textarea>
          <input type="number" name="user_id" placeholder="User ID" required>
          <button>Create Post</button>
        </form>
      </div>

      <div class="section">
        <h2>22. Log Injection</h2>
        <p><a href="/search?q=test%0A[FAKE]%20Admin%20logged%20in">Test Log Injection</a></p>
        <p><code>q=test%0A[FAKE] Admin logged in</code></p>
      </div>

      <div class="section">
        <h2>23. Brute Force - No Rate Limiting</h2>
        <form method="POST" action="/brute-force-login">
          <input type="text" name="username" placeholder="Username" required>
          <input type="password" name="password" placeholder="Password" required>
          <button>Login</button>
        </form>
        <p><code>No rate limiting - unlimited login attempts</code></p>
      </div>

      <div class="section">
        <h2>24. Config File Exposure</h2>
        <p><a href="/config">View Config</a></p>
        <p><code>Exposes .env file over HTTP</code></p>
      </div>

      <div class="section">
        <h2>25. HTTP without HTTPS</h2>
        <p>All data transmitted in plaintext</p>
        <p><code>No TLS/SSL encryption</code></p>
      </div>

      <div class="section">
        <h2>26. Vulnerable Dependencies</h2>
        <p>Run: <code>npm audit</code></p>
        <p>Old package versions with known vulnerabilities</p>
      </div>

      <div class="section">
        <h2>27. Unsafe Redirects with Custom Protocols</h2>
        <p><a href="/open-link?link=javascript:alert('XSS')">Try Protocol Redirect</a></p>
      </div>

      <div class="section">
        <h2>28. Timing Attack Vulnerability</h2>
        <form method="POST" action="/timing-attack">
          <input type="text" name="secret" placeholder="Secret" required>
          <button>Submit</button>
        </form>
      </div>

      <div class="section">
        <h2>29. JSON Serialization Injection</h2>
        <p><a href="/userdata?id=1">Get User Data</a></p>
        <p><code>Try: /userdata?id=1, "isAdmin": true}//</code></p>
      </div>

      <div class="section">
        <h2>30. Insecure Temporary Files</h2>
        <p><a href="/download-temp">Download Temp File</a></p>
        <p><code>Predictable temp file names</code></p>
      </div>

      <div class="section">
        <h2>Learning Resources</h2>
        <ul>
          <li><a href="https://owasp.org/www-project-top-ten/" target="_blank">OWASP Top 10</a></li>
          <li><a href="https://portswigger.net/burp/communityedition" target="_blank">Burp Suite Community</a></li>
          <li><a href="https://owasp.org/www-project-webgoat/" target="_blank">OWASP WebGoat</a></li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════╗
  ║   VULNERABLE WEB APPLICATION               ║
  ║   Started on http://localhost:${PORT}     ║
  ║   ⚠️  FOR EDUCATIONAL PURPOSES ONLY        ║
  ╚════════════════════════════════════════════╝
  `);
});
