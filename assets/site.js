// Not Your Average Joes — site behavior
// Sticky-nav scroll state + scroll-triggered reveal animations
(function () {
  if (typeof window === 'undefined') return;

  function init() {
    // Sticky-nav scroll background
    var nav = document.querySelector('.site-nav');
    if (nav) {
      var setNavState = function () {
        if (window.scrollY > 8) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      };
      setNavState();
      window.addEventListener('scroll', setNavState, { passive: true });
    }

    // Reveal animations
    var revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealEls.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var delay = parseInt(entry.target.dataset.delay, 10);
          if (isNaN(delay)) delay = i * 60;
          setTimeout(function () { entry.target.classList.add('in'); }, delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Mobile navigation drawer
(function () {
  if (typeof window === 'undefined') return;
  function init() {
    var toggle = document.querySelector('.nav-hamburger');
    var drawer = document.querySelector('.nav-drawer');
    if (!toggle || !drawer) return;
    var closeBtn = drawer.querySelector('.nav-drawer-close');
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      drawer.classList.add('open');
      drawer.removeAttribute('aria-hidden');
      document.body.classList.add('drawer-open');
      toggle.setAttribute('aria-expanded', 'true');
      if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 80);
    }
    function close() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('drawer-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
      else toggle.focus();
    }

    toggle.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) close();
    });
    drawer.querySelectorAll('.nav-drawer-link, .nav-drawer-cta').forEach(function (a) {
      a.addEventListener('click', function () { setTimeout(close, 40); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
