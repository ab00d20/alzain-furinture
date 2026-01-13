'use client'

import { motion } from 'framer-motion'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ]

  return (
    <footer className="glass-strong border-t border-alzain-gold/30 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-alzain-gold to-yellow-600 rounded-xl flex items-center justify-center font-bold text-2xl text-alzain-black shadow-lg glow-gold">
                ز
              </div>
              <div>
                <h3 className="text-xl font-bold text-alzain-gold text-glow">مصنع الزين</h3>
                <p className="text-xs text-gray-400">للمفروشات الراقية</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              نصنع الفخامة والراحة في كل قطعة أثاث. خبرة 25+ عام في تصنيع أفخم المفروشات.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">تواصل معنا</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-alzain-gold" />
                <span>عمان - شارع المدينة المنورة</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm" dir="ltr">
                <Phone className="w-4 h-4 text-alzain-gold" />
                <span>+962 6 XXX XXXX</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-alzain-gold" />
                <span>info@alzain.jo</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">تابعنا</h4>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 glass hover:glass-gold rounded-lg flex items-center justify-center transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-alzain-gold transition-colors" />
                </motion.a>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-4">
              شاركنا على وسائل التواصل واحصل على عروض حصرية
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 مصنع الزين للمفروشات. جميع الحقوق محفوظة.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            صُنع بـ <span className="text-alzain-gold">♥</span> في الأردن
          </p>
        </div>
      </div>
    </footer>
  )
}
