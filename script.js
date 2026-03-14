// Prevent browser from restoring scroll position on refresh.
// This scroll-driven layout always starts at the top (Hero scene).
if (history.scrollRestoration) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ─────────────────────────────────────────
   SCROLL-DRIVEN SCENE TRANSITIONS

   Layout: body creates scroll height via #scroll-space.
   .main-panel is position:fixed — it never moves.
   Each .scene is absolutely positioned inside it,
   translated by JS to create the "pages sliding" effect.

   Snap positions are calculated dynamically from each scene's
   actual content height, so adding more projects never causes
   scenes to overlap.

   Scene order: 0=Hero, 1=Dev, 2=Research, 3=Design, 4=Contact
───────────────────────────────────────── */

const scenes       = Array.from(document.querySelectorAll('.scene'));
const navLinks     = Array.from(document.querySelectorAll('.nav-link'));
const scrollSpace  = document.getElementById('scroll-space');
const rightSidebar = document.querySelector('.right-sidebar');
const mainPanel    = document.getElementById('main-panel');

const SCENE_COUNT = scenes.length;
const VH = () => window.innerHeight;

// ── Extra breathing room added after each scene's content ──────
// Increase this number for more space between sections (unit: viewport heights).
// You can find and edit this value to tune the gap between all sections.
const SCENE_GAP_EXTRA = 0.25;
// ──────────────────────────────────────────────────────────────

// Map nav data-target → scene index (used for nav clicks)
const NAV_TO_SCENE = { '0': 0, '1': 1, '2': 2, '3': 3 };

// Which nav target is "active" for each scene index
const SCENE_TO_NAV = ['0', '1', '2', '3'];

// Snap positions: computed dynamically, updated on resize
let SNAP_POSITIONS = [];

function buildSnapPositions() {
  const vh = VH();
  const pos = [0]; // Scene 0 (Hero) always at progress = 0

  for (let i = 1; i < SCENE_COUNT; i++) {
    const prevInner = scenes[i - 1].querySelector('.scene-inner');
    // Hero has no .scene-inner (just a canvas) → treat as full viewport
    const contentH = prevInner ? prevInner.scrollHeight : vh;
    // Gap = content height in vh units, plus extra breathing room
    const gap = Math.max(0.8, contentH / vh + SCENE_GAP_EXTRA);
    pos.push(pos[i - 1] + gap);
  }

  SNAP_POSITIONS = pos;
  // Update scroll space so the last scene is fully reachable
  scrollSpace.style.height = `${(SNAP_POSITIONS[SNAP_POSITIONS.length - 1] + 1) * 100}vh`;
}

buildSnapPositions();


/* ── Find nearest scene to a given scroll progress ── */
function nearestScene(progress) {
  let idx = 0, minDist = Infinity;
  SNAP_POSITIONS.forEach((pos, i) => {
    const d = Math.abs(pos - progress);
    if (d < minDist) { minDist = d; idx = i; }
  });
  return idx;
}


/* ── Scene transform update ── */
let rafPending = false;

function updateScenes() {
  rafPending = false;
  const progress = window.scrollY / VH();

  scenes.forEach((scene, i) => {
    const offset = (SNAP_POSITIONS[i] - progress) * 100;
    scene.style.transform = `translateY(${offset}%)`;
  });

  // Highlight the correct nav link
  const currentIndex = nearestScene(progress);
  const activeTarget = SCENE_TO_NAV[currentIndex];
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.target === activeTarget);
  });

  // Slide right sidebar out and expand main panel, driven by scroll progress.
  // t = 0 → hero (sidebar fully visible), t = 1 → sidebar fully off-screen right.
  const t = Math.min(1, Math.max(0, progress));
  const rightW = Math.max(0, window.innerWidth - 200 - window.innerHeight);

  if (rightSidebar) {
    rightSidebar.style.transform  = `translateX(${t * 100}%)`;
    rightSidebar.style.pointerEvents = t > 0 ? 'none' : '';
    rightSidebar.style.visibility    = t >= 1 ? 'hidden' : '';
  }
  if (mainPanel) {
    mainPanel.style.right = `${rightW * (1 - t)}px`;
  }
  // Hide hover preview while sidebar is sliding
  if (t > 0 && rsPreview) {
    rsPreview.classList.remove('visible');
  }
}

window.addEventListener('scroll', () => {
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(updateScenes);
  }
}, { passive: true });

updateScenes(); // initial render


/* ── Snap to nearest scene after scroll settles ── */
let snapTimer;
let isSnapping = false;

window.addEventListener('scroll', () => {
  if (isSnapping) return; // ignore scroll events triggered by our own smooth scroll
  clearTimeout(snapTimer);
  snapTimer = setTimeout(() => {
    const progress = window.scrollY / VH();
    const idx      = nearestScene(progress);
    const targetY  = SNAP_POSITIONS[idx] * VH();
    const delta    = Math.abs(window.scrollY - targetY);

    if (delta > 4) {
      isSnapping = true;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      // Clear the flag once the smooth scroll finishes
      const clearSnap = () => {
        isSnapping = false;
        window.removeEventListener('scrollend', clearSnap);
      };
      if ('onscrollend' in window) {
        window.addEventListener('scrollend', clearSnap, { once: true });
      } else {
        setTimeout(clearSnap, 600); // fallback for older browsers
      }
    }
  }, 300); // wait for momentum scrolling to settle
}, { passive: true });


/* ── Nav link clicks → scroll to scene ── */
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const sceneIdx = NAV_TO_SCENE[link.dataset.target] ?? 0;
    window.scrollTo({ top: SNAP_POSITIONS[sceneIdx] * VH(), behavior: 'smooth' });
  });
});


/* ─────────────────────────────────────────
   RIGHT SIDEBAR — Hover preview
   Preview covers the left area (main panel + left sidebar),
   from top-left flush to the right sidebar's left edge.
   Height = top of .sidebar-bio so it never overlaps the bio.
───────────────────────────────────────── */
const rsPreview    = document.getElementById('rs-preview');
const rsPreviewImg = document.getElementById('rs-preview-img');
const sidebarBio   = document.querySelector('.sidebar-bio');

function syncPreviewHeight() {
  if (!rsPreview || !sidebarBio) return;
  rsPreview.style.height = (sidebarBio.getBoundingClientRect().top - 24) + 'px'; // 24px = gap above bio
}

syncPreviewHeight();

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    buildSnapPositions();
    syncPreviewHeight();
    updateScenes();
  }, 100);
});


/* ─────────────────────────────────────────
   RIGHT SIDEBAR — Recent Items
   Reads RECENT_ITEMS from recent.js.
   Each item has independent thumb (small) and preview (large hover) images.
───────────────────────────────────────── */
(function buildRecentList() {
  const list = document.getElementById('recent-list');
  if (!list || typeof RECENT_ITEMS === 'undefined') return;

  RECENT_ITEMS.forEach(item => {
    const a = document.createElement('a');
    a.className = 'rs-item';
    a.href      = item.href;

    // Large hover preview — covers the left panel area
    if (item.preview && rsPreview) {
      a.addEventListener('mouseenter', () => {
        rsPreviewImg.src = item.preview;
        rsPreviewImg.alt = item.title;
        rsPreview.classList.add('visible');
      });
      a.addEventListener('mouseleave', () => {
        rsPreview.classList.remove('visible');
      });
    }

    // Small thumbnail shown inside the sidebar
    if (item.thumb) {
      const img     = document.createElement('img');
      img.src       = item.thumb;
      img.alt       = item.title;
      img.className = 'rs-thumb';
      a.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'rs-thumb-empty';
      a.appendChild(ph);
    }

    // Text area: title, meta (date · type), description
    const info  = document.createElement('div');
    info.className = 'rs-info';

    const title = document.createElement('span');
    title.className   = 'rs-title';
    title.textContent = item.title;
    info.appendChild(title);

    if (item.date || item.type) {
      const meta = document.createElement('span');
      meta.className   = 'rs-meta';
      meta.textContent = [item.date, item.type].filter(Boolean).join(' · ');
      info.appendChild(meta);
    }

    if (item.desc) {
      const desc = document.createElement('p');
      desc.className   = 'rs-desc';
      desc.textContent = item.desc;
      info.appendChild(desc);
    }

    a.appendChild(info);

    list.appendChild(a);
  });
})();


/* ─────────────────────────────────────────
   PROJECT ITEM — Click to navigate only
   No hover overlay, no fullscreen preview on content scenes.
───────────────────────────────────────── */
document.querySelectorAll('.project-item[data-href]').forEach(item => {
  item.addEventListener('click', () => {
    window.location.href = item.dataset.href;
  });
});
