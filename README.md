# ♻️ Trash to Token

A blockchain-based recycling incentive platform built on Solana. Students earn $TRASH tokens by submitting proof of recycling.

## Features

- 📸 Photo submission with AI validation (demo mode)
- 🪙 SPL token rewards ($TRASH)
- 👛 Solana wallet integration (Phantom)
- 🏆 Leaderboard system
- 📊 Personal recycling history
- 🎨 Animated WebGL background

## Quick Start

1. Install dependencies:
```bash
cd trash-to-token
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open http://localhost:3000

4. Connect Phantom wallet (Devnet)

## Demo Mode

This hackathon MVP includes:
- ✅ Mock AI validation (70% success rate)
- ✅ Mock token minting (stored locally)
- ✅ Full UI/UX flow
- ✅ Security validations (file type, size limits)

## Production Deployment

For production, implement:

1. **Deploy SPL Token**
   - Use Anchor framework
   - Deploy to Solana mainnet
   - Add mint address to `.env.local`

2. **Backend API**
   - Create `/api/mint` endpoint with mint authority
   - Implement rate limiting
   - Add authentication

3. **AI Validation**
   - Replace mock validator in `utils/validateImage.ts`
   - Options: Google Vision, AWS Rekognition, Azure Computer Vision
   - Add API key to environment variables

4. **Security**
   - Enable CSRF protection
   - Add request signing
   - Implement fraud detection

## Tech Stack

- Next.js 14 + TypeScript
- Solana Web3.js + Wallet Adapter
- Framer Motion (animations)
- TailwindCSS
- OGL (WebGL shader background)

## Security Features

- File type validation
- File size limits (10MB max)
- Input sanitization
- LocalStorage limits (100 records max)
- Wallet address validation
