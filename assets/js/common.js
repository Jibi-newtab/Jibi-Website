// Dark Mode
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

if (localStorage.getItem('theme') === 'dark') {
    html.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});

// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
    });
});
