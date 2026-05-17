'use client'

import { Coins, Flame, Globe, TrendingUp, Award } from 'lucide-react'

interface HomeTabProps {
  stats: {
    balance: number
    streak: number
    co2Saved: number
  }
  transactions: Array<{
    id: string
    username: string
    item: string
    tokens: number
    timestamp: number
    txHash?: string
  }>
  username: string
}

export default function HomeTab({ stats, transactions, username }: HomeTabProps) {
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Coins className="w-5 h-5" style={{ color: '#22c55e' }} />
            <span style={{ color: '#86efac', fontSize: '14px' }}>Balance</span>
          </div>
          <div className="tabular-nums" style={{ fontSize: '32px', fontWeight: 'bold', color: '#f0fdf4' }}>
            {stats.balance}
          </div>
          <div style={{ color: '#86efac', fontSize: '14px' }}>$ECO</div>
        </div>

        {/* Streak */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-5 h-5" style={{ color: '#f97316' }} />
            <span style={{ color: '#86efac', fontSize: '14px' }}>Streak</span>
          </div>
          <div className="tabular-nums" style={{ fontSize: '32px', fontWeight: 'bold', color: '#f0fdf4' }}>
            {stats.streak}
          </div>
          <div style={{ color: '#86efac', fontSize: '14px' }}>Days • 2x Bonus</div>
        </div>

        {/* Impact */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-5 h-5" style={{ color: '#22c55e' }} />
            <span style={{ color: '#86efac', fontSize: '14px' }}>Impact</span>
          </div>
          <div className="tabular-nums" style={{ fontSize: '32px', fontWeight: 'bold', color: '#f0fdf4' }}>
            {stats.co2Saved}
          </div>
          <div style={{ color: '#86efac', fontSize: '14px' }}>kg CO₂ saved</div>
        </div>
      </div>

      {/* Weekly Challenge Banner */}
      <div 
        className="card p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05))',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5" style={{ color: '#22c55e' }} />
              <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: '600' }}>
                Weekly Challenge
              </span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#f0fdf4', marginBottom: '8px' }}>
              Recycle 50 Items This Week
            </h3>
            <p style={{ color: '#86efac', fontSize: '14px', marginBottom: '12px' }}>
              Complete to earn 500 bonus $ECO + exclusive badge
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full" style={{ background: '#0f1a0f' }}>
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: '34%', 
                    background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                    boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                  }}
                />
              </div>
              <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: '600' }}>
                17/50
              </span>
            </div>
          </div>
          <div className="text-5xl ml-4">🏆</div>
        </div>
      </div>

      {/* Community Feed */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f0fdf4' }}>
            🌍 Community Feed
          </h2>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#22c55e' }} />
            <span style={{ color: '#86efac', fontSize: '14px' }}>Live</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {transactions.slice(0, 8).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded hover:bg-[#0f1a0f] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🌿</span>
                <div>
                  <div style={{ color: '#f0fdf4', fontSize: '14px', fontWeight: '500' }}>
                    {tx.item}
                  </div>
                  <div style={{ color: '#86efac', fontSize: '12px' }}>
                    {tx.username === username ? 'You' : tx.username} • {formatTimeAgo(tx.timestamp)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="tabular-nums" style={{ color: '#22c55e', fontSize: '14px', fontWeight: '600' }}>
                  +{tx.tokens} $ECO
                </span>
                {tx.txHash && (
                  <a
                    href={`https://explorer.solana.com/tx/${tx.txHash}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#22c55e', fontSize: '12px' }}
                  >
                    ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
