# 🛒 বাজার দর (Bazar Dor)

A responsive Bangla market-price tracker built with **Next.js 14 (App Router)**, **Tailwind CSS + daisyUI**, **BetterAuth** and **react-hot-toast**. It shows today's prices of essential goods (rice, lentils, oil, vegetables, fish, meat, eggs & dairy, spices), the daily change, and per-bazar prices across divisions.

## ✨ Features

- **Navbar** – logo with Bangla date, category links (active link highlighted), sign in / sign up buttons (profile name + sign out when logged in).
- **Price ticker** – infinite marquee showing emoji, name, price per unit and ▲/▼ %.
- **Hero** – eyebrow text, heading, subtitle, CTA that smooth-scrolls to `#সব-পণ্য`, banner on the right (stacks on mobile).
- **Home sections** – top 6 risers (আজ দাম বেড়েছে ▲), top 6 fallers (আজ দাম কমেছে ▼), and all products (সব পণ্য) in a responsive 1 / 2 / 4 column grid.
- **Product card** – emoji, name, unit, today's price in Bengali digits, change badge (green ▲ / red ▼ / gray —০.০%). Click opens the detail page.
- **Sort dropdown (C1)** – সাজান: ডিফল্ট | দাম: কম থেকে বেশি | দাম: বেশি থেকে কম. Sorting is by numeric value (not string), so Bengali numerals work correctly.
- **Category page** (`/category/[slug]`) – title + icon, sort control, skeleton loading state, empty / invalid-slug 404 state with "হোম পেজে ফিরে যান".
- **Product detail page** (`/product/[slug]`) – **protected route**. Shows emoji, title, category and unit tags, change badge, min / max / average / today's price, yesterday / last week / last month, and a per-bazar table grouped by division.
- **Authentication** (`/signin`, `/signup`) – email + password, Google and GitHub social login via BetterAuth. Toasts for success, errors, validation, logout and protected-route redirects.
- **404 page** for any unknown route, with a button back to home.
- **Footer** – matches the Figma text.
- **Skeleton loaders** while data is being fetched.

## 🧱 Tech Stack

| Area | Tool |
|------|------|
| Framework | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, daisyUI, Hind Siliguri font |
| Auth | BetterAuth + MongoDB adapter |
| Notifications | react-hot-toast |
| Data | Bazardor JSON API (with fallback server) |

## 🔌 API

Data is fetched on the client from:

- Primary: `https://api.api-store.workers.dev/api/bazardor/products`
- Fallback: `https://api.abcz.workers.dev/api/bazardor/products`

Each product looks like:

```json
{
  "id": 1, "slug": "sorno-machi-chal", "nameBn": "স্বর্ণমাছি চাল",
  "category": "chal", "categoryNameBn": "চাল", "categoryIcon": "🍚",
  "unit": "kg", "image": "🍚",
  "today": 148, "yesterday": 145, "lastWeek": 142, "lastMonth": 138,
  "change": { "dir": "up", "pct": 2.1 },
  "markets": [{ "market": "কারওয়ান বাজার", "division": "ঢাকা", "min": 146, "max": 165 }]
}
```

All mapping lives in `normalize()` in `lib/api.ts`:

- `unit` → `kg` = প্রতি কেজি, `litre` = প্রতি লিটার, `dozen` = প্রতি ডজন, `piece` = প্রতি পিস
- `change.dir` + `change.pct` → signed percentage (up = +, down = −, flat = 0)
- Min / Max / Average are calculated from `markets` (min of mins, max of maxes, mean of market midpoints)

If the API shape changes, edit only `normalize()`.

## 📁 Project Structure

```
app/
  layout.tsx, page.tsx, not-found.tsx, globals.css
  category/[slug]/page.tsx
  product/[slug]/page.tsx        (protected)
  signin/page.tsx, signup/page.tsx
  api/auth/[...all]/route.ts     (BetterAuth handler)
components/
  Navbar.tsx (navbar + ticker), Footer.tsx, ProductCard.tsx,
  SortSelect.tsx, NotFoundView.tsx
lib/
  api.ts          (fetch, normalize, Bengali digit helpers, sorting)
  auth.ts         (BetterAuth server config)
  auth-client.ts  (BetterAuth client)
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- A MongoDB database (e.g. free MongoDB Atlas cluster)
- (Optional) Google and GitHub OAuth apps for social login

### 2. Install

```bash
npm install
```

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
BETTER_AUTH_SECRET=<long random string>
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

OAuth callback URLs:

- Google: `{APP_URL}/api/auth/callback/google`
- GitHub: `{APP_URL}/api/auth/callback/github`

### 4. Run

```bash
npm run dev      # development → http://localhost:3000
npm run build    # production build
npm start        # run production build
```

## ☁️ Deploying to Vercel

1. Push the project to GitHub and import it in Vercel.
2. Add all environment variables above. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your Vercel URL (e.g. `https://your-app.vercel.app`).
3. Update the Google / GitHub OAuth callback URLs to the Vercel domain.
4. Deploy. Dynamic routes (`/product/[slug]`, `/category/[slug]`) work on refresh; no extra rewrite config is needed.

## 🔐 Auth Flow

- **Sign up** → success toast → redirect to `/signin`. Errors show as toast.
- **Sign in** → success toast → redirect to `/`. Errors show as toast.
- **Social login** → Google / GitHub → redirect to `/`.
- **Protected route** → visiting `/product/[slug]` while logged out shows an error toast and redirects to `/signin`.
- **Sign out** → toast and redirect to `/`.
- Email verification and forgot-password are intentionally not implemented.

## 📱 Responsive Design

- Container: `max-w-6xl mx-auto px-4`
- Product grid: 1 column on mobile, 2 on small screens, 4 on large screens
- Navbar category links scroll horizontally on small screens; ticker stays usable
- Hero stacks vertically on mobile
- Buttons use `btn-sm sm:btn-md`

## ⚠️ Notes

- Prices are indicative; the footer states: "সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।"
- The hero banner is an emoji (🧺) placeholder; replace it with your Figma image.
- Styling follows the brief but is not pixel-matched to the Figma.

## 📄 License

For educational / assignment use.
