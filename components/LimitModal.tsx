'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Mail, X } from 'lucide-react'

interface LimitModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LimitModal({ isOpen, onClose }: LimitModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 px-4"
          >
            <div className="glass-strong border border-alzain-gold/30 rounded-3xl p-8 relative shadow-2xl glow-gold">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 w-10 h-10 glass hover:glass-gold rounded-full flex items-center justify-center transition-all duration-300"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Content */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 glass-gold border-2 border-alzain-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-4">
                  لقد استهلكت محاولاتك المجانية
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  تفضل بزيارة معرضنا في <span className="text-alzain-gold font-bold">عمان</span> لتجربة الموديلات واقعياً والحصول على استشارة مجانية من خبرائنا
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 glass rounded-xl p-4 hover:glass-gold transition-all duration-300">
                  <div className="w-12 h-12 glass-gold rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-alzain-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">الموقع</p>
                    <p className="text-white font-bold">عمان - شارع المدينة المنورة</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 glass rounded-xl p-4 hover:glass-gold transition-all duration-300">
                  <div className="w-12 h-12 glass-gold rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-alzain-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">اتصل بنا</p>
                    <p className="text-white font-bold" dir="ltr">+962 6 XXX XXXX</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 glass rounded-xl p-4 hover:glass-gold transition-all duration-300">
                  <div className="w-12 h-12 glass-gold rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-alzain-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">البريد الإلكتروني</p>
                    <p className="text-white font-bold">info@alzain.jo</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full btn-ios text-alzain-black font-black text-xl py-5 rounded-[20px] relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>احجز موعد زيارة</span>
                </span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
