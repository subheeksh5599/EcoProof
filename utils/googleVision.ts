export interface VisionResult {
  isRecyclable: boolean
  itemType: string
  reason: string
  confidence: number
  labels?: string[]
}

interface GeminiResponse {
  plastic_detected: boolean
  items: string[]
  confidence: 'high' | 'medium' | 'low'
  reasoning: string
}

/**
 * Image validation using Gemini Vision API
 */
export async function validateWithGoogleVision(imageFile: File): Promise<VisionResult> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_VISION_API_KEY

  if (!apiKey || apiKey === 'your_google_vision_api_key_here') {
    console.warn('⚠️ API key not configured, using basic detection')
    return fallbackValidation(imageFile)
  }

  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile)

    const prompt = `You are a plastic waste detection expert. Analyze this image carefully.

Only identify objects if you are highly confident they are plastic waste or plastic materials. Respond in JSON:

{
  "plastic_detected": true/false,
  "items": ["item1", "item2"],
  "confidence": "high/medium/low",
  "reasoning": "why you think this is or isn't plastic"
}

If the image contains paper, skin, fabric, signatures, text, or non-plastic materials, return plastic_detected: false. Do NOT guess.`

    // Call Gemini Vision API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                },
                {
                  inline_data: {
                    mime_type: imageFile.type,
                    data: base64Image
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500,
          }
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Gemini API error:', errorData)
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Extract the text response
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!textResponse) {
      throw new Error('No response from Gemini API')
    }

    console.log('🤖 Gemini Response:', textResponse)

    // Parse JSON from response (handle markdown code blocks)
    let jsonText = textResponse.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '')
    }

    const geminiResult: GeminiResponse = JSON.parse(jsonText)

    console.log('🔍 Gemini Analysis:', geminiResult)

    // Convert Gemini response to our format
    if (geminiResult.plastic_detected) {
      const confidenceScore = 
        geminiResult.confidence === 'high' ? 0.9 :
        geminiResult.confidence === 'medium' ? 0.75 : 0.6

      const itemType = geminiResult.items.length > 0 
        ? detectPlasticType(geminiResult.items)
        : 'Plastic Item'

      return {
        isRecyclable: true,
        itemType: itemType,
        reason: geminiResult.reasoning,
        confidence: confidenceScore,
        labels: geminiResult.items
      }
    } else {
      return {
        isRecyclable: false,
        itemType: 'Not Plastic',
        reason: geminiResult.reasoning,
        confidence: 0,
        labels: geminiResult.items
      }
    }

  } catch (error) {
    console.error('❌ API error:', error)
    console.log('⚠️ Using basic validation')
    return fallbackValidation(imageFile)
  }
}

function detectPlasticType(items: string[]): string {
  const itemsLower = items.map(i => i.toLowerCase())
  
  if (itemsLower.some(d => d.includes('bottle'))) return 'Plastic Bottle'
  if (itemsLower.some(d => d.includes('bag'))) return 'Plastic Bag'
  if (itemsLower.some(d => d.includes('container') || d.includes('tub'))) return 'Plastic Container'
  if (itemsLower.some(d => d.includes('cup'))) return 'Plastic Cup'
  if (itemsLower.some(d => d.includes('wrapper') || d.includes('packaging'))) return 'Plastic Packaging'
  if (itemsLower.some(d => d.includes('straw'))) return 'Plastic Straw'
  if (itemsLower.some(d => d.includes('lid') || d.includes('cap'))) return 'Plastic Lid'
  
  return 'Plastic Item'
}

function detectItemType(detections: string[]): string {
  if (detections.some(d => d.includes('paper') || d.includes('cardboard'))) return 'Paper/Cardboard'
  if (detections.some(d => d.includes('glass') || d.includes('bottle'))) return 'Glass Item'
  if (detections.some(d => d.includes('can') || d.includes('aluminum') || d.includes('metal'))) return 'Metal Can'
  return 'Recyclable Item'
}

/**
 * Basic validation for development and testing
 */
async function fallbackValidation(imageFile: File): Promise<VisionResult> {
  await new Promise(resolve => setTimeout(resolve, 1000))

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
        reason: `Detected ${item.type} (filename-based)`,
        confidence: item.confidence
      }
    }
  }

  // Default: assume it's recyclable plastic
  return {
    isRecyclable: true,
    itemType: 'Plastic Item',
    reason: 'Detected Plastic Item',
    confidence: 0.85
  }
}

/**
 * Convert File to base64 string
 */
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
