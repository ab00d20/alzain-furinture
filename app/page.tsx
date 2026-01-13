'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import AITool from '@/components/AITool'
import LatestModels from '@/components/LatestModels'
import ModernFeed from '@/components/ModernFeed'
import Footer from '@/components/Footer'
import LimitModal from '@/components/LimitModal'
import { FingerprintService } from '@/lib/fingerprint'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [remainingAttempts, setRemainingAttempts] = useState(7)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize fingerprinting
    const initFingerprint = async () => {
      const service = FingerprintService.getInstance()
      await service.initialize()
      setRemainingAttempts(service.getRemainingAttempts())
      setIsInitialized(true)
    }

    initFingerprint()
  }, [])

  const handleLimitReached = () => {
    setIsModalOpen(true)
  }

  const handleAttemptUsed = () => {
    const service = FingerprintService.getInstance()
    const success = service.incrementUsage()
    
    if (success) {
      setRemainingAttempts(service.getRemainingAttempts())
    }
    
    if (service.hasReachedLimit()) {
      handleLimitReached()
    }
  }

  if (!isInitialized) {
    // Loading screen
    return (
      <div className="min-h-screen flex items-center justify-center bg-alzain-black">
        <div className="text-center">
          <div className="w-20 h-20 bg-alzain-gold rounded-lg flex items-center justify-center font-bold text-4xl text-alzain-black mx-auto mb-4 animate-pulse">
            ز
          </div>
          <p className="text-alzain-gold">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-alzain-black">
      <Header />
      <Hero />
      <AITool 
        onLimitReached={handleLimitReached}
        remainingAttempts={remainingAttempts}
      />
      <LatestModels />
      <ModernFeed />
      <Footer />
      <LimitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  )
}
