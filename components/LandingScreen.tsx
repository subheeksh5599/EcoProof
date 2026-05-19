'use client'

import HeroSection from './HeroSection'

interface LandingScreenProps {
  onConnect: () => void
}

export default function LandingScreen({ onConnect }: LandingScreenProps) {
  return <HeroSection onConnect={onConnect} />
}
