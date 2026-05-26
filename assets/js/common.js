// === Theme Toggle ===
// Initial theme is set by inline script in <head> to avoid FOUC.
(function () {
    var themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    var html = document.documentElement;

    function syncToggleState() {
        var isDark = html.getAttribute('data-theme') === 'dark';
        themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }

    syncToggleState();

    themeToggle.addEventListener('click', function () {
        var isDark = html.getAttribute('data-theme') === 'dark';
        try {
            if (isDark) {
                html.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        } catch (e) { /* localStorage disabled */ }
        syncToggleState();
    });
})();

// === Hamburger / Mobile Menu ===
(function () {
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');
    var nav = document.querySelector('body > nav');
    if (!hamburger || !mobileMenu) return;

    var lastFocus = null;

    function syncNavHeight() {
        if (!nav) return;
        var navHeight = nav.offsetHeight || 60;
        document.documentElement.style.setProperty('--nav-height', navHeight + 'px');
    }

    function isOpen() {
        return mobileMenu.classList.contains('open');
    }

    function focusableInMenu() {
        return mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    }

    function openMenu() {
        hamburger.classList.add('active');
        mobileMenu.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        lastFocus = document.activeElement;
        var first = focusableInMenu()[0];
        if (first) first.focus();
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus();
        }
    }

    function toggleMenu() {
        if (isOpen()) closeMenu(); else openMenu();
    }

    function handleResize() {
        syncNavHeight();
        if (window.innerWidth > 900 && isOpen()) {
            closeMenu();
        }
    }

    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'mobileMenu');

    syncNavHeight();

    hamburger.addEventListener('click', toggleMenu);

    // Keyboard activation (Enter / Space) — works for div with role="button"
    hamburger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    // ESC closes the menu; Tab is trapped while open
    document.addEventListener('keydown', function (e) {
        if (!isOpen()) return;

        if (e.key === 'Escape' || e.key === 'Esc') {
            e.preventDefault();
            closeMenu();
            return;
        }

        if (e.key === 'Tab') {
            var nodes = focusableInMenu();
            if (!nodes.length) return;
            var first = nodes[0];
            var last = nodes[nodes.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    // Click outside closes menu
    document.addEventListener('click', function (e) {
        if (!isOpen()) return;
        if (mobileMenu.contains(e.target) || hamburger.contains(e.target)) return;
        closeMenu();
    });

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', syncNavHeight);
})();
