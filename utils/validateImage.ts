export interface ValidationResult {
  isRecyclable: boolean
  itemType: string
  reason: string
  confidence: number
}

/**
 * DEMO MODE: Simulated image validator for development
 * In production, replace with real AI service (Google Vision, AWS Rekognition, etc.)
 * Currently validates based on filename keywords and accepts all images as plastic items
 */
export async function validateRecyclableImage(imageFile: File): Promise<ValidationResult> {
  // Validate file type
  if (!imageFile.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }

  // Validate file size (max 10MB for security)
  const MAX_SIZE = 10 * 1024 * 1024
  if (imageFile.size > MAX_SIZE) {
    throw new Error('Image size must be less than 10MB')
  }

  // Simulate API processing delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Mock validation based on filename (for demo purposes)
  const filename = imageFile.name.toLowerCase()
  
  const plasticItems = [
    { keywords: ['bottle', 'plastic', 'pet'], type: 'Plastic Bottle', confidence: 0.92 },
    { keywords: ['bag', 'plastic'], type: 'Plastic Bag', confidence: 0.88 },
    { keywords: ['container', 'plastic', 'tub'], type: 'Plastic Container', confidence: 0.85 },
    { keywords: ['cup', 'plastic'], type: 'Plastic Cup', confidence: 0.90 },
    { keywords: ['wrapper', 'packaging'], type: 'Plastic Packaging', confidence: 0.87 },
  ]

  // Check filename for plastic keywords
  for (const item of plasticItems) {
    if (item.keywords.some(keyword => filename.includes(keyword))) {
      return {
        isRecyclable: true,
        itemType: item.type,
        reason: `Detected ${item.type}`,
        confidence: item.confidence
      }
    }
  }

  // If no keywords match, assume it's a generic plastic item
  // In production, this would be replaced with real AI vision API
  return {
    isRecyclable: true,
    itemType: 'Plastic Item',
    reason: 'Detected Plastic Item',
    confidence: 0.85
  }
}

/**
 * PRODUCTION: Uncomment and configure for real AI validation
 */
/*
export async function validateRecyclableImageProduction(imageFile: File): Promise<ValidationResult> {
  const apiKey = process.env.NEXT_PUBLIC_VISION_API_KEY

  if (!apiKey) {
    throw new Error('Vision API key not configured')
  }

  const base64Image = await fileToBase64(imageFile)

  const response = await fetch('/api/validate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image })
  })

  if (!response.ok) {
    throw new Error('Validation failed')
  }

  return await response.json()
}
*/

// Utility function for production use
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
