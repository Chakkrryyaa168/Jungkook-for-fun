# jungkook.zip ♡ — A Little World of Jungkook 💜

A romantic, dreamy digital scrapbook fan-memory website dedicated to **Jeon Jungkook** of BTS, created as a heartfelt gift for your girlfriend.

---

## 🌸 Dreamy Purple World Aesthetics
- **Deep Purple**: `#211B38`
- **Lavender**: `#B9A0D9`
- **Soft Pink**: `#F4DCEB`
- **Cream**: `#FFF8F0`
- **White**: `#FFFFFF`
- Accents: Glassmorphism, polaroid-style borders, washi tape, floating hearts and sparkles.

---

## ✨ Features Included

1. **Homepage — Welcome to His World**:
   - Full-screen dreamy entrance with animated hero portrait of Jungkook.
   - Title: `jungkook.zip ♡`
   - Main heading: *"Welcome to His World."*
   - Subtitle: *"A little place filled with moments worth remembering."*
   - "Enter His World ♡" button with smooth scroll into the scrapbook.

2. **Photo Memories Gallery**:
   - Pinterest-style masonry grid layout with different photo heights and orientations.
   - Category filters: *All Moments*, *Casual Jungkook*, *Photoshoots*, *Concert Moments*, *Golden Era*, and *Cute Moments*.
   - Full-screen Lightbox with next/previous controls, keyboard arrows (`←`/`→`/`Esc`), and zoom view.
   - Heart/Favorite interaction (persisted in `localStorage`).
   - Sourced from legal Wikimedia Commons archives, organized in `src/data/photos.js` with fallback image support.

3. **Jungkook Timeline**:
   - Vertical interactive journey from **2013** to **2026**:
     - *2013 — BTS Debut*
     - *2016 — Wings Era*
     - *2018 — Love Yourself Era*
     - *2020 — Dynamite Era*
     - *2023 — Seven / Golden Era*
     - *2024–2026 — Recent Moments & Timeless Bond*
   - Era milestones, quotes, and polaroid photographs.

4. **Little Things About Jungkook**:
   - 6 interactive 3D flip cards:
     - *His Hobbies* (G.C.F videography, boxing, bowling, guitar)
     - *His Music* (vocal versatility, ad-libs, writing & producing)
     - *His Funny Moments* (Downy craze, mattress folding, Weverse lives)
     - *His Iconic Performances* (Euphoria flying wires, World Cup Dreamers, Times Square)
     - *His Favorite Things* (banana milk, ramen, combat boots, rainy days)
     - *His Personality & Talents* (Golden Maknae, bunny smile, humble heart)

5. **Korean 4-Cut Photo Booth (인생네컷)**:
   - Create aesthetic 4-cut vertical photo strips with your choice of frame colors (Lavender Dream, Midnight Purple, Strawberry Milk, Classic White).
   - Tap any slot to cycle through pictures, write a custom handwritten bottom caption, and print or save the souvenir strip!

6. **Daily Jungkook Note & Fortune 🥠**:
   - Interactive daily note box where your girlfriend can tap to reveal sweet quotes and romantic reminders with sparkle effects.

7. **Secret Letter — A Special Surprise ♡**:
   - Interactive 3D wax-sealed airmail envelope with JK stamp.
   - Unfolds with a pastel confetti sparkle burst (`canvas-confetti`).
   - Handwritten typography message:
     > *"I know how much you love him, so I made this little corner of the internet just for you. I hope every time you visit, it brings a little happiness to your day. You deserve all the happiness in the world. ♡"*
   - **Personalization Mode**: An *"Edit Letter ✏️"* button allows you to easily edit the greeting, text, and sign-off, saved directly to browser `localStorage`!
   - **Our Own Pictures & Memories**: A dedicated couple scrapbook section where you can upload your own photos, add captions, stickers, and dates.

6. **Extra Sweet Details**:
   - Custom desktop heart & sparkle cursor follower.
   - Click-to-spawn floating hearts everywhere on screen.
   - "Favorites" drawer modal with count badge in the navbar.
   - Midnight Purple / Lavender theme toggle.
   - Smooth entrance loader: *"Preparing a little happiness for you... 💜"*.
   - *"Made with love ♡"* footer with BTS quotes and back-to-top button.

---

## 🚀 How to Run the Website

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

---

## 🎨 How to Personalize

- **Change or Add Jungkook Photos**: Edit [src/data/photos.js](file:///d:/Write%20Code/React/RandomJKforgf/src/data/photos.js).
- **Edit the Secret Letter**: You can click the *"Personalize / Edit Letter ✏️"* button directly inside the website, or edit the default text in [src/components/SecretLetter.jsx](file:///d:/Write%20Code/React/RandomJKforgf/src/components/SecretLetter.jsx).
- **Add Couple Memories**: Click *"Add Our Memory 📸"* on the website to upload pictures directly from your computer, or customize the starter photos in [src/components/SecretLetter.jsx](file:///d:/Write%20Code/React/RandomJKforgf/src/components/SecretLetter.jsx).
# Jungkook-for-fun
