'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function Navbar() {
  const { publicKey } = useWallet()

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        height: '64px',
        background: 'rgba(5, 8, 5, 0.95)',
        backdropFilter: 'blur(10px)',
        borderColor: '#1f2e1f'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="text-xl font-bold gradient-text">EcoProof</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Network Badge */}
          <div className="badge-green badge flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
            Devnet
          </div>

          {/* Wallet Button */}
          <WalletMultiButton style={{
            background: publicKey ? '#0f1a0f' : '#22c55e',
            color: publicKey ? '#f0fdf4' : '#050805',
            border: publicKey ? '1px solid #1f2e1f' : 'none',
            borderRadius: '999px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '600',
            height: '40px'
          }} />
        </div>
      </div>
    </nav>
  )
}
