// js/main.js

document.addEventListener('DOMContentLoaded', function () {

    // ====================
    // Pause other media when one plays
    // ====================
    const allMedia = document.querySelectorAll('audio, video');

    allMedia.forEach(media => {
        media.addEventListener('play', function () {
            allMedia.forEach(otherMedia => {
                if (otherMedia !== media) {
                    otherMedia.pause();
                }
            });
        });
    });

    // ====================
    // Smooth scroll for nav links
    // ====================
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ====================
    // Scroll animations (fade-in + slide-ins)
    // ====================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.fade-in, .slide-in-left, .slide-in-right'
    );

    animatedElements.forEach(el => observer.observe(el));

    // ====================
    // Lightbox (create first so galleries can use it)
    // ====================
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <img src="" alt="">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // ====================
    // Gallery System
    // ====================
    const galleries = document.querySelectorAll('[data-gallery]');

    galleries.forEach(gallery => {
        const slides = gallery.querySelectorAll('.gallery-slide');
        const dotsContainer = gallery.querySelector('.gallery-dots');
        const prevBtn = gallery.querySelector('.gallery-prev');
        const nextBtn = gallery.querySelector('.gallery-next');
        const imageWrapper = gallery.querySelector('.gallery-image-wrapper');
        let currentIndex = 0;

        // Generate dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('gallery-dot');
            dot.setAttribute('aria-label', `Go to image ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = gallery.querySelectorAll('.gallery-dot');

        function goToSlide(index) {
            slides[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');

            currentIndex = index;

            if (currentIndex >= slides.length) currentIndex = 0;
            if (currentIndex < 0) currentIndex = slides.length - 1;

            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }

        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

        // Keyboard support
        gallery.setAttribute('tabindex', '0');
        gallery.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
            if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        const viewer = gallery.querySelector('.gallery-viewer');

        viewer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        viewer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToSlide(currentIndex + 1);
                } else {
                    goToSlide(currentIndex - 1);
                }
            }
        }, { passive: true });

        // FIX: Click on image wrapper to open CURRENT slide in lightbox
        imageWrapper.addEventListener('click', () => {
            const activeSlide = slides[currentIndex];
            openLightbox(activeSlide.src, activeSlide.alt);
        });
    });

    // ====================
    // Copy Email to Clipboard
    // ====================

    const emailButton = document.getElementById('copy-email');
    const feedback = document.getElementById('copy-feedback');

    if (emailButton) {
        emailButton.addEventListener('click', async () => {
            const email = "nelson.e.mencos@gmail.com";

            try {
                await navigator.clipboard.writeText(email);
                feedback.textContent = "Email copied to clipboard!";
            } catch (err) {
                feedback.textContent = "Failed to copy email.";
            }

            // Clear message after 2 seconds
            setTimeout(() => {
                feedback.textContent = "";
            }, 2000);
        });
    }

});