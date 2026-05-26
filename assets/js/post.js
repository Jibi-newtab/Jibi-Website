// === Reading Progress Bar ===
(function () {
    var progressBar = document.getElementById('readingProgress');
    if (!progressBar) return;

    var ticking = false;

    function update() {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = Math.min(progress, 100) + '%';
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });
})();

// === Copy Link ===
function copyLink() {
    var msg = document.getElementById('copiedMsg');
    function show() {
        if (!msg) return;
        msg.style.display = 'block';
        setTimeout(function () { msg.style.display = 'none'; }, 2500);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href).then(show, function () {
            // Permission denied or insecure context — silent fallback
        });
    } else {
        // Legacy fallback
        var input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        try { document.execCommand('copy'); show(); } catch (e) { /* noop */ }
        document.body.removeChild(input);
    }
}

function shareOnTelegram() {
    var shareUrl = 'https://t.me/share/url?url=' + encodeURIComponent(window.location.href);
    window.open(shareUrl, '_blank', 'noopener');
}

function shareOnInstagram() {
    copyLink();
    window.open('https://www.instagram.com/', '_blank', 'noopener');
}

// === Smooth Scroll for TOC and anchor links ===
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// === TOC Scroll Spy (rAF-throttled) ===
(function () {
    var tocLinks = document.querySelectorAll('.toc-list a');
    if (!tocLinks.length) return;

    var headings = [];
    tocLinks.forEach(function (link) {
        var id = link.getAttribute('href').substring(1);
        var heading = document.getElementById(id);
        if (heading) headings.push({ el: heading, link: link });
    });

    if (!headings.length) return;

    var ticking = false;

    function updateActiveToc() {
        var scrollTop = window.scrollY + 120;
        var active = null;

        for (var i = 0; i < headings.length; i++) {
            if (headings[i].el.offsetTop <= scrollTop) {
                active = headings[i];
            }
        }

        tocLinks.forEach(function (l) { l.classList.remove('active'); });
        if (active) active.link.classList.add('active');
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateActiveToc);
            ticking = true;
        }
    }, { passive: true });

    updateActiveToc();
})();
