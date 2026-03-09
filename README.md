# Destates Frontend

Modern real estate investment platform UI built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+
- Backend API running (see `../backend/README.md`)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Create `.env.local`:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   App runs at `http://localhost:3000`.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, stats, featured properties, benefits, testimonials |
| `/investments` | All investment properties listing |
| `/investments/[id]` | Property detail with ROI calculator and add-to-cart |
| `/plots` | Land plots listing |
| `/plots/[id]` | Plot detail with area calculator and add-to-cart |
| `/pgs` | PG accommodation listings |
| `/pgs/[id]` | PG detail with amenities and contact info |
| `/about` | About page with team, timeline, mission/vision |
| `/contact` | Contact form and company info |
| `/how-it-works` | Step-by-step guide with FAQ |
| `/cart` | Shopping cart with order summary |

### Admin Pages (requires ADMIN role)

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard with entity counts |
| `/admin/properties` | Property CRUD with image upload |
| `/admin/plots` | Plot CRUD with image upload |
| `/admin/pgs` | PG listing CRUD with image upload |
| `/admin/testimonials` | Testimonial CRUD with avatar upload |
| `/admin/users` | Users list (read-only) |
| `/admin/inquiries` | Contact inquiries with expandable messages |

Admin credentials (from seed): `admin@destates.in` / `admin123`

## Project Structure

```
frontend/
├── public/
│   ├── logo.png
│   └── logo-alt.jpeg
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (navbar, footer, providers)
│   │   ├── page.tsx            # Home page
│   │   ├── providers.tsx       # Auth + Cart context providers
│   │   ├── globals.css         # Theme variables + Tailwind config
│   │   ├── investments/
│   │   │   ├── page.tsx        # Properties listing
│   │   │   └── [id]/page.tsx   # Property detail
│   │   ├── plots/
│   │   │   ├── page.tsx        # Plots listing
│   │   │   └── [id]/page.tsx   # Plot detail
│   │   ├── pgs/
│   │   │   ├── page.tsx        # PG listings
│   │   │   └── [id]/page.tsx   # PG detail
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── how-it-works/page.tsx
│   │   ├── cart/page.tsx
│   │   └── admin/
│   │       ├── layout.tsx        # Sidebar layout + AdminGuard
│   │       ├── page.tsx          # Dashboard (stat cards)
│   │       ├── properties/       # Property CRUD
│   │       ├── plots/            # Plot CRUD
│   │       ├── pgs/              # PG CRUD
│   │       ├── testimonials/     # Testimonial CRUD
│   │       ├── users/            # Users list (read-only)
│   │       └── inquiries/        # Inquiries list (read-only)
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminGuard.tsx  # Auth + role check, redirects non-admins
│   │   │   └── ImageUploader.tsx # Reusable image upload with previews
│   │   ├── layout/
│   │   │   ├── Navbar.tsx      # Sticky navbar with glass effect
│   │   │   ├── Footer.tsx      # 4-column footer
│   │   │   └── LayoutShell.tsx # Conditional Navbar/Footer (hidden on /admin)
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── FeaturedProperties.tsx
│   │   │   ├── LandPlotsSection.tsx
│   │   │   ├── BenefitsSection.tsx
│   │   │   ├── InvestmentReturns.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   └── CTASection.tsx
│   │   ├── ui/
│   │   │   ├── AnimatedSection.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PlotCard.tsx
│   │   │   ├── PGCard.tsx
│   │   │   ├── TestimonialCard.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── SectionHeading.tsx
│   │   └── auth/
│   │       └── AuthModal.tsx   # Login/signup modal
│   ├── lib/
│   │   ├── api.ts              # API client (public + admin + upload)
│   │   ├── auth-context.tsx    # Auth state management
│   │   ├── cart-context.tsx    # Cart state management
│   │   └── utils.ts            # Helpers (cn, formatCurrency)
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── .env.local
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Theme

The app uses a warm gold/amber color scheme:

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#d4a84c` | Gold — buttons, links, accents |
| `secondary` | `#d48400` | Deep orange — gradients |
| `background` | `#fefbf8` | Warm off-white |
| `foreground` | `#12080b` | Near-black text |
| `muted` | `#f0eae4` | Light gray backgrounds |
| `border` | `#f1e6da` | Warm borders |

## Key Components

### ImageUploader
Reusable component for uploading images in admin forms.
- Supports single or multiple image uploads
- Shows thumbnail previews with hover-to-remove
- Uploads via `POST /api/upload/images` (FormData)
- Returns server paths like `/uploads/<filename>`

### AdminGuard
Wraps admin pages to enforce authentication and ADMIN role. Redirects unauthorized users to home.

### LayoutShell
Conditionally renders Navbar and Footer. Hides them on `/admin` routes where the admin sidebar layout is used instead.

## Deploy

Deploy on [Vercel](https://vercel.com) for the easiest setup with Next.js. Set the `NEXT_PUBLIC_API_URL` environment variable to your deployed backend URL.
