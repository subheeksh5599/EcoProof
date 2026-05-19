'use client'

import { ShoppingBag, Gift, Zap, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'

interface MarketplaceTabProps {
  balance: number
  onPurchase: (item: string, cost: number) => void
}

export default function MarketplaceTab({ balance, onPurchase }: MarketplaceTabProps) {
  const [ownedBadges, setOwnedBadges] = useState<string[]>([])

  useEffect(() => {
    // Load owned badges
    try {
      const badges = JSON.parse(localStorage.getItem('user_badges') || '[]')
      setOwnedBadges(badges.map((b: any) => b.id))
    } catch (error) {
      console.error('Error loading badges:', error)
    }
  }, [])

  const items = [
    {
      id: 'badge-bronze',
      name: 'Bronze Badge',
      description: 'Exclusive profile badge • 1.5x reward multiplier',
      cost: 50,
      icon: '🥉',
      category: 'badge',
      multiplier: 1.5
    },
    {
      id: 'badge-silver',
      name: 'Silver Badge',
      description: 'Rare profile badge • 2.0x reward multiplier',
      cost: 150,
      icon: '🥈',
      category: 'badge',
      multiplier: 2.0
    },
    {
      id: 'badge-gold',
      name: 'Gold Badge',
      description: 'Epic profile badge • 2.5x reward multiplier',
      cost: 300,
      icon: '🥇',
      category: 'badge',
      multiplier: 2.5
    },
    {
      id: 'badge-platinum',
      name: 'Platinum Badge',
      description: 'Legendary profile badge • 3.0x reward multiplier',
      cost: 500,
      icon: '💎',
      category: 'badge',
      multiplier: 3.0
    },
    {
      id: 'badge-diamond',
      name: 'Diamond Badge',
      description: 'Mythic profile badge • 3.5x reward multiplier',
      cost: 1000,
      icon: '💠',
      category: 'badge',
      multiplier: 3.5
    }
  ]

  const handlePurchase = (item: typeof items[0]) => {
    if (balance < item.cost) {
      toast.error('Insufficient balance')
      return
    }
    
    // Store badge with multiplier
    if (item.category === 'badge') {
      try {
        const badges = JSON.parse(localStorage.getItem('user_badges') || '[]')
        
        // Check if already owned
        if (badges.some((b: any) => b.id === item.id)) {
          toast.error('You already own this badge')
          return
        }
        
        badges.push({
          id: item.id,
          name: item.name,
          icon: item.icon,
          multiplier: item.multiplier,
          purchasedAt: Date.now()
        })
        
        localStorage.setItem('user_badges', JSON.stringify(badges))
        setOwnedBadges([...ownedBadges, item.id]) // Update state
      } catch (error) {
        console.error('Error saving badge:', error)
      }
    }
    
    onPurchase(item.name, item.cost)
    toast.success(`${item.icon} ${item.name} purchased! ${item.multiplier}x multiplier active!`)
  }

  const categories = [
    { id: 'badge', name: 'Tier Badges', icon: '🏅' }
  ]

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div 
        className="card p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05))',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div style={{ color: '#86efac', fontSize: '14px', marginBottom: '4px' }}>
              Your Balance
            </div>
            <div className="tabular-nums" style={{ fontSize: '32px', fontWeight: '700', color: '#f0fdf4' }}>
              {balance} $ECO
            </div>
          </div>
          <ShoppingBag className="w-12 h-12" style={{ color: '#22c55e', opacity: 0.5 }} />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="pill whitespace-nowrap"
            style={{
              background: 'rgba(31, 46, 31, 0.5)',
              border: '1px solid #1f2e1f',
              color: '#86efac',
              cursor: 'pointer',
              padding: '8px 16px'
            }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const isOwned = ownedBadges.includes(item.id)
          const canAfford = balance >= item.cost && !isOwned
          
          return (
            <div
              key={item.id}
              className="card p-6 transition-all hover:border-[#22c55e]"
              style={{
                opacity: isOwned ? 0.7 : canAfford ? 1 : 0.6,
                cursor: canAfford ? 'pointer' : 'not-allowed',
                border: isOwned ? '2px solid #22c55e' : undefined
              }}
            >
              {/* Icon */}
              <div className="text-5xl mb-3">{item.icon}</div>

              {/* Name */}
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f0fdf4', marginBottom: '8px' }}>
                {item.name}
              </h3>

              {/* Description */}
              <p style={{ color: '#86efac', fontSize: '14px', marginBottom: '16px', minHeight: '40px' }}>
                {item.description}
              </p>

              {/* Price & Button */}
              <div className="flex items-center justify-between">
                <div className="tabular-nums" style={{ color: '#22c55e', fontSize: '18px', fontWeight: '700' }}>
                  {item.cost} $ECO
                </div>
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={!canAfford}
                  className="btn-primary"
                  style={{
                    padding: '6px 16px',
                    fontSize: '14px',
                    opacity: canAfford ? 1 : 0.5,
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                    background: isOwned ? '#16a34a' : undefined
                  }}
                >
                  {isOwned ? '✓ Owned' : canAfford ? 'Buy' : 'Locked'}
                </button>
              </div>

              {/* Category Badge */}
              <div className="mt-3">
                <span 
                  className="badge"
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#22c55e',
                    fontSize: '11px',
                    padding: '2px 8px'
                  }}
                >
                  {item.multiplier}x Multiplier
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info Banner */}
      <div 
        className="card p-4"
        style={{
          background: 'rgba(34, 197, 94, 0.05)',
          border: '1px solid rgba(34, 197, 94, 0.2)'
        }}
      >
        <div className="flex items-start gap-3">
          <Gift className="w-5 h-5 flex-shrink-0" style={{ color: '#22c55e' }} />
          <div>
            <div style={{ color: '#f0fdf4', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
              Tier Multipliers Active
            </div>
            <div style={{ color: '#86efac', fontSize: '13px' }}>
              Higher tier badges multiply your rewards! Each tier adds 0.5x to your base reward.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
