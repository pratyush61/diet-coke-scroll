// ─────────────────────────────────────────────────────────────
// Mobile navigation
// ─────────────────────────────────────────────────────────────

const mobileMenu = document.getElementById('mobileMenu');
const menuToggle = document.getElementById('menuToggle');
const header = document.querySelector('header');

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

menuToggle?.addEventListener('click', () => {
  toggleMobileNav();
});

// Close the menu after selecting a navigation link.
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggleMobileNav(true);
  });
});

// Close the menu with Escape and return focus to the toggle.
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileMenu && !mobileMenu.hidden) {
    toggleMobileNav(true);
    menuToggle?.focus();
  }
});

// Close the menu when clicking outside the header.
document.addEventListener('click', event => {
  if (
    mobileMenu &&
    !mobileMenu.hidden &&
    header &&
    !header.contains(event.target)
  ) {
    toggleMobileNav(true);
  }
});

// Close mobile navigation when switching to desktop width.
const desktopQuery = window.matchMedia('(min-width: 821px)');

desktopQuery.addEventListener('change', event => {
  if (event.matches) {
    toggleMobileNav(true);
  }
});

// ─────────────────────────────────────────────────────────────
// Scroll animations
// ─────────────────────────────────────────────────────────────

// Keep the page functional if GSAP or ScrollTrigger fails to load.
if (
  typeof window.gsap !== 'undefined' &&
  typeof window.ScrollTrigger !== 'undefined'
) {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  gsap.registerPlugin(ScrollTrigger);

  const can = document.querySelector('.can-wrap');
  const main = document.querySelector('main');
  const headingLines = document.querySelectorAll('.hero h1 .line');

  if (can && main) {
    // Page-load animation respects reduced-motion preferences.
    const loadMotion = gsap.matchMedia();

    loadMotion.add(
      {
        reduce: '(prefers-reduced-motion: reduce)'
      },
      context => {
        if (context.conditions.reduce) return;

        gsap.from(can, {
          yPercent: -160,
          rotation: -25,
          opacity: 0,
          duration: 1.3,
          ease: 'bounce.out'
        });

        if (headingLines.length) {
          gsap.from(headingLines, {
            yPercent: 110,
            duration: 1,
            stagger: 0.15,
            ease: 'power4.out',
            delay: 0.2
          });
        }
      }
    );

    // Responsive scroll journey.
    // GSAP automatically reverts animations when media conditions change.
    const scrollMotion = gsap.matchMedia();

    scrollMotion.add(
      {
        reduce: '(prefers-reduced-motion: reduce)',
        wide: '(min-width: 821px)',
        narrow: '(max-width: 820px)'
      },
      context => {
        if (context.conditions.reduce) return;

        const wide = context.conditions.wide;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: main,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.25
          }
        });

        timeline
          .to(can, {
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
      }
    );
  }
}
