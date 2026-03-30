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

// Scroll Progress Bar
function updateScrollProgress() {
	const scrollTop = window.pageYOffset;
	const docHeight = document.body.scrollHeight - window.innerHeight;
	const scrollPercent = (scrollTop / docHeight) * 100;
	const progressBar = document.querySelector('.scroll-progress-bar');
	
	if (progressBar) {
		progressBar.style.width = scrollPercent + '%';
	}
}

// Clean Cursor Trail
function initCursorTrail() {
	const cursor = document.querySelector('.cursor-trail');
	let mouseX = 0, mouseY = 0;
	let cursorX = 0, cursorY = 0;
	
	document.addEventListener('mousemove', (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
		cursor.classList.add('active');
	});
	
	document.addEventListener('mouseleave', () => {
		cursor.classList.remove('active');
	});
	
	function animateCursor() {
		cursorX += (mouseX - cursorX) * 0.1;
		cursorY += (mouseY - cursorY) * 0.1;
		
		cursor.style.left = cursorX - 10 + 'px';
		cursor.style.top = cursorY - 10 + 'px';
		
		requestAnimationFrame(animateCursor);
	}
	animateCursor();
}

// Enhanced Scroll Animations
function initScrollAnimations() {
	const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
	};
	
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('revealed');
			}
		});
	}, observerOptions);
	
	// Observe elements for scroll animations
	document.querySelectorAll('.portfolio-section, .game-card, .contact-content').forEach(el => {
		el.classList.add('scroll-reveal');
		observer.observe(el);
	});
}

// Performance Optimizations
function optimizePerformance() {
	// Preload critical images
	const criticalImages = [
		'img/sam_hero.jpg',
		'img/FairyForest.png',
		'img/WhitchWay.png',
		'img/BossOne.png',
		'img/RaccoonIcon.png',
		'img/frogPrinceMenu.jpg'
	];
	
	criticalImages.forEach(src => {
		const img = new Image();
		img.src = src;
	});
	
	// Optimize scroll events
	let ticking = false;
	function updateOnScroll() {
		updateScrollProgress();
		ticking = false;
	}
	
	window.addEventListener('scroll', () => {
		if (!ticking) {
			requestAnimationFrame(updateOnScroll);
			ticking = true;
		}
	});
}

// Hover "decode" scramble on headings (respects reduced motion)
function initTextScrambleHover() {
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
	const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";

	function lockHeaderLogoWidth(el, finalText) {
		el.style.display = "inline-block";
		el.style.flexShrink = "0";
		const saved = el.textContent;
		let maxW = 0;
		const len = finalText.length;
		for (let k = 0; k < 40; k++) {
			let s = "";
			for (let i = 0; i < len; i++) {
				const c = finalText[i];
				s += c === " " || c === "\n" ? c : glyphs[(Math.random() * glyphs.length) | 0];
			}
			el.textContent = s;
			maxW = Math.max(maxW, el.getBoundingClientRect().width);
		}
		el.textContent = saved;
		el.style.minWidth = Math.ceil(maxW + 6) + "px";
	}

	const nodes = document.querySelectorAll("header .logo");
	nodes.forEach((el) => {
		if (el.dataset.scrambleBound === "1") return;
		el.dataset.scrambleBound = "1";
		const finalText = el.textContent.replace(/\s+/g, " ").trim();
		el.dataset.scrambleText = finalText;
		lockHeaderLogoWidth(el, finalText);
		let timerId = null;
		el.addEventListener(
			"mouseenter",
			() => {
				if (timerId) clearInterval(timerId);
				const text = el.dataset.scrambleText;
				const len = text.length;
				let frame = 0;
				const maxFrames = 14;
				timerId = setInterval(() => {
					frame++;
					if (frame >= maxFrames) {
						clearInterval(timerId);
						timerId = null;
						el.textContent = text;
						return;
					}
					let out = "";
					for (let i = 0; i < len; i++) {
						const c = text[i];
						if (c === " " || c === "\n") {
							out += c;
							continue;
						}
						const settle = frame / maxFrames;
						if (i / len < settle) out += c;
						else out += glyphs[(Math.random() * glyphs.length) | 0];
					}
					el.textContent = out;
				}, 32);
			},
			{ passive: true }
		);
	});
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
	initCursorTrail();
	initScrollAnimations();
	initTextScrambleHover();
	optimizePerformance();
	updateScrollProgress();
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