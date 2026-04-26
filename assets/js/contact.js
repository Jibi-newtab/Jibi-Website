// Contact Form
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) return;

    document.getElementById('formContent').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
});
