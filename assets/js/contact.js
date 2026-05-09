// Contact Form
(function () {
    const form = document.getElementById('contactForm');
    const formContent = document.getElementById('formContent');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');
    const sendAnotherBtn = document.getElementById('sendAnother');
    const messageEl = document.getElementById('message');
    const charCount = document.getElementById('charCount');

    // Character counter
    if (messageEl && charCount) {
        messageEl.addEventListener('input', function () {
            charCount.textContent = this.value.length;
        });
    }

    // Validate email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Show / clear errors
    function showError(inputId, errorId) {
        var input = document.getElementById(inputId);
        var error = document.getElementById(errorId);
        if (input) input.classList.add('error');
        if (error) error.classList.add('visible');
    }

    function clearError(inputId, errorId) {
        var input = document.getElementById(inputId);
        var error = document.getElementById(errorId);
        if (input) input.classList.remove('error');
        if (error) error.classList.remove('visible');
    }

    // Clear errors on input
    ['name', 'email', 'message'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', function () {
                clearError(id, id + 'Error');
            });
        }
    });

    // Submit
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('name').value.trim();
            var email = document.getElementById('email').value.trim();
            var message = document.getElementById('message').value.trim();
            var valid = true;

            if (!name) { showError('name', 'nameError'); valid = false; }
            if (!email || !isValidEmail(email)) { showError('email', 'emailError'); valid = false; }
            if (!message) { showError('message', 'messageError'); valid = false; }

            if (!valid) return;

            // Simulate loading
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            setTimeout(function () {
                formContent.style.display = 'none';
                formSuccess.style.display = 'block';
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }, 1200);
        });
    }

    // Send another
    if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', function () {
            form.reset();
            charCount.textContent = '0';
            formSuccess.style.display = 'none';
            formContent.style.display = 'block';
        });
    }
})();
