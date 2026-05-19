'use client'

import { Award, Calendar, TrendingUp, Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getUserBadges, getHighestMultiplier } from '@/utils/badgeSystem'

interface ProfileTabProps {
  username: string
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
}

export default function ProfileTab({ username, stats, transactions }: ProfileTabProps) {
  const [ownedBadges, setOwnedBadges] = useState<any[]>([])
  const [activeMultiplier, setActiveMultiplier] = useState(1.0)

  useEffect(() => {
    const badges = getUserBadges()
    setOwnedBadges(badges)
    setActiveMultiplier(getHighestMultiplier())
  }, [])

  // Calculate category breakdown
  const categoryBreakdown = transactions.reduce((acc, tx) => {
    const category = tx.item.toLowerCase().includes('plastic') ? 'Plastic' :
                     tx.item.toLowerCase().includes('paper') ? 'Paper' :
                     tx.item.toLowerCase().includes('glass') ? 'Glass' :
                     tx.item.toLowerCase().includes('metal') ? 'Metal' : 'Other'
    
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalSubmissions = Object.values(categoryBreakdown).reduce((a, b) => a + b, 0)

  const badges = [
    { id: 'first', name: 'First Steps', icon: '🌱', earned: true, description: 'First submission' },
    { id: 'streak7', name: 'Week Warrior', icon: '🔥', earned: stats.streak >= 7, description: '7 day streak' },
    { id: 'tokens100', name: 'Century Club', icon: '💯', earned: stats.balance >= 100, description: '100 tokens earned' },
    { id: 'impact', name: 'Impact Maker', icon: '🌍', earned: stats.co2Saved >= 10, description: '10kg CO₂ saved' },
    { id: 'streak30', name: 'Monthly Master', icon: '👑', earned: stats.streak >= 30, description: '30 day streak' },
    { id: 'tokens500', name: 'Token Titan', icon: '⭐', earned: stats.balance >= 500, description: '500 tokens earned' },
  ]

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              border: '3px solid rgba(34, 197, 94, 0.3)'
            }}
          >
            🌿
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f0fdf4', marginBottom: '4px' }}>
              {username}
            </h1>
            <div style={{ color: '#86efac', fontSize: '14px', marginBottom: '12px' }}>
              Eco Warrior • Member since {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4 flex-wrap">
              <div>
                <div className="tabular-nums" style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>
                  {stats.balance}
                </div>
                <div style={{ color: '#86efac', fontSize: '12px' }}>$ECO Earned</div>
              </div>
              <div>
                <div className="tabular-nums" style={{ fontSize: '20px', fontWeight: '700', color: '#f97316' }}>
                  {stats.streak}
                </div>
                <div style={{ color: '#86efac', fontSize: '12px' }}>Day Streak</div>
              </div>
              <div>
                <div className="tabular-nums" style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>
                  {totalSubmissions}
                </div>
                <div style={{ color: '#86efac', fontSize: '12px' }}>Submissions</div>
              </div>
              <div>
                <div className="tabular-nums" style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>
                  {activeMultiplier}x
                </div>
                <div style={{ color: '#86efac', fontSize: '12px' }}>Multiplier</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Owned Badges */}
      {ownedBadges.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5" style={{ color: '#22c55e' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f0fdf4' }}>
              Owned Badges
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ownedBadges.map((badge) => (
              <div
                key={badge.id}
                className="p-4 rounded-lg text-center"
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '2px solid rgba(34, 197, 94, 0.3)'
                }}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div style={{ color: '#f0fdf4', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                  {badge.name}
                </div>
                <div style={{ color: '#22c55e', fontSize: '12px', fontWeight: '600' }}>
                  {badge.multiplier}x Multiplier
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Badges */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-5 h-5" style={{ color: '#22c55e' }} />
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f0fdf4' }}>
            Achievement Badges
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="p-4 rounded-lg text-center transition-all"
              style={{
                background: badge.earned ? 'rgba(34, 197, 94, 0.1)' : 'rgba(31, 46, 31, 0.3)',
                border: badge.earned ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid #1f2e1f',
                opacity: badge.earned ? 1 : 0.5
              }}
            >
              <div className="text-3xl mb-2">{badge.earned ? badge.icon : '🔒'}</div>
              <div style={{ color: badge.earned ? '#f0fdf4' : '#86efac', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                {badge.name}
              </div>
              <div style={{ color: '#86efac', fontSize: '12px' }}>
                {badge.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-5 h-5" style={{ color: '#22c55e' }} />
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f0fdf4' }}>
            Recycling Categories
          </h2>
        </div>

        <div className="space-y-3">
          {Object.entries(categoryBreakdown).map(([category, count]) => {
            const percentage = totalSubmissions > 0 ? (count / totalSubmissions) * 100 : 0
            const icons: Record<string, string> = {
              'Plastic': '🧴',
              'Paper': '📄',
              'Glass': '🍶',
              'Metal': '🥫',
              'Other': '♻️'
            }

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{icons[category]}</span>
                    <span style={{ color: '#f0fdf4', fontSize: '14px', fontWeight: '500' }}>
                      {category}
                    </span>
                  </div>
                  <span className="tabular-nums" style={{ color: '#86efac', fontSize: '14px' }}>
                    {count} items ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: '#0f1a0f' }}>
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      background: 'linear-gradient(90deg, #22c55e, #16a34a)'
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {totalSubmissions === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📦</div>
            <div style={{ color: '#86efac', fontSize: '14px' }}>
              No submissions yet. Start recycling to see your breakdown!
            </div>
          </div>
        )}
      </div>

      {/* Recent History */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5" style={{ color: '#22c55e' }} />
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f0fdf4' }}>
            Recent Activity
          </h2>
        </div>

        <div className="space-y-2">
          {transactions.slice(0, 10).map((tx) => (
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
                    {formatTimeAgo(tx.timestamp)}
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

        {transactions.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📅</div>
            <div style={{ color: '#86efac', fontSize: '14px' }}>
              No activity yet. Submit your first recycling proof!
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
