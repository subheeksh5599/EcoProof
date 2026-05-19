export interface WeeklyChallenge {
  id: string
  title: string
  description: string
  target: number
  reward: number
  icon: string
  startDate: number
  endDate: number
}

export interface ChallengeProgress {
  challengeId: string
  progress: number
  completed: boolean
  claimedReward: boolean
}

/**
 * Get the current week's challenge
 */
export function getCurrentChallenge(): WeeklyChallenge {
  const now = Date.now()
  const weekStart = getWeekStart(now)
  const weekEnd = getWeekEnd(now)
  
  // Generate challenge ID based on week
  const challengeId = `week_${weekStart}`
  
  return {
    id: challengeId,
    title: 'Recycle 50 Items This Week',
    description: 'Complete to earn 500 bonus $ECO + exclusive badge',
    target: 50,
    reward: 500,
    icon: '🏆',
    startDate: weekStart,
    endDate: weekEnd
  }
}

/**
 * Get user's progress for current challenge
 */
export function getChallengeProgress(): ChallengeProgress {
  const challenge = getCurrentChallenge()
  
  try {
    const stored = localStorage.getItem('challenge_progress')
    const progress: ChallengeProgress = stored ? JSON.parse(stored) : {
      challengeId: challenge.id,
      progress: 0,
      completed: false,
      claimedReward: false
    }
    
    // Reset if it's a new week
    if (progress.challengeId !== challenge.id) {
      return {
        challengeId: challenge.id,
        progress: 0,
        completed: false,
        claimedReward: false
      }
    }
    
    return progress
  } catch (error) {
    console.error('Error loading challenge progress:', error)
    return {
      challengeId: challenge.id,
      progress: 0,
      completed: false,
      claimedReward: false
    }
  }
}

/**
 * Update challenge progress (call after each submission)
 */
export function updateChallengeProgress(): void {
  const challenge = getCurrentChallenge()
  const progress = getChallengeProgress()
  
  // Increment progress
  progress.progress += 1
  
  // Check if completed
  if (progress.progress >= challenge.target) {
    progress.completed = true
  }
  
  // Save
  localStorage.setItem('challenge_progress', JSON.stringify(progress))
  
  console.log(`📊 Challenge progress: ${progress.progress}/${challenge.target}`)
  
  // Show notification if just completed
  if (progress.completed && !progress.claimedReward) {
    console.log('🎉 Weekly challenge completed! Claim your reward!')
  }
}

/**
 * Claim challenge reward
 */
export function claimChallengeReward(): { success: boolean; reward: number } {
  const challenge = getCurrentChallenge()
  const progress = getChallengeProgress()
  
  if (!progress.completed) {
    return { success: false, reward: 0 }
  }
  
  if (progress.claimedReward) {
    return { success: false, reward: 0 }
  }
  
  // Mark as claimed
  progress.claimedReward = true
  localStorage.setItem('challenge_progress', JSON.stringify(progress))
  
  // Add reward to balance
  try {
    const username = localStorage.getItem('user_username') || 'Anonymous'
    const records = JSON.parse(localStorage.getItem('recycling_records') || '[]')
    records.push({
      id: `challenge_${challenge.id}`,
      wallet: 'system',
      username: username,
      itemType: 'Weekly Challenge Reward',
      amount: challenge.reward,
      timestamp: Date.now(),
      txHash: `challenge_${Date.now()}`
    })
    localStorage.setItem('recycling_records', JSON.stringify(records))
  } catch (error) {
    console.error('Error adding challenge reward:', error)
  }
  
  console.log(`🎁 Claimed ${challenge.reward} $ECO challenge reward!`)
  
  return { success: true, reward: challenge.reward }
}

/**
 * Get start of current week (Monday 00:00:00)
 */
function getWeekStart(timestamp: number): number {
  const date = new Date(timestamp)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday
  const monday = new Date(date.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday.getTime()
}

/**
 * Get end of current week (Sunday 23:59:59)
 */
function getWeekEnd(timestamp: number): number {
  const weekStart = getWeekStart(timestamp)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)
  return weekEnd.getTime()
}

/**
 * Get time remaining in current week
 */
export function getTimeRemaining(): string {
  const challenge = getCurrentChallenge()
  const now = Date.now()
  const remaining = challenge.endDate - now
  
  if (remaining <= 0) return 'Expired'
  
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days}d ${hours}h left`
  return `${hours}h left`
}
