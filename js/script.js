// Performance optimized header scroll
const header = document.querySelector("header");
let ticking = false;

function updateHeader() {
	header.classList.toggle("sticky", window.scrollY > 90);
	ticking = false;
}

window.addEventListener("scroll", function() {
	if (!ticking) {
		requestAnimationFrame(updateHeader);
		ticking = true;
	}
});

// Mobile menu with performance optimization
let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.navlist');

menu.onclick = () => {
	menu.classList.toggle('bx-x');
	navlist.classList.toggle('open')
};

window.onscroll = () => {
	menu.classList.remove('bx-x');
	navlist.classList.remove('open')
};

// Optimized ScrollReveal with reduced motion support
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
	ScrollReveal({
		distance: '80px',
		duration: 2000,
		delay: 200,
		useDelay: 'always',
		viewFactor: 0.2,
		cleanup: true
	});

	ScrollReveal().reveal('.hero-text, .recent-games, .mid-left', { origin: 'left'});
	ScrollReveal().reveal('.hero-img, .mid-right', { origin: 'right'});
	ScrollReveal().reveal('.scroll, .portfolio-btn', { origin: 'bottom'});
	ScrollReveal().reveal('.mid-text', { origin: 'top'});
	ScrollReveal().reveal('.portfolio-content, .contact-content', { origin: 'right'});
}

// Lazy loading for images
const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries, observer) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			const img = entry.target;
			img.src = img.dataset.src || img.src;
			img.classList.remove('lazy');
			observer.unobserve(img);
		}
	});
});

images.forEach(img => {
	if (img.dataset.src) {
		imageObserver.observe(img);
	}
});

// Particle Background
if (typeof particlesJS !== 'undefined') {
	particlesJS('particles-js', {
		particles: {
			number: {
				value: 80,
				density: {
					enable: true,
					value_area: 800
				}
			},
			color: {
				value: '#ffffff'
			},
			shape: {
				type: 'circle',
				stroke: {
					width: 0,
					color: '#000000'
				}
			},
			opacity: {
				value: 0.5,
				random: false,
				anim: {
					enable: false,
					speed: 1,
					opacity_min: 0.1,
					sync: false
				}
			},
			size: {
				value: 3,
				random: true,
				anim: {
					enable: false,
					speed: 40,
					size_min: 0.1,
					sync: false
				}
			},
			line_linked: {
				enable: true,
				distance: 150,
				color: '#ffffff',
				opacity: 0.4,
				width: 1
			},
			move: {
				enable: true,
				speed: 6,
				direction: 'none',
				random: false,
				straight: false,
				out_mode: 'out',
				bounce: false,
				attract: {
					enable: false,
					rotateX: 600,
					rotateY: 1200
				}
			}
		},
		interactivity: {
			detect_on: 'canvas',
			events: {
				onhover: {
					enable: true,
					mode: 'repulse'
				},
				onclick: {
					enable: true,
					mode: 'push'
				},
				resize: true
			},
			modes: {
				grab: {
					distance: 400,
					line_linked: {
						opacity: 1
					}
				},
				bubble: {
					distance: 400,
					size: 40,
					duration: 2,
					opacity: 8,
					speed: 3
				},
				repulse: {
					distance: 200,
					duration: 0.4
				},
				push: {
					particles_nb: 4
				},
				remove: {
					particles_nb: 2
				}
			}
		},
		retina_detect: true
	});
}