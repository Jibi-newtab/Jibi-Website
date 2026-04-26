// Copy Link
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        document.getElementById('copiedMsg').style.display = 'block';
        setTimeout(() => document.getElementById('copiedMsg').style.display = 'none', 2500);
    });
}

// Smooth scroll for TOC and anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
