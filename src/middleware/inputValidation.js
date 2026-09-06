// Input validation middleware
export const validateEmail = (email) => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePhoneNumber = (phone) => {
  if (typeof phone !== 'string' || phone.trim().length === 0) return false;
  const phoneRegex = /^[\d\s\-+()]+$/;
  return phoneRegex.test(phone.trim());
};

export const validateString = (str, minLength = 1, maxLength = 1000) => {
  return typeof str === 'string' && str.length >= minLength && str.length <= maxLength;
};

export const validateInteger = (value) => {
  if (typeof value === 'number') return Number.isInteger(value) && value > 0;
  if (typeof value !== 'string' || !/^\d+$/.test(value.trim())) return false;
  return Number(value) > 0;
};

export const validateInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .trim()
          .replace(/<script[^>]*>.*?<\/script>/gi, '')
          .replace(/<[^>]+>/g, '');
      }
    });
  }
  next();
};

export const checkMaliciousPatterns = (req, res, next) => {
  const body = JSON.stringify(req.body);
  const maliciousPatterns = [
    /(\$where|\$ne|\$gt|\$regex)/gi,
    /\b(union\s+select|select\s+.+\s+from|insert\s+into|update\s+\w+\s+set|delete\s+from|drop\s+(table|database))\b/gi,
  ];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(body)) {
      console.warn(`Malicious pattern detected from IP: ${req.ip}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid input detected',
      });
    }
  }
  next();
};
