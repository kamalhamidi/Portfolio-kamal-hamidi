# Portfolio Kamal

A modern portfolio and admin dashboard built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

It includes:
- a public portfolio homepage with sections for profile, experience, projects, certifications, skills, and contact
- an authenticated admin area for managing portfolio content
- Supabase-backed storage and database integration
- server-side data fetching with incremental static regeneration

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Supabase Auth, Database, and Storage
- Zod for validation
- React Hook Form
- Framer Motion
- Lucide React

## Features

### Public portfolio
- Hero, About, Experience, Projects, Certifications, Skills, Contact, and Footer sections
- Data loaded from Supabase
- Home page ISR with hourly revalidation

### Admin dashboard
- Supabase email/password login
- Protected `/admin` routes via middleware
- CRUD operations for:
  - profile
  - projects
  - experience
  - certifications
  - skills
- File uploads for assets and documents using Supabase Storage

## Project Structure

```text
app/
  admin/              Admin dashboard pages
  api/revalidate/     Manual revalidation endpoint
  page.tsx            Public portfolio homepage
components/
  admin/              Admin UI components
  portfolio/          Public-facing portfolio sections
lib/
  actions.ts          Server actions for CRUD and uploads
  queries.ts          Data fetching helpers
  supabase/           Client, server, and middleware helpers
types/
  index.ts            Shared application types
supabase-schema.sql   Database schema and RLS policies
seed.sql              Sample seed data
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Set up Supabase

1. Create a new Supabase project.
2. Open the SQL editor and run `supabase-schema.sql`.
3. Optionally run `seed.sql` to populate demo content.
4. In Supabase Storage, verify the public buckets exist:
   - `avatars`
   - `documents`

## Running the App

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm run start
```

## Available Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — run the production server
- `npm run lint` — run the Next.js linter

## Authentication

- Admin routes are protected by middleware.
- Unauthenticated users visiting `/admin` are redirected to `/admin/login`.
- Authenticated users visiting `/admin/login` are redirected to `/admin`.
- Login uses Supabase email/password authentication.

## Database Overview

The project uses the following tables:
- `profiles`
- `projects`
- `experience`
- `certifications`
- `skills`

Row Level Security is enabled, with:
- public read access for portfolio content
- authenticated write access for admin operations

## Storage

The app uploads files to Supabase Storage using public buckets:
- `avatars` for profile/media assets
- `documents` for CVs and related files

## Revalidation

The homepage exports `revalidate = 3600`, so portfolio content is refreshed every hour.

There is also a manual revalidation endpoint at `/api/revalidate` for triggering a homepage refresh.

## Notes

- `SUPABASE_SERVICE_ROLE_KEY` is required by the server-side service client.
- If Supabase environment variables are missing, middleware skips session checks.
- The sample seed data currently contains demo content that should be replaced with your own profile information.

## Deployment

This project is well suited for deployment on Vercel.

Before deploying, make sure:
- all Supabase environment variables are configured in your hosting provider
- the database schema has been applied
- storage buckets and policies are set up correctly

## Future Improvements

Potential next steps:
- add an `.env.example` file
- add automated tests for server actions and admin flows
- protect the revalidation endpoint with a secret
- add richer content editing for projects and profile sections
