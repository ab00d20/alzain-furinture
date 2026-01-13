'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'
import { Upload, Image as ImageIcon, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface AIToolProps {
  onLimitReached: () => void
  remainingAttempts: number
}

export default function AITool({ onLimitReached, remainingAttempts }: AIToolProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      
      reader.onload = () => {
        setUploadedImage(reader.result as string)
        processImage()
      }
      
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    disabled: remainingAttempts <= 0
  })

  const processImage = async () => {
    setIsProcessing(true)
    setResult(null)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsProcessing(false)
    setResult('success')
    
    // Decrement attempts
    if (remainingAttempts <= 1) {
      setTimeout(() => onLimitReached(), 1000)
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            جرب <span className="text-alzain-gold">الذكاء الاصطناعي</span> الآن
          </h2>
          <p className="text-gray-400 text-lg">
            ارفع صورة غرفتك وشوف الموديلات بشكل واقعي
          </p>
          <div className="mt-4 text-sm text-alzain-gold">
            المحاولات المتبقية: {remainingAttempts} / 7
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-alzain-gold glass-gold scale-105'
                  : remainingAttempts <= 0
                  ? 'border-gray-700 glass cursor-not-allowed'
                  : 'border-gray-700 hover:border-alzain-gold glass hover:glass-gold'
              }`}
            >
              <input {...getInputProps()} />
              
              {uploadedImage ? (
                <div className="space-y-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setUploadedImage(null)
                      setResult(null)
                    }}
                    className="text-sm text-gray-400 hover:text-alzain-gold transition-colors"
                  >
                    تغيير الصورة
                  </button>
                </div>
              ) : (
                <>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Upload className="w-16 h-16 text-alzain-gold mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {remainingAttempts <= 0
                      ? 'لقد استهلكت المحاولات المتاحة'
                      : 'اسحب صورة غرفتك هنا'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {remainingAttempts > 0
                      ? 'أو اضغط لاختيار صورة من جهازك'
                      : 'قم بزيارة المعرض للمزيد'}
                  </p>
                  <p className="text-xs text-gray-500 mt-4">
                    PNG, JPG, WEBP (حتى 10MB)
                  </p>
                </>
              )}
            </div>

            {/* Process Button */}
            {uploadedImage && !isProcessing && !result && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={processImage}
                className="w-full mt-6 btn-ios text-alzain-black font-black text-xl py-5 rounded-[20px] relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>توليد التصميم الآن</span>
                </span>
              </motion.button>
            )}
          </motion.div>

          {/* Result Area */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong border border-gray-700 rounded-2xl p-8 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {!uploadedImage && !isProcessing && !result && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <ImageIcon className="w-20 h-20 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500">النتيجة ستظهر هنا</p>
                </motion.div>
              )}

              {isProcessing && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <Loader2 className="w-16 h-16 text-alzain-gold animate-spin mx-auto mb-4" />
                  <p className="text-white font-medium text-lg mb-2">جاري معالجة الصورة...</p>
                  <p className="text-gray-400 text-sm">الذكاء الاصطناعي يعمل على تصميمك</p>
                </motion.div>
              )}

              {result === 'success' && uploadedImage && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center w-full"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-white font-medium text-lg mb-4">تم بنجاح!</p>
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Result"
                      className="w-full h-64 object-cover rounded-xl opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-alzain-gold/30 to-transparent rounded-xl"></div>
                    <div className="absolute bottom-4 right-4 bg-alzain-gold text-alzain-black px-4 py-2 rounded-full text-sm font-bold">
                      موديل 2026
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
