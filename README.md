# UltronAI — deploy guide

This is a real Vite + React project. No Render, no server to babysit.

## What's in here

```
ultronai-website/
├── index.html          the page shell (loads Tailwind + fonts)
├── src/
│   ├── main.jsx         mounts the app
│   └── App.jsx           the whole product — landing page + dashboard + chat + Ultron Code/Predict/Shark
├── api/
│   └── chat.js           the ONLY backend piece — holds your Anthropic key safely, proxies chat requests
├── package.json
├── vite.config.js
└── .env.example          copy to .env.local for local testing
```

## Why there's a backend piece at all

Your Anthropic API key can never live in frontend code — anyone could open
their browser's dev tools and steal it. `api/chat.js` is a tiny serverless
function: the browser calls `/api/chat`, that function calls Anthropic with
your real key (which only exists on the server), and hands back the answer.
You don't manage a server — the hosting platform runs this function on
demand.

## Step 1 — test it locally (optional but recommended)

You'll need [Node.js](https://nodejs.org) installed (any recent LTS version).

```bash
cd ultronai-website
npm install
cp .env.example .env.local
```

Open `.env.local` and paste your real Anthropic key in place of the
placeholder. Then:

```bash
npm run dev
```

This starts the frontend, but **the local dev server won't run `/api/chat`
automatically** — that only runs once deployed to Vercel (or via `vercel dev`
if you install the Vercel CLI). For now, local testing shows you the UI; the
live chat calls will work once deployed. If you want full local testing
including the API route, install the Vercel CLI (`npm i -g vercel`) and run
`vercel dev` instead of `npm run dev`.

## Step 2 — push to GitHub

```bash
cd ultronai-website
git init
git add .
git commit -m "UltronAI"
```

Create a new empty repo on GitHub (no README/gitignore, since you already
have one), then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/ultronai.git
git branch -M main
git push -u origin main
```

## Step 3 — deploy on Vercel (replaces Render)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New > Project**, pick your `ultronai` repo.
3. Vercel auto-detects it's a Vite project — leave the defaults, don't
   change the build command.
4. Before clicking Deploy, open **Environment Variables** and add:
   - `ANTHROPIC_API_KEY` = your real key
5. Click **Deploy**.

That's it. You get a live URL immediately
(`ultronai-yourname.vercel.app`), and every future `git push` to `main`
auto-redeploys. No dashboards to babysit, no manual restarts.

If you'd rather skip GitHub entirely for the very first deploy: Vercel's
dashboard also lets you drag the unzipped `ultronai-website` folder straight
onto [vercel.com/new](https://vercel.com/new). GitHub is still worth setting
up afterward so future edits auto-deploy instead of manual re-uploads.

## Step 4 — custom domain (optional)

In the Vercel project, go to **Settings > Domains** and add your own domain
if you have one. Vercel handles the DNS/SSL for you.

## Setting up Stripe

Two new files handle this:

- `api/create-checkout-session.js` — the "Upgrade to Pro" buttons call this,
  it creates a Stripe Checkout session, and the browser redirects there.
  Stripe hosts the actual payment form — card numbers never touch your code.
- `api/webhook.js` — Stripe calls this directly (not the browser) when a
  payment actually succeeds, fails, or a subscription is cancelled. This is
  the only reliable way to know someone paid.

### Steps

1. In the [Stripe Dashboard](https://dashboard.stripe.com), go to
   **Product catalog > Add product**. Create a "Pro" product with a
   €12/month recurring price. Copy the **price ID** (starts with `price_`).
2. In Vercel, add these environment variables:
   - `STRIPE_SECRET_KEY` — from Stripe Dashboard > Developers > API keys
     (use the **secret** key, starts with `sk_live_` or `sk_test_` — test
     mode first, always)
   - `STRIPE_PRICE_ID_PRO` — the price ID from step 1
3. Redeploy so the new variables take effect.
4. Set up the webhook: Stripe Dashboard > Developers > Webhooks > **Add
   endpoint**. URL is `https://your-site.vercel.app/api/webhook`. Select
   events: `checkout.session.completed`, `customer.subscription.deleted`,
   `invoice.payment_failed`. Copy the **signing secret** (starts with
   `whsec_`) into Vercel as `STRIPE_WEBHOOK_SECRET`, then redeploy again.
5. Test in Stripe test mode first (test card `4242 4242 4242 4242`, any
   future date, any CVC) before switching to live keys.

### What this doesn't do yet

The webhook receives and verifies real Stripe events, but there's nowhere
to *store* "this user is now Pro" — that needs the database mentioned
below. Right now it just logs the event. The `TODO` comments in
`api/webhook.js` mark exactly where that logic goes once a database exists.

## About the mock data

Projects, Documents, Team, and Analytics all currently reset on every page
refresh — there's no database yet. Adding one (Postgres via
[Neon](https://neon.tech) or [Supabase](https://supabase.com) both work well
with Vercel and have generous free tiers) is the next real step after this
is live.
