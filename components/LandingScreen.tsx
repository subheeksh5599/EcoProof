'use client'

import { useEffect, useState } from 'react'
import Navbar from './Navbar'

interface LandingScreenProps {
  onConnect: () => void
}

export default function LandingScreen({ onConnect }: LandingScreenProps) {
  const [stats, setStats] = useState({ submissions: 0, tokens: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load platform stats
    try {
      const records = JSON.parse(localStorage.getItem('recycling_records') || '[]')
      const totalTokens = records.reduce((sum: number, r: any) => sum + (r.amount || 0), 0)
      
      // Get today's submissions
      const today = new Date().setHours(0, 0, 0, 0)
      const todayRecords = records.filter((r: any) => {
        const recordDate = new Date(r.timestamp).setHours(0, 0, 0, 0)
        return recordDate === today
      })
      
      setStats({
        submissions: todayRecords.length,
        tokens: totalTokens
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }, [])

  // Floating leaf particles
  const leaves = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: i * 1.5,
    left: Math.random() * 100,
    size: 24 + Math.random() * 16,
    duration: 12 + Math.random() * 8
  }))

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#050805' }}>
        <div className="text-center">
          <div className="text-4xl mb-4">🌿</div>
          <div style={{ color: '#86efac' }}>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#050805' }}>
      {/* Animated leaf particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {leaves.map((leaf) => (
          <div
            key={leaf.id}
            className="absolute"
            style={{
              left: `${leaf.left}%`,
              animation: `float-up ${leaf.duration}s linear infinite`,
              animationDelay: `${leaf.delay}s`,
              fontSize: `${leaf.size}px`,
              opacity: 0.4,
              bottom: '-50px'
            }}
          >
            🌿
          </div>
        ))}
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-in" style={{ color: '#f0fdf4' }}>
          Recycle. Prove. Earn.
        </h1>
        
        <p className="text-lg md:text-xl mb-12 max-w-2xl animate-slide-in" style={{ color: '#86efac', animationDelay: '0.1s' }}>
          Turn your recycling into real Solana tokens — verified by AI, rewarded on-chain.
        </p>

        <button
          onClick={onConnect}
          className="btn-primary text-lg px-8 py-4 animate-pulse-glow flex items-center gap-2"
          style={{ animationDelay: '0.2s' }}
        >
          🔗 Connect Wallet
        </button>

        {/* Live stats */}
        <div className="flex flex-wrap gap-4 mt-12 justify-center animate-slide-in" style={{ animationDelay: '0.3s' }}>
          <div className="pill" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#86efac' }}>
            <span className="font-bold tabular-nums">{stats.submissions}</span> submissions
          </div>
          <div className="pill" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#86efac' }}>
            <span className="font-bold tabular-nums">{stats.tokens.toLocaleString()}</span> $ECO
          </div>
          <div className="pill" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#86efac' }}>
            platform-wide today
          </div>
        </div>
      </div>
    </div>
  )
}
