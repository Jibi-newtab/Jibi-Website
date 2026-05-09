// Blog Filter
(function () {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var posts = document.querySelectorAll('#blogGrid .post-card');
    var featuredPost = document.querySelector('.featured-post');
    var emptyState = document.getElementById('emptyState');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.dataset.filter;
            var visibleCount = 0;

            // Featured post
            if (featuredPost) {
                var featuredMatch = filter === 'all' || featuredPost.dataset.category === filter;
                featuredPost.style.display = featuredMatch ? '' : 'none';
                if (featuredMatch && featuredPost.dataset.category === filter) visibleCount++;
                if (filter === 'all' && featuredPost) visibleCount++;
            }

            // Grid posts
            posts.forEach(function (post) {
                var match = filter === 'all' || post.dataset.category === filter;
                if (match) {
                    post.classList.remove('hidden');
                    post.style.animation = 'fadeUp 0.4s ease forwards';
                    visibleCount++;
                } else {
                    post.classList.add('hidden');
                    post.style.animation = '';
                }
            });

            // Empty state
            if (emptyState) {
                var totalVisible = visibleCount + (featuredPost && featuredPost.style.display !== 'none' && filter === 'all' ? 0 : 0);
                emptyState.style.display = (visibleCount === 0 && filter !== 'all') ? 'block' : 'none';
            }
        });
    });
})();
