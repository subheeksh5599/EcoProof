/**
 * Check if user is in cooldown period
 */
export function checkCooldown(): { inCooldown: boolean; remainingTime?: number; remainingHours?: number } {
  try {
    const lastSubmission = localStorage.getItem('last_submission')
    const cooldown = 5 * 60 * 1000 // 5 minutes cooldown
    
    if (lastSubmission) {
      const timeSinceLastSubmission = Date.now() - parseInt(lastSubmission)
      
      if (timeSinceLastSubmission < cooldown) {
        const remaining = cooldown - timeSinceLastSubmission
        const hours = Math.floor(remaining / 3600000)
        const minutes = Math.floor((remaining % 3600000) / 60000)
        
        return {
          inCooldown: true,
          remainingTime: remaining,
          remainingHours: hours > 0 ? hours : 0
        }
      }
    }
    
    return { inCooldown: false }
  } catch (error) {
    console.error('Error checking cooldown:', error)
    return { inCooldown: false }
  }
}

/**
 * Update last submission timestamp
 */
export function updateLastSubmission(): void {
  try {
    localStorage.setItem('last_submission', Date.now().toString())
  } catch (error) {
    console.error('Error updating last submission:', error)
  }
}

/**
 * Format remaining time for display
 */
export function formatRemainingTime(milliseconds: number): string {
  const hours = Math.floor(milliseconds / 3600000)
  const minutes = Math.floor((milliseconds % 3600000) / 60000)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}
