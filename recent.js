/* ═══════════════════════════════════════════════════════════════
   recent.js  —  Right Sidebar "Recent" Configuration
   ═══════════════════════════════════════════════════════════════

   This is the ONLY file you need to edit to control the right
   sidebar. Four slots, each fully independent.

   ── Field reference ──────────────────────────────────────────

   title    Display name shown below the thumbnail in the sidebar

   href     Where clicking the item navigates to.
            Can be a local page (e.g. 'projects/foo/page.html')
            or an external URL (e.g. 'https://...')

   thumb    Path to the SMALL image shown inside the sidebar list.
            Recommended size: any reasonable thumbnail (e.g. 200×150 px).
            File lives in: recent/

   preview  Path to the LARGE image shown when hovering over the item.
            This fills the left panel area as a background preview.
            Recommended size: wide landscape, e.g. 1200×800 px or larger.
            File lives in: recent/
            Set to '' to disable the hover preview for that item.

   ── Image files go here ──────────────────────────────────────

     recent/
       01-thumb.jpg      ← item 1 small sidebar image
       01-preview.jpg    ← item 1 large hover image
       02-thumb.jpg
       02-preview.jpg
       03-thumb.jpg
       03-preview.jpg
       04-thumb.jpg
       04-preview.jpg

   (Any image format works: .jpg .png .webp etc.)

═══════════════════════════════════════════════════════════════ */

const RECENT_ITEMS = [
  /* ── Slot 1 ──────────────────────────────────────────────── */
  {
    title: "Internet-Babel",
    href: "projects/internet-babel/page.html",
    thumb: "recent/01-thumb.jpg",
    preview: "recent/01-preview.jpg",
    date: "2024", // ← year or "Month Year"
    type: "Development", // ← project category
    desc: "Two-sentence description of this project. Edit this text in recent.js.",
  },

  /* ── Slot 2 ──────────────────────────────────────────────── */
  {
    title: "Mental-Gen",
    href: "projects/mental-gen/page.html",
    thumb: "recent/02-thumb.jpg",
    preview: "recent/02-preview.jpg",
    date: "2024",
    type: "Design",
    desc: "Two-sentence description of this project. Edit this text in recent.js.",
  },

  /* ── Slot 3 ──────────────────────────────────────────────── */
  {
    title: "Olfactory Memory Map",
    href: "projects/olfactory-map/page.html",
    thumb: "recent/03-thumb.jpg",
    preview: "recent/03-preview.jpg",
    date: "2024",
    type: "Research",
    desc: "Two-sentence description of this project. Edit this text in recent.js.",
  },

  {
    title: "Olfactory Memory Map",
    href: "projects/olfactory-map/page.html",
    thumb: "recent/05-thumb.jpg",
    preview: "recent/05-preview.jpg",
    date: "2024",
    type: "Research",
    desc: "Two-sentence description of this project. Edit this text in recent.js.",
  },

  /* ── Slot 4 ──────────────────────────────────────────────── */
  {
    title: "Read the Library Itself",
    href: "projects/library/page.html",
    thumb: "recent/04-thumb.jpg",
    preview: "recent/04-preview.jpg",
    date: "2023",
    type: "Research",
    desc: "Two-sentence description of this project. Edit this text in recent.js.",
  },
];
