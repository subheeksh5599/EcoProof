export interface Badge {
  id: string
  name: string
  icon: string
  multiplier: number
  purchasedAt: number
}

export function getUserBadges(): Badge[] {
  try {
    const badges = localStorage.getItem('user_badges')
    return badges ? JSON.parse(badges) : []
  } catch (error) {
    console.error('Error loading badges:', error)
    return []
  }
}

export function addBadge(badgeId: string, name: string, icon: string, multiplier: number): void {
  try {
    const badges = getUserBadges()
    
    // Check if badge already exists
    if (badges.some(b => b.id === badgeId)) {
      console.log('Badge already owned')
      return
    }
    
    badges.push({
      id: badgeId,
      name,
      icon,
      multiplier,
      purchasedAt: Date.now()
    })
    
    localStorage.setItem('user_badges', JSON.stringify(badges))
    console.log('✅ Badge added:', name, `(${multiplier}x multiplier)`)
  } catch (error) {
    console.error('Error adding badge:', error)
  }
}

export function getHighestMultiplier(): number {
  const badges = getUserBadges()
  if (badges.length === 0) return 1.0 // Base multiplier
  
  // Return the highest multiplier from all owned badges
  const highest = Math.max(...badges.map(b => b.multiplier))
  console.log('🏅 Active multiplier:', `${highest}x`)
  return highest
}

export function hasBadge(badgeId: string): boolean {
  const badges = getUserBadges()
  return badges.some(b => b.id === badgeId)
}

export function calculateReward(baseAmount: number): number {
  const multiplier = getHighestMultiplier()
  const reward = Math.floor(baseAmount * multiplier)
  console.log(`💰 Reward calculation: ${baseAmount} × ${multiplier}x = ${reward} $ECO`)
  return reward
}
