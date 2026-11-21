# Look on the Bright✦Side

A good-news site that follows the moon.

Bright✦Side collects hopeful stories from independent newsrooms and YouTube creators: conservation wins, community projects, climate solutions, science that's going right. The site changes with the lunar cycle. The phase of the moon decides what the homepage says, which kind of good news is featured, what music plays, and on a few special nights, what colour the whole site is.

The idea is simple: give people a reason to come back once a month, look up, and see something going right.

**Live site:** [https://brightsidemoon.vercel.app/](https://brightsidemoon.vercel.app/)
**Built by:** [KokoNekoArt](https://kokoneko.art)

---

## How the moon drives the site

Every page load works out the current moon locally with [astronomy-engine](https://github.com/cosinekitty/astronomy). There's no external API, no key and nothing to rate-limit. Dates are calculated in the site's home timezone (`America/Winnipeg`), and pages regenerate hourly.

Each phase has a theme, and each theme features a different tone of good news:

| Moon | Theme | What's featured |
|---|---|---|
| Waxing (new → full) | **Grow** | Growth: progress, projects getting started, things building momentum |
| Full moon (3 days) | **Celebrate** | Celebration: wins worth sharing. Everyone who visits on the full moon is celebrating together |
| Waning (full → new) | **Appreciate** | Appreciation: the people, places and work worth noticing |
| New moon (3 days) | **Reflect** | Reflection: harder stories, always with a way forward |
| Blue moon (3 days) | **Rejoice** | Celebration, with the whole site recoloured |
| Lunar eclipse (3 days) | **Reflect deeply** | Reflection, with the whole site recoloured |

The hero shows the matching moon image (ten phases, including crescents, quarters and gibbous moons), the illumination and phase angle, and copy written for that point in the cycle, like "the first half of the cycle" or "nearing the end of the cycle".

Blue Moons and Lunar Eclipses set `data-moon-mode` on `<body>`, which swaps the site's colour variables. Every colour in the site comes from CSS custom properties stored as RGB triplets, so one attribute change recolours everything.

Reflection stories only appear on the new moon and during eclipses. The rest of the month, the site stays light.

The music follows the moon too: hopeful and building while it grows, warm and slow while it wanes, bright on the full moon, and quiet and calm on the new moon.

---

## How stories get in

There's no database or manual posting. Stories come straight from publishers' RSS feeds and YouTube channel feeds, refreshed hourly.

Each item passes through a short pipeline before it's shown:

1. **Fetch.** Every source is fetched in parallel. If one feed is down, the others still load.
2. **Filter.** Items are dropped if they're about AI, US partisan politics, or (for general-news sources) violent topics. The goal is to populate the feed with peace, love, and positivity, and not anxiety, dread, or despair. The politics filter treats both parties the same.
3. **Tone.** A keyword classifier decides whether a story is growth, appreciation, celebration or reflection. It understands turnarounds, so "species saved from extinction" reads as good news even though "extinction" is in the headline.
4. **Categories.** Each story gets one or two categories (animals & wildlife, oceans & marine life, climate action, sparks of hope, a brigher tomorrow, and so on), weighting the headline and summary over the body text.
5. **Content warnings.** Reflection stories with graphic details are tagged and their summaries are hidden behind a click.
6. **Hold periods.** Sources that ask for a delay before sharing are held back until it's passed.

When the automatic call is wrong, a small curation file can override a story's tone or categories, pin it, mark it graphic or hide it. Those overrides become the site's "featured" editorial picks.

---

## Music

An optional lofi player sits at the bottom of every page. Nothing plays until the visitor presses play.

- **Human-made, openly licensed.** Tracks come from [Jamendo](https://www.jamendo.com), where every track is released by its artist under a Creative Commons licence, through the [Jamendo API](https://devportal.jamendo.com).
- **Picked by vibe, like the news.** Each moon has its own search: a few mood tags and a tempo range, limited to instrumental tracks.
- **No AI music.** Searches only include tracks released before 2022, before AI music tools became widespread. A hide list removes anything that slips through, and a pin list keeps favourites at the top.
- **Shuffled for each listener.** The pool is reshuffled daily, and each visitor gets their own order on their first play.
- **Remembers where you were.** Track, position, shuffle and mute are saved in the visitor's own browser (`localStorage`) and nowhere else. If they were listening, the music picks up again on their next click, since browsers don't allow sound before a visitor interacts with the page.
- **Keeps playing between pages.** The player lives in the root layout, so navigating doesn't interrupt it.

---

## How sources are credited

Bright✦Side only uses sources whose terms allow it, and it shows as little as possible: **a headline, a short summary, the author, the publication and a link to the original.** Full articles are never copied. Every headline links to the original story, so readers (and traffic) go back to the people who did the reporting.

| How a source is used | What's shown |
|---|---|
| Creative Commons / republishing allowed | Headline, unedited summary excerpt, author byline, source name, link to the original, plus any credit line the publisher asks for |
| YouTube | The creator's own video through YouTube's official embedded player in privacy-enhanced mode. Nothing plays or loads from YouTube until the visitor clicks |
| Jamendo music | Streamed from Jamendo, unedited. The player shows the track and artist, both linked to Jamendo, and the track's licence is one click away in the queue |

Each source's licence and terms, and every track with its artist and licence, are listed on the site's [Sources & Attribution](https://brightsidemoon.vercel.app/attribution) page.

**If you run one of these publications** and want anything changed, credited differently or removed, email the address on the About page. It will be handled quickly.

**If you want something to be sourced** and you have the right to allow me distribution rights, email the address on the [About](https://brightsidemoon.vercel.app/about) page and I'll review your request.

---

## Tech stack

- **[Next.js](https://nextjs.org) 16** (App Router, React Server Components, incremental static regeneration)
- **React 19** and **TypeScript**
- **[Tailwind CSS](https://tailwindcss.com) v4** with CSS custom properties for theming
- **[astronomy-engine](https://github.com/cosinekitty/astronomy)** for moon phases, blue moons and eclipses
- **[rss-parser](https://github.com/rbren/rss-parser)** for article and YouTube feeds
- **[Jamendo API](https://devportal.jamendo.com)** for Creative Commons music
- **[Phosphor Icons](https://phosphoricons.com)**
- Designed in **Figma**, deployed on **Vercel**

### Accessibility

- Respects `prefers-reduced-motion` (brush-stroke and menu animations turn off)
- Hover effects only on devices that can hover; the same effects show on keyboard focus
- `aria-current` on the active page, `aria-pressed` on toggles, live regions for content that changes
- Screen-reader hints on links that open a new tab
- Graphic content is opt-in
- Music never autoplays, and the player's buttons report their on/off state to screen readers

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                  Homepage (moon hero + featured news)
│   ├── news/                     Archive, pagination and category filters
│   ├── about/                    About page with an interactive moon preview
│   ├── attribution/              Sources & Attribution, generated from sources.ts and the playlists
│   └── not-found.tsx             404 page that follows the moon too
├── components/
│   ├── MoonHero.tsx              Phase image, stats and copy
│   ├── SiteNav.tsx               Nav with slide-in mobile menu
│   ├── MusicPlayer.tsx           Lofi player: queue, shuffle, mute, remembers where you were
│   └── news/                     Post cards, video embed, filters, pagination
└── lib/
    ├── moon.ts                   Works out phase, theme, blue moons and eclipses
    ├── moon-content.ts           Hero copy for each phase
    ├── music/
    │   ├── playlist.ts           Vibe, tempo, pins and hidden tracks for each moon
    │   └── jamendo.ts            Fetches, filters and shuffles each moon's playlist
    └── news/
        ├── sources.ts            Every feed, its licence and credit rules
        ├── get-posts.ts          Fetch → filter → classify → sort
        ├── tone.ts               Tone classifier
        ├── categories.ts         Category classifier
        ├── content.ts            AI, politics, blocked and graphic filters
        └── curation.ts           Manual overrides and featured picks
```

---

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

For music, add a Jamendo client ID (free for non-commercial use, from [devportal.jamendo.com](https://devportal.jamendo.com)) to `.env.local`:

```
JAMENDO_CLIENT_ID=your_client_id
```

Without it, the site works normally and the player stays hidden.

### Preview options (development only)

Set these in `.env.local` to check different moons and states without waiting a month:

| Variable | Example | What it does |
|---|---|---|
| `MOON_PREVIEW` | `full`, `waning-crescent`, `blue`, `eclipse` | Forces a phase or special mode |
| `MOON_PREVIEW_DATE` | `2026-03-03` | Calculates the moon for a specific date |
| `NEWS_PREVIEW` | `empty`,`sample` | Previews the error state or sample feed with no real content |

Sample posts file needs to be placed in src/lib/news/sample-posts.ts for testing sample sate.
---

## Adding a source

Sources live in `src/lib/news/sources.ts`. Before adding one, read the publisher's terms. A feed being public doesn't mean it can be republished. Then add an entry with:

- `feedUrl` and `homepage`
- `license`: `'cc'` for Creative Commons / republishing allowed, `'embed'` for YouTube
- `licenseNotice` and `termsUrl` so the Sources page can show them
- `credit` if the publisher asks for a specific credit line
- `embargoHours` if they ask for a delay
- Optional `fixedCategories` / `fixedTone` for channels with one clear focus

---

## Known limits

- **No archive beyond what feeds hold.** Feeds only carry their latest 10 to 50 items, so older stories drop off. A small database would make the archive permanent.
- **The pre-2022 music filter is a strong signal, not a guarantee.** Release dates are metadata, so the hide list stays as a backstop.
- **Keyword classifiers aren't perfect.** Some stories land in the wrong tone or category. The curation file is there for those.

---

## Credits

Design and development by [KokoNekoArt](https://kokoneko.art).
Stories belong to their original publishers and creators, and music to its artists. See [Sources & Attributions](/attribution).
