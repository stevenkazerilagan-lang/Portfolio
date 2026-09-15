const menuIcon = document.getElementById('menu-icon');
const navLinks = document.querySelector('.nav-links');

menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

/* ===== Cursor-reactive effects =====
   Skipped for touch devices (no real pointer) and for people who've
   asked their OS for reduced motion. */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

if (!prefersReducedMotion && !isTouchDevice) {

    // Learning cards tilt slightly toward the pointer — kept subtle on purpose
    document.querySelectorAll('.learning-card').forEach((card) => {
        const maxTilt = 3; // degrees

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;  // 0 -> 1
            const y = (e.clientY - rect.top) / rect.height;  // 0 -> 1

            const rotateY = (x - 0.5) * maxTilt * 2;
            const rotateX = (0.5 - y) * maxTilt * 2;

            card.style.transform =
                `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // Portrait drifts gently toward the cursor within the about section
    const aboutSection = document.getElementById('about');
    const aboutPhoto = document.querySelector('.about-photo');

    if (aboutSection && aboutPhoto) {
        aboutSection.addEventListener('mousemove', (e) => {
            const rect = aboutSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 -> 0.5
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            const maxDrift = 5; // px
            aboutPhoto.style.transform = `translate(${x * maxDrift}px, ${y * maxDrift}px)`;
        });

        aboutSection.addEventListener('mouseleave', () => {
            aboutPhoto.style.transform = 'translate(0, 0)';
        });
    }
}

/* ===== Learning cards: click to reveal topics, blur the rest =====
   Runs regardless of motion settings since this is functional,
   not decorative. */
const learningGrid = document.getElementById('learningGrid');
const learningCards = document.querySelectorAll('.learning-card');

function setActiveLearningCard(card) {
    const isAlreadyActive = card.classList.contains('active');

    learningCards.forEach(c => c.classList.remove('active'));

    if (isAlreadyActive) {
        learningGrid.classList.remove('has-active');
    } else {
        card.classList.add('active');
        learningGrid.classList.add('has-active');
    }
}

learningCards.forEach((card) => {
    card.addEventListener('click', () => setActiveLearningCard(card));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setActiveLearningCard(card);
        }
    });
});

document.addEventListener('click', (e) => {
    if (learningGrid && !learningGrid.contains(e.target)) {
        learningCards.forEach(c => c.classList.remove('active'));
        learningGrid.classList.remove('has-active');
    }
});
