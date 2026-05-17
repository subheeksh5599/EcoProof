'use client'

import { Camera, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

type SubmissionState = 'empty' | 'uploaded' | 'analyzing' | 'validated' | 'rejected' | 'minting' | 'success'

interface SubmitTabProps {
  submissionState: SubmissionState
  selectedImage: File | null
  imagePreview: string
  selectedCategory: string
  validationResult: any
  rewardAmount: number
  cooldownRemaining: number
  onImageSelect: (file: File) => void
  onMint: () => void
  onReset: () => void
  onCategoryChange: (category: string) => void
}

export default function SubmitTab({
  submissionState,
  selectedImage,
  imagePreview,
  selectedCategory,
  validationResult,
  rewardAmount,
  cooldownRemaining,
  onImageSelect,
  onMint,
  onReset,
  onCategoryChange
}: SubmitTabProps) {
  const formatCooldown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-6">
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f0fdf4', marginBottom: '16px' }}>
          📸 Submit Proof
        </h2>

        {/* Upload Zone */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            submissionState === 'empty' ? 'cursor-pointer hover:border-[#22c55e]' : ''
          }`}
          style={{
            borderColor: submissionState === 'validated' ? '#22c55e' : submissionState === 'rejected' ? '#ef4444' : '#1f2e1f',
            background: submissionState === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'transparent'
          }}
          onClick={() => {
            if (submissionState === 'empty' && cooldownRemaining === 0) {
              document.getElementById('file-input')?.click()
            }
          }}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onImageSelect(file)
            }}
          />

          {/* State: Empty */}
          {submissionState === 'empty' && (
            <div>
              {cooldownRemaining > 0 ? (
                <>
                  <div className="text-4xl mb-3">⏱️</div>
                  <div style={{ color: '#f59e0b', fontSize: '16px', fontWeight: '600' }}>
                    Cooldown Active
                  </div>
                  <div style={{ color: '#86efac', fontSize: '14px', marginTop: '8px' }}>
                    Next submission in {formatCooldown(cooldownRemaining)}
                  </div>
                </>
              ) : (
                <>
                  <Camera className="w-12 h-12 mx-auto mb-3" style={{ color: '#86efac' }} />
                  <div style={{ color: '#f0fdf4', fontSize: '16px', fontWeight: '600' }}>
                    Drop your recycling photo here
                  </div>
                  <div style={{ color: '#86efac', fontSize: '14px', marginTop: '8px' }}>
                    or click to upload
                  </div>
                </>
              )}
            </div>
          )}

          {/* State: Uploaded / Analyzing */}
          {(submissionState === 'uploaded' || submissionState === 'analyzing') && imagePreview && (
            <div>
              <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg mb-3" />
              {submissionState === 'analyzing' && (
                <div className="flex items-center justify-center gap-2 animate-pulse">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#22c55e' }} />
                  <span style={{ color: '#86efac' }}>Analyzing image...</span>
                </div>
              )}
            </div>
          )}

          {/* State: Validated */}
          {submissionState === 'validated' && imagePreview && (
            <div>
              <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg mb-3" />
              <div className="flex items-center justify-center gap-2 mb-2 animate-check-in">
                <CheckCircle2 className="w-6 h-6" style={{ color: '#22c55e' }} />
                <span style={{ color: '#22c55e', fontSize: '16px', fontWeight: '600' }}>
                  {validationResult?.itemType || 'Plastic'} detected
                </span>
              </div>
              <div className="badge-green badge">
                High confidence
              </div>
              <div className="mt-3" style={{ color: '#f0fdf4', fontSize: '18px', fontWeight: '600' }}>
                Reward: +{rewardAmount} $ECO
              </div>
            </div>
          )}

          {/* State: Rejected */}
          {submissionState === 'rejected' && (
            <div>
              {imagePreview && <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg mb-3 opacity-50" />}
              <div className="flex items-center justify-center gap-2 mb-2">
                <XCircle className="w-6 h-6" style={{ color: '#ef4444' }} />
                <span style={{ color: '#ef4444', fontSize: '16px', fontWeight: '600' }}>
                  {validationResult?.error || 'No recyclable item detected'}
                </span>
              </div>
              <div style={{ color: '#86efac', fontSize: '14px' }}>
                Try a clearer photo of your recyclable plastic item
              </div>
            </div>
          )}

          {/* State: Minting */}
          {submissionState === 'minting' && (
            <div>
              <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin" style={{ color: '#22c55e' }} />
              <div style={{ color: '#f0fdf4', fontSize: '16px', fontWeight: '600' }}>
                Minting to your wallet...
              </div>
              <div style={{ color: '#86efac', fontSize: '14px', marginTop: '8px' }}>
                Confirming on Solana devnet...
              </div>
            </div>
          )}

          {/* State: Success */}
          {submissionState === 'success' && (
            <div>
              <div className="text-6xl mb-3">✅</div>
              <div style={{ color: '#22c55e', fontSize: '20px', fontWeight: '700' }}>
                +{rewardAmount} $ECO added to your wallet
              </div>
              <div style={{ color: '#86efac', fontSize: '14px', marginTop: '8px' }}>
                Great job recycling!
              </div>
            </div>
          )}
        </div>

        {/* Category Selector */}
        {submissionState === 'empty' && cooldownRemaining === 0 && (
          <div className="mt-4">
            <div style={{ color: '#86efac', fontSize: '14px', marginBottom: '8px' }}>Category:</div>
            <div className="flex gap-2 flex-wrap">
              {['🧴 Plastic', '📄 Paper', '🍶 Glass', '🥫 Metal'].map((cat) => {
                const categoryName = cat.split(' ')[1].toLowerCase()
                return (
                  <button
                    key={cat}
                    className={`pill ${selectedCategory === categoryName ? 'badge-green' : ''}`}
                    style={{
                      background: selectedCategory === categoryName ? 'rgba(34, 197, 94, 0.2)' : 'rgba(31, 46, 31, 0.5)',
                      border: `1px solid ${selectedCategory === categoryName ? '#22c55e' : '#1f2e1f'}`,
                      color: selectedCategory === categoryName ? '#22c55e' : '#86efac',
                      cursor: 'pointer'
                    }}
                    onClick={() => onCategoryChange(categoryName)}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Mint Button */}
        {submissionState === 'validated' && (
          <button
            className="btn-primary w-full mt-4 text-lg py-3"
            onClick={onMint}
          >
            Mint $ECO Tokens
          </button>
        )}

        {/* Try Again Button */}
        {submissionState === 'rejected' && (
          <button
            className="btn-primary w-full mt-4"
            onClick={onReset}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
