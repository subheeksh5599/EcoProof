'use client'

import { useState } from 'react'
import { Trophy, TrendingUp, Clock } from 'lucide-react'

interface LeaderboardEntry {
  username: string
  tokens: number
  rank: number
}

interface LeaderboardTabProps {
  leaderboard: LeaderboardEntry[]
  username: string
  userRank: number
}

export default function LeaderboardTab({ leaderboard, username, userRank }: LeaderboardTabProps) {
  const [filter, setFilter] = useState<'weekly' | 'alltime'>('alltime')

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('alltime')}
          className={`pill ${filter === 'alltime' ? 'badge-green' : ''}`}
          style={{
            background: filter === 'alltime' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(31, 46, 31, 0.5)',
            border: `1px solid ${filter === 'alltime' ? '#22c55e' : '#1f2e1f'}`,
            color: filter === 'alltime' ? '#22c55e' : '#86efac',
            cursor: 'pointer',
            padding: '8px 16px'
          }}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          All Time
        </button>
        <button
          onClick={() => setFilter('weekly')}
          className={`pill ${filter === 'weekly' ? 'badge-green' : ''}`}
          style={{
            background: filter === 'weekly' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(31, 46, 31, 0.5)',
            border: `1px solid ${filter === 'weekly' ? '#22c55e' : '#1f2e1f'}`,
            color: filter === 'weekly' ? '#22c55e' : '#86efac',
            cursor: 'pointer',
            padding: '8px 16px'
          }}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          This Week
        </button>
      </div>

      {/* Your Rank Card */}
      {userRank > 0 && (
        <div 
          className="card p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05))',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  fontSize: '20px'
                }}
              >
                {userRank === 1 ? '👑' : userRank === 2 ? '🥈' : userRank === 3 ? '🥉' : '🌿'}
              </div>
              <div>
                <div style={{ color: '#f0fdf4', fontSize: '18px', fontWeight: '600' }}>
                  Your Rank
                </div>
                <div style={{ color: '#86efac', fontSize: '14px' }}>
                  {username}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div style={{ color: '#22c55e', fontSize: '32px', fontWeight: '700' }}>
                #{userRank}
              </div>
              <div style={{ color: '#86efac', fontSize: '14px' }}>
                {leaderboard.find(e => e.username === username)?.tokens || 0} $ECO
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6" style={{ color: '#22c55e' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#f0fdf4' }}>
            Top Recyclers
          </h2>
        </div>

        <div className="space-y-2">
          {leaderboard.map((entry) => {
            const isCurrentUser = entry.username === username
            
            return (
              <div
                key={entry.username}
                className="flex items-center justify-between p-4 rounded-lg transition-all hover:bg-[#0f1a0f]"
                style={{
                  background: isCurrentUser ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                  border: isCurrentUser ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid transparent'
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: entry.rank <= 3 
                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.1))' 
                        : 'rgba(31, 46, 31, 0.5)',
                      border: entry.rank <= 3 ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid #1f2e1f',
                      fontSize: entry.rank <= 3 ? '20px' : '14px',
                      fontWeight: '600',
                      color: entry.rank <= 3 ? '#22c55e' : '#86efac'
                    }}
                  >
                    {entry.rank === 1 ? '👑' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                  </div>

                  {/* User Info */}
                  <div>
                    <div style={{ color: '#f0fdf4', fontSize: '16px', fontWeight: '500' }}>
                      {isCurrentUser ? 'You' : entry.username}
                    </div>
                    <div style={{ color: '#86efac', fontSize: '12px' }}>
                      Rank #{entry.rank}
                    </div>
                  </div>
                </div>

                {/* Tokens */}
                <div className="text-right">
                  <div className="tabular-nums" style={{ color: '#22c55e', fontSize: '18px', fontWeight: '700' }}>
                    {entry.tokens.toLocaleString()}
                  </div>
                  <div style={{ color: '#86efac', fontSize: '12px' }}>
                    $ECO
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🏆</div>
            <div style={{ color: '#86efac', fontSize: '14px' }}>
              No rankings yet. Be the first to recycle!
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
