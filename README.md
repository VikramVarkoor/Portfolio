# Vikram Varkoor — Portfolio

Glassmorphism dark portfolio built with Next.js 15, TypeScript, and Tailwind CSS.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Click Deploy — that's it. Auto-deploys on every push.

## Customising

All content lives in one file: `src/app/data.ts`

- **Projects** — update titles, descriptions, tags, GitHub links, live URLs
- **Publications** — add/remove IEEE papers
- **Skills** — update categories and items
- **Experience** — update internship bullets

### Other things to update in `page.tsx`
- Replace `your@email.com` with your real email (2 places)
- Replace `linkedin.com/in/vikramvarkoor` with your actual LinkedIn URL
- Update the Lumen live URL once it's deployed

### Adding your CV
Drop your CV PDF into the `/public` folder as `Vikram_Varkoor_CV.pdf`
The "download cv" button will automatically serve it.

## Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Inter font (Google Fonts)
- Deployed on Vercel (free tier)
