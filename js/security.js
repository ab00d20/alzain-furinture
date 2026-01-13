/**
 * =====================================================
 * ALZAIN FURNITURE - SECURITY MODULE
 * =====================================================
 * Professional security practices for frontend protection
 */

const AlzainSecurity = (function() {
  'use strict';
  
  // =============================================
  // 1. RATE LIMITING (Client-side)
  // =============================================
  const rateLimiter = {
    requests: {},
    maxRequests: 10, // Max requests per window
    windowMs: 60000, // 1 minute window
    
    check: function(action) {
      const now = Date.now();
      const key = action || 'default';
      
      if (!this.requests[key]) {
        this.requests[key] = { count: 1, startTime: now };
        return true;
      }
      
      const elapsed = now - this.requests[key].startTime;
      
      if (elapsed > this.windowMs) {
        this.requests[key] = { count: 1, startTime: now };
        return true;
      }
      
      if (this.requests[key].count >= this.maxRequests) {
        console.warn('⚠️ Rate limit exceeded for:', key);
        return false;
      }
      
      this.requests[key].count++;
      return true;
    },
    
    reset: function(action) {
      if (action) {
        delete this.requests[action];
      } else {
        this.requests = {};
      }
    }
  };
  
  // =============================================
  // 2. INPUT VALIDATION & SANITIZATION
  // =============================================
  const validator = {
    // Sanitize HTML to prevent XSS
    sanitizeHTML: function(str) {
      if (!str) return '';
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    },
    
    // Validate image file
    validateImage: function(file, options = {}) {
      const defaults = {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        minWidth: 100,
        minHeight: 100,
        maxWidth: 8000,
        maxHeight: 8000
      };
      
      const config = { ...defaults, ...options };
      const errors = [];
      
      // Check file type
      if (!config.allowedTypes.includes(file.type)) {
        errors.push('نوع الملف غير مسموح. الأنواع المسموحة: JPEG, PNG, WebP, GIF');
      }
      
      // Check file size
      if (file.size > config.maxSize) {
        const maxMB = config.maxSize / (1024 * 1024);
        errors.push(`حجم الملف كبير جداً. الحد الأقصى: ${maxMB}MB`);
      }
      
      return {
        valid: errors.length === 0,
        errors: errors
      };
    },
    
    // Validate image dimensions
    validateImageDimensions: function(img, options = {}) {
      return new Promise((resolve) => {
        const defaults = {
          minWidth: 100,
          minHeight: 100,
          maxWidth: 8000,
          maxHeight: 8000
        };
        
        const config = { ...defaults, ...options };
        const errors = [];
        
        if (img.width < config.minWidth || img.height < config.minHeight) {
          errors.push(`الصورة صغيرة جداً. الحد الأدنى: ${config.minWidth}x${config.minHeight}`);
        }
        
        if (img.width > config.maxWidth || img.height > config.maxHeight) {
          errors.push(`الصورة كبيرة جداً. الحد الأقصى: ${config.maxWidth}x${config.maxHeight}`);
        }
        
        resolve({
          valid: errors.length === 0,
          errors: errors,
          dimensions: { width: img.width, height: img.height }
        });
      });
    },
    
    // Validate API key format
    validateApiKey: function(key) {
      if (!key || typeof key !== 'string') return false;
      
      // Gemini keys start with AIza
      if (key.startsWith('AIza') && key.length >= 30) return true;
      
      // OpenAI keys start with sk-
      if (key.startsWith('sk-') && key.length >= 40) return true;
      
      // Stability AI keys are long alphanumeric
      if (/^sk-[a-zA-Z0-9]{40,}$/.test(key)) return true;
      
      return false;
    },
    
    // Sanitize phone number
    sanitizePhone: function(phone) {
      return phone.replace(/[^\d+]/g, '');
    },
    
    // Validate email
    validateEmail: function(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }
  };
  
  // =============================================
  // 3. SECURE STORAGE
  // =============================================
  const secureStorage = {
    // Encrypt data before storing (simple obfuscation - for sensitive data use server-side)
    encrypt: function(data) {
      try {
        const str = typeof data === 'string' ? data : JSON.stringify(data);
        return btoa(encodeURIComponent(str).split('').reverse().join(''));
      } catch (e) {
        console.error('Encryption error');
        return null;
      }
    },
    
    // Decrypt stored data
    decrypt: function(encoded) {
      try {
        return decodeURIComponent(atob(encoded).split('').reverse().join(''));
      } catch (e) {
        console.error('Decryption error');
        return null;
      }
    },
    
    // Set item with expiry
    setWithExpiry: function(key, value, ttlMs) {
      const item = {
        value: value,
        expiry: Date.now() + ttlMs
      };
      localStorage.setItem(key, JSON.stringify(item));
    },
    
    // Get item checking expiry
    getWithExpiry: function(key) {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      
      try {
        const item = JSON.parse(itemStr);
        if (Date.now() > item.expiry) {
          localStorage.removeItem(key);
          return null;
        }
        return item.value;
      } catch (e) {
        return null;
      }
    },
    
    // Clear sensitive data
    clearSensitive: function() {
      const sensitiveKeys = [
        'alzain_ai_api_key',
        'alzain_admin_session',
        'alzain_session_expiry'
      ];
      
      sensitiveKeys.forEach(key => {
        localStorage.removeItem(key);
      });
    },
    
    // Mask API key for display
    maskApiKey: function(key) {
      if (!key || key.length < 10) return '****';
      return key.substring(0, 6) + '****' + key.substring(key.length - 4);
    }
  };
  
  // =============================================
  // 4. ERROR HANDLING & MASKING
  // =============================================
  const errorHandler = {
    // Masked error messages for users
    userMessages: {
      'network': 'حدث خطأ في الاتصال. يرجى التحقق من الإنترنت.',
      'api': 'خدمة الذكاء الاصطناعي غير متاحة حالياً.',
      'validation': 'يرجى التحقق من البيانات المدخلة.',
      'auth': 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول.',
      'rate_limit': 'تم تجاوز الحد المسموح. يرجى الانتظار.',
      'unknown': 'حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.'
    },
    
    // Handle and mask errors
    handle: function(error, context = 'unknown') {
      // Log full error for debugging (in development only)
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error(`[${context}]`, error);
      }
      
      // Determine error type
      let errorType = 'unknown';
      
      if (error.message) {
        const msg = error.message.toLowerCase();
        if (msg.includes('network') || msg.includes('fetch') || msg.includes('cors')) {
          errorType = 'network';
        } else if (msg.includes('api') || msg.includes('401') || msg.includes('403')) {
          errorType = 'api';
        } else if (msg.includes('validation') || msg.includes('invalid')) {
          errorType = 'validation';
        } else if (msg.includes('auth') || msg.includes('session') || msg.includes('token')) {
          errorType = 'auth';
        } else if (msg.includes('rate') || msg.includes('limit') || msg.includes('quota')) {
          errorType = 'rate_limit';
        }
      }
      
      return {
        userMessage: this.userMessages[errorType],
        errorType: errorType,
        timestamp: new Date().toISOString()
      };
    },
    
    // Log suspicious activity
    logSuspicious: function(activity, details = {}) {
      const log = {
        activity: activity,
        details: details,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      // Store in localStorage for admin review
      try {
        const logs = JSON.parse(localStorage.getItem('alzain_security_logs') || '[]');
        logs.push(log);
        
        // Keep only last 100 logs
        if (logs.length > 100) {
          logs.shift();
        }
        
        localStorage.setItem('alzain_security_logs', JSON.stringify(logs));
      } catch (e) {
        // Silent fail
      }
      
      // Log to console in development
      if (window.location.hostname === 'localhost') {
        console.warn('🚨 Suspicious activity:', log);
      }
    }
  };
  
  // =============================================
  // 5. CSRF & XSS PROTECTION
  // =============================================
  const protection = {
    // Generate CSRF token
    generateToken: function() {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },
    
    // Set CSRF token
    setCSRFToken: function() {
      const token = this.generateToken();
      sessionStorage.setItem('csrf_token', token);
      return token;
    },
    
    // Validate CSRF token
    validateCSRFToken: function(token) {
      const stored = sessionStorage.getItem('csrf_token');
      return stored && stored === token;
    },
    
    // Escape HTML entities
    escapeHTML: function(str) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return str.replace(/[&<>"']/g, m => map[m]);
    },
    
    // Check for potential XSS patterns
    detectXSS: function(input) {
      const xssPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /data:/i,
        /vbscript:/i,
        /<iframe/i,
        /<object/i,
        /<embed/i
      ];
      
      return xssPatterns.some(pattern => pattern.test(input));
    }
  };
  
  // =============================================
  // 6. SESSION SECURITY
  // =============================================
  const session = {
    // Check session validity
    isValid: function() {
      const sessionToken = localStorage.getItem('alzain_admin_session');
      const expiry = localStorage.getItem('alzain_session_expiry');
      
      if (!sessionToken || !expiry) return false;
      return Date.now() < parseInt(expiry);
    },
    
    // Extend session
    extend: function(durationMs = 30 * 60 * 1000) {
      const expiry = localStorage.getItem('alzain_session_expiry');
      if (expiry) {
        localStorage.setItem('alzain_session_expiry', Date.now() + durationMs);
      }
    },
    
    // Destroy session
    destroy: function() {
      localStorage.removeItem('alzain_admin_session');
      localStorage.removeItem('alzain_session_expiry');
    },
    
    // Get session age
    getAge: function() {
      const expiry = localStorage.getItem('alzain_session_expiry');
      if (!expiry) return null;
      
      const sessionDuration = 30 * 60 * 1000;
      const startTime = parseInt(expiry) - sessionDuration;
      return Date.now() - startTime;
    }
  };
  
  // =============================================
  // 7. INITIALIZE SECURITY
  // =============================================
  function init() {
    // Set CSRF token
    protection.setCSRFToken();
    
    // Clear expired data
    const expiry = localStorage.getItem('alzain_session_expiry');
    if (expiry && Date.now() > parseInt(expiry)) {
      session.destroy();
    }
    
    // Monitor for suspicious patterns
    document.addEventListener('input', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (protection.detectXSS(e.target.value)) {
          errorHandler.logSuspicious('xss_attempt', { 
            field: e.target.name || e.target.id,
            value: e.target.value.substring(0, 100)
          });
          e.target.value = validator.sanitizeHTML(e.target.value);
        }
      }
    });
    
    // Log page views
    if (window.location.pathname.includes('admin')) {
      const views = parseInt(localStorage.getItem('alzain_admin_views') || '0') + 1;
      localStorage.setItem('alzain_admin_views', views);
    }
    
    console.log('🔒 Alzain Security Module initialized');
  }
  
  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Public API
  return {
    rateLimiter: rateLimiter,
    validator: validator,
    storage: secureStorage,
    error: errorHandler,
    protection: protection,
    session: session,
    init: init
  };
})();

// Make available globally
window.AlzainSecurity = AlzainSecurity;
