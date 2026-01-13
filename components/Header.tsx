'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Header() {
  const [activeNav, setActiveNav] = useState('الرئيسية')

  const navItems = ['الرئيسية', 'أحدث الموديلات', 'عن المصنع']

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 right-0 left-0 z-50 glass-strong border-b border-alzain-gold/30"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-alzain-gold to-yellow-600 rounded-xl flex items-center justify-center font-bold text-2xl text-alzain-black shadow-lg">
              ز
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-alzain-gold leading-tight">
                مصنع الزين
              </h1>
              <p className="text-xs text-gray-400">للمفروشات الراقية</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`relative px-6 py-3 text-sm font-bold rounded-2xl transition-all ${
                  activeNav === item 
                    ? 'glass-gold text-white' 
                    : 'btn-glass text-gray-300 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          >
            <span className="w-6 h-0.5 bg-alzain-gold"></span>
            <span className="w-6 h-0.5 bg-alzain-gold"></span>
            <span className="w-6 h-0.5 bg-alzain-gold"></span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}
