# Learning Checklist - Track Your Progress

Use this checklist to track which vulnerabilities you've tested and learned.

## Getting Started

- [ ] Install Node.js (v12+)
- [ ] Install npm (v6+)
- [ ] Clone/download vulnerable app
- [ ] Run `npm install`
- [ ] Run `npm start`
- [ ] Open http://localhost:3000
- [ ] Read README.md
- [ ] Read QUICK_START.md

---

## Original 10 Vulnerabilities (OWASP Top 10)

### 1. SQL Injection
- [ ] Understand what it is
- [ ] Test with curl
- [ ] Test with web form
- [ ] Try with Burp Suite
- [ ] Study secure fix (parameterized queries)
- [ ] Implement fix in code

### 2. XSS (Cross-Site Scripting)
- [ ] Understand reflected vs stored
- [ ] Test basic `<script>` tag
- [ ] Test `<img>` tag
- [ ] Test event handlers
- [ ] Study output encoding
- [ ] Test fix implementation

### 3. IDOR (Insecure Direct Object References)
- [ ] Test /user/1
- [ ] Test /user/2
- [ ] Test /user/99
- [ ] Understand authorization
- [ ] Study authorization checks
- [ ] Implement fix

### 4. Command Injection
- [ ] Test basic ping
- [ ] Test command chaining (;)
- [ ] Test pipes (|)
- [ ] Understand security risks
- [ ] Study safe alternatives
- [ ] Learn execFile vs exec

### 5. Path Traversal
- [ ] Test ../app.js
- [ ] Test ../../package.json
- [ ] Test ../../../../etc/passwd
- [ ] Understand path normalization
- [ ] Study fixes (path.resolve)
- [ ] Implement fix

### 6. Hardcoded Credentials
- [ ] Access /api-key endpoint
- [ ] View exposed secrets
- [ ] Check source code
- [ ] Learn about .env files
- [ ] Study environment variables
- [ ] Implement fix

### 7. Missing Authentication
- [ ] Access /admin without login
- [ ] Try /admin/update
- [ ] Access other protected endpoints
- [ ] Study authentication methods
- [ ] Learn JWT vs sessions
- [ ] Implement middleware

### 8. Weak Password Storage
- [ ] Check /user/1 password
- [ ] Verify plaintext storage
- [ ] Check database directly
- [ ] Learn about hashing
- [ ] Study bcrypt, Argon2
- [ ] Implement password hashing

### 9. Information Disclosure
- [ ] Visit /debug endpoint
- [ ] See exposed information
- [ ] Check error messages
- [ ] Study security headers
- [ ] Learn what to hide
- [ ] Implement proper error handling

### 10. Open Redirect
- [ ] Test /redirect?url=
- [ ] Test with external domain
- [ ] Understand phishing risk
- [ ] Study URL validation
- [ ] Learn whitelist approach
- [ ] Implement fix

---

## Advanced Vulnerabilities (11-20)

### 11. CSRF (Cross-Site Request Forgery)
- [ ] Understand CSRF concept
- [ ] Test /transfer-money
- [ ] Create CSRF form on another site
- [ ] Study CSRF tokens
- [ ] Learn SameSite cookies
- [ ] Implement CSRF protection

### 12. File Upload Validation
- [ ] Test upload normal file
- [ ] Test upload shell.php
- [ ] Test upload executable
- [ ] Study extension validation
- [ ] Learn MIME type checking
- [ ] Implement upload protection

### 13. Insecure Session IDs
- [ ] Test /login-session
- [ ] Notice sequential IDs
- [ ] Predict next ID
- [ ] Understand session hijacking
- [ ] Study session ID generation
- [ ] Implement crypto.randomBytes()

### 14. XXE (XML External Entity)
- [ ] Understand XXE concept
- [ ] Test /parse-xml
- [ ] Try file read XXE
- [ ] Try billion laughs DOS
- [ ] Learn DTD validation
- [ ] Implement XXE protection

### 15. SSRF (Server-Side Request Forgery)
- [ ] Test /fetch-url
- [ ] Try internal URLs
- [ ] Try AWS metadata URL
- [ ] Test Docker API access
- [ ] Study URL validation
- [ ] Implement IP/host whitelist

### 16. Mass Assignment / Over-posting
- [ ] Understand concept
- [ ] Test /update-profile
- [ ] Try adding isAdmin=1
- [ ] Try adding isStaff=1
- [ ] Study privilege escalation
- [ ] Implement field whitelist

### 17. Weak Encryption (ECB Mode)
- [ ] Understand ECB vs CBC
- [ ] Test /encrypt endpoint
- [ ] Encrypt same value twice
- [ ] Notice identical ciphertext
- [ ] Study encryption modes
- [ ] Implement CBC/GCM mode

### 18. Uncontrolled Recursion / DOS
- [ ] Create nested JSON
- [ ] Test /process-json
- [ ] Cause stack overflow
- [ ] Understand DOS attacks
- [ ] Study depth limits
- [ ] Implement limit validation

### 19. Insecure Password Reset
- [ ] Test /reset-password?token=1
- [ ] Try token=2, token=3
- [ ] Understand token prediction
- [ ] Study secure tokens
- [ ] Learn about expiration
- [ ] Implement secure reset

### 20. HTTP Parameter Pollution
- [ ] Understand concept
- [ ] Test /process?id=1&id=2
- [ ] Test with different values
- [ ] Study server handling
- [ ] Learn inconsistencies
- [ ] Implement duplicate rejection

---

## Security Hardening (21-30+)

### 21. Missing Input Validation
- [ ] Test /create-post with long input
- [ ] Test with special characters
- [ ] Test with invalid types
- [ ] Understand DOS potential
- [ ] Study validation techniques
- [ ] Implement input validation

### 22. Log Injection
- [ ] Test /search endpoint
- [ ] Inject newlines (%0A)
- [ ] Create fake log entries
- [ ] Check app.log file
- [ ] Understand log forging
- [ ] Implement log sanitization

### 23. No Rate Limiting
- [ ] Test rapid /brute-force-login
- [ ] Generate many requests
- [ ] Understand brute force
- [ ] Study rate limiting
- [ ] Learn fail2ban
- [ ] Implement rate limiter

### 24. Config File Exposure
- [ ] Access /config endpoint
- [ ] See .env contents
- [ ] Understand secret leakage
- [ ] Study secret management
- [ ] Learn AWS Secrets Manager
- [ ] Remove config endpoints

### 25. No HTTPS / Plaintext Data
- [ ] Use Wireshark/tcpdump
- [ ] Capture HTTP traffic
- [ ] See plaintext credentials
- [ ] Understand MITM attacks
- [ ] Study TLS/SSL
- [ ] Implement HTTPS

### 26. Vulnerable Dependencies
- [ ] Run npm audit
- [ ] See vulnerability list
- [ ] Understand CVEs
- [ ] Check version numbers
- [ ] Study update process
- [ ] Run npm update

### 27. Unsafe Redirects
- [ ] Test /open-link with protocols
- [ ] Try javascript: protocol
- [ ] Try data: protocol
- [ ] Understand XSS through redirect
- [ ] Study URL validation
- [ ] Implement protocol check

### 28. Timing Attacks
- [ ] Test /timing-attack
- [ ] Measure response times
- [ ] Try different secrets
- [ ] Notice timing differences
- [ ] Study constant-time comparison
- [ ] Implement crypto.timingSafeEqual()

### 29. JSON Serialization Injection
- [ ] Understand JSON structure
- [ ] Test /userdata with special chars
- [ ] Try breaking JSON
- [ ] Study serialization
- [ ] Learn escaping
- [ ] Implement JSON.stringify()

### 30. Insecure Temporary Files
- [ ] Test /download-temp
- [ ] Get filename
- [ ] Check /temp directory
- [ ] Notice predictability
- [ ] Study random generation
- [ ] Implement crypto.randomBytes()

---

## Tools Mastery

### Burp Suite Community Edition
- [ ] Download and install
- [ ] Configure proxy
- [ ] Intercept requests
- [ ] Use Repeater tab
- [ ] Use Intruder tab
- [ ] Run Scanner

### OWASP ZAP
- [ ] Download and install
- [ ] Set up proxy
- [ ] Run passive scan
- [ ] Run active scan
- [ ] Review findings
- [ ] Generate report

### SQLMap
- [ ] Install SQLMap
- [ ] Test /login endpoint
- [ ] Enumerate databases
- [ ] Extract data
- [ ] Understand options
- [ ] Use automation

### curl & Browser Tools
- [ ] Basic GET requests
- [ ] POST requests with data
- [ ] Add headers
- [ ] Follow redirects
- [ ] Inspect cookies
- [ ] View source code

---

## Understanding & Learning

### Security Concepts
- [ ] Learn OWASP Top 10
- [ ] Understand CVSS scoring
- [ ] Study attack vectors
- [ ] Learn defense strategies
- [ ] Understand trust boundaries
- [ ] Study threat models

### Secure Coding
- [ ] Input validation
- [ ] Output encoding
- [ ] Parameterized queries
- [ ] Password hashing
- [ ] Encryption algorithms
- [ ] Security headers

### Best Practices
- [ ] Principle of least privilege
- [ ] Defense in depth
- [ ] Secure by default
- [ ] Fail securely
- [ ] Don't trust user input
- [ ] Keep it simple

---

## Implementation Challenges

### Beginner
- [ ] Fix SQL injection in /login
- [ ] Fix XSS in /comment
- [ ] Add basic authentication
- [ ] Implement IDOR check
- [ ] Add path validation

### Intermediate
- [ ] Implement CSRF tokens
- [ ] Add file upload validation
- [ ] Implement rate limiting
- [ ] Add HTTPS
- [ ] Secure password storage

### Advanced
- [ ] Implement OAuth/JWT
- [ ] Add security headers
- [ ] Implement encryption
- [ ] Create security scanner
- [ ] Implement WAF rules

---

## Testing & Verification

### Manual Testing
- [ ] Test each vulnerability manually
- [ ] Verify fixes work
- [ ] Try bypass techniques
- [ ] Test edge cases
- [ ] Document findings

### Automated Testing
- [ ] Run npm audit
- [ ] Use Burp Scanner
- [ ] Use ZAP Scanner
- [ ] Use SQLMap
- [ ] Create test cases

### Documentation
- [ ] Document vulnerabilities
- [ ] Note exploitation steps
- [ ] Record fixes implemented
- [ ] Create security checklist
- [ ] Share knowledge

---

## Advanced Topics

- [ ] Learn SSRF exploitation
- [ ] Study XXE attacks
- [ ] Understand deserialization
- [ ] Learn about gadget chains
- [ ] Study privilege escalation
- [ ] Learn post-exploitation

---

## Certifications & Beyond

- [ ] Get CompTIA Security+
- [ ] Get OWASP GPEN
- [ ] Get CEH (Certified Ethical Hacker)
- [ ] Get OSCP
- [ ] Contribute to open source
- [ ] Join bug bounty programs

---

## Progress Summary

### Completed
- [ ] Reading & Understanding: ___ / 10 vulnerabilities
- [ ] Testing: ___ / 30 vulnerabilities
- [ ] Fixes Implemented: ___ / 30 vulnerabilities
- [ ] Tools Mastered: ___ / 4 tools
- [ ] Challenges Completed: ___ / 3 levels

### Notes

```
[Your learning notes here]
```

---

## Final Assessment

- [ ] Can explain all 30 vulnerabilities
- [ ] Can test at least 20 vulnerabilities
- [ ] Can fix at least 10 vulnerabilities
- [ ] Can use Burp Suite
- [ ] Can use OWASP ZAP
- [ ] Understand secure coding principles
- [ ] Ready for bug bounty or OSCP
- [ ] Can teach others

---

**Keep learning and practicing! Security is a journey, not a destination.** 🚀
