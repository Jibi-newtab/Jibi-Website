// Word Rotator
const words = document.querySelectorAll('.rotating-wrapper .word');
let wordIndex = 0;

function updateWords() {
    words.forEach(word => {
        word.classList.remove('pos2', 'pos1', 'active', 'neg1', 'neg2');
    });

    const len = words.length;
    const pos2Index = (wordIndex - 2 + len) % len;
    const pos1Index = (wordIndex - 1 + len) % len;
    const activeIndex = wordIndex;
    const neg1Index = (wordIndex + 1) % len;
    const neg2Index = (wordIndex + 2) % len;

    words[pos2Index].classList.add('pos2');
    words[pos1Index].classList.add('pos1');
    words[activeIndex].classList.add('active');
    words[neg1Index].classList.add('neg1');
    words[neg2Index].classList.add('neg2');

    wordIndex = (wordIndex + 1) % len;
}

if (words.length > 0) {
    updateWords();
    setInterval(updateWords, 2000);
}

// FAQ Toggle
document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isOpen) item.classList.add('active');
    });
});

// Scroll Animations
const anims = document.querySelectorAll('.anim');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

anims.forEach(el => observer.observe(el));

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});
