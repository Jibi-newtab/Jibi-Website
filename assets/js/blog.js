// Blog Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const posts = document.querySelectorAll('#blogGrid .post-card');
const featuredPost = document.querySelector('.featured-post');
const emptyState = document.getElementById('emptyState');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        let visibleCount = 0;

        if (filter === 'all' || featuredPost.dataset.category === filter) {
            featuredPost.style.display = '';
        } else {
            featuredPost.style.display = 'none';
        }

        posts.forEach(post => {
            const match = filter === 'all' || post.dataset.category === filter;
            post.style.display = match ? '' : 'none';
            if (match) visibleCount++;
        });

        emptyState.style.display = (visibleCount === 0 && filter !== 'all') ? 'block' : 'none';
    });
});

// Newsletter
function handleNewsletter() {
    const email = document.getElementById('newsletterEmail').value.trim();
    if (!email || !email.includes('@')) return;
    document.getElementById('newsletterEmail').style.display = 'none';
    document.querySelector('.btn-primary').style.display = 'none';
    document.getElementById('newsletterMsg').style.display = 'block';
}
