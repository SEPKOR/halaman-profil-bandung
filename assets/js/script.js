// Handles hamburger menu, back-to-top button, and page transition functionality

document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to body on load
    document.body.classList.add('fade-in');

    // Hamburger menu functionality
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.getElementById('mainNav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('nav-open');
            navToggle.classList.toggle('open');
        });
    }

    // Back to top button functionality
    const backToTopBtn = document.getElementById('backToTopBtn');

    if (backToTopBtn) {
        // Show/hide button on scroll
        window.onscroll = function() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                backToTopBtn.style.display = "block";
            } else {
                backToTopBtn.style.display = "none";
            }
        };

        // Scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        });
    }

    // Page transition functionality
    document.querySelectorAll('a').forEach(anchor => {
        // Exclude external links, mailto, tel, and anchor links within the same page
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
          return; // Skip anchor links
        }
        if (anchor.hostname === window.location.hostname || !anchor.hostname) { // Same origin or relative path
            anchor.addEventListener('click', function(e) {
                const targetPage = this.href;
                if (targetPage !== window.location.href) { // Only animate if navigating to a different page
                    e.preventDefault();
                    document.body.classList.remove('fade-in'); // Remove fade-in if it's there
                    document.body.classList.add('fade-out');
                    setTimeout(() => {
                        window.location.href = targetPage;
                    }, 500); // Match this timeout to the CSS animation duration
                }
            });
        }
    });
});
