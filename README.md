# Vulnerable Web Application - ENHANCED Edition (30+ Vulnerabilities)

**⚠️ WARNING**: This application is **intentionally EXTREMELY vulnerable** for educational and training purposes only. DO NOT use this in production or deploy it to the internet.

## Status: ENHANCED

This version includes **30+ security vulnerabilities** covering:
- OWASP Top 10
- CWE/SANS Top 25
- Advanced exploitation techniques
- Real-world attack scenarios

See [ENHANCED_VULNS.md](ENHANCED_VULNS.md) for complete vulnerability list.

## Purpose

This vulnerable web application is designed to teach security vulnerabilities and help you understand:
- Common attack vectors
- Advanced exploitation techniques
- How to identify vulnerabilities
- Secure coding practices
- Security testing methodologies

## Quick Statistics

- **Total Vulnerabilities**: 30+
- **API Endpoints**: 35+
- **Attack Vectors**: SQL, XSS, SSRF, XXE, Command Injection, Path Traversal, and more
- **Database**: SQLite with test data
- **Framework**: Express.js (JavaScript/Node.js)

## Vulnerabilities Included (10 Core)

### 1. **SQL Injection**
- **Location**: `/login` endpoint
- **Vulnerability**: User input is directly concatenated into SQL queries
- **Exploitation**: 
  - Username: `' OR '1'='1' --`
  - Password: (anything)
- **Impact**: Authentication bypass, data theft, data manipulation
- **Fix**: Use parameterized queries/prepared statements

### 2. **Cross-Site Scripting (XSS)**
- **Location**: `/comment` endpoint
- **Vulnerability**: User input is rendered directly in HTML without escaping
- **Exploitation**: 
  - `<script>alert('XSS')</script>`
  - `<img src=x onerror=alert('XSS')>`
- **Impact**: Session hijacking, credential theft, malware distribution
- **Fix**: HTML escape all user input, use Content Security Policy

### 3. **Insecure Direct Object References (IDOR)**
- **Location**: `/user/:id` endpoint
- **Vulnerability**: No authorization check on user access
- **Exploitation**: 
  - `/user/1` - View any user's data including passwords
  - `/user/2`
- **Impact**: Unauthorized access to sensitive user data
- **Fix**: Implement proper authorization checks

### 4. **Command Injection**
- **Location**: `/ping` endpoint
- **Vulnerability**: User input passed directly to system commands
- **Exploitation**: 
  - `/ping?host=8.8.8.8; whoami`
  - `/ping?host=localhost | cat /etc/passwd`
  - `/ping?host=$(rm -rf /)`
- **Impact**: Complete system compromise, data destruction
- **Fix**: Never execute user input as commands; use parameterized APIs

### 5. **Path Traversal**
- **Location**: `/download` endpoint
- **Vulnerability**: No validation of file paths
- **Exploitation**: 
  - `/download?file=../app.js`
  - `/download?file=../../../../etc/passwd`
- **Impact**: Unauthorized file access, source code disclosure
- **Fix**: Use whitelist validation, avoid user input in file paths

### 6. **Hardcoded Credentials**
- **Location**: `/api-key` endpoint
- **Vulnerability**: Sensitive data embedded in source code
- **Exploitation**: 
  - Visit `/api-key` to view API keys and database passwords
  - Read source code
- **Impact**: Credential compromise, unauthorized API access
- **Fix**: Use environment variables and secure secret management

### 7. **Missing Authentication**
- **Location**: `/admin` endpoint
- **Vulnerability**: No session validation or login requirement
- **Exploitation**: Anyone can access admin functionality
- **Impact**: Unauthorized privilege escalation
- **Fix**: Implement proper authentication and authorization

### 8. **Weak Password Storage**
- **Location**: `/register` endpoint
- **Vulnerability**: Passwords stored in plaintext
- **Exploitation**: 
  - Database compromise reveals all passwords
  - Check `/user/1` to see admin password
- **Impact**: Complete user account compromise
- **Fix**: Use bcrypt, PBKDF2, or Argon2 hashing

### 9. **Information Disclosure**
- **Location**: `/debug` endpoint
- **Vulnerability**: Sensitive debug information publicly accessible
- **Exploitation**: 
  - Exposes database names, credentials, system info
- **Impact**: Reconnaissance for further attacks
- **Fix**: Remove or protect debug endpoints

### 10. **Unvalidated Redirects**
- **Location**: `/redirect` endpoint
- **Vulnerability**: No validation of redirect URLs
- **Exploitation**: 
  - `/redirect?url=https://attacker.com`
  - Used in phishing attacks
- **Impact**: Phishing, malware distribution
- **Fix**: Validate URLs against whitelist

## Additional Vulnerabilities (20+ More)

In addition to the core 10, this enhanced version includes:

- **CSRF** - Transfer money without validation
- **File Upload Bypass** - Upload executable files
- **Insecure Session IDs** - Predictable session tokens
- **XXE Injection** - XML external entity attacks
- **SSRF** - Access internal services
- **Mass Assignment** - Modify unintended fields
- **Weak Encryption** - ECB mode determinism
- **Uncontrolled Recursion** - DOS attacks
- **Insecure Password Reset** - Predictable tokens
- **HTTP Parameter Pollution** - Duplicate parameters
- **Missing Input Validation** - Buffer overflow potential
- **Log Injection** - Forge log entries
- **No Rate Limiting** - Brute force attacks
- **Config Exposure** - Accessible .env file
- **No HTTPS** - Plaintext transmission
- **Vulnerable Dependencies** - Known CVEs
- **Unsafe Redirects** - Protocol-based XSS
- **Timing Attacks** - Information leakage
- **JSON Serialization Injection** - Malformed JSON
- **Insecure Temp Files** - Predictable names
- And more...

**See [ENHANCED_VULNS.md](ENHANCED_VULNS.md) for complete list and testing instructions.**

## Setup & Installation

### Prerequisites
- Node.js (v12 or higher)
- npm

### Installation

```bash
cd "Vulnerable Application"
npm install
```

### Running the Application

```bash
npm start
```

The application will start at `http://localhost:3000`

### Development Mode (with auto-reload)

```bash
npm run dev
```

## Testing Tools

### Command Line Tools
```bash
# Basic GET request
curl http://localhost:3000/user/1

# POST with data
curl -X POST -d "username=admin&password=' OR '1'='1'" http://localhost:3000/login

# Test path traversal
curl "http://localhost:3000/download?file=../app.js"
```

### Recommended Security Tools
1. **Burp Suite Community** - Web application security testing
2. **OWASP ZAP** - Free alternative to Burp Suite
3. **curl** / **Postman** - API testing
4. **SQLMap** - SQL injection testing
5. **Chrome DevTools** - XSS and client-side analysis

## Learning Path

1. **Start with SQL Injection** - Login endpoint
2. **Test XSS** - Comment endpoint
3. **Explore IDOR** - User data access
4. **Try Command Injection** - Ping functionality
5. **Attempt Path Traversal** - File download
6. **Check Information Disclosure** - Debug endpoint
7. **Break Authentication** - Admin panel
8. **Test Authorization** - Various endpoints

## Fixes & Secure Coding

Each vulnerability comes with a recommended fix. Learning how to secure each vulnerability will improve your development skills:

- Use ORM frameworks or parameterized queries
- Implement proper input validation and output encoding
- Apply principle of least privilege
- Use security headers (CSP, X-Frame-Options, etc.)
- Implement proper authentication and authorization
- Use bcrypt or similar for password hashing
- Remove debug endpoints in production
- Never hardcode credentials

## Additional Resources

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [DVWA - Damn Vulnerable Web App](http://www.dvwa.co.uk/)

## Disclaimer

This application is provided for **educational and authorized testing purposes only**. Using this application on systems you don't own or have explicit permission to test is illegal. Always practice ethical hacking principles:

- Only test systems you own or have written authorization to test
- Don't cause harm or violate privacy
- Respect the law and use this knowledge responsibly
- Follow responsible disclosure practices

## License

Educational use only.
