document.addEventListener('DOMContentLoaded', () => {
    let menu = document.querySelector('#menu-icon');
    let navmenu = document.querySelector('.navmenu');

    menu.onclick = () => {
        menu.classList.toggle('bx-x');
        navmenu.classList.toggle('open');
    };

    const sr = ScrollReveal({
        distance: '40px',
        duration: 2400,
        reset: true
    });

    sr.reveal('.hero-text span', { delay: 400 });
    sr.reveal('.hero-img', { delay: 500, origin: 'top' });
    sr.reveal('.hero-text h5', { delay: 600, origin: 'bottom' });
    sr.reveal('.hero-text h1', { delay: 700, origin: 'bottom' });
    sr.reveal('.hero-text p', { delay: 800, origin: 'top' });
    sr.reveal('.hero-btn', { delay: 900, origin: 'top' });
    sr.reveal('.images-box', { delay: 1000, origin: 'top' });
    sr.reveal('.social-icons', { delay: 1100, origin: 'bottom' });
    sr.reveal('.scroll-btn', { delay: 1150, origin: 'top' });

    const heroImg = document.getElementById('hero-img');
    const gifDuration = 1000; // duration of your GIF in milliseconds
    const playCount = 3; // number of times the GIF should play

    // Total duration for the GIF to play the specified number of times
    const totalDuration = gifDuration * playCount;

    setTimeout(() => {
        heroImg.style.transition = 'opacity 1s';
        heroImg.style.opacity = '0'; // Start fade-out

        setTimeout(() => {
            heroImg.src = 'img/frog_idle.png'; // Change source to PNG
            heroImg.style.opacity = '1'; // Fade-in new image
        }, 1000); // Match the duration of the CSS transition
    }, totalDuration);
});
