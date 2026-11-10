// Mobile navigation
const mobileMenu = document.getElementById('mobileMenu');
const menuToggle = document.getElementById('menuToggle');

function toggleMobileNav(forceClose = false) {
  if (!mobileMenu || !menuToggle) return;

  const shouldOpen = forceClose ? false : mobileMenu.hidden;

  mobileMenu.hidden = !shouldOpen;
  mobileMenu.classList.toggle('open', shouldOpen);

  menuToggle.setAttribute('aria-expanded', String(shouldOpen));
  menuToggle.setAttribute(
    'aria-label',
    shouldOpen ? 'Close navigation menu' : 'Open navigation menu'
  );
}

menuToggle?.addEventListener('click', () => toggleMobileNav());

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggleMobileNav(true));
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileMenu && !mobileMenu.hidden) {
    toggleMobileNav(true);
    menuToggle?.focus();
  }
});

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const can = document.querySelector('.can-wrap');

// Page-load moment: can drops in, headline lines rise
if (!reduce) {
  gsap.from(can, {
    yPercent: -160,
    rotation: -25,
    opacity: 0,
    duration: 1.3,
    ease: 'bounce.out'
  });

  gsap.from('.hero h1 .line', {
    yPercent: 110,
    duration: 1,
    stagger: 0.15,
    ease: 'power4.out',
    delay: 0.2
  });
}

// Scroll journey: centre -> left of text -> right of timeline -> spin to rest
const mm = gsap.matchMedia();

mm.add({
  wide: '(min-width: 821px)',
  narrow: '(max-width: 820px)'
}, ctx => {
  if (reduce) return;

  const wide = ctx.conditions.wide;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: 'main',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    }
  });

  tl.to(can, {
    rotation: -14,
    scale: 0.92,
    duration: 1,
    ease: 'none'
  })
  .to(can, {
    rotation: 10,
    scale: 0.9,
    y: wide ? 0 : '18vh',
    duration: 1,
    ease: 'none'
  })
  .to(can, {
    x: wide ? '-30vw' : 0,
    rotation: 180,
    scale: wide ? 1 : 0.8,
    y: wide ? 0 : '-8vh',
    duration: 1,
    ease: 'none'
  });
});
