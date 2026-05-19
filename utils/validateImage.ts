import { validateWithGoogleVision, VisionResult } from './googleVision'

export interface ValidationResult {
  isRecyclable: boolean
  itemType: string
  reason: string
  confidence: number
}

/**
 * Image validation using Gemini Vision API
 * Detects plastic materials with high accuracy
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

  console.log('🔍 Validating image...')
  console.log('📸 Image:', imageFile.name, `(${(imageFile.size / 1024).toFixed(1)} KB)`)
  
  const result = await validateWithGoogleVision(imageFile)
  
  console.log('✅ Validation complete:', {
    isRecyclable: result.isRecyclable,
    itemType: result.itemType,
    confidence: `${(result.confidence * 100).toFixed(0)}%`,
    reason: result.reason
  })
  
  return {
    isRecyclable: result.isRecyclable,
    itemType: result.itemType,
    reason: result.reason,
    confidence: result.confidence
  }
}

// File conversion utility
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
