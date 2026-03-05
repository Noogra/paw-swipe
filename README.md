# 🐾 PawSwipe

A Tinder-style pet adoption app — swipe through adoptable animals from shelters near you and find your perfect companion.

Built with Next.js 16 App Router, Supabase auth, Prisma + PostgreSQL, and Framer Motion. Features a high-end UI with Glassmorphism, Bento Grid layouts, and Playfair Display serif typography.

---

## Features

- **Swipe to discover** — drag cards left to pass, right to like, backed by spring physics
- **Shelter profiles** — browse partner shelters and their available pets
- **Liked pets** — saved matches with direct shelter contact details (phone, email, website)
- **Filters** — narrow by pet type, size, gender, and city
- **Dual roles** — separate flows for adopters and shelter managers
- **Shelter dashboard** — upload and manage pet listings with Cloudinary image hosting
- **Auth** — email/password sign-up and login via Supabase, with remember me

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, RSC) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion v12 |
| Auth | Supabase Auth |
| Database | PostgreSQL via Prisma ORM |
| Image hosting | Cloudinary (next-cloudinary) |
| Fonts | Geist Sans, Geist Mono, Playfair Display |

## UI Design

- **Glassmorphism** — frosted glass cards with `backdrop-filter` blur over amber gradient sections
- **Liquid Glass** — amber-tinted glass surfaces on interactive elements
- **Bento Grids** — asymmetric 12-column CSS Grid layouts on the landing page and secondary pages
- **Typography** — oversized Playfair Display serif headings mixed with Geist Mono labels
- **Micro-interactions** — scroll-triggered reveals, stagger animations, page transitions, hover effects

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Supabase project
- Cloudinary account

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

### Install & Run

```bash
npm install

# Push schema and seed the database
npx prisma db push
npx prisma db seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
├── (adopter)/        # Swipe feed, liked pets
├── (auth)/           # Login, register
├── (shelter)/        # Shelter dashboard
├── shelters/[id]/    # Public shelter profiles
├── profile/          # User profile
└── api/pets/         # Infinite scroll API route

components/
├── landing/          # Hero and features sections
├── swipe/            # SwipeCard, ActionButtons, FilterPanel
├── shelters/         # ShelterCard, ShelterPetCard
├── pets/             # LikedPetCard
└── ui/               # Navbar, BottomNav, AnimatedSection, PageTransition
```

## License

MIT
