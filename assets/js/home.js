// === Word Rotator ===
(function () {
    var words = document.querySelectorAll('.rotating-wrapper .word');
    var len = words.length;
    if (len === 0) return;

    var POSITIONS = ['pos2', 'pos1', 'active', 'neg1', 'neg2'];
    var wordIndex = 0;

    function clearAll() {
        words.forEach(function (w) {
            w.classList.remove.apply(w.classList, POSITIONS);
        });
    }

    function updateWords() {
        clearAll();

        if (len === 1) {
            words[0].classList.add('active');
            return;
        }

        // Offsets: -2, -1, 0, +1, +2 mapped to POSITIONS
        for (var i = 0; i < POSITIONS.length; i++) {
            var offset = i - 2; // -2..+2
            var idx = ((wordIndex + offset) % len + len) % len;
            // If multiple offsets resolve to the same word (small lists),
            // keep the most central class only.
            if (!words[idx].classList.contains('active') &&
                !words[idx].classList.contains('pos1') &&
                !words[idx].classList.contains('neg1')) {
                words[idx].classList.add(POSITIONS[i]);
            } else if (POSITIONS[i] === 'active') {
                // Force active if collision with an outer position
                words[idx].className = words[idx].className
                    .replace(/\b(pos2|pos1|neg1|neg2)\b/g, '').trim();
                words[idx].classList.add('active');
            }
        }

        wordIndex = (wordIndex + 1) % len;
    }

    updateWords();
    if (len > 1) setInterval(updateWords, 2000);
})();

// === FAQ Accordion (with keyboard + ARIA) ===
(function () {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item, index) {
        var question = item.querySelector('.faq-question');
        var answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;

        var qId = 'faq-q-' + index;
        var aId = 'faq-a-' + index;
        question.id = qId;
        answer.id = aId;

        // Make the question keyboard-focusable and announce as a button
        question.setAttribute('role', 'button');
        question.setAttribute('tabindex', '0');
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', aId);
        answer.setAttribute('role', 'region');
        answer.setAttribute('aria-labelledby', qId);

        function toggle() {
            var isOpen = item.classList.contains('active');
            items.forEach(function (i) {
                i.classList.remove('active');
                var q = i.querySelector('.faq-question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        }

        question.addEventListener('click', toggle);
        question.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                toggle();
            }
        });
    });
})();

// === Scroll Animations ===
(function () {
    var anims = document.querySelectorAll('.anim');
    if (!anims.length || !('IntersectionObserver' in window)) {
        anims.forEach(function (el) { el.classList.add('visible'); });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    anims.forEach(function (el) { observer.observe(el); });
})();

// === Smooth Scroll for in-page anchor links ===
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
