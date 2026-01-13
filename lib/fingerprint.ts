// Fingerprint Service
// Manages user fingerprinting and usage limits

import FingerprintJS from '@fingerprintjs/fingerprintjs'

const MAX_ATTEMPTS = 7
const STORAGE_KEY = 'alzain_usage_count'

export class FingerprintService {
  private static instance: FingerprintService
  private fingerprint: string | null = null

  private constructor() {}

  static getInstance(): FingerprintService {
    if (!FingerprintService.instance) {
      FingerprintService.instance = new FingerprintService()
    }
    return FingerprintService.instance
  }

  async initialize(): Promise<void> {
    try {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      this.fingerprint = result.visitorId
    } catch (error) {
      console.error('Failed to initialize fingerprint:', error)
      // Fallback to a random ID if fingerprinting fails
      this.fingerprint = `fallback_${Math.random().toString(36).substring(7)}`
    }
  }

  getStorageKey(): string {
    return `${STORAGE_KEY}_${this.fingerprint}`
  }

  getUsageCount(): number {
    if (typeof window === 'undefined') return 0
    
    const key = this.getStorageKey()
    const stored = localStorage.getItem(key)
    return stored ? parseInt(stored, 10) : 0
  }

  getRemainingAttempts(): number {
    return Math.max(0, MAX_ATTEMPTS - this.getUsageCount())
  }

  incrementUsage(): boolean {
    if (typeof window === 'undefined') return false
    
    const current = this.getUsageCount()
    if (current >= MAX_ATTEMPTS) {
      return false // Limit reached
    }
    
    const key = this.getStorageKey()
    localStorage.setItem(key, (current + 1).toString())
    return true
  }

  hasReachedLimit(): boolean {
    return this.getUsageCount() >= MAX_ATTEMPTS
  }

  reset(): void {
    if (typeof window === 'undefined') return
    
    const key = this.getStorageKey()
    localStorage.removeItem(key)
  }
}

export default FingerprintService
