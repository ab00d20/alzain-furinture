'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Star } from 'lucide-react'

const models = [
  {
    id: 1,
    name: 'كنبة لوكس الملكية',
    price: '2,499',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    isNew: true,
  },
  {
    id: 2,
    name: 'صوفا مودرن إيليت',
    price: '1,899',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    isNew: true,
  },
  {
    id: 3,
    name: 'كنبة فيلفت الذهبية',
    price: '3,299',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80',
    isNew: true,
  },
  {
    id: 4,
    name: 'طقم جلوس فاخر',
    price: '4,999',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    isNew: true,
  },
  {
    id: 5,
    name: 'كنبة كلاسيك بريميوم',
    price: '2,199',
    image: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=800&q=80',
    isNew: true,
  },
  {
    id: 6,
    name: 'صوفا زاوية عصرية',
    price: '3,799',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
    isNew: true,
  },
]

export default function LatestModels() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    const scroll = async () => {
      if (scrollRef.current) {
        await controls.start({
          x: -scrollRef.current.scrollWidth / 2,
          transition: {
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          },
        })
      }
    }
    scroll()
  }, [controls])

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            أحدث <span className="text-alzain-gold">موديلاتنا</span>
          </h2>
          <p className="text-gray-400 text-lg">
            تشكيلة 2026 - حصرياً من مصنع الزين
          </p>
        </motion.div>
      </div>

      {/* Infinite Scroll */}
      <div className="relative">
        <motion.div
          ref={scrollRef}
          animate={controls}
          className="flex gap-6 pr-6"
          style={{ width: 'max-content' }}
        >
          {[...models, ...models].map((model, index) => (
            <motion.div
              key={`${model.id}-${index}`}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative group w-80 flex-shrink-0 cursor-pointer"
            >
              {/* Card */}
              <div className="glass-strong rounded-2xl overflow-hidden border border-gray-700 shadow-2xl hover:border-alzain-gold/50 transition-all duration-300 hover:glow-gold">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-alzain-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* New Badge */}
                  {model.isNew && (
                    <div className="absolute top-4 left-4 glass-gold text-alzain-gold px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3 fill-current" />
                      جديد
                    </div>
                  )}

                  {/* Quick View Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ scale: 1.05 }}
                    className="absolute bottom-4 right-4 left-4 btn-ios text-alzain-black font-bold py-3 px-6 rounded-[16px] opacity-0 group-hover:opacity-100 transition-all duration-300 text-base"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      عرض التفاصيل
                    </span>
                  </motion.button>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{model.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-alzain-gold">{model.price}</span>
                      <span className="text-sm text-gray-400 mr-1">دينار</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-alzain-gold fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Gradient Overlays */}
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-alzain-black to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-alzain-black to-transparent pointer-events-none"></div>
      </div>
    </section>
  )
}
