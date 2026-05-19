'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import toast from 'react-hot-toast'
import Navbar from './Navbar'
import TabNavigation from './TabNavigation'
import HomeTab from './HomeTab'
import SubmitTab from './SubmitTab'
import LeaderboardTab from './LeaderboardTab'
import MarketplaceTab from './MarketplaceTab'
import ProfileTab from './ProfileTab'
import { validateRecyclableImage } from '@/utils/validateImage'
import { mintTokens } from '@/utils/mintToken'
import { checkCooldown, updateLastSubmission } from '@/utils/cooldown'
import { getImageHash, markImageAsSubmitted, isImageAlreadySubmitted } from '@/utils/imageHash'
import { calculateReward, getHighestMultiplier } from '@/utils/badgeSystem'
import { updateChallengeProgress } from '@/utils/weeklyChallenge'

type SubmissionState = 'empty' | 'uploaded' | 'analyzing' | 'validated' | 'rejected' | 'minting' | 'success'
type Tab = 'home' | 'submit' | 'leaderboard' | 'marketplace' | 'profile'

interface UserStats {
  balance: number
  streak: number
  co2Saved: number
}

interface LeaderboardEntry {
  username: string
  tokens: number
  rank: number
}

interface Transaction {
  id: string
  username: string
  item: string
  tokens: number
  timestamp: number
  txHash?: string
}

export default function DashboardScreen() {
  const { publicKey } = useWallet()
  const [username, setUsername] = useState<string>('')
  const [stats, setStats] = useState<UserStats>({ balance: 0, streak: 0, co2Saved: 0 })
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [userRank, setUserRank] = useState<number>(0)
  const [mounted, setMounted] = useState(false)
  
  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>('home')
  
  // Submission flow state
  const [submissionState, setSubmissionState] = useState<SubmissionState>('empty')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('plastic')
  const [validationResult, setValidationResult] = useState<any>(null)
  const [rewardAmount, setRewardAmount] = useState<number>(0)
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0)

  // Load data on mount
  useEffect(() => {
    setMounted(true)
    const savedUsername = localStorage.getItem('user_username') || 'Anonymous'
    setUsername(savedUsername)
    loadUserStats()
    loadLeaderboard()
    loadTransactions()
    checkCooldownStatus()
  }, [publicKey])

  // Reload stats when username changes
  useEffect(() => {
    if (username) {
      loadUserStats()
    }
  }, [username])

  // Auto-refresh transactions
  useEffect(() => {
    const interval = setInterval(() => {
      loadTransactions()
      loadLeaderboard()
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Cooldown timer
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setInterval(() => {
        setCooldownRemaining(prev => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [cooldownRemaining])

  const checkCooldownStatus = () => {
    const result = checkCooldown()
    if (result.inCooldown && result.remainingTime) {
      setCooldownRemaining(Math.floor(result.remainingTime / 1000))
    } else {
      setCooldownRemaining(0)
    }
  }

  const loadUserStats = () => {
    try {
      const currentUsername = username || localStorage.getItem('user_username') || 'Anonymous'
      const records = JSON.parse(localStorage.getItem('recycling_records') || '[]')
      
      console.log('📊 Loading stats for:', currentUsername)
      console.log('📦 Total records:', records.length)
      
      const userRecords = records.filter((r: any) => r.username === currentUsername)
      console.log('👤 User records:', userRecords.length, userRecords)
      
      const balance = userRecords.reduce((sum: number, r: any) => sum + (r.amount || 0), 0)
      const co2Saved = balance * 0.023 // Rough estimate: ~23g CO2 per token
      
      // Calculate actual streak
      const streak = calculateStreak(userRecords)
      
      console.log('💰 Balance:', balance, '$ECO')
      
      setStats({
        balance,
        streak,
        co2Saved: parseFloat(co2Saved.toFixed(1))
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const calculateStreak = (records: any[]) => {
    if (records.length === 0) return 0
    
    // Sort by timestamp descending
    const sorted = [...records].sort((a, b) => b.timestamp - a.timestamp)
    
    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    
    for (const record of sorted) {
      const recordDate = new Date(record.timestamp)
      recordDate.setHours(0, 0, 0, 0)
      
      const daysDiff = Math.floor((currentDate.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === streak) {
        streak++
      } else if (daysDiff > streak) {
        break
      }
    }
    
    return streak
  }

  const loadLeaderboard = () => {
    try {
      const records = JSON.parse(localStorage.getItem('recycling_records') || '[]')
      const userTotals: { [key: string]: number } = {}
      
      records.forEach((r: any) => {
        if (r.username) {
          userTotals[r.username] = (userTotals[r.username] || 0) + (r.amount || 0)
        }
      })
      
      const sorted = Object.entries(userTotals)
        .map(([username, tokens]) => ({ username, tokens: tokens as number, rank: 0 }))
        .sort((a, b) => b.tokens - a.tokens)
        .slice(0, 10)
        .map((entry, index) => ({ ...entry, rank: index + 1 }))
      
      setLeaderboard(sorted)
      
      const currentUserRank = sorted.findIndex(e => e.username === username)
      setUserRank(currentUserRank >= 0 ? currentUserRank + 1 : 0)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    }
  }

  const loadTransactions = () => {
    try {
      const records = JSON.parse(localStorage.getItem('recycling_records') || '[]')
      const txs = records
        .sort((a: any, b: any) => b.timestamp - a.timestamp)
        .slice(0, 10)
        .map((r: any) => ({
          id: r.id || r.timestamp.toString(),
          username: r.username || 'Anonymous',
          item: r.itemType || 'Plastic Item',
          tokens: r.amount || 0,
          timestamp: r.timestamp,
          txHash: r.txHash
        }))
      
      setTransactions(txs)
    } catch (error) {
      console.error('Error loading transactions:', error)
    }
  }

  const handleImageSelect = async (file: File) => {
    if (cooldownRemaining > 0) {
      toast.error(`Please wait ${formatCooldown(cooldownRemaining)} before next submission`)
      return
    }

    setSelectedImage(file)
    setImagePreview(URL.createObjectURL(file))
    setSubmissionState('uploaded')
    
    // Auto-start analysis
    setTimeout(() => analyzeImage(file), 500)
  }

  const analyzeImage = async (file: File) => {
    setSubmissionState('analyzing')
    
    try {
      // Check for duplicate
      const hash = await getImageHash(file)
      if (isImageAlreadySubmitted(hash)) {
        setSubmissionState('rejected')
        setValidationResult({ error: 'This image has already been submitted' })
        toast.error('Duplicate image detected')
        return
      }
      
      // Validate image
      const result = await validateRecyclableImage(file)
      
      if (result.isRecyclable) {
        setValidationResult(result)
        const baseReward = 10
        const finalReward = calculateReward(baseReward) // Apply badge multiplier
        setRewardAmount(finalReward)
        setSubmissionState('validated')
        
        // Store hash
        markImageAsSubmitted(hash)
      } else {
        setSubmissionState('rejected')
        setValidationResult(result)
        toast.error(result.reason || 'No recyclable plastic detected')
      }
    } catch (error) {
      setSubmissionState('rejected')
      setValidationResult({ error: 'Analysis failed' })
      toast.error('Failed to analyze image')
    }
  }

  const handleMint = async () => {
    if (!publicKey || submissionState !== 'validated') return
    
    setSubmissionState('minting')
    
    try {
      const itemType = validationResult?.itemType || 'Plastic Item'
      const result = await mintTokens(publicKey.toBase58(), rewardAmount, itemType)
      
      if (result.success) {
        // Set cooldown
        updateLastSubmission()
        checkCooldownStatus()
        
        // Update challenge progress
        updateChallengeProgress()
        
        // Update UI
        setSubmissionState('success')
        toast.success(`🌱 ${rewardAmount} $ECO minted!`, {
          duration: 5000,
          action: result.signature ? {
            label: 'View on Explorer',
            onClick: () => window.open(`https://explorer.solana.com/tx/${result.signature}?cluster=devnet`, '_blank')
          } : undefined
        } as any)
        
        // Reload data
        loadUserStats()
        loadLeaderboard()
        loadTransactions()
        
        // Reset after 3 seconds
        setTimeout(() => {
          resetSubmission()
        }, 3000)
      } else {
        throw new Error(result.error || 'Minting failed')
      }
    } catch (error: any) {
      setSubmissionState('validated')
      toast.error(error.message || 'Failed to mint tokens')
    }
  }

  const resetSubmission = () => {
    setSubmissionState('empty')
    setSelectedImage(null)
    setImagePreview('')
    setValidationResult(null)
    setRewardAmount(0)
  }

  const handlePurchase = (item: string, cost: number) => {
    // Deduct from balance
    const newBalance = stats.balance - cost
    setStats({ ...stats, balance: newBalance })
    
    // Update localStorage
    const records = JSON.parse(localStorage.getItem('recycling_records') || '[]')
    records.push({
      id: Date.now().toString(),
      username,
      itemType: `Purchased: ${item}`,
      amount: -cost,
      timestamp: Date.now()
    })
    localStorage.setItem('recycling_records', JSON.stringify(records))
    
    loadUserStats()
    loadTransactions()
  }

  const formatCooldown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#050805' }}>
        <div className="loader"></div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab stats={stats} transactions={transactions} username={username} onStatsUpdate={loadUserStats} />
      
      case 'submit':
        return (
          <SubmitTab
            submissionState={submissionState}
            selectedImage={selectedImage}
            imagePreview={imagePreview}
            selectedCategory={selectedCategory}
            validationResult={validationResult}
            rewardAmount={rewardAmount}
            cooldownRemaining={cooldownRemaining}
            onImageSelect={handleImageSelect}
            onMint={handleMint}
            onReset={resetSubmission}
            onCategoryChange={setSelectedCategory}
          />
        )
      
      case 'leaderboard':
        return <LeaderboardTab leaderboard={leaderboard} username={username} userRank={userRank} />
      
      case 'marketplace':
        return <MarketplaceTab balance={stats.balance} onPurchase={handlePurchase} />
      
      case 'profile':
        return <ProfileTab username={username} stats={stats} transactions={transactions} />
      
      default:
        return null
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: '#050805', paddingTop: '80px', paddingBottom: '100px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {renderTabContent()}
        </div>
      </div>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  )
}
