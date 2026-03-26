# INTERCESSOR

INTERCESSOR is a Next.js App Router project with:

- Public pages for content and church discovery
- Admin CMS area protected by NextAuth
- Prisma ORM for database access
- Contact and Google Maps-backed geocode/places APIs

## Local Development

1. Install dependencies.

```bash
npm install
```

2. Copy environment variables.

```bash
cp .env.example .env.local
```

3. Set `DATABASE_URL` in `.env.local` to a PostgreSQL connection string.

4. Push Prisma schema to your local database.

```bash
npm run prisma:push
```

5. Start development server.

```bash
npm run dev
```

## Production Build

```bash
npm run build
npm run start
```

Build automatically runs:

- `prisma generate`
- `next build`

## Vercel Deployment Readiness

This project is configured for Vercel serverless deployment with a managed PostgreSQL database.

### Required Vercel Environment Variables

Set these in both Preview and Production where applicable:

- `DATABASE_URL` (required): managed PostgreSQL connection string
- `NEXTAUTH_SECRET` (required): long random secret
- `NEXTAUTH_URL` (required in production): app URL, for example `https://intercessor.uk`
- `SMTP_HOST` (required)
- `SMTP_PORT` (required)
- `SMTP_SECURE` (required)
- `SMTP_USER` (required)
- `SMTP_PASS` (required)
- `SMTP_FROM_EMAIL` (required)
- `CONTACT_EMAIL_TO` (optional): recipient for contact form submissions (defaults to `contact@intercessor.uk`)
- `GOOGLE_MAPS_SERVER_API_KEY` (required): server-side key for Geocoding and Places APIs
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (required): browser key for Maps JavaScript API only
- `NEXT_PUBLIC_APP_URL` (recommended): canonical app URL used for sitemap and origin checks

### First Deployment Checklist

1. Provision managed PostgreSQL (Neon, Supabase, Vercel Postgres, or equivalent).
2. Set all required environment variables in Vercel Project Settings.
3. Run Prisma migrations against the target database:

```bash
npm run prisma:migrate:deploy
```

4. Ensure Google server key has Geocoding API + Places API enabled.
5. Ensure Google browser key is restricted to your allowed domains and Maps JavaScript API.
6. Deploy to Preview and validate:
	- Admin login
	- Contact form send
	- Belong geocode + nearby search
7. Promote to Production after Preview validation.

### Notes

- API routes for auth/contact/geocode/places are pinned to Node runtime (`runtime = "nodejs"`).
- In-memory rate limiting is suitable for single-instance development only. Use Redis-backed limiting for production-scale traffic.

## Prisma Commands

- Generate client: `npm run prisma:generate`
- Push schema: `npm run prisma:push`
- Apply migrations in deployment environments: `npm run prisma:migrate:deploy`
- Open studio: `npm run prisma:studio`
