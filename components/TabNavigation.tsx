'use client'

import { Home, Upload, Trophy, ShoppingBag, User } from 'lucide-react'

type Tab = 'home' | 'submit' | 'leaderboard' | 'marketplace' | 'profile'

interface TabNavigationProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'home' as Tab, label: 'Home', icon: Home },
    { id: 'submit' as Tab, label: 'Submit', icon: Upload },
    { id: 'leaderboard' as Tab, label: 'Leaderboard', icon: Trophy },
    { id: 'marketplace' as Tab, label: 'Marketplace', icon: ShoppingBag },
    { id: 'profile' as Tab, label: 'Profile', icon: User },
  ]

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'linear-gradient(to top, rgba(5, 8, 5, 0.98), rgba(5, 8, 5, 0.95))',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderTop: '1px solid rgba(34, 197, 94, 0.2)',
        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        height: '80px',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="max-w-md mx-auto h-full flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center gap-1 transition-all relative group"
              style={{
                minWidth: '64px',
                padding: '10px 12px',
                flex: 1
              }}
            >
              {/* Enhanced Glassy background effect */}
              <div 
                className="absolute inset-0 rounded-2xl transition-all duration-300"
                style={{
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(22, 163, 74, 0.18), rgba(16, 185, 129, 0.12))' 
                    : 'transparent',
                  backdropFilter: isActive ? 'blur(20px) saturate(200%)' : 'none',
                  WebkitBackdropFilter: isActive ? 'blur(20px) saturate(200%)' : 'none',
                  border: isActive 
                    ? '1.5px solid rgba(34, 197, 94, 0.5)' 
                    : '1px solid transparent',
                  boxShadow: isActive 
                    ? '0 8px 32px rgba(34, 197, 94, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.15)' 
                    : 'none',
                  transform: isActive ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
                }}
              />
              
              {/* Hover effect for inactive tabs */}
              {!isActive && (
                <div 
                  className="absolute inset-0 rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                />
              )}
              
              {/* Icon with enhanced glassy effect */}
              <div 
                className="relative z-10 transition-all duration-300"
                style={{
                  filter: isActive 
                    ? 'drop-shadow(0 0 16px rgba(34, 197, 94, 0.9)) drop-shadow(0 0 6px rgba(34, 197, 94, 0.5))' 
                    : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                <Icon 
                  className="w-6 h-6 transition-all duration-300" 
                  style={{ 
                    color: isActive ? '#22c55e' : '#86efac',
                    strokeWidth: isActive ? 2.5 : 2,
                    opacity: isActive ? 1 : 0.7
                  }} 
                />
              </div>
              
              {/* Label */}
              <span 
                className="text-xs font-medium relative z-10 transition-all duration-300"
                style={{ 
                  color: isActive ? '#22c55e' : '#86efac',
                  textShadow: isActive ? '0 0 12px rgba(34, 197, 94, 0.6)' : 'none',
                  fontWeight: isActive ? '600' : '500',
                  opacity: isActive ? 1 : 0.8
                }}
              >
                {tab.label}
              </span>
              
              {/* Active indicator dot */}
              {isActive && (
                <div 
                  className="absolute top-1 w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ 
                    background: '#22c55e',
                    boxShadow: '0 0 12px rgba(34, 197, 94, 1), 0 0 6px rgba(34, 197, 94, 0.6)'
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
