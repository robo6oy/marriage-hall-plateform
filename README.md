# The Grand Pavilion — Marriage Hall & Wedding Event Venue

A complete, runnable website for a marriage hall / wedding venue.
**All business details in this repository are demo content only** — replace
them with the real venue's details before launch. No awards, ratings,
history or experience claims are made here.

## What is included

Public site (HashRouter, so it works on GitHub Pages with no server routing):

- Home — hero, featured halls, packages preview, gallery preview, visit info
- Halls — filter by type/category/event, sort, and individual hall pages
- Packages & Services — wedding, reception and engagement packages, plus services
- Gallery — filterable, with a keyboard-friendly lightbox (Esc to close)
- About, searchable FAQs, Contact, Enquiry, Availability checker
- Privacy Policy, Terms, and a custom 404 page

Admin panel (`#/admin` — deliberately **not** linked from the public navigation):

- First visit: set a passcode. Afterwards, log in with that passcode.
- Overview, enquiries (9 statuses, private notes, follow-up dates, CSV export)
- Halls, packages, services, gallery, FAQs, availability and business settings editors
- Public pages and admin share the same data source (`src/store.js`)

Enquiries are **not** confirmed bookings. An enquiry only creates a reference
number (for example `GP-2026-0001`); the venue confirms availability separately.

Availability checker: a date with no published record is reported as
**not configured**, never as available.

## Run it locally

```bash
npm install
npm run dev
```

Then open the local address Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

The `dist/` output is static and can be hosted on GitHub Pages, Netlify,
Vercel, or any static host.

## Deploy to GitHub Pages

This project uses `HashRouter` and `base: '/marriage-hall-plateform/'` in
`vite.config.js`, so the built site works under
`https://<your-username>.github.io/marriage-hall-plateform/`.

If you rename the repository, update `base` in `vite.config.js` to match
(`/your-repo-name/`), rebuild, and redeploy.

## Data and persistence in this code version

- Demo data lives in `src/data.js` and is seeded into the browser's
  `localStorage` on first load via `src/store.js`.
- Admin edits and enquiries created in this code version are stored in
  `localStorage` in the visitor's own browser. They are **not** shared across
  devices and are **not** the Muse app's server database.
- For a production, multi-device admin, connect a backend such as Supabase:
  replace the `localStorage` calls in `src/store.js` with Supabase tables
  (`business_settings`, `halls`, `packages`, `services`, `gallery`,
  `faqs`, `enquiries`, `availability`), enable Row Level Security so only
  authenticated admins can write, and use Supabase Auth instead of the
  local passcode in `src/admin.jsx`. The passcode here is a demo convenience
  only and must not be treated as production authentication.

## Replace demo content

- Business details: `src/data.js` → `SETTINGS`, or Admin → Settings
- Halls / packages / services / gallery / FAQs: `src/data.js`, or the
  matching Admin editors
- Photos: the demo photo URLs in `src/data.js` are Unsplash URLs. Replace
  `image` values with your own hosted photos.
