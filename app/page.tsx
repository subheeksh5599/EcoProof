'use client'

import { useMemo, useState, useEffect } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { Toaster } from 'react-hot-toast'
import LandingScreen from '@/components/LandingScreen'
import DashboardScreen from '@/components/DashboardScreen'
import UsernameSetup from '@/components/UsernameSetup'
import FloatingLines from '@/components/FloatingLines'
import DotField from '@/components/DotField'

require('@solana/wallet-adapter-react-ui/styles.css')

function AppContent() {
  const { publicKey } = useWallet()
  const [username, setUsername] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedUsername = localStorage.getItem('user_username')
    if (savedUsername) {
      setUsername(savedUsername)
    }
  }, [])

  const handleConnect = () => {
    // Trigger wallet modal
    const button = document.querySelector('.wallet-adapter-button') as HTMLButtonElement
    if (button) button.click()
  }

  const handleUsernameSet = (newUsername: string) => {
    setUsername(newUsername)
  }

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

  // Show landing screen if wallet not connected
  if (!publicKey) {
    return <LandingScreen onConnect={handleConnect} />
  }

  // Show username setup if no username
  if (!username) {
    return <UsernameSetup onUsernameSet={handleUsernameSet} />
  }

  // Show dashboard
  return <DashboardScreen />
}

export default function Home() {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  
  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: 'confirmed' }}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#0f1a0f',
                color: '#f0fdf4',
                border: '1px solid #1f2e1f',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#0f1a0f',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#0f1a0f',
                },
              },
            }}
          />
          
          <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
            {/* Floating Lines Background */}
            <div style={{ 
              position: 'fixed', 
              inset: 0, 
              zIndex: 0,
              opacity: 0.2
            }}>
              <FloatingLines
                linesGradient={["#22c55e", "#16a34a", "#22c55e"]}
                animationSpeed={1.7}
                interactive={false}
                bendRadius={8.5}
                bendStrength={-0.5}
                mouseDamping={0.11}
                parallax
                parallaxStrength={0.2}
              />
            </div>
            
            {/* Dot Field Overlay */}
            <div style={{ 
              position: 'fixed', 
              inset: 0, 
              zIndex: 1,
              opacity: 0.3
            }}>
              <DotField
                dotRadius={1.5}
                dotSpacing={14}
                bulgeStrength={67}
                glowRadius={160}
                sparkle={false}
                waveAmplitude={0}
                cursorRadius={500}
                cursorForce={0.1}
                bulgeOnly
                gradientFrom="#22c55e"
                gradientTo="#16a34a"
                glowColor="#050805"
              />
            </div>
            
            {/* Main Content */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              <AppContent />
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
