# Lonorix CR

Lonorix CR is a modern Next.js 14 application that helps Clash Royale players optimize their gameplay through AI-powered deck analysis and intelligent card planning.

## Features

🎯 **Card Planner**
- Analyze your card collection with real player data
- Get intelligent upgrade recommendations
- Track progress towards maximum card levels

🧠 **AI Deck Coach**  
- Expert deck analysis powered by GPT-4o-mini
- Identify win conditions, strengths, and weaknesses
- Receive strategic tips and gameplay recommendations

⚡ **Real-time Data**
- Direct integration with Supercell's official Clash Royale API
- Up-to-date player statistics and card information

🎨 **Beautiful Design**
- Clash Royale-inspired theme with blue and gold colors
- Dark/light mode support
- Fully responsive mobile-first design
- Smooth animations with Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Clash Royale API key from [Supercell Developer Portal](https://developer.clashroyale.com/)
- OpenAI API key from [OpenAI Platform](https://platform.openai.com/)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd clashroyale
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables file:
```bash
# Create .env.local file in the root directory
touch .env.local
```

4. Add your API keys to `.env.local`:
```env
# Clash Royale API Configuration
CLASH_API_KEY=your_clash_royale_api_key_here

# OpenAI API Configuration  
OPENAI_API_KEY=your_openai_api_key_here
```

**⚠️ Security Note:** Never commit your `.env.local` file to version control. It's already included in `.gitignore`.

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

### `/api/player/[tag]`
Fetches Clash Royale player data from Supercell's official API.

**Parameters:**
- `tag` - Player tag (with or without # prefix)

**Returns:** Complete player profile including cards, trophies, and statistics.

### `/api/deck-coach`
Provides AI-powered deck analysis using OpenAI's GPT-4o-mini model.

**Body:**
```json
{
  "deck": ["Hog Rider", "Fireball", "Musketeer", "Ice Spirit", "Cannon", "Log", "Skeletons", "Ice Golem"]
}
```

**Returns:** Structured analysis including win conditions, strengths, weaknesses, and strategic tips.

## Project Structure

```
app/
├── api/
│   ├── deck-coach/
│   └── player/[tag]/
├── card-planner/
├── deck-coach/
├── about/
├── globals.css
├── layout.tsx
└── page.tsx
components/
├── ui/
├── Footer.tsx
├── Navbar.tsx
└── ThemeProvider.tsx
```

## Technology Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **Theme:** next-themes for dark/light mode
- **API Integration:** Clash Royale API + OpenAI API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.