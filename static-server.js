/**
 * =====================================================
 * ALZAIN FURNITURE - STATIC FILE SERVER WITH API
 * =====================================================
 * Serves preview-ultimate.html with security headers
 * Includes API for product management
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Data directory for persistent storage
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const IMAGES_DIR = path.join(__dirname, 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify({
    siteName: 'مصنع الزين للمفروشات',
    phone: '+966500000000',
    email: 'info@alzain.com'
  }, null, 2));
}

// Enable compression
app.use(compression());

// Parse JSON bodies (limit 50MB for images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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

// Serve uploaded images
app.use('/uploads', express.static(IMAGES_DIR));

// Serve static files
app.use(express.static(__dirname, {
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|webp)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    if (filePath.match(/\.html$/)) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// =====================================================
// API ROUTES FOR PRODUCTS
// =====================================================

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: true, products: [] });
  }
});

// Save all products
app.post('/api/products', (req, res) => {
  try {
    const { products } = req.body;
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    res.json({ success: true, message: 'تم حفظ المنتجات' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'فشل في حفظ المنتجات' });
  }
});

// Add single product
app.post('/api/products/add', (req, res) => {
  try {
    const product = req.body;
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    
    // Generate ID if not exists
    if (!product.id) {
      product.id = Date.now().toString();
    }
    
    products.push(product);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    res.json({ success: true, product, message: 'تم إضافة المنتج' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'فشل في إضافة المنتج' });
  }
});

// Update product
app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = req.body;
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
      res.json({ success: true, product: products[index], message: 'تم تحديث المنتج' });
    } else {
      res.status(404).json({ success: false, error: 'المنتج غير موجود' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'فشل في تحديث المنتج' });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    
    const filtered = products.filter(p => p.id !== id);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(filtered, null, 2));
    res.json({ success: true, message: 'تم حذف المنتج' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'فشل في حذف المنتج' });
  }
});

// Upload image (Base64)
app.post('/api/upload', (req, res) => {
  try {
    const { image, filename } = req.body;
    
    if (!image) {
      return res.status(400).json({ success: false, error: 'لم يتم إرسال صورة' });
    }
    
    // Extract base64 data
    const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ success: false, error: 'صيغة الصورة غير صحيحة' });
    }
    
    const ext = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');
    
    // Generate unique filename
    const uniqueName = filename || `img_${Date.now()}.${ext}`;
    const filePath = path.join(IMAGES_DIR, uniqueName);
    
    fs.writeFileSync(filePath, buffer);
    
    const imageUrl = `/uploads/${uniqueName}`;
    res.json({ success: true, url: imageUrl, message: 'تم رفع الصورة' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'فشل في رفع الصورة' });
  }
});

// =====================================================
// API ROUTES FOR SETTINGS
// =====================================================

// Get settings
app.get('/api/settings', (req, res) => {
  try {
    const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    res.json({ success: true, settings });
  } catch (error) {
    res.json({ success: true, settings: {} });
  }
});

// Save settings
app.post('/api/settings', (req, res) => {
  try {
    const settings = req.body;
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    res.json({ success: true, message: 'تم حفظ الإعدادات' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'فشل في حفظ الإعدادات' });
  }
});

// =====================================================
// MAIN ROUTES
// =====================================================

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'preview-ultimate.html'));
});

// Admin routes
app.get('/admin', (req, res) => {
  res.redirect('/admin/login.html');
});

// Health check
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
║   Admin: /admin/login.html                                ║
║                                                           ║
║   API Endpoints:                                          ║
║   GET  /api/products     - Get all products               ║
║   POST /api/products     - Save all products              ║
║   POST /api/products/add - Add single product             ║
║   PUT  /api/products/:id - Update product                 ║
║   DELETE /api/products/:id - Delete product               ║
║   POST /api/upload       - Upload image                   ║
║   GET  /api/settings     - Get settings                   ║
║   POST /api/settings     - Save settings                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
