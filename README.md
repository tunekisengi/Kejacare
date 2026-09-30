# KejaCare

KejaCare is a Next.js app for booking and tracking home services in Kenya. It uses Supabase for online fundi listings, job booking, and realtime job status updates.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set the Supabase URL and publishable key.
3. Run `npm run dev` and open http://localhost:3000.

Node.js 22 or newer is required by the installed Supabase client.

## Supabase setup

The Supabase project must have the `fundis`, `profiles`, and `jobs` tables configured with suitable Row Level Security policies. Enable Realtime for `jobs` if clients and fundis should see status changes live. The live app's `fundis` schema uses `service` and `rate`; `jobs` uses `service` and `amount`.

Only public Supabase URL and publishable/anon keys belong in `NEXT_PUBLIC_*` variables. Never add a service-role key to the browser app or commit `.env.local`.

## Deploy on Vercel

Import this repository into Vercel as a Next.js project. Vercel detects the framework and uses the package scripts (`npm run build`) automatically. Configure these environment variables in the Vercel project's **Settings → Environment Variables** for Production and Preview:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (legacy fallback; optional if the publishable key is set)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (optional; only needed when map API features are enabled)

After adding or changing environment values, redeploy so the build receives them. The current authentication screen uses a demo OTP and is not Supabase Auth.

Before pushing, validate locally with `npm run build`.
