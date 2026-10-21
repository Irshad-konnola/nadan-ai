# Nadan AI — നാടൻ കലോറി 🍃

An AI-powered, culturally attuned nutrition and calorie tracker built specifically for Kerala and South Indian diets. Speak or type naturally in **Malayalam**, **Manglish**, or **English** (e.g., *"Randu porotta + beef roast kazhichu"* or *"2 idli sambar coconut chutney"*), and Nadan AI estimates calories and macros while maintaining your daily log and streaks.

---

## ✨ Features

- **🗣️ Multilingual & Manglish Comprehension**: Understands Malayalam script, phonetic Manglish, and standard English.
- **🍛 Kerala Diet Specialization**: Estimates nutritional values for traditional Kerala meals (Porotta, Appam, Kanji, Biriyani, Thoran, etc.).
- **⚡ AI Nutrition Agent**: Powered by Google Gemini 2.5 Flash through the Vercel AI SDK with function-calling capabilities.
- **📊 Real-time Database Sync**: Powered by Neon Serverless PostgreSQL and Drizzle ORM.
- **🎭 Dynamic AI Vibe & Mood**: Adapts coaching personality (from "Hype Man" to "Strict Coach") depending on daily intake targets.
- **🌓 Native Dark / Light Mode**: Seamless theme switching with system preference detection and smooth OKLCH color palettes.
- **📱 Mobile-First Responsive UI**: Styled with modern Tailwind CSS v4, custom micro-interactions, and quick-prompt suggestion chips.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Frontend** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **AI Engine** | [Vercel AI SDK](https://sdk.vercel.ai/) (`ai`, `@ai-sdk/google`) |
| **LLM Model** | Google Gemini 2.5 Flash |
| **Database & ORM** | [Neon Serverless PostgreSQL](https://neon.tech/), [Drizzle ORM](https://orm.drizzle.team/) |
| **Type Safety & Validation** | [TypeScript 5](https://www.typescriptlang.org/), [Zod](https://zod.dev/) |

---

## 📁 Project Structure

```text
nadan-ai/
├── src/
│   ├── actions/
│   │   └── dbActions.ts        # Server actions for database operations & food logging
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts    # Streaming AI chat endpoint with tool execution
│   │   ├── globals.css         # OKLCH design system, theme variables & animations
│   │   ├── icon.svg            # SVG application favicon & tab brand icon
│   │   ├── layout.tsx          # Root layout with fonts (Syne & DM Sans)
│   │   └── page.tsx            # Main chat interface & interactive state
│   ├── db/
│   │   ├── index.ts            # Neon client & Drizzle database instance
│   │   └── schema.ts           # Drizzle schema (users, daily_logs, food_entries)
│   └── lib/
│       └── utils.ts            # Reusable utility functions (cn helper)
├── public/                     # Public static assets
├── drizzle.config.ts           # Drizzle Kit configuration
├── components.json             # Shadcn UI configuration
├── eslint.config.mjs           # ESLint configuration
├── tsconfig.json               # TypeScript configuration with @/* path alias
├── package.json                # Dependencies and project scripts
├── .env.example                # Example environment variable template
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.18.0 or newer
- **Neon Database**: A free serverless PostgreSQL database at [neon.tech](https://neon.tech)
- **Google AI API Key**: An API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/nadan-ai.git
cd nadan-ai
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Open `.env.local` and add your credentials:

```env
# Neon PostgreSQL Connection String
DATABASE_URL="postgresql://user:password@endpoint-pooler.region.aws.neon.tech/neondb?sslmode=require"

# Google Gemini API Key
GOOGLE_GENERATIVE_AI_API_KEY="AIzaSy..."
```

### 3. Initialize the Database

Push the schema to your Neon PostgreSQL instance:

```bash
npm run db:push
```

You can view and manage your data with Drizzle Studio:

```bash
npm run db:studio
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Compiles an optimized production build |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint across the codebase |
| `npm run db:push` | Pushes the Drizzle schema directly to the database |
| `npm run db:generate` | Generates SQL migration files |
| `npm run db:migrate` | Applies pending migrations to the database |
| `npm run db:studio` | Launches Drizzle Studio in the browser to view tables |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).