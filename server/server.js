/**
 * =====================================================
 * ALZAIN FURNITURE - SECURE NODE.JS SERVER
 * =====================================================
 * Professional Express server with Helmet.js security
 * 
 * Installation:
 * 1. cd server
 * 2. npm install
 * 3. Create .env file with your API keys
 * 4. npm start
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// 1. HELMET.JS - SECURITY HEADERS
// =============================================
app.use(helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.tailwindcss.com",
        "https://unpkg.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https:"
      ],
      connectSrc: [
        "'self'",
        "https://generativelanguage.googleapis.com",
        "https://api.openai.com",
        "https://api.stability.ai"
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  // HSTS - Force HTTPS
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  // Prevent clickjacking
  frameguard: { action: 'deny' },
  // Prevent MIME type sniffing
  noSniff: true,
  // XSS Protection
  xssFilter: true,
  // Hide X-Powered-By header
  hidePoweredBy: true,
  // Referrer Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// =============================================
// 2. CORS CONFIGURATION
// =============================================
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      process.env.PRODUCTION_URL
    ].filter(Boolean);
    
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// =============================================
// 3. RATE LIMITING
// =============================================
// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    error: 'تم تجاوز الحد المسموح للطلبات. يرجى الانتظار.',
    retryAfter: 15
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict rate limiter for AI API
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 AI requests per hour
  message: {
    success: false,
    error: 'تم تجاوز حد طلبات الذكاء الاصطناعي. يرجى الانتظار ساعة.',
    retryAfter: 60
  }
});

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts
  message: {
    success: false,
    error: 'محاولات تسجيل دخول كثيرة. يرجى الانتظار 15 دقيقة.'
  }
});

app.use(generalLimiter);

// =============================================
// 4. BODY PARSING & SIZE LIMITS
// =============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =============================================
// 5. STATIC FILES
// =============================================
app.use(express.static(path.join(__dirname, '..'), {
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Cache static assets
    if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// =============================================
// 6. API PROXY - HIDE API KEYS
// =============================================
app.post('/api/ai/generate', aiLimiter, async (req, res) => {
  try {
    const { prompt, image, provider = 'gemini' } = req.body;
    
    // Input validation
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'الوصف مطلوب'
      });
    }
    
    if (prompt.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'الوصف طويل جداً'
      });
    }
    
    // Validate image if provided
    if (image) {
      if (!image.startsWith('data:image/')) {
        return res.status(400).json({
          success: false,
          error: 'نوع الصورة غير صالح'
        });
      }
      
      // Check image size (base64 is ~4/3 of original)
      const base64Size = Buffer.from(image.split(',')[1] || '', 'base64').length;
      if (base64Size > 10 * 1024 * 1024) { // 10MB limit
        return res.status(400).json({
          success: false,
          error: 'حجم الصورة كبير جداً'
        });
      }
    }
    
    let response;
    
    if (provider === 'gemini') {
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
      
      if (!GEMINI_API_KEY) {
        return res.status(500).json({
          success: false,
          error: 'خدمة الذكاء الاصطناعي غير متاحة'
        });
      }
      
      const model = image ? 'gemini-pro-vision' : 'gemini-pro';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      
      const parts = [{ text: prompt }];
      
      if (image) {
        const base64Data = image.split(',')[1];
        const mimeType = image.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
        parts.push({
          inline_data: {
            mime_type: mimeType,
            data: base64Data
          }
        });
      }
      
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Gemini API Error:', data);
        return res.status(500).json({
          success: false,
          error: 'حدث خطأ في خدمة الذكاء الاصطناعي'
        });
      }
      
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      return res.json({
        success: true,
        result: result
      });
    }
    
    // Add more providers here...
    
    return res.status(400).json({
      success: false,
      error: 'مزود الذكاء الاصطناعي غير مدعوم'
    });
    
  } catch (error) {
    console.error('AI API Error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'حدث خطأ غير متوقع'
    });
  }
});

// =============================================
// 7. AUTHENTICATION ROUTES
// =============================================
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { password } = req.body;
    
    // Get stored password hash
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
    
    if (!password || !ADMIN_PASSWORD_HASH) {
      return res.status(400).json({
        success: false,
        error: 'بيانات الدخول غير صحيحة'
      });
    }
    
    // Hash the provided password
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    
    if (hash !== ADMIN_PASSWORD_HASH) {
      return res.status(401).json({
        success: false,
        error: 'كلمة المرور غير صحيحة'
      });
    }
    
    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + (30 * 60 * 1000); // 30 minutes
    
    return res.json({
      success: true,
      token: sessionToken,
      expiry: expiry
    });
    
  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'حدث خطأ في تسجيل الدخول'
    });
  }
});

// =============================================
// 8. HEALTH CHECK
// =============================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// =============================================
// 9. SECURITY LOGS (Admin only)
// =============================================
app.get('/api/admin/security-logs', (req, res) => {
  // Add authentication check here
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'غير مصرح'
    });
  }
  
  // Return logs (implement proper storage)
  res.json({
    success: true,
    logs: []
  });
});

// =============================================
// 10. ERROR HANDLING
// =============================================
// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'الصفحة غير موجودة'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  // Log error details (not to client)
  console.error('Server Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString()
  });
  
  // Send masked error to client
  res.status(err.status || 500).json({
    success: false,
    error: 'حدث خطأ في الخادم'
  });
});

// =============================================
// 11. START SERVER
// =============================================
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏠 مصنع الزين للمفروشات - Secure Server                 ║
║                                                           ║
║   Server running on: http://localhost:${PORT}              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                        ║
║                                                           ║
║   Security Features Active:                               ║
║   ✅ Helmet.js (Security Headers)                         ║
║   ✅ CORS Protection                                      ║
║   ✅ Rate Limiting                                        ║
║   ✅ Input Validation                                     ║
║   ✅ Error Masking                                        ║
║   ✅ API Key Protection                                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
