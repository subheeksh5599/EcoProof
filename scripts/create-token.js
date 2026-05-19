/**
 * SPL Token Creation Script
 * Creates a new token on Solana Devnet for the EcoProof platform
 */

const {
  Connection,
  Keypair,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} = require('@solana/web3.js')
const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} = require('@solana/spl-token')
const fs = require('fs')
const path = require('path')

async function createEcoToken() {
  console.log('🌱 Creating $ECO Token on Solana Devnet...\n')

  // Connect to devnet
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

  // Generate or load mint authority keypair
  const keypairPath = path.join(__dirname, 'mint-authority.json')
  let mintAuthority

  if (fs.existsSync(keypairPath)) {
    console.log('📂 Loading existing mint authority...')
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'))
    mintAuthority = Keypair.fromSecretKey(new Uint8Array(keypairData))
  } else {
    console.log('🔑 Generating new mint authority keypair...')
    mintAuthority = Keypair.generate()
    fs.writeFileSync(keypairPath, JSON.stringify(Array.from(mintAuthority.secretKey)))
    console.log('✅ Keypair saved to:', keypairPath)
  }

  console.log('🔑 Mint Authority:', mintAuthority.publicKey.toBase58())

  // Check balance
  const balance = await connection.getBalance(mintAuthority.publicKey)
  console.log('💰 Balance:', balance / LAMPORTS_PER_SOL, 'SOL')

  if (balance < 0.1 * LAMPORTS_PER_SOL) {
    console.log('\n⚠️  Low balance! Requesting airdrop...')
    try {
      const signature = await connection.requestAirdrop(
        mintAuthority.publicKey,
        2 * LAMPORTS_PER_SOL
      )
      await connection.confirmTransaction(signature)
      console.log('✅ Airdrop successful!')
    } catch (error) {
      console.error('❌ Airdrop failed:', error.message)
      console.log('\n💡 Get devnet SOL from: https://faucet.solana.com/')
      console.log('   Paste this address:', mintAuthority.publicKey.toBase58())
      process.exit(1)
    }
  }

  // Create token mint
  console.log('\n🪙 Creating token mint...')
  const mint = await createMint(
    connection,
    mintAuthority,
    mintAuthority.publicKey, // mint authority
    mintAuthority.publicKey, // freeze authority
    9 // decimals (9 is standard for Solana tokens)
  )

  console.log('✅ Token Mint Created:', mint.toBase58())

  // Create token account for mint authority
  console.log('\n📦 Creating token account...')
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    mintAuthority,
    mint,
    mintAuthority.publicKey
  )

  console.log('✅ Token Account:', tokenAccount.address.toBase58())

  // Mint initial supply (optional)
  console.log('\n💎 Minting initial supply...')
  const initialSupply = 1000000 * Math.pow(10, 9) // 1 million tokens
  await mintTo(
    connection,
    mintAuthority,
    mint,
    tokenAccount.address,
    mintAuthority.publicKey,
    initialSupply
  )

  console.log('✅ Minted 1,000,000 $ECO tokens')

  // Save configuration
  const config = {
    network: 'devnet',
    mintAddress: mint.toBase58(),
    mintAuthority: mintAuthority.publicKey.toBase58(),
    tokenAccount: tokenAccount.address.toBase58(),
    decimals: 9,
  }

  const configPath = path.join(__dirname, 'token-config.json')
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

  console.log('\n✅ Configuration saved to:', configPath)
  console.log('\n📝 Add this to your .env.local file:')
  console.log('─'.repeat(80))
  console.log(`NEXT_PUBLIC_TOKEN_MINT=${mint.toBase58()}`)
  console.log(`MINT_AUTHORITY_SECRET_KEY=${JSON.stringify(Array.from(mintAuthority.secretKey))}`)
  console.log('─'.repeat(80))
  console.log('\n🎉 Token creation complete!')
  console.log('\n📋 Next steps:')
  console.log('   1. Copy the above lines to .env.local')
  console.log('   2. Restart your dev server: npm run dev')
  console.log('   3. Submit a recycling proof to test real token minting!')
}

createEcoToken().catch((error) => {
  console.error('\n❌ Error:', error.message)
  process.exit(1)
})
