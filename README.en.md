# Miku Space

Miku Space is a personal blog and portfolio built with the Next.js App Router. It combines content publishing, admin management, full-text search, SEO, social sharing, and theme switching in one place. The site uses a clean teal visual language and organizes information around posts, notes, works, interests, and music for both presentation and day-to-day maintenance.

Chinese version: [README.md](README.md)

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.6-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite_/_libSQL-3-003B57?logo=sqlite)

## Highlights

### Public Site

- The homepage combines a hero section, interest carousel, featured works, latest content, and a personal sidebar.
- Posts and notes have dedicated listing and detail pages with Markdown rendering, reading-time estimation, and social sharing.
- Works are shown as a responsive grid of cards that link directly to GitHub repositories.
- The search page supports tag filtering and full-text search with a shared content shell layout.
- The about page presents a short bio, tech stack, and contact links.
- Built-in theme switching supports light, dark, and system modes.
- SEO coverage includes Open Graph and Twitter Card metadata, canonical URLs, robots.txt, and sitemap.xml.
- The UI is responsive across desktop and mobile devices with motion and interaction feedback throughout.

### Content and Admin

- The admin area supports creating, editing, reordering, and deleting posts, notes, works, interests, and songs.
- Draft and published states make staged publishing easier.
- Image and audio uploads use local storage in development and switch to Vercel Blob in production.
- Drag sorting and featured flags help maintain the homepage and curated sections.
- Admin login uses a cookie-based auth flow protected with an HMAC signature.

### Engineering

- Prisma with the libSQL adapter powers the database layer, using local SQLite in development and Turso in production.
- Next.js standalone output keeps deployment flexible for Vercel or a Node.js server.
- File storage supports both local disk and Vercel Blob through environment-driven switching.
- ESLint, TypeScript, and Tailwind CSS 4 provide the project tooling stack.

## Tech Stack

- Framework: Next.js 16.2.6 with App Router and Turbopack
- UI: React 19, Tailwind CSS 4, Framer Motion, Lucide React
- Content: React Markdown with remark-gfm
- Database: SQLite in development, Turso libSQL in production
- ORM: Prisma 7.8.0 with @prisma/adapter-libsql
- Storage: Local disk in development, Vercel Blob in production
- Types: TypeScript 5 and Zod validation

## Quick Start

### Requirements

- Node.js 20+
- npm or another package manager

### Install and Run

```bash
git clone https://github.com/ZSylph/miku-space.git
cd zsxy

npm install

cp .env.example .env
# Fill in database and admin credentials as needed

npx prisma migrate dev
npm run db:seed

npm run dev
```

After startup:

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

## Environment Variables

Create a `.env` file in the project root and configure the following groups.

### Database

| Variable              | Required               | Description                                                                                         |
| --------------------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`        | Yes                    | Development: `file:./dev.db`; production: a Turso connection string such as `libsql://xxx.turso.io` |
| `DATABASE_AUTH_TOKEN` | Required in production | Turso auth token created with `turso db tokens create <name>`                                       |

### Site

| Variable   | Required | Description                                                                             |
| ---------- | -------- | --------------------------------------------------------------------------------------- |
| `SITE_URL` | No       | Public site URL used for RSS, sitemap, and OG tags. Defaults to `http://localhost:3000` |

### Admin

| Variable              | Required | Description                                                |
| --------------------- | -------- | ---------------------------------------------------------- |
| `ADMIN_USERNAME`      | Yes      | Admin login username                                       |
| `ADMIN_PASSWORD_HASH` | Yes      | Password scrypt hash                                       |
| `ADMIN_SECRET`        | Yes      | HMAC signing key for session cookies, ideally 64 hex chars |

### Vercel Blob

| Variable                | Required               | Description                                                        |
| ----------------------- | ---------------------- | ------------------------------------------------------------------ |
| `BLOB_READ_WRITE_TOKEN` | Required in production | Vercel Blob read/write token, automatically provisioned via Storage |

> Local development does not require Blob variables. Files are saved to `public/uploads/` automatically.

## Common Scripts

| Command                  | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `npm run dev`            | Start the development server                       |
| `npm run build`          | Build the production bundle                        |
| `npm run start`          | Start the production server                        |
| `npm run lint`           | Run ESLint                                         |
| `npm run db:seed`        | Seed the database                                  |
| `npx prisma migrate dev` | Run database migrations in development             |
| `npx prisma db push`     | Push the schema to a remote database in production |

## Directory Overview

```text
app/
  (site)/              Public pages
    page.tsx           Home page
    posts/             Posts list and detail pages
    notes/             Notes list and detail pages
    works/             Works showcase
    about/             About page
    search/            Search page
  (admin)/             Admin area
    admin/             Dashboard and CRUD pages
  admin/               Login page
  api/                 API routes for auth, CRUD, and uploads
  robots.ts            robots.txt generation
  sitemap.ts           sitemap.xml generation
components/
  blocks/              Homepage and page sections
  layout/              Navigation, sidebar, and footer components
  site/                Public detail, card, and sharing components
  admin/               Admin forms, tables, and upload components
  pages/               Page-level client components
lib/
  prisma.ts            Prisma client singleton
  auth.ts              Password hashing and verification
  admin-auth.ts        Admin session signing and verification
  blob.ts              Vercel Blob client and helpers
  file-cleanup.ts      Upload cleanup for local and Blob storage
  site-config.ts       Global site configuration
  validation.ts        Zod validation rules
  api-utils.ts         API response helpers
prisma/
  schema.prisma        Data model definitions
  migrations/          Database migrations
  seed.ts              Seed data
public/
  uploads/             Local upload directory
```

## Deployment

The recommended stack is: Vercel + Turso + Vercel Blob.

### 1. Create a Turso Database

```bash
# Install the Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Sign in and create a database
turso auth signup
turso db create miku-space

# Get connection details
turso db show miku-space --url
turso db tokens create miku-space
```

### 2. Migrate Local Data to Turso

```bash
# Export local SQLite data
sqlite3 dev.db .dump > dump.sql

# Import into Turso
turso db shell miku-space < dump.sql
```

### 3. Enable Vercel Blob

1. Go to your Vercel project Settings → Storage
2. Click Create Database and select the Blob type
3. Once created, `BLOB_READ_WRITE_TOKEN` is automatically injected into your environment variables

### 4. Deploy to Vercel

```bash
# Install the Vercel CLI
npm i -g vercel

# Deploy from the project root
vercel
```

Configure these values in Vercel project settings under Environment Variables:

```text
DATABASE_URL=libsql://xxx.turso.io
DATABASE_AUTH_TOKEN=eyJ...
ADMIN_SECRET=your-random-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your-scrypt-hash
SITE_URL=https://your-domain.com
```

### 5. Push the Schema to Production

```bash
DATABASE_URL="libsql://xxx.turso.io" \
DATABASE_AUTH_TOKEN="eyJ..." \
npx prisma db push
```

### 6. Bind a Domain

Add your custom domain in Vercel project settings and follow the DNS instructions.

## Security Notes

- `.env` and all `.env.*` files except `.env.example` are ignored by Git.
- `*.db` database files and the `/public/uploads` directory are also ignored.
- Admin passwords are stored with Node.js native `scrypt`, and session cookies are signed with HMAC-SHA256.
- Double-check your `.env` file before pushing to GitHub to avoid leaking secrets.

## License

[MIT](LICENSE)
