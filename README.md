# 🪑 Al-Zain Furniture AI - مصنع الزين للمفروشات

<div dir="rtl">

## 🌟 نظرة عامة

موقع ويب حديث وفاخر لمصنع الزين للمفروشات باستخدام Next.js 14، Tailwind CSS، وتقنية الذكاء الاصطناعي. يوفر الموقع تجربة مستخدم سلسة للغاية مع إمكانية رفع صور الغرف ومعاينة الأثاث باستخدام الذكاء الاصطناعي.

### ✨ المميزات الرئيسية

- 🎨 **تصميم فاخر**: ألوان الأسود (#121212) والذهبي (#FFC107)
- 🌙 **الوضع الداكن**: تصميم عصري بالكامل
- 🇦🇪 **دعم اللغة العربية**: اتجاه RTL كامل مع خط Tajawal
- 🤖 **أداة الذكاء الاصطناعي**: رفع صور الغرف ومعاينة الأثاث
- 🔒 **نظام الحد**: 7 محاولات مجانية باستخدام FingerprintJS
- 🎬 **حركات سلسة**: باستخدام Framer Motion
- 📱 **استجابة كاملة**: Mobile-First Design
- 🎯 **Bento Grid**: عرض حديث للصور
- ⚡ **أداء عالي**: Next.js 14 مع App Router

</div>

---

## 🚀 Quick Start

### Prerequisites

Make sure you have Node.js 18+ installed:
```bash
node --version
```

### Installation

1. **Install Dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. **Run Development Server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. **Open Browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
al-zain-furniture/
├── app/
│   ├── layout.tsx          # Root layout with Arabic font
│   ├── page.tsx            # Main page with all sections
│   └── globals.css         # Global styles & RTL config
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Hero.tsx            # Hero section with animations
│   ├── AITool.tsx          # AI upload tool with drag-drop
│   ├── LatestModels.tsx    # Infinite slider
│   ├── ModernFeed.tsx      # Bento Grid gallery
│   ├── LimitModal.tsx      # Usage limit modal
│   └── Footer.tsx          # Footer with contact info
├── lib/
│   └── fingerprint.ts      # FingerprintJS service
├── public/                 # Static assets
├── tailwind.config.ts      # Tailwind configuration
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

---

## 🎨 Design System

### Colors
- **Primary Black**: `#121212` (alzain-black)
- **Primary Gold**: `#FFC107` (alzain-gold)
- **Gradients**: Used throughout for depth

### Typography
- **Font Family**: Tajawal (Google Fonts)
- **Weights**: 300, 400, 500, 700, 900
- **Direction**: RTL (Right-to-Left)

### Animations
All animations use **Framer Motion** with these principles:
- **Smooth**: Cubic-bezier easing
- **Liquid**: 0.4-0.6s duration
- **Responsive**: Scale and position transforms

---

## 🔧 Configuration

### Environment Variables (Optional)
Create `.env.local` for custom settings:
```env
NEXT_PUBLIC_API_URL=your-api-url
NEXT_PUBLIC_SITE_URL=https://alzain.jo
```

### Tailwind Custom Classes
- `liquid-smooth` - Smooth transitions
- `alzain-black` - Primary dark color
- `alzain-gold` - Primary gold color
- `font-arabic` - Tajawal font

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `next` | React framework |
| `react` | UI library |
| `framer-motion` | Animations |
| `@fingerprintjs/fingerprintjs` | User tracking |
| `react-dropzone` | File upload |
| `tailwindcss` | Styling |
| `lucide-react` | Icons |

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit - Al-Zain Furniture"
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

3. **Custom Domain** (Optional)
   - Add your domain in Vercel settings
   - Update DNS records

### Other Platforms
```bash
npm run build
npm run start
```

---

## 🎯 Features Breakdown

### 1. Header Component
- Fixed navigation with blur effect
- Animated underline for active nav
- Mobile-responsive menu button
- Al-Zain logo with gold accent

### 2. Hero Section
- Full-screen with animated background
- Floating gold particles
- Scroll indicator animation
- Statistics counter

### 3. AI Tool
- Drag & drop file upload
- Preview uploaded images
- Processing animation
- Result display with overlay
- Usage counter display

### 4. Latest Models Slider
- Infinite scroll animation
- Hover effects with scale
- "New" badges
- Price display
- Star ratings

### 5. Modern Feed (Bento Grid)
- Responsive grid layout
- Varied cell sizes
- Hover animations
- Feature cards

### 6. Fingerprint System
- Tracks user by browser fingerprint
- 7 free attempts
- Local storage persistence
- Limit modal with contact info

---

## 🔐 Security & Limits

The site uses **@fingerprintjs/fingerprintjs** to track:
- ✅ Browser fingerprint (anonymous)
- ✅ Local storage for count
- ✅ 7 free image uploads
- ✅ Modal after limit reached

**Note**: Users can bypass by clearing browser data. For production, implement server-side validation.

---

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large */
2xl: 1536px /* 2X Extra large */
```

---

## 🎬 Animation Examples

### Page Transitions
```tsx
initial={{ opacity: 0, y: 50 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

### Hover Effects
```tsx
whileHover={{ scale: 1.05, y: -10 }}
whileTap={{ scale: 0.95 }}
```

---

## 🐛 Troubleshooting

### Issue: Animations not working
**Solution**: Make sure components are marked with `'use client'`

### Issue: Arabic text displaying LTR
**Solution**: Check `html` tag has `dir="rtl"` in layout.tsx

### Issue: Images not loading
**Solution**: Update `next.config.js` with correct image domains

### Issue: Font not loading
**Solution**: Verify Google Fonts API is accessible

---

## 🚧 Future Enhancements

- [ ] Backend API for real AI processing
- [ ] User authentication system
- [ ] Shopping cart functionality
- [ ] Admin panel for managing products
- [ ] WhatsApp integration
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Blog section

---

## 📄 License

This project is proprietary and confidential.  
© 2026 Al-Zain Furniture. All rights reserved.

---

## 🤝 Support

For questions or support:
- **Email**: info@alzain.jo
- **Phone**: +962 6 XXX XXXX
- **Address**: Amman, Jordan

---

## 👨‍💻 Developer Notes

### Code Style
- Use TypeScript for type safety
- Follow Next.js 14 best practices
- Components are client-side (`'use client'`)
- CSS uses Tailwind utility classes
- Comments in English for code, Arabic for UI

### Performance Tips
- Images are lazy-loaded
- Components use React.memo where needed
- Framer Motion animations are GPU-accelerated
- Tailwind purges unused CSS

---

<div dir="rtl">

## 🌟 لماذا هذا الموقع مميز؟

1. **الهوية البصرية الفاخرة**: الأسود والذهبي يعطيان انطباع Brand عالمي
2. **التقنية الحديثة**: استخدام Next.js 14 وFramer Motion للأداء الأمثل
3. **تجربة المستخدم**: كل حركة مصممة لتكون "سلسة جداً جداً"
4. **الذكاء الاصطناعي**: ميزة تنافسية تجذب العملاء
5. **الاستجابة الكاملة**: يعمل بشكل مثالي على الهواتف (معظم الزيارات من Reels)

</div>

---

**Built with ❤️ for Al-Zain Furniture**

*صُنع بحب لمصنع الزين للمفروشات*
