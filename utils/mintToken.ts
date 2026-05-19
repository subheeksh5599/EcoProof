import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, createMintToInstruction, getAssociatedTokenAddress } from '@solana/spl-token'

export interface MintResult {
  success: boolean
  signature?: string
  error?: string
}

export async function mintTokens(
  recipientWallet: string,
  amount: number,
  itemType?: string
): Promise<MintResult> {
  try {
    // Validate inputs
    if (!recipientWallet || recipientWallet.length < 32) {
      return {
        success: false,
        error: 'Invalid wallet address'
      }
    }

    if (amount <= 0 || amount > 1000) {
      return {
        success: false,
        error: 'Invalid token amount'
      }
    }

    const tokenMintAddress = process.env.NEXT_PUBLIC_TOKEN_MINT

    // Check if real minting is configured
    const useRealMinting = !!tokenMintAddress

    if (useRealMinting) {
      console.log('🪙 Minting REAL tokens on Solana...')
      
      // Call API to mint real tokens
      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: recipientWallet,
          amount: amount,
          itemType: itemType || 'Plastic Item'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Minting failed')
      }

      const result = await response.json()
      
      // Store transaction record
      try {
        const username = localStorage.getItem('user_username') || 'Anonymous'
        const records = JSON.parse(localStorage.getItem('recycling_records') || '[]')
        records.push({
          id: result.signature,
          wallet: recipientWallet.substring(0, 44),
          username: username,
          itemType: itemType || 'Plastic Item',
          amount,
          timestamp: Date.now(),
          txHash: result.signature,
          tokenAccount: result.tokenAccount
        })
        const trimmedRecords = records.slice(-100)
        localStorage.setItem('recycling_records', JSON.stringify(trimmedRecords))
        
        console.log('✅ Real tokens minted!', {
          username,
          itemType: itemType || 'Plastic Item',
          amount,
          signature: result.signature
        })
      } catch (storageError) {
        console.warn('LocalStorage error:', storageError)
      }

      return {
        success: true,
        signature: result.signature
      }
    } else {
      // Fallback: Simulate minting for development
      console.log('⚠️ Token mint not configured, using simulation mode')
      console.log(`  Simulating ${amount} $ECO tokens to ${recipientWallet}`)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Generate mock transaction signature for development
      const mockSignature = `sim_${Date.now()}${Math.random().toString(36).substring(2, 15)}`

      // Store transaction record
      try {
        const username = localStorage.getItem('user_username') || 'Anonymous'
        const records = JSON.parse(localStorage.getItem('recycling_records') || '[]')
        records.push({
          id: mockSignature,
          wallet: recipientWallet.substring(0, 44),
          username: username,
          itemType: itemType || 'Plastic Item',
          amount,
          timestamp: Date.now(),
          txHash: mockSignature
        })
        const trimmedRecords = records.slice(-100)
        localStorage.setItem('recycling_records', JSON.stringify(trimmedRecords))
        
        console.log('✅ Simulated transaction recorded:', {
          username,
          itemType: itemType || 'Plastic Item',
          amount,
          signature: mockSignature
        })
      } catch (storageError) {
        console.warn('LocalStorage error:', storageError)
      }

      return {
        success: true,
        signature: mockSignature
      }
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
