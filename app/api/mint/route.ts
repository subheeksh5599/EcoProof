import { NextRequest, NextResponse } from 'next/server'
import {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
} from '@solana/web3.js'
import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token'

export async function POST(request: NextRequest) {
  try {
    const { recipient, amount, itemType } = await request.json()

    // Validate inputs
    if (!recipient || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (amount <= 0 || amount > 1000) {
      return NextResponse.json(
        { error: 'Invalid amount (must be 1-1000)' },
        { status: 400 }
      )
    }

    // Get environment variables
    const mintAddress = process.env.NEXT_PUBLIC_TOKEN_MINT
    const mintAuthoritySecret = process.env.MINT_AUTHORITY_SECRET_KEY

    if (!mintAddress || !mintAuthoritySecret) {
      console.error('❌ Missing environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Connect to Solana
    const connection = new Connection(
      clusterApiUrl('devnet'),
      'confirmed'
    )

    // Load mint authority
    const mintAuthority = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(mintAuthoritySecret))
    )

    const mint = new PublicKey(mintAddress)
    const recipientPubkey = new PublicKey(recipient)

    console.log('🪙 Minting tokens...')
    console.log('  Recipient:', recipient)
    console.log('  Amount:', amount)
    console.log('  Item:', itemType)

    // Get or create recipient's token account
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      mintAuthority,
      mint,
      recipientPubkey
    )

    console.log('  Token Account:', recipientTokenAccount.address.toBase58())

    // Mint tokens (convert to smallest unit with 9 decimals)
    const amountInSmallestUnit = amount * Math.pow(10, 9)
    const signature = await mintTo(
      connection,
      mintAuthority,
      mint,
      recipientTokenAccount.address,
      mintAuthority.publicKey,
      amountInSmallestUnit
    )

    console.log('✅ Tokens minted!')
    console.log('  Signature:', signature)

    return NextResponse.json({
      success: true,
      signature,
      tokenAccount: recipientTokenAccount.address.toBase58(),
      amount,
    })
  } catch (error: any) {
    console.error('❌ Minting error:', error)
    return NextResponse.json(
      { error: error.message || 'Minting failed' },
      { status: 500 }
    )
  }
}
