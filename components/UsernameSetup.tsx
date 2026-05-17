'use client'

import { useState } from 'react'

interface UsernameSetupProps {
  onUsernameSet: (username: string) => void
}

export default function UsernameSetup({ onUsernameSet }: UsernameSetupProps) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate username
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    if (username.length > 20) {
      setError('Username must be less than 20 characters')
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores')
      return
    }

    // Save username to localStorage
    localStorage.setItem('user_username', username.trim())
    onUsernameSet(username.trim())
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ position: 'relative' }}>
      {/* Background effects are inherited from parent */}
      <div className="max-w-md w-full" style={{ position: 'relative', zIndex: 10 }}>
        <div className="bg-[#111111]/90 backdrop-blur-lg rounded-2xl p-8 border border-[#1a1a1a] shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">♻</div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="gradient-text">Trash2Token</span>
            </h1>
            <p className="text-[#86efac] text-lg">Welcome! Let's get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-[#f0fdf4] mb-3 font-semibold text-lg">
                Choose your username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError('')
                }}
                placeholder="Enter username"
                className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] text-[#f0fdf4] placeholder-[#86efac]/50 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
                maxLength={20}
                autoFocus
              />
              {error && (
                <p className="text-[#ef4444] text-sm mt-2">{error}</p>
              )}
              <p className="text-[#86efac] text-sm mt-2">
                3-20 characters, letters, numbers, and underscores only
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#22c55e] hover:bg-[#16a34a] text-[#0a0a0a] font-bold rounded-lg transition text-lg shadow-lg hover:shadow-xl glow-green"
            >
              Continue
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#86efac] text-sm">
              Earn $ECO tokens by recycling plastic
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
