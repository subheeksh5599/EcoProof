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
      className="fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        background: 'rgba(5, 8, 5, 0.95)',
        backdropFilter: 'blur(20px)',
        borderColor: '#1f2e1f',
        height: '72px'
      }}
    >
      <div className="max-w-md mx-auto h-full flex items-center justify-center gap-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center gap-1 transition-all relative group"
              style={{
                minWidth: '60px',
                padding: '8px'
              }}
            >
              {/* Enhanced Glassy background effect */}
              <div 
                className="absolute inset-0 rounded-2xl transition-all duration-300"
                style={{
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.15), rgba(16, 185, 129, 0.1))' 
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))',
                  backdropFilter: isActive ? 'blur(16px) saturate(180%)' : 'blur(8px)',
                  WebkitBackdropFilter: isActive ? 'blur(16px) saturate(180%)' : 'blur(8px)',
                  border: isActive 
                    ? '1px solid rgba(34, 197, 94, 0.4)' 
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isActive 
                    ? '0 8px 32px rgba(34, 197, 94, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 0 rgba(0, 0, 0, 0.1)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
              />
              
              {/* Icon with enhanced glassy effect */}
              <div 
                className="relative z-10"
                style={{
                  filter: isActive 
                    ? 'drop-shadow(0 0 12px rgba(34, 197, 94, 0.8)) drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))' 
                    : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                }}
              >
                <Icon 
                  className="w-6 h-6 transition-all duration-300" 
                  style={{ 
                    color: isActive ? '#22c55e' : '#86efac',
                    strokeWidth: isActive ? 2.5 : 2,
                    opacity: isActive ? 1 : 0.8
                  }} 
                />
              </div>
              
              {/* Label */}
              <span 
                className="text-xs font-medium relative z-10 transition-all duration-300"
                style={{ 
                  color: isActive ? '#22c55e' : '#86efac',
                  textShadow: isActive ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none'
                }}
              >
                {tab.label}
              </span>
              
              {/* Active indicator dot */}
              {isActive && (
                <div 
                  className="absolute -top-1 w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ 
                    background: '#22c55e',
                    boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)'
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
