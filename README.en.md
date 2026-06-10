# Miku Space

Miku Space is a personal blog and portfolio built with the Next.js App Router. It combines content publishing, admin management, full-text search, SEO, social sharing, and theme switching in one place. The site uses a clean teal visual language and organizes information around posts, notes, works, interests, and music for both presentation and day-to-day maintenance.

README：
**[简体中文](README.md)** | **[English](README.en.md)**

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.6-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite_/_D1-3-003B57?logo=sqlite)

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
- Image and audio uploads use local storage in development and switch to Cloudflare R2 in production.
- Drag sorting and featured flags help maintain the homepage and curated sections.
- Admin login uses a cookie-based auth flow protected with an HMAC signature.

### Engineering

- Prisma powers the database layer, using local SQLite in development and Cloudflare D1 via the D1 adapter in production.
- The @opennextjs/cloudflare adapter enables deployment to Cloudflare Workers at the edge.
- File storage supports both local disk and Cloudflare R2 through environment-driven switching.
- ESLint, TypeScript, and Tailwind CSS 4 provide the project tooling stack.

## Tech Stack

- Framework: Next.js 16.2.6 with App Router and Turbopack
- UI: React 19, Tailwind CSS 4, Framer Motion, Lucide React
- Content: React Markdown with remark-gfm
- Database: SQLite in development, Cloudflare D1 in production
- ORM: Prisma 7.8.0 with @prisma/adapter-d1
- Storage: Local disk in development, Cloudflare R2 in production
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

### Database (local development only)

| Variable       | Required | Description                                                                          |
| -------------- | -------- | ------------------------------------------------------------------------------------ |
| `DATABASE_URL` | Yes      | Development: `file:./dev.db`. Production uses a D1 binding and does not need this.  |

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

### Cloudflare R2

| Variable               | Required               | Description                                |
| ---------------------- | ---------------------- | ------------------------------------------ |
| `R2_ENDPOINT`          | Required in production | R2 S3-compatible API endpoint              |
| `R2_ACCESS_KEY_ID`     | Required in production | R2 API Access Key ID                       |
| `R2_SECRET_ACCESS_KEY` | Required in production | R2 API Secret Access Key                   |
| `R2_BUCKET_NAME`       | No                     | Bucket name, defaults to `miku-uploads`    |
| `R2_PUBLIC_URL`        | Required in production | Public access URL for the R2 bucket        |

> Production credentials are configured via `wrangler.jsonc` bindings and `wrangler secret put`. Local development saves files to `public/uploads/` automatically.

## Common Scripts

| Command                          | Description                                              |
| -------------------------------- | -------------------------------------------------------- |
| `npm run dev`                    | Start the local development server                       |
| `npm run build`                  | Build Cloudflare Workers-compatible output               |
| `npm run deploy`                 | Build and deploy to Cloudflare                           |
| `npm run preview`                | Preview locally with wrangler dev                        |
| `npm run lint`                   | Run ESLint                                               |
| `npm run db:seed`                | Seed the database                                        |
| `npx prisma migrate dev`         | Run database migrations in development                   |
| `wrangler d1 migrations apply`   | Push migrations to D1 database in production             |

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
  prisma.ts            Prisma client (D1 adapter / local dual mode)
  auth.ts              Password hashing and verification
  admin-auth.ts        Admin session signing and verification
  r2.ts                Cloudflare R2 S3 client and helpers
  file-cleanup.ts      Upload cleanup for local and R2 storage
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

The recommended stack is: Cloudflare Pages + Cloudflare D1 + Cloudflare R2.

### 1. Create a Cloudflare D1 Database

```bash
# Install the Wrangler CLI (if not already installed)
npm install -g wrangler

# Log in to Cloudflare
wrangler login

# Create a D1 database
wrangler d1 create miku-space
```

Copy the returned `database_id` into `wrangler.jsonc`.

### 2. Migrate Local Data to D1

```bash
# Export local SQLite data
sqlite3 dev.db .dump > dump.sql

# Import into D1
wrangler d1 execute miku-space --remote --file=dump.sql
```

### 3. Create a Cloudflare R2 Bucket

```bash
# Create an R2 bucket
wrangler r2 bucket create miku-uploads
```

Then retrieve the API token and endpoint from Cloudflare Dashboard → R2, and set secrets via `wrangler secret put`.

### 4. Deploy to Cloudflare Pages

```bash
# Build and deploy
npm run deploy
```

Set sensitive variables with `wrangler secret put`:

```bash
wrangler secret put ADMIN_SECRET
wrangler secret put ADMIN_PASSWORD_HASH
wrangler secret put R2_ACCESS_KEY_ID
wrangler secret put R2_SECRET_ACCESS_KEY
```

### 5. Push the Schema to D1

```bash
# Generate migration SQL
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > init.sql

# Apply to remote D1
wrangler d1 execute miku-space --remote --file=init.sql
```

### 6. Bind a Domain

In Cloudflare Dashboard → Pages → your project, add a custom domain. Cloudflare will automatically configure DNS and SSL.

## Security Notes

- `.env` and all `.env.*` files except `.env.example` are ignored by Git.
- `*.db` database files and the `/public/uploads` directory are also ignored.
- Admin passwords are stored with Node.js native `scrypt`, and session cookies are signed with HMAC-SHA256.
- Double-check your `.env` file before pushing to GitHub to avoid leaking secrets.

## License

[MIT](LICENSE)
