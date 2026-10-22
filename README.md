<div align="center">

# 🥗 Nadan AI — Multilingual Regional Food Calorie & Macro Tracker

**An AI-powered nutrition web application supporting English, Malayalam, and Manglish food queries using Fuse.js fuzzy search and the Google Gemini Flash API.**

[![Live Demo](https://img.shields.io/badge/Live_App-nadan--ai.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://nadan-ai.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini_Flash-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[**🚀 Try Live Demo (nadan-ai.vercel.app)**](https://nadan-ai.vercel.app/) • [Key Features](#key-features) • [How It Works](#hybrid-search--ai-architecture) • [Local Setup](#getting-started-local-development)

</div>

---

## 📸 Product Preview

<!-- Tip: Drag and drop 2 screenshots of Nadan AI directly into the GitHub README editor -->
| Multilingual Search (English, Malayalam & Manglish) | AI Nutritional & Macro Breakdown |
| :---: | :---: |
| <img width="640" height="855" alt="Screenshot 2026-10-22 094312" src="https://github.com/user-attachments/assets/7bd86aef-2610-47de-9d97-63a5e8265bfd" /> | <img width="643" height="851" alt="Screenshot 2026-10-22 094644" src="https://github.com/user-attachments/assets/3de87103-36af-41ca-9b5c-13ce0c13712e" /> |

---

## 💡 The Problem & Solution

Mainstream calorie-tracking applications are built around Western food databases and fail to recognize authentic South Indian and Kerala cuisine—or break when users type phonetic transliterations (*Manglish*) with varied spellings (e.g., *"puttu kadala"*, *"kuzhimanthi"*, *"pazham pori"*).

**Nadan AI** solves this with a **Hybrid Search + Generative AI Pipeline**:
1. **Zero-Latency Fuzzy Search (`Fuse.js`):** Queries first pass through an indexed local dataset configured with weighted fuzzy matching across English names, Malayalam script, and phonetic Manglish variations.
2. **LLM Fallback & Portion Analysis (`Google Gemini Flash API`):** For custom home-cooked combinations, unindexed dishes, or natural-language meal descriptions, Nadan AI queries the **Gemini Flash LLM** with structured JSON output enforcement to return accurate calorie, protein, carbohydrate, and fat estimates.

---

## ✨ Key Features

- **🗣️ Tri-Lingual Query Engine:** Seamlessly search dishes in **English**, **Malayalam script (മലയാളം)**, or **Manglish** phonetic spelling without worrying about exact typos.
- **🤖 Gemini Flash AI Nutritionist:** Instant macro-nutrient estimation (Calories, Protein, Carbs, Fats) for complex regional meals and custom portion sizes.
- **⚡ Sub-Millisecond Local Indexing:** Powered by `Fuse.js` threshold tuning to handle phonetic variations (e.g., matching *biriyani* / *biryani* or *chappathi* / *chapati* instantly).
- **📊 Daily Macro Dashboard:** Clean, mobile-first progress tracking for daily calorie goals and macro splits.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend & Routing** | Next.js, React, JavaScript, Tailwind CSS |
| **Search Engine** | Fuse.js (Client-side weighted fuzzy search across multilingual keys) |
| **AI / LLM Integration** | Google Gemini Flash API (Structured JSON nutritional parsing) |
| **Deployment** | Vercel |

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone [https://github.com/Irshad-konnola/nadan-ai.git](https://github.com/Irshad-konnola/nadan-ai.git)
cd nadan-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Add your Google Gemini API key:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 4. Start the development server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 📄 License
Distributed under the MIT License. Built by [Irshad Konnola](https://irshadkonnola.vercel.app/).
