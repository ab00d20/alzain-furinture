# 🔐 دليل الأمان - مصنع الزين للمفروشات
# Al-Zain Furniture Factory - Security Guide

## نظرة عامة | Overview

هذا الدليل يشرح جميع الإجراءات الأمنية المطبقة في الموقع.
This guide explains all security measures implemented in the website.

---

## 📋 قائمة الإجراءات الأمنية | Security Checklist

### 1. تأمين الاتصال والنقل (Transport Security)

| الإجراء | الحالة | التفاصيل |
|---------|--------|----------|
| HTTPS Only | ⚠️ يحتاج للسيرفر | يجب تفعيله عند رفع الموقع |
| HSTS Header | ✅ مضاف | Strict-Transport-Security عبر Node.js |

**كيفية التفعيل:**
- عند استخدام السيرفر Node.js، HSTS يُفعّل تلقائياً
- لخدمات الاستضافة مثل Netlify أو Vercel، أضف في headers:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

---

### 2. حماية الـ API والـ Backend

| الإجراء | الحالة | التفاصيل |
|---------|--------|----------|
| API Key Masking | ✅ | يُخفى في Console logs |
| Rate Limiting | ✅ | 10 طلبات/ساعة للـ AI |
| Input Validation | ✅ | فحص نوع وحجم الصور |
| Sanitization | ✅ | تنظيف المدخلات من XSS |

**Rate Limiting Configuration:**
```javascript
// في preview-ultimate.html
const aiRateLimiter = {
  maxRequests: 10,    // الحد الأقصى
  windowMs: 3600000   // ساعة واحدة
};
```

**لتغيير الحدود:**
1. افتح `preview-ultimate.html`
2. ابحث عن `aiRateLimiter`
3. عدّل `maxRequests` و `windowMs`

---

### 3. سياسات المتصفح (Browser Security Headers)

| Header | الحالة | الوصف |
|--------|--------|-------|
| Content-Security-Policy | ✅ | يمنع XSS وحقن الأكواد |
| X-Frame-Options | ✅ DENY | يمنع Clickjacking |
| X-Content-Type-Options | ✅ nosniff | يمنع تخمين MIME |
| X-XSS-Protection | ✅ | حماية XSS إضافية |
| Referrer-Policy | ✅ | يحد من تسريب البيانات |
| Permissions-Policy | ✅ | يعطل الكاميرا والميكروفون |

**CSP المطبق:**
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https:;
  connect-src 'self' https://generativelanguage.googleapis.com;
  frame-ancestors 'none';
  form-action 'self';
">
```

---

### 4. أمان البيانات (Data Security)

| الإجراء | الحالة | التفاصيل |
|---------|--------|----------|
| CORS | ✅ | محدد في Node.js server |
| Secure Storage | ✅ | تخزين مع انتهاء صلاحية |
| Password Hashing | ✅ | SHA-256 عبر Web Crypto API |
| Session Tokens | ✅ | crypto.getRandomValues() |

**تخزين كلمة المرور:**
```javascript
// يُخزن فقط الـ Hash وليس كلمة المرور الأصلية
const hash = await crypto.subtle.digest('SHA-256', password);
localStorage.setItem('alzain_admin_password', hash);
```

---

### 5. الرقابة والتحليل (Monitoring)

| الإجراء | الحالة | التفاصيل |
|---------|--------|----------|
| Error Masking | ✅ | لا تُعرض Stack Traces للمستخدم |
| Security Logging | ✅ | تُسجل محاولات الدخول |
| Suspicious Activity | ✅ | تُسجل محاولات XSS |

**عرض سجلات الأمان:**
```javascript
// في Console المتصفح
console.log(JSON.parse(localStorage.getItem('alzain_security_logs')));
```

---

## 🚀 تشغيل السيرفر الآمن

### المتطلبات:
- Node.js 18+
- npm

### التثبيت:
```bash
cd server
npm install
```

### إعداد البيئة:
```bash
# انسخ ملف الإعدادات
cp .env.example .env

# حرر الملف وأضف مفاتيحك
# GEMINI_API_KEY=your_key_here
```

### التشغيل:
```bash
npm start
```

---

## 🔑 تغيير كلمة مرور الأدمن

### الطريقة 1: من لوحة التحكم
1. ادخل لوحة التحكم
2. اذهب لـ "الإعدادات"
3. قسم "تغيير كلمة المرور"

### الطريقة 2: من Console المتصفح
```javascript
// إعادة تعيين لكلمة المرور الافتراضية
localStorage.removeItem('alzain_admin_password');

// أو تعيين كلمة مرور جديدة
async function setNewPassword(newPass) {
  const msgBuffer = new TextEncoder().encode(newPass);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  localStorage.setItem('alzain_admin_password', hash);
  console.log('✅ تم تغيير كلمة المرور');
}
setNewPassword('your_new_password');
```

---

## 📁 ملفات الأمان

```
web site/
├── js/
│   └── security.js          # وحدة الأمان الرئيسية
├── server/
│   ├── server.js             # سيرفر Node.js مع Helmet.js
│   ├── package.json          # Dependencies
│   ├── .env.example          # نموذج ملف البيئة
│   └── .gitignore           # يمنع رفع .env
└── SECURITY.md               # هذا الملف
```

---

## ⚠️ تحذيرات أمنية

1. **لا ترفع ملف .env للـ Git أبداً**
2. **غيّر كلمة المرور الافتراضية فوراً**
3. **استخدم HTTPS في الإنتاج**
4. **راجع سجلات الأمان دورياً**
5. **حدّث الـ Dependencies بانتظام**

---

## 🛡️ للاستضافة على الإنترنت

### Netlify/Vercel:
أضف ملف `netlify.toml` أو `vercel.json`:

```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

### Apache (.htaccess):
```apache
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

### Nginx:
```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

---

## 📞 الدعم

للمساعدة في الأمان، راجع:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js Docs](https://helmetjs.github.io/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**تاريخ آخر تحديث:** يناير 2026
