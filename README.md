# jungkook.zip ♡

A pink coquette scrapbook and interactive fan gift for Jungkook (Jeon Jung-kook). Built with React, Vite, Tailwind CSS, Framer Motion, and Lucide.

## Design

The visual theme uses baby pink (`#FFDDE8`), blush (`#FFF0F5`), rose (`#E8B4C8`), cream (`#FFF8F2`), and warm scrapbook text (`#654454`). The responsive layout includes a floating desktop navigation bar and fixed mobile navigation.

## Pages and features

- **Home (`/`)** — animated first-visit gift intro, JK hero, timeline, and interactive fact cards.
- **Gallery (`/gallery`)** — category filters, favorites, lightbox, individual downloads, selected-photo ZIP, and full-gallery ZIP with attribution details.
- **JK Arcade (`/arcade`)** — five playable mini-games, local best scores, sound control, and an unlockable surprise.
- **Music (`/music`)** — six Jungkook tracks, including “Dreamers,” with Spotify/Apple Music links and a Spotify embed; playback never starts automatically.
- **Surprise (`/surprise`)** — animated envelope, editable letter saved in the browser, and a section for personal photos and memories.
- **Photo Booth (`/photo-booth`)** — create, customize, and save photo strips. Mobile devices can use the native share/save menu; desktop browsers can download a PNG or save to a chosen folder, with PDF printing as a fallback.

Jungkook image data and source/license credits are kept in `src/data/photos.js`. Follow each Wikimedia Commons source page’s terms when reusing an image.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with:

```bash
npm run build
```

## Personalize

- Replace or update gallery images and their attribution in `src/data/photos.js`.
- Change the default surprise letter in `src/components/SecretLetter.jsx`.
- The first-visit intro, favorites, letter, memories, game progress, and photo booth data are stored locally in the browser; no backend is used.
