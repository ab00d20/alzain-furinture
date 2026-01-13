/**
 * =====================================================
 * ALZAIN FURNITURE - STATIC FILE SERVER
 * =====================================================
 * Serves preview-ultimate.html with security headers
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable compression
app.use(compression());

// Security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://cdn.tailwindcss.com",
        "https://unpkg.com",
        "https://www.google-analytics.com",
        "https://connect.facebook.net"
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
        "https://api.stability.ai",
        "https://www.google-analytics.com",
        "https://www.facebook.com"
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors());

// Serve static files
app.use(express.static(__dirname, {
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Cache static assets for 1 year
    if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|webp)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    // No cache for HTML files
    if (filePath.match(/\.html$/)) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// Main route - serve preview-ultimate.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'preview-ultimate.html'));
});

// Admin routes
app.get('/admin', (req, res) => {
  res.redirect('/admin/login.html');
});

// Health check for Render
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'preview-ultimate.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏠 مصنع الزين للمفروشات - Al-Zain Furniture             ║
║                                                           ║
║   Server running on: http://localhost:${PORT}               ║
║   Main page: preview-ultimate.html                        ║
║                                                           ║
║   ✅ Security Headers Active                              ║
║   ✅ Compression Enabled                                  ║
║   ✅ Static File Caching                                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
