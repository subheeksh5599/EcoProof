/**
 * Generate SHA-256 hash of an image file to detect duplicates
 */
export async function getImageHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Check if an image hash has already been submitted
 */
export function isImageAlreadySubmitted(hash: string): boolean {
  try {
    const usedHashes = JSON.parse(localStorage.getItem('used_hashes') || '[]')
    return usedHashes.includes(hash)
  } catch (error) {
    console.error('Error checking image hash:', error)
    return false
  }
}

/**
 * Mark an image hash as submitted
 */
export function markImageAsSubmitted(hash: string): void {
  try {
    const usedHashes = JSON.parse(localStorage.getItem('used_hashes') || '[]')
    usedHashes.push(hash)
    // Keep only last 1000 hashes to prevent localStorage overflow
    const trimmedHashes = usedHashes.slice(-1000)
    localStorage.setItem('used_hashes', JSON.stringify(trimmedHashes))
  } catch (error) {
    console.error('Error marking image hash:', error)
  }
}
