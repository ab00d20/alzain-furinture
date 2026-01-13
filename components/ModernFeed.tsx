'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Award, Heart } from 'lucide-react'

const trendImages = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    title: 'ألوان هادئة',
    gridClass: 'col-span-2 row-span-2',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    title: 'تصاميم عصرية',
    gridClass: 'col-span-1 row-span-1',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80',
    title: 'فخامة كلاسيكية',
    gridClass: 'col-span-1 row-span-1',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    title: 'جلوس عائلي',
    gridClass: 'col-span-1 row-span-2',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=800&q=80',
    title: 'أناقة بسيطة',
    gridClass: 'col-span-1 row-span-1',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
    title: 'مساحات واسعة',
    gridClass: 'col-span-2 row-span-1',
  },
]

const features = [
  {
    icon: TrendingUp,
    title: 'أحدث الصيحات',
    description: 'نتابع أحدث صيحات الموضة العالمية',
  },
  {
    icon: Award,
    title: 'جودة عالية',
    description: 'خامات فاخرة وتصنيع احترافي',
  },
  {
    icon: Heart,
    title: 'راحة مثالية',
    description: 'مصممة لتوفير أقصى درجات الراحة',
  },
]

export default function ModernFeed() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-alzain-black to-gray-900">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            أحدث <span className="text-alzain-gold">صيحات 2026</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            استلهم من أحدث التصاميم والألوان العصرية في عالم المفروشات
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
          className="grid grid-cols-4 gap-4 mb-16"
        >
          {trendImages.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`${item.gridClass} relative group overflow-hidden rounded-2xl cursor-pointer glass-strong border border-gray-700 hover:border-alzain-gold/50 transition-all duration-300`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-alzain-black via-alzain-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              
              {/* Title */}
              <div className="absolute bottom-0 right-0 left-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                <div className="w-12 h-1 bg-alzain-gold"></div>
              </div>

              {/* Hover Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute top-4 left-4 w-10 h-10 glass-gold rounded-full flex items-center justify-center"
              >
                <Heart className="w-5 h-5 text-alzain-gold" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-strong border border-gray-700 rounded-3xl p-8 text-center hover:border-alzain-gold/50 transition-all duration-300 group"
            >
              <div className="w-20 h-20 glass-gold border-2 border-alzain-gold/50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-10 h-10 text-alzain-gold" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="h-1 bg-gradient-to-r from-alzain-gold to-yellow-500 rounded-full mt-6"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
