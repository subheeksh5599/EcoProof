'use client'

import { useEffect, useRef, useState } from 'react'

interface HeroSectionProps {
  onConnect: () => void
}

export default function HeroSection({ onConnect }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let animationFrameId: number
    let fadeTimeout: NodeJS.Timeout

    const handleVideoLoop = () => {
      const currentTime = video.currentTime
      const duration = video.duration

      if (duration && currentTime) {
        // Fade in at start (0-0.5s)
        if (currentTime < 0.5) {
          video.style.opacity = String(currentTime / 0.5)
        }
        // Fade out before end (last 0.5s)
        else if (currentTime > duration - 0.5) {
          video.style.opacity = String((duration - currentTime) / 0.5)
        }
        // Full opacity in between
        else {
          video.style.opacity = '1'
        }
      }

      animationFrameId = requestAnimationFrame(handleVideoLoop)
    }

    const handleVideoEnd = () => {
      video.style.opacity = '0'
      
      fadeTimeout = setTimeout(() => {
        video.currentTime = 0
        video.play().catch(err => console.error('Video play error:', err))
      }, 100)
    }

    const handleCanPlay = () => {
      setIsVideoLoaded(true)
      video.play().catch(err => console.error('Video play error:', err))
      animationFrameId = requestAnimationFrame(handleVideoLoop)
    }

    video.addEventListener('ended', handleVideoEnd)
    video.addEventListener('canplay', handleCanPlay)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      if (fadeTimeout) {
        clearTimeout(fadeTimeout)
      }
      video.removeEventListener('ended', handleVideoEnd)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: '#FFFFFF' }}>
      {/* Video Background */}
      <div 
        className="absolute z-0"
        style={{
          top: '300px',
          inset: 'auto 0 0 0',
          overflow: 'hidden'
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{
            opacity: 0,
            transition: 'opacity 0.5s ease-in-out'
          }}
          muted
          playsInline
          preload="auto"
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4" 
            type="video/mp4" 
          />
        </video>
        
        {/* Gradient Overlays */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"
          style={{ pointerEvents: 'none' }}
        />
      </div>

      {/* Navigation Bar */}
      <nav 
        className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Logo */}
        <div 
          className="font-display text-3xl"
          style={{ 
            letterSpacing: '-0.02em',
            color: '#000000',
            fontFamily: 'Instrument Serif, serif'
          }}
        >
          EcoProof<sup style={{ fontSize: '0.6em', fontWeight: 'normal' }}>®</sup>
        </div>

        {/* Connect Wallet Button */}
        <button
          onClick={onConnect}
          className="rounded-full px-6 py-2.5 text-sm font-medium transition-transform hover:scale-105"
          style={{
            background: '#000000',
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Connect Wallet
        </button>
      </nav>

      {/* Hero Section */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
        style={{
          paddingTop: 'calc(8rem - 75px)',
          paddingBottom: '10rem'
        }}
      >
        {/* Headline */}
        <h1 
          className="font-display text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal animate-fade-rise"
          style={{
            fontFamily: 'Instrument Serif, serif',
            lineHeight: '0.95',
            letterSpacing: '-2.46px',
            color: '#000000'
          }}
        >
          Transform <span style={{ fontStyle: 'italic', color: '#6F6F6F' }}>waste</span> into{' '}
          <span style={{ fontStyle: 'italic', color: '#6F6F6F' }}>wealth</span>, verified on-chain.
        </h1>

        {/* Description */}
        <p 
          className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay"
          style={{
            color: '#6F6F6F',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Submit proof of recycling, let AI validate your impact, and earn $ECO tokens on Solana. 
          Join the movement turning environmental action into tangible rewards.
        </p>

        {/* CTA Button */}
        <button
          onClick={onConnect}
          className="rounded-full px-14 py-5 text-base mt-12 font-medium transition-transform hover:scale-103 animate-fade-rise-delay-2"
          style={{
            background: '#000000',
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Begin Journey
        </button>
      </div>
    </div>
  )
}
