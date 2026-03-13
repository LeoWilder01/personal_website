/* ═══════════════════════════════════════════════════════════════
   projects.js  —  Project Registry
   ═══════════════════════════════════════════════════════════════

   This is the single source of truth for all your projects.
   Edit this file to control what appears where on the site.

   ── Field reference ──────────────────────────────────────────

   id           Unique key (lowercase, hyphens only)
   title        Display name
   category     'design' | 'dev' | 'research'
   year         String, e.g. '2023'
   description  One-sentence blurb (used in sidebar + scenes)
   preview      Path to thumbnail image (relative to index.html)
                  Leave '' if no image yet
   href         Path to detail page (relative to index.html)
   recent       true  → show in the right-sidebar "Recent" list
                false → only in main project scenes

   ── How to edit ──────────────────────────────────────────────

   • Show/hide in sidebar    change   recent: true / false
   • Reorder sidebar items   move the objects with recent:true up/down
   • Add a project           append a new object at the bottom
   • Add a new category      use any string in 'category'
                             then update the scenes in index.html

═══════════════════════════════════════════════════════════════ */

const PROJECTS = [

  /* ── Research ─────────────────────────────────────────────── */
  {
    id:          'mental-gen',
    title:       'Mental-Gen',
    category:    'research',
    year:        '2023',
    description: 'A Brain–Computer Interface based interactive method for interior space generative design.',
    preview:     'projects/mental-gen/preview.png',
    href:        'projects/mental-gen/page.html',
    recent:      true,
  },
  {
    id:          'mindscape',
    title:       'Mindscape',
    category:    'research',
    year:        '2023',
    description: 'EEG & VR study of cognitive load in high information-density street environments.',
    preview:     'projects/mindscape/preview.png',
    href:        'projects/mindscape/page.html',
    recent:      false,
  },
  {
    id:          'instagrammable-space',
    title:       'Instagrammable Space Paradigm',
    category:    'research',
    year:        '2022',
    description: 'Architectural space analysis in social-media dissemination via computer vision.',
    preview:     'projects/instagrammable-space/preview.png',
    href:        'projects/instagrammable-space/page.html',
    recent:      false,
  },

  /* ── Design ───────────────────────────────────────────────── */
  {
    id:          'museum',
    title:       'The Rite of Passage Museum',
    category:    'design',
    year:        '2022',
    description: 'Spatial sequence experiential design exploring coming-of-age rituals across cultures.',
    preview:     'projects/museum/preview.png',
    href:        'projects/museum/page.html',
    recent:      false,
  },
  {
    id:          'olfactory-map',
    title:       'Olfactory Memory Map',
    category:    'design',
    year:        '2022',
    description: 'Odor-memory based hardware interaction and augmented-reality development.',
    preview:     'projects/olfactory-map/preview.png',
    href:        'projects/olfactory-map/page.html',
    recent:      true,
  },
  {
    id:          'cyber-mask',
    title:       'Cyber Mask',
    category:    'design',
    year:        '2021',
    description: 'Masks that appear normal to the eye but produce visual artifacts on camera screens.',
    preview:     'projects/cyber-mask/preview.png',
    href:        'projects/cyber-mask/page.html',
    recent:      false,
  },
  {
    id:          'library',
    title:       'Read the Library Itself',
    category:    'design',
    year:        '2021',
    description: 'When space is abstracted enough, people can read it the same way they read text.',
    preview:     'projects/library/preview.png',
    href:        'projects/library/page.html',
    recent:      true,
  },
  {
    id:          'urban-village',
    title:       'Urban Village Redevelopment',
    category:    'design',
    year:        '2020',
    description: 'Methods of translating traditional rural lifestyles into modern urban expansion.',
    preview:     'projects/urban-village/preview.png',
    href:        'projects/urban-village/page.html',
    recent:      false,
  },
  {
    id:          'xlab',
    title:       'Xlab',
    category:    'design',
    year:        '2020',
    description: '',
    preview:     '',
    href:        'projects/xlab/page.html',
    recent:      false,
  },

  /* ── Development ──────────────────────────────────────────── */
  {
    id:          'internet-babel',
    title:       'Internet-Babel',
    category:    'dev',
    year:        '2025',
    description: '',
    preview:     '',                               // add preview path once image is ready
    href:        'projects/internet-babel/page.html',
    recent:      true,
  },
  {
    id:          'agent-life',
    title:       'agent-life',
    category:    'dev',
    year:        '2025',
    description: '',
    preview:     '',
    href:        'projects/agent-life/page.html',
    recent:      false,
  },

];
