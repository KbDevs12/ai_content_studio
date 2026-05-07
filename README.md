# 🎨 AI Content Studio

Website generator konten berbasis AI menggunakan Next.js 15 + Claude API.

## ✦ Fitur

- **6 tipe konten**: Blog Post, Social Media, Email, Product Description, Brainstorm, Press Release
- **6 pilihan tone**: Formal, Casual, Persuasive, Humorous, Inspirational, Technical
- **Real-time streaming output** — teks muncul karakter demi karakter
- **History lokal** — riwayat 20 generate terakhir tersimpan di browser
- **Preview & Raw mode** — lihat markdown yang terformat atau raw text
- **Copy & Download** — salin ke clipboard atau download sebagai `.md`
- **2 bahasa** — English & Bahasa Indonesia

## 🚀 Setup & Menjalankan

### 1. Clone & Install

```bash
git clone <repo-url>
cd ai-content-studio
npm install
```

### 2. Dapatkan API Key (GRATIS)

1. Buka https://aistudio.google.com/app/apikey
2. Login dengan akun Google
3. Klik **"Create API Key"** — selesai, gratis!

### 3. Setup Environment

```bash
cp .env.example .env.local
# Edit .env.local, isi ANTHROPIC_API_KEY dengan key kamu
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka http://localhost:3000

## 🌐 Deploy ke Vercel (GRATIS)

1. Push kode ke GitHub
2. Buka https://vercel.com, login dengan GitHub
3. Import repository
4. Di bagian **Environment Variables**, tambahkan:
   - Key: `GEMINI_API_KEY`
   - Value: API key kamu
5. Deploy!

## 🗂 Struktur Project

```
ai-content-studio/
├── app/
│   ├── api/generate/route.ts   # API endpoint streaming
│   ├── globals.css             # Styles & animasi
│   ├── layout.tsx              # Root layout + fonts
│   └── page.tsx                # Main page
├── components/
│   ├── Header.tsx              # Navigation header
│   ├── ContentForm.tsx         # Form input
│   ├── OutputPanel.tsx         # Panel output + markdown
│   └── HistoryPanel.tsx        # Riwayat generate
├── types/
│   └── index.ts                # TypeScript types
└── .env.example                # Template environment
```

## 🛠 Tech Stack

| Tech              | Kegunaan                                |
| ----------------- | --------------------------------------- |
| Next.js 15        | Framework React dengan App Router       |
| Google Gemini SDK | Koneksi ke Gemini 2.0 Flash AI (gratis) |
| Tailwind CSS      | Styling utility-first                   |
| react-markdown    | Render output markdown                  |

## 📝 Catatan

- **Gemini API key** didapat gratis di Google AI Studio, tidak perlu kartu kredit
- History tersimpan di **localStorage** browser (tidak ke server)
- Streaming menggunakan **Server-Sent Events** via Next.js Route Handler
- Model yang dipakai: **gemini-2.0-flash** — cepat dan gratis
