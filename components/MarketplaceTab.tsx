'use client'

import { ShoppingBag, Gift, Zap, Star } from 'lucide-react'
import toast from 'react-hot-toast'

interface MarketplaceTabProps {
  balance: number
  onPurchase: (item: string, cost: number) => void
}

export default function MarketplaceTab({ balance, onPurchase }: MarketplaceTabProps) {
  const items = [
    {
      id: 'tree',
      name: 'Plant a Tree',
      description: 'Fund a real tree planting through our partners',
      cost: 100,
      icon: '🌳',
      category: 'impact'
    },
    {
      id: 'ocean',
      name: 'Ocean Cleanup',
      description: 'Support ocean plastic removal projects',
      cost: 150,
      icon: '🌊',
      category: 'impact'
    },
    {
      id: 'solar',
      name: 'Solar Panel Fund',
      description: 'Contribute to community solar installations',
      cost: 200,
      icon: '☀️',
      category: 'impact'
    },
    {
      id: 'badge-bronze',
      name: 'Bronze Badge',
      description: 'Exclusive profile badge',
      cost: 50,
      icon: '🥉',
      category: 'badge'
    },
    {
      id: 'badge-silver',
      name: 'Silver Badge',
      description: 'Rare profile badge',
      cost: 100,
      icon: '🥈',
      category: 'badge'
    },
    {
      id: 'badge-gold',
      name: 'Gold Badge',
      description: 'Legendary profile badge',
      cost: 250,
      icon: '🥇',
      category: 'badge'
    },
    {
      id: 'boost-2x',
      name: '2x Boost (24h)',
      description: 'Double your rewards for 24 hours',
      cost: 75,
      icon: '⚡',
      category: 'boost'
    },
    {
      id: 'boost-3x',
      name: '3x Boost (24h)',
      description: 'Triple your rewards for 24 hours',
      cost: 150,
      icon: '🔥',
      category: 'boost'
    },
    {
      id: 'nft-eco',
      name: 'Eco Warrior NFT',
      description: 'Limited edition NFT collectible',
      cost: 500,
      icon: '🎨',
      category: 'nft'
    }
  ]

  const handlePurchase = (item: typeof items[0]) => {
    if (balance < item.cost) {
      toast.error('Insufficient balance')
      return
    }
    
    onPurchase(item.name, item.cost)
    toast.success(`${item.icon} ${item.name} purchased!`)
  }

  const categories = [
    { id: 'impact', name: 'Real Impact', icon: '🌍' },
    { id: 'badge', name: 'Badges', icon: '🏅' },
    { id: 'boost', name: 'Boosts', icon: '⚡' },
    { id: 'nft', name: 'NFTs', icon: '🎨' }
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
          const canAfford = balance >= item.cost
          
          return (
            <div
              key={item.id}
              className="card p-6 transition-all hover:border-[#22c55e]"
              style={{
                opacity: canAfford ? 1 : 0.6,
                cursor: canAfford ? 'pointer' : 'not-allowed'
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
                    cursor: canAfford ? 'pointer' : 'not-allowed'
                  }}
                >
                  {canAfford ? 'Buy' : 'Locked'}
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
                  {categories.find(c => c.id === item.category)?.name}
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
              New items added weekly
            </div>
            <div style={{ color: '#86efac', fontSize: '13px' }}>
              Keep recycling to unlock exclusive rewards and make real-world impact
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
