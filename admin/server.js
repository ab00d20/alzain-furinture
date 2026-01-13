const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'alzain-furniture-secret-key-2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(express.static('.'));

// Database setup
const db = new sqlite3.Database('./admin/database.db', (err) => {
  if (err) {
    console.error('Database error:', err);
  } else {
    console.log('Connected to database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    collection TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    images TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    product_id INTEGER,
    product_name TEXT,
    quantity INTEGER DEFAULT 1,
    total_price REAL,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`);

  // Create default admin if not exists
  const defaultPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO admins (username, password, email) VALUES (?, ?, ?)`,
    ['admin', defaultPassword, 'admin@alzain.com']);
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'PROUDCTS/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Authentication middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// ==================== AUTH ROUTES ====================
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM admins WHERE username = ?', [username], (err, admin) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    if (bcrypt.compareSync(password, admin.password)) {
      const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, username: admin.username });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// ==================== PRODUCT ROUTES ====================
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY created_at DESC', [], (err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(products.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : []
    })));
  });
});

app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    });
  });
});

app.post('/api/products', authenticateToken, upload.array('images', 10), (req, res) => {
  const { name, collection, description, price } = req.body;
  const images = req.files ? req.files.map(f => f.path) : [];

  db.run(
    'INSERT INTO products (name, collection, description, price, images) VALUES (?, ?, ?, ?, ?)',
    [name, collection, description, price, JSON.stringify(images)],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Product created successfully' });
    }
  );
});

app.put('/api/products/:id', authenticateToken, upload.array('images', 10), (req, res) => {
  const { name, collection, description, price } = req.body;
  let images = req.body.existing_images ? JSON.parse(req.body.existing_images) : [];
  
  if (req.files && req.files.length > 0) {
    images = images.concat(req.files.map(f => f.path));
  }

  db.run(
    'UPDATE products SET name = ?, collection = ?, description = ?, price = ?, images = ? WHERE id = ?',
    [name, collection, description, price, JSON.stringify(images), req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product updated successfully' });
    }
  );
});

app.delete('/api/products/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product deleted successfully' });
  });
});

// ==================== ORDER ROUTES ====================
app.get('/api/orders', authenticateToken, (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, orders) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(orders);
  });
});

app.post('/api/orders', (req, res) => {
  const { customer_name, customer_email, customer_phone, product_id, product_name, quantity, total_price, notes } = req.body;

  db.run(
    'INSERT INTO orders (customer_name, customer_email, customer_phone, product_id, product_name, quantity, total_price, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [customer_name, customer_email, customer_phone, product_id, product_name, quantity || 1, total_price, notes],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Order created successfully' });
    }
  );
});

app.put('/api/orders/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Order status updated' });
  });
});

app.delete('/api/orders/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM orders WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Order deleted successfully' });
  });
});

// ==================== STATS ====================
app.get('/api/stats', authenticateToken, (req, res) => {
  const stats = {};
  
  db.get('SELECT COUNT(*) as count FROM products', (err, result) => {
    stats.totalProducts = result?.count || 0;
    
    db.get('SELECT COUNT(*) as count FROM orders', (err, result) => {
      stats.totalOrders = result?.count || 0;
      
      db.get('SELECT COUNT(*) as count FROM orders WHERE status = "pending"', (err, result) => {
        stats.pendingOrders = result?.count || 0;
        
        db.get('SELECT SUM(total_price) as total FROM orders WHERE status = "completed"', (err, result) => {
          stats.totalRevenue = result?.total || 0;
          res.json(stats);
        });
      });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Admin Server running at http://localhost:${PORT}`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin/dashboard.html`);
  console.log(`🔐 Default Login: username: admin, password: admin123`);
});
