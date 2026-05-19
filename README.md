# 🌿 EcoProof

A blockchain-powered platform that rewards users for recycling plastic waste. Submit proof of recycling, get AI validation, and earn $ECO tokens on Solana.

## Features

- 🤖 **AI-Powered Detection** - Gemini Vision API validates plastic waste with expert-level accuracy
- 🪙 **Real Token Rewards** - Earn SPL tokens on Solana blockchain
- 🏅 **Tier System** - Purchase badges to multiply your rewards (1.5x - 3.5x)
- 👛 **Wallet Integration** - Seamless Phantom wallet connection
- 📊 **Analytics Dashboard** - Track your impact, streak, and CO₂ savings
- 🎨 **Cinematic UI** - Modern design with video backgrounds and smooth animations

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Phantom wallet browser extension
- Solana devnet SOL (for testing)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd EcoProof

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with the following:

```env
# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_TOKEN_MINT=your_token_mint_address

# Mint Authority (Server-side only)
MINT_AUTHORITY_SECRET_KEY=[your_secret_key_array]

# AI Detection
NEXT_PUBLIC_GOOGLE_VISION_API_KEY=your_gemini_api_key
```

## Token Setup

Create your SPL token on Solana:

```bash
npm run create-token
```

This will generate a token mint and provide the configuration for your `.env.local` file.

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion

**Blockchain:**
- Solana Web3.js
- SPL Token
- Wallet Adapter (Phantom)

**AI/ML:**
- Google Gemini Vision API
- Custom plastic detection prompt

**Backend:**
- Next.js API Routes
- Server-side token minting

## Architecture

```
┌─────────────┐
│   Browser   │
│  (Next.js)  │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌─────────────┐ ┌──────────────┐
│   Gemini    │ │   Solana     │
│  Vision API │ │  Blockchain  │
└─────────────┘ └──────────────┘
```

## Security

- File validation (type, size)
- Duplicate image detection (perceptual hashing)
- Rate limiting (cooldown system)
- Server-side token minting
- Input sanitization
- Wallet signature verification

## Badge System

Purchase tier badges to multiply your rewards:

| Badge | Cost | Multiplier |
|-------|------|------------|
| 🥉 Bronze | 50 $ECO | 1.5x |
| 🥈 Silver | 150 $ECO | 2.0x |
| 🥇 Gold | 300 $ECO | 2.5x |
| 💎 Platinum | 500 $ECO | 3.0x |
| 💠 Diamond | 1000 $ECO | 3.5x |

## Project Structure

```
EcoProof/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── mint/         # Token minting endpoint
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/            # React components
│   ├── DashboardScreen.tsx
│   ├── HeroSection.tsx
│   ├── MarketplaceTab.tsx
│   └── ...
├── utils/                 # Utility functions
│   ├── badgeSystem.ts    # Badge management
│   ├── googleVision.ts   # AI detection
│   ├── mintToken.ts      # Token minting
│   └── validateImage.ts  # Image validation
└── scripts/              # Setup scripts
    └── create-token.js   # Token creation
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review the code comments

## Acknowledgments

- Solana Foundation
- Google Gemini AI
- Open source community

---

Built with 💚 for a sustainable future
