const header = document.querySelector('header');

let headerTicking = false;



function updateHeader() {

	if (header && !header.classList.contains('sam-menubar')) {

		header.classList.toggle('sticky', window.scrollY > 90);

	}

	headerTicking = false;

}



window.addEventListener('scroll', () => {

	if (!headerTicking) {

		requestAnimationFrame(updateHeader);

		headerTicking = true;

	}

});



const menu = document.querySelector('#menu-icon');

const navlist = document.querySelector('.navlist');



if (menu && navlist) {

menu.onclick = () => {

	menu.classList.toggle('bx-x');

		navlist.classList.toggle('open');

};



	window.addEventListener('scroll', () => {

	menu.classList.remove('bx-x');

		navlist.classList.remove('open');

	});

}



function parseGameFromCard(link) {

	const card = link.querySelector('.game-card');

	if (!card) return null;



	const href = link.getAttribute('href') || '#';

	const target = link.getAttribute('target') || '';

	const title = card.querySelector('.game-details h4')?.textContent.trim() || '';

	const desc = card.querySelector('.game-details > p')?.textContent.trim() || '';

	const tags = [...card.querySelectorAll('.game-tags .tag')].map((t) => t.textContent.trim());

	const storyTitle = card.querySelector('.blog-post h5')?.textContent.trim() || '';

	const storyText = card.querySelector('.blog-post p')?.textContent.trim() || '';

	const date = card.querySelector('.blog-date')?.textContent.trim() || '';

	const playText = card.querySelector('.play-overlay span')?.textContent.trim() || 'Play Now';



	const staticImg = card.querySelector(

		'.game-image img:not(.angry-birds-hover-gif):not(.fairy-forest-hover-gif)'

	);

	const imgSrc = staticImg?.getAttribute('src') || '';

	const imgAlt = staticImg?.getAttribute('alt') || title;

	const hoverGif = card.querySelector('.angry-birds-hover-gif, .fairy-forest-hover-gif');

	const hoverSrc = hoverGif?.getAttribute('src') || '';

	const playUrl = link.getAttribute('data-play') || '';



	const engine =

		tags.find((t) => /unity|unreal|godot|sfml|flask|javascript|html|c\+\+/i.test(t)) ||

		tags[0] ||

		'Game';

	let visitLabel = 'Launch';

	if (/view code/i.test(playText)) visitLabel = 'View Source';

	else if (/visit site/i.test(playText)) visitLabel = 'Open Site';



	const genreTags = tags.filter(

		(t) => !/unity|unreal|godot|sfml|flask|javascript|html|c\+\+|web development|full-stack/i.test(t)

	);

	const genreLine = genreTags.slice(0, 2).join(' · ');

	const metaLine = [engine, genreLine, date].filter(Boolean).join(' · ');



	return {

		href,

		target,

		title,

		desc,

		tags,

		storyTitle,

		storyText,

		date,

		imgSrc,

		imgAlt,

		hoverSrc,

		playUrl,

		engine,

		metaLine,

		visitLabel,

		genreTags,

	};

}



function getGameAccent(game) {

	const byTitle = {

		'Boss Two': { color: '#ff6b5b', glow: 'rgba(255, 107, 91, 0.45)' },

		'Boss One': { color: '#e85d4a', glow: 'rgba(232, 93, 74, 0.4)' },

		'Unknown Caller': { color: '#5b8cff', glow: 'rgba(91, 140, 255, 0.4)' },

		'Flickering Hope': { color: '#f5a623', glow: 'rgba(245, 166, 35, 0.4)' },

		'Recall': { color: '#5eead4', glow: 'rgba(94, 234, 212, 0.4)' },

		'Fairy Forest': { color: '#4ade80', glow: 'rgba(74, 222, 128, 0.4)' },

		'Whitch Way': { color: '#a78bfa', glow: 'rgba(167, 139, 250, 0.4)' },

		'Sneaky Soxs': { color: '#fb923c', glow: 'rgba(251, 146, 60, 0.4)' },

		'The Frog Prince': { color: '#34d399', glow: 'rgba(52, 211, 153, 0.4)' },

	};

	if (byTitle[game.title]) return byTitle[game.title];

	if (game.tags.some((t) => /horror/i.test(t))) return { color: '#5b8cff', glow: 'rgba(91, 140, 255, 0.4)' };

	if (game.tags.some((t) => /action|boss|combat/i.test(t))) return { color: '#ff6b5b', glow: 'rgba(255, 107, 91, 0.4)' };

	if (game.tags.some((t) => /puzzle|platform/i.test(t))) return { color: '#5eead4', glow: 'rgba(94, 234, 212, 0.4)' };

	if (game.tags.some((t) => /co-op|coop/i.test(t))) return { color: '#f5a623', glow: 'rgba(245, 166, 35, 0.4)' };

	return { color: '#7c6cff', glow: 'rgba(124, 108, 255, 0.4)' };

}



function getGameAnimClass(game) {

	if (game.tags.some((t) => /horror/i.test(t))) return 'studio-window--fade';

	if (game.tags.some((t) => /action|boss/i.test(t))) return 'studio-window--snap';

	if (game.tags.some((t) => /puzzle|platform/i.test(t))) return 'studio-window--bounce';

	return 'studio-window--rise';

}



function buildGameTitlebarHtml(game) {

	return `

		<div class="studio-window-titlebar">

			<div class="studio-win-dots">

				<button type="button" class="studio-win-dot studio-win-dot--close" aria-label="Close"></button>

				<button type="button" class="studio-win-dot studio-win-dot--min" aria-label="Minimize"></button>

				<button type="button" class="studio-win-dot studio-win-dot--max" aria-label="Maximize"></button>

			</div>

			<img class="studio-win-title-icon" src="${game.imgSrc}" alt="" width="18" height="18">

			<span class="studio-window-title">${game.title}</span>

			${game.isNew ? '<span class="studio-win-title-badge">New</span>' : ''}

		</div>

	`;

}



function buildPlayTipsHtml(game) {

	const controls =

		game.title === 'Boss Two'

			? [

					['Movement', ['A', 'D']],

					['Attack', ['Left click']],

					['Special attack', ['Right click']],

					['Jump', ['Space']],

				]

			: [];



	const controlsHtml = controls.length

		? `

			<p class="studio-win-play-tips-label">Controls</p>

			<ul class="studio-win-controls">

				${controls

					.map(

						([label, keys]) => `

				<li class="studio-win-control-row">

					<span class="studio-win-control-name">${label}</span>

					<span class="studio-win-control-keys">${keys.map((key) => `<kbd>${key}</kbd>`).join('')}</span>

				</li>`

					)

					.join('')}

			</ul>`

		: '';



	return `

		<div class="studio-win-play-tips">

			${controlsHtml}

		</div>

	`;

}



function showAchievementToast(title, subtitle) {

	let toast = document.querySelector('.studio-achievement-toast');

	if (!toast) {

		toast = document.createElement('div');

		toast.className = 'studio-achievement-toast';

		toast.setAttribute('role', 'status');

		document.body.appendChild(toast);

	}



	toast.innerHTML = `<span class="studio-achievement-kicker">Achievement</span><strong>${title}</strong><span>${subtitle}</span>`;

	toast.classList.remove('is-visible');

	void toast.offsetWidth;

	toast.classList.add('is-visible');

	clearTimeout(toast._hideTimer);

	toast._hideTimer = setTimeout(() => toast.classList.remove('is-visible'), 4200);

}



function expandPlayWindow(win) {

	if (win.classList.contains('is-playing')) return;

	win.classList.add('is-playing');

	win.style.width = 'min(960px, calc(100vw - 24px))';

	win.style.maxHeight = 'calc(100dvh - 168px)';

	const top = parseInt(win.style.top, 10);

	if (Number.isFinite(top) && top > 52) win.style.top = `${Math.max(52, top - 20)}px`;

	focusWindow(win.dataset.id);

}



function pauseGamePlayer(win) {

	const playArea = win.querySelector('.studio-win-play');

	if (!playArea || playArea.dataset.loaded !== 'true') return;

	playArea.classList.add('is-paused');

	const label = playArea.querySelector('.studio-win-play-start-label');

	if (label) label.textContent = 'Resume';

	playArea.querySelector('iframe')?.contentWindow?.postMessage({ type: 'sam-os-game', action: 'pause' }, '*');

}



function startOrResumeGamePlayer(win) {

	const playArea = win.querySelector('.studio-win-play');

	const iframe = playArea?.querySelector('iframe[data-play-src]');

	if (!playArea || !iframe) return;



	const label = playArea.querySelector('.studio-win-play-start-label');



	if (!iframe.src) {

		iframe.src = iframe.dataset.playSrc;

		playArea.dataset.loaded = 'true';

		if (label) label.textContent = 'Loading…';

		expandPlayWindow(win);

		const gameTitle = win.querySelector('.studio-window-title')?.textContent;

		if (gameTitle === 'Boss Two' && !localStorage.getItem('sam-os-achievement-boss-two-play')) {

			localStorage.setItem('sam-os-achievement-boss-two-play', '1');

			showAchievementToast('Actually Played It', 'Boss Two launched in your browser');

			StudioSounds.play('achievement');

		}

	} else {

		iframe.contentWindow?.postMessage({ type: 'sam-os-game', action: 'resume' }, '*');

	}



	playArea.classList.remove('is-paused');

}



function pauseAllGamePlayers() {

	StudioOS.els.windows?.querySelectorAll('.studio-game-window.has-play').forEach(pauseGamePlayer);

}



function attachGamePlayerControls(win, game) {

	if (!game.playUrl) return;



	const playArea = win.querySelector('.studio-win-play');

	if (!playArea) return;



	playArea.classList.add('is-paused');



	playArea.querySelector('.studio-win-play-start')?.addEventListener('click', (e) => {

		e.stopPropagation();

		startOrResumeGamePlayer(win);

		StudioSounds.play('open');

	});

}



function attachGameWindowExtras(win, game) {

	const id = win.dataset.id;

	const preview = win.querySelector('.studio-win-preview');

	const hasHover = Boolean(game.hoverSrc);



	if (hasHover && preview) {

		preview.classList.add('has-hover');

		let autoplayTimer = setTimeout(() => preview.classList.add('is-autoplay'), 1400);

		preview.addEventListener('mouseenter', () => {

			clearTimeout(autoplayTimer);

			win.classList.add('is-previewing');

		});

		preview.addEventListener('mouseleave', () => win.classList.remove('is-previewing'));

	}



	win.querySelector('.studio-win-preview-expand')?.addEventListener('click', (e) => {

		e.stopPropagation();

		preview?.classList.toggle('is-expanded');

	});



	win.querySelectorAll('.studio-win-tab').forEach((tab) => {

		tab.addEventListener('click', () => {

			const panelId = tab.dataset.panel;

			win.querySelectorAll('.studio-win-tab').forEach((t) => {

				t.classList.toggle('is-active', t === tab);

				t.setAttribute('aria-selected', t === tab ? 'true' : 'false');

			});

			win.querySelectorAll('.studio-win-panel').forEach((p) => {

				p.classList.toggle('is-active', p.dataset.panel === panelId);

			});

			StudioSounds.play('tab');

		});

	});



	win.tabIndex = -1;

	win.addEventListener('keydown', (e) => {

		if (

			!game.playUrl &&

			e.key === 'Enter' &&

			!e.target.matches('input, textarea, button.studio-win-tab')

		) {

			e.preventDefault();

			win.querySelector('.studio-win-launch')?.click();

		}

		if (e.key === 'p' || e.key === 'P') {

			const tab = StudioOS.els.tabbar?.querySelector(`[data-tab-id="${id}"]`);

			tab?.classList.toggle('is-pinned');

			StudioSounds.play('tab');

		}

	});

	attachGamePlayerControls(win, game);

}



const StudioOS = {

	games: [],

	zones: [],

	windows: new Map(),

	zIndex: 100,

	focusedId: null,

	els: {},

	chromeReady: false,

};



const StudioSounds = {

	ctx: null,

	muted: false,

	ambientOn: false,

	ambientNodes: null,

	ready: false,

	dockBtn: null,



	init() {

		// Default ON — only off if the user clicked mute before

		if (localStorage.getItem('sam-os-sound-ver') !== '2') {

			localStorage.setItem('sam-os-sound-ver', '2');

			localStorage.setItem('sam-os-muted', '0');

		}

		this.muted = localStorage.getItem('sam-os-muted') === '1';

		this.ambientOn = localStorage.getItem('sam-os-ambient') === '1';



		const unlockOnce = () => {

			this.unlock();

			if (this.ambientOn && !this.muted) this.startAmbient();

		};

		document.addEventListener('pointerdown', unlockOnce, { once: true });

		document.addEventListener('keydown', unlockOnce, { once: true });

	},



	unlock() {

		const ctx = this.ensureCtx();

		if (ctx?.state === 'suspended') ctx.resume();

		this.ready = true;

	},



	ensureCtx() {

		if (!this.ctx) {

			const AC = window.AudioContext || window.webkitAudioContext;

			if (!AC) return null;

			this.ctx = new AC();

		}

		if (this.ctx?.state === 'suspended') this.ctx.resume();

		return this.ctx;

	},



	tone(ctx, { f0, f1, dur, vol, type = 'sine' }) {

		const osc = ctx.createOscillator();

		const gain = ctx.createGain();

		osc.type = type;

		osc.frequency.setValueAtTime(f0, ctx.currentTime);

		osc.frequency.linearRampToValueAtTime(f1, ctx.currentTime + dur * 0.65);

		gain.gain.setValueAtTime(0.0001, ctx.currentTime);

		gain.gain.exponentialRampToValueAtTime(Math.max(vol, 0.0001), ctx.currentTime + 0.01);

		gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);

		osc.connect(gain);

		gain.connect(ctx.destination);

		osc.start(ctx.currentTime);

		osc.stop(ctx.currentTime + dur + 0.02);

	},



	play(type) {

		if (this.muted) return;

		const ctx = this.ensureCtx();

		if (!ctx) return;



		const playNow = () => {

			const profiles = {

				open: { f0: 320, f1: 540, dur: 0.1, vol: 0.12, type: 'sine' },

				openHorror: { f0: 92, f1: 48, dur: 0.16, vol: 0.11, type: 'triangle' },

				openAction: { f0: 180, f1: 520, dur: 0.07, vol: 0.13, type: 'square' },

				openPuzzle: { f0: 540, f1: 920, dur: 0.08, vol: 0.1, type: 'sine' },

				close: { f0: 460, f1: 260, dur: 0.085, vol: 0.11, type: 'sine' },

				minimize: { f0: 240, f1: 150, dur: 0.075, vol: 0.1, type: 'triangle' },

				tab: { f0: 620, f1: 720, dur: 0.045, vol: 0.09, type: 'sine' },

				search: { f0: 480, f1: 680, dur: 0.055, vol: 0.1, type: 'sine' },

				maximize: { f0: 380, f1: 560, dur: 0.07, vol: 0.095, type: 'sine' },

				peel: { f0: 210, f1: 320, dur: 0.035, vol: 0.07, type: 'triangle' },

				thud: { f0: 120, f1: 52, dur: 0.14, vol: 0.14, type: 'triangle' },

				achievement: { f0: 660, f1: 980, dur: 0.09, vol: 0.11, type: 'sine' },

			};



			const profile = profiles[type] || profiles.tab;

			this.tone(ctx, profile);

			if (type === 'search') {

				setTimeout(() => this.tone(ctx, { f0: 700, f1: 860, dur: 0.04, vol: 0.085, type: 'sine' }), 60);

			}

			if (type === 'peel') {

				setTimeout(() => this.tone(ctx, { f0: 280, f1: 190, dur: 0.03, vol: 0.045, type: 'triangle' }), 28);

			}

			if (type === 'thud') {

				setTimeout(() => this.tone(ctx, { f0: 70, f1: 38, dur: 0.08, vol: 0.1, type: 'triangle' }), 40);

			}

			if (type === 'achievement') {

				setTimeout(() => this.tone(ctx, { f0: 880, f1: 1180, dur: 0.07, vol: 0.09, type: 'sine' }), 90);

			}

		};



		if (ctx.state === 'suspended') {

			ctx.resume().then(playNow).catch(() => {});

			return;

		}

		playNow();

	},



	playForGame(game) {

		if (!game) {

			this.play('open');

			return;

		}

		if (game.tags.some((t) => /horror/i.test(t))) this.play('openHorror');

		else if (game.tags.some((t) => /action|boss/i.test(t))) this.play('openAction');

		else if (game.tags.some((t) => /puzzle|platform/i.test(t))) this.play('openPuzzle');

		else this.play('open');

	},



	peel() {

		this.play('peel');

	},



	startAmbient() {

		if (this.muted || this.ambientOn) return;

		const ctx = this.ensureCtx();

		if (!ctx) return;



		const bufferSize = ctx.sampleRate * 2;

		const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);

		const data = buffer.getChannelData(0);

		let last = 0;

		for (let i = 0; i < bufferSize; i += 1) {

			const white = Math.random() * 2 - 1;

			last = (last + 0.02 * white) / 1.02;

			data[i] = last * 3.5;

		}



		const source = ctx.createBufferSource();

		source.buffer = buffer;

		source.loop = true;



		const filter = ctx.createBiquadFilter();

		filter.type = 'lowpass';

		filter.frequency.value = 420;



		const gain = ctx.createGain();

		gain.gain.value = 0.028;



		source.connect(filter);

		filter.connect(gain);

		gain.connect(ctx.destination);

		source.start();



		this.ambientNodes = { source, gain };

		this.ambientOn = true;

		localStorage.setItem('sam-os-ambient', '1');

		this.updateDockIcon();

	},



	stopAmbient() {

		if (this.ambientNodes?.source) {

			try {

				this.ambientNodes.source.stop();

			} catch {

				/* already stopped */

			}

		}

		this.ambientNodes = null;

		this.ambientOn = false;

		localStorage.setItem('sam-os-ambient', '0');

		this.updateDockIcon();

	},



	toggleAmbient() {

		this.unlock();

		if (this.ambientOn) {

			this.stopAmbient();

			return;

		}

		if (this.muted) {

			this.muted = false;

			localStorage.setItem('sam-os-muted', '0');

		}

		this.startAmbient();

	},



	toggleMute() {

		const wasMuted = this.muted;

		this.unlock();

		this.muted = !this.muted;

		localStorage.setItem('sam-os-muted', this.muted ? '1' : '0');

		if (this.muted) this.stopAmbient();

		else if (localStorage.getItem('sam-os-ambient') === '1') this.startAmbient();

		this.updateDockIcon();

		if (!this.muted && wasMuted) this.play('open');

	},



	updateDockIcon() {

		if (!this.dockBtn) return;

		const icon = this.muted ? 'ri-volume-mute-line' : this.ambientOn ? 'ri-cloud-windy-line' : 'ri-volume-up-line';

		this.dockBtn.innerHTML = `<i class="${icon}"></i>`;

		this.dockBtn.setAttribute(

			'data-tip',

			this.muted

				? 'Click: sound on · Double-click: ambient'

				: this.ambientOn

					? 'Ambient on · Click: mute · Double-click: ambient off'

					: 'Click: mute · Double-click: room ambient'

		);

		this.dockBtn.setAttribute('aria-label', this.muted ? 'Turn sound on' : this.ambientOn ? 'Ambient on' : 'Mute UI sounds');

		this.dockBtn.classList.toggle('is-muted', this.muted);

		this.dockBtn.classList.toggle('is-sound-off', this.muted);

		this.dockBtn.classList.toggle('is-ambient-on', this.ambientOn && !this.muted);

	},



	bindDockButton(btn) {

		this.dockBtn = btn;

		this.updateDockIcon();

	},

};



function playCrtReveal() {

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const crt = document.createElement('div');

	crt.className = 'studio-crt';

	crt.innerHTML = `
		<div class="studio-crt-half studio-crt-top"></div>
		<div class="studio-crt-half studio-crt-bot"></div>
		<div class="studio-crt-line"></div>
		<div class="studio-crt-scan"></div>
	`;

	document.body.appendChild(crt);

	crt.addEventListener('animationend', (e) => {

		if (e.target.classList.contains('studio-crt-scan')) crt.remove();

	});

	setTimeout(() => crt.remove(), 1400);

}



function runBoot(onDone) {

	if (sessionStorage.getItem('sam-os-booted') === '1') {

		onDone();

		return;

	}



	const boot = document.createElement('div');

	boot.className = 'studio-boot';

	boot.innerHTML = `

		<div class="studio-boot-inner">

			<p class="studio-boot-logo">SamOS</p>

			<p class="studio-boot-sub">game dev workstation</p>

			<div class="studio-boot-bar"><div class="studio-boot-fill"></div></div>

			<p class="studio-boot-status">Mounting portfolio...</p>

			<p class="studio-boot-skip">Click or press any key to skip</p>

		</div>

	`;

	document.body.appendChild(boot);



	const fill = boot.querySelector('.studio-boot-fill');

	const status = boot.querySelector('.studio-boot-status');

	const messages = ['Mounting portfolio...', 'Loading builds...', 'Warming shaders...', 'Ready.'];

	let progress = 0;

	let done = false;



	const finish = () => {

		if (done) return;

		done = true;

		StudioSounds.unlock();

		sessionStorage.setItem('sam-os-booted', '1');

		onDone();

		playCrtReveal();

		boot.remove();

	};



	const tick = () => {

		if (done) return;

		progress += 4 + Math.random() * 12;

		if (progress >= 100) {

			fill.style.width = '100%';

			status.textContent = messages[3];

			setTimeout(finish, 280);

			return;

		}

		fill.style.width = progress + '%';

		status.textContent = messages[Math.min(messages.length - 2, Math.floor(progress / 34))];

		requestAnimationFrame(tick);

	};



	requestAnimationFrame(tick);

	boot.addEventListener('click', finish);

	window.addEventListener('keydown', finish, { once: true });

}



function focusWindow(id) {

	StudioOS.focusedId = id;

	StudioOS.els.windows.querySelectorAll('.studio-window').forEach((win) => {

		win.classList.toggle('is-focused', win.dataset.id === id);

	});

	const win = StudioOS.windows.get(id);

	if (win) {

		win.style.zIndex = ++StudioOS.zIndex;

		if (win.classList.contains('studio-game-window')) win.focus({ preventScroll: true });

	}

	updateTabActive(id);

	StudioOS.els.windows.querySelectorAll('.studio-game-window.has-play').forEach((gameWin) => {

		if (gameWin.dataset.id !== id) pauseGamePlayer(gameWin);

	});

}



function addTab(id, title) {

	const bar = StudioOS.els.tabbar;

	if (!bar) return;

	if (bar.querySelector(`[data-tab-id="${id}"]`)) {

		updateTabActive(id);

		return;

	}



	const tab = document.createElement('button');

	tab.type = 'button';

	tab.className = 'studio-tab';

	tab.dataset.tabId = id;

	tab.setAttribute('role', 'tab');

	tab.innerHTML = `<span class="studio-tab-label">${title}</span><span class="studio-tab-pin" aria-hidden="true">📌</span><span class="studio-tab-close" aria-hidden="true">×</span>`;



	tab.addEventListener('click', (e) => {

		if (e.target.closest('.studio-tab-close')) {

			closeWindow(id);

			return;

		}

		if (e.target.closest('.studio-tab-pin')) {

			tab.classList.toggle('is-pinned');

			StudioSounds.play('tab');

			return;

		}



		showWindow(id);

		StudioSounds.play('tab');

	});



	bar.appendChild(tab);

	updateTabActive(id);

}



function updateTabActive(id) {

	StudioOS.els.tabbar?.querySelectorAll('.studio-tab').forEach((tab) => {

		tab.classList.toggle('is-active', tab.dataset.tabId === id);

		tab.setAttribute('aria-selected', tab.dataset.tabId === id ? 'true' : 'false');

	});

}



function removeTab(id) {

	StudioOS.els.tabbar?.querySelector(`[data-tab-id="${id}"]`)?.remove();

}



function buildTitlebarHtml(title) {

	return `

		<div class="studio-window-titlebar">

			<div class="studio-win-dots">

				<button type="button" class="studio-win-dot studio-win-dot--close" aria-label="Close"></button>

				<button type="button" class="studio-win-dot studio-win-dot--min" aria-label="Minimize"></button>

				<button type="button" class="studio-win-dot studio-win-dot--max" aria-label="Maximize"></button>

			</div>

			<span class="studio-window-title">${title}</span>

		</div>

	`;

}



function getMaximizeBounds(win) {

	const pad = { top: 48, right: 16, bottom: 88, left: 16 };

	const parent = win?.parentElement;

	if (parent?.matches('[data-about-slot]')) {

		const width = Math.max(280, parent.clientWidth - pad.left - pad.right);

		const height = Math.max(200, parent.clientHeight - pad.top - pad.bottom);

		return { left: pad.left, top: pad.top, width, height };

	}

	const width = Math.max(280, window.innerWidth - pad.left - pad.right);

	const height = Math.max(200, window.innerHeight - pad.top - pad.bottom);

	return { left: pad.left, top: pad.top, width, height };

}



function saveWindowGeometry(win) {

	win.dataset.savedLeft = win.style.left || '';

	win.dataset.savedTop = win.style.top || '';

	win.dataset.savedWidth = win.style.width || '';

	win.dataset.savedMaxHeight = win.style.maxHeight || '';

	win.dataset.savedHeight = win.style.height || '';

	win.dataset.savedTransform = win.style.transform || '';

}



function restoreWindowGeometry(win) {

	win.style.left = win.dataset.savedLeft || '';

	win.style.top = win.dataset.savedTop || '';

	win.style.width = win.dataset.savedWidth || '';

	win.style.maxHeight = win.dataset.savedMaxHeight || '';

	win.style.height = win.dataset.savedHeight || '';

	win.style.transform = win.dataset.savedTransform || 'none';

}



function applyMaximizeGeometry(win) {

	const bounds = getMaximizeBounds(win);

	win.style.left = `${bounds.left}px`;

	win.style.top = `${bounds.top}px`;

	win.style.width = `${bounds.width}px`;

	win.style.maxHeight = `${bounds.height}px`;

	win.style.height = `${bounds.height}px`;

	win.style.transform = 'none';

}



function updateMaximizeButton(win, isMaximized) {

	const maxBtn = win.querySelector('.studio-win-dot--max');

	if (!maxBtn) return;

	maxBtn.setAttribute('aria-label', isMaximized ? 'Restore' : 'Maximize');

	maxBtn.classList.toggle('is-restored', isMaximized);

}



function getLevelScrollTop(level) {

	const levels = [...document.querySelectorAll('.studio-level')];

	if (!level || levels.indexOf(level) <= 0) return 0;

	const pad = parseFloat(getComputedStyle(level).paddingTop) || 0;

	return level.getBoundingClientRect().top + window.scrollY + pad;

}



function scrollToLevel(level, { behavior = 'smooth' } = {}) {

	if (!level) return;

	const top = getLevelScrollTop(level);

	const root = document.documentElement;

	if (behavior === 'smooth') root.classList.add('is-level-navigating');

	window.scrollTo({ top, behavior });

	const finish = () => root.classList.remove('is-level-navigating');

	if (behavior === 'smooth') {

		let finished = false;

		const done = () => {

			if (finished) return;

			finished = true;

			finish();

		};

		window.addEventListener('scrollend', done, { once: true });

		setTimeout(done, 900);

	} else finish();

}



function scrollToStudioLevel() {

	const studio = document.getElementById('level-studio');

	if (!studio) return;

	scrollToLevel(studio, { behavior: 'smooth' });

}



function showWindow(id) {

	const win = StudioOS.windows.get(id);

	if (!win) return;

	if (id === 'about') scrollToStudioLevel();

	win.style.display = '';

	win.classList.remove('is-minimized');

	if (win.classList.contains('is-maximized')) applyMaximizeGeometry(win);

	focusWindow(id);

	updateDockAppState(id);

}



function minimizeWindow(id) {

	const win = StudioOS.windows.get(id);

	if (!win) return;

	win.classList.add('is-minimized');

	win.style.display = 'none';

	if (win.classList.contains('has-play')) pauseGamePlayer(win);

	StudioSounds.play('minimize');

	updateDockAppState(id);

}



function isWindowVisible(id) {

	const win = StudioOS.windows.get(id);

	if (!win) return false;

	return !win.classList.contains('is-minimized') && win.style.display !== 'none';

}



function toggleDockApp(id, openFn) {

	if (isWindowVisible(id)) {

		minimizeWindow(id);

		return;

	}

	openFn();

}



function updateDockAppState(id) {

	const btn = StudioOS.els.dock?.querySelector(`[data-app-id="${id}"]`);

	if (!btn) return;

	btn.classList.toggle('is-open', StudioOS.windows.has(id) && isWindowVisible(id));

}



function toggleMaximizeWindow(id) {

	const win = StudioOS.windows.get(id);

	if (!win) return;

	if (win.classList.contains('is-maximized')) {

		win.classList.remove('is-maximized');

		restoreWindowGeometry(win);

		updateMaximizeButton(win, false);

		focusWindow(id);

		StudioSounds.play('minimize');

		return;

	}

	saveWindowGeometry(win);

	win.classList.remove('is-minimized');

	win.style.display = '';

	win.classList.add('is-maximized');

	applyMaximizeGeometry(win);

	updateMaximizeButton(win, true);

	focusWindow(id);

	StudioSounds.play('maximize');

}



function attachWindowControls(win, id) {

	const closeBtn = win.querySelector('.studio-win-dot--close');

	const minBtn = win.querySelector('.studio-win-dot--min');

	let maxBtn = win.querySelector('.studio-win-dot--max');



	if (maxBtn && maxBtn.tagName === 'SPAN') {

		const replacement = document.createElement('button');

		replacement.type = 'button';

		replacement.className = 'studio-win-dot studio-win-dot--max';

		replacement.setAttribute('aria-label', 'Maximize');

		maxBtn.replaceWith(replacement);

		maxBtn = replacement;

	}



	closeBtn?.addEventListener('click', (e) => {

		e.stopPropagation();

		closeWindow(id);

	});

	minBtn?.addEventListener('click', (e) => {

		e.stopPropagation();

		minimizeWindow(id);

	});

	maxBtn?.addEventListener('click', (e) => {

		e.stopPropagation();

		toggleMaximizeWindow(id);

	});



	const titlebar = win.querySelector('.studio-window-titlebar');

	titlebar?.addEventListener('dblclick', (e) => {

		if (e.target.closest('.studio-win-dot')) return;

		toggleMaximizeWindow(id);

	});

}



function finalizeWindow(win, id, title, { game = null, container = null } = {}) {

	win.addEventListener('mousedown', () => focusWindow(id));

	attachWindowControls(win, id);

	makeDraggable(win, win.querySelector('.studio-window-titlebar'));

	const mount = container || StudioOS.els.windows;

	mount.appendChild(win);

	StudioOS.windows.set(id, win);

	focusWindow(id);

	addTab(id, title);

	if (StudioSounds.ready) {

		if (game) StudioSounds.playForGame(game);

		else StudioSounds.play('open');

	}

	updateDockAppState(id);

}



function relayoutMaximizedWindows() {

	StudioOS.windows.forEach((win) => {

		if (win.classList.contains('is-maximized')) applyMaximizeGeometry(win);

	});

}



function makeDraggable(win, handle) {

	let dragging = false;

	let startX = 0;

	let startY = 0;

	let origX = 0;

	let origY = 0;



	const onDown = (e) => {

		if (e.target.closest('.studio-win-dot')) return;

		if (win.classList.contains('is-maximized')) {

			toggleMaximizeWindow(win.dataset.id);

			return;

		}

		dragging = true;

		focusWindow(win.dataset.id);

		const rect = win.getBoundingClientRect();

		const parent = win.parentElement;

		const parentRect = parent.getBoundingClientRect();

		origX = rect.left - parentRect.left;

		origY = rect.top - parentRect.top;

		win.style.left = origX + 'px';

		win.style.top = origY + 'px';

		win.style.transform = 'none';

		startX = e.clientX;

		startY = e.clientY;

		e.preventDefault();

	};



	const onMove = (e) => {

		if (!dragging) return;

		win.style.left = origX + (e.clientX - startX) + 'px';

		win.style.top = origY + (e.clientY - startY) + 'px';

	};



	const onUp = () => {

		dragging = false;

	};



	handle.addEventListener('mousedown', onDown);

	window.addEventListener('mousemove', onMove);

	window.addEventListener('mouseup', onUp);

}



function closeWindow(id) {

	const win = StudioOS.windows.get(id);

	if (!win) return;

	win.remove();

	StudioOS.windows.delete(id);

	removeTab(id);

	StudioSounds.play('close');

	updateDockAppState(id);

	if (StudioOS.focusedId === id) StudioOS.focusedId = null;

}



function closeFocusedWindowIfUnpinned() {

	if (!StudioOS.focusedId || !isWindowVisible(StudioOS.focusedId)) return false;

	if (isProtectedFromDesktopClose(StudioOS.focusedId)) return false;

	const tab = StudioOS.els.tabbar?.querySelector(`[data-tab-id="${StudioOS.focusedId}"]`);

	if (tab?.classList.contains('is-pinned')) return false;

	closeWindow(StudioOS.focusedId);

	return true;

}



function closeTopUnpinnedWindow() {

	if (StudioOS.els.search?.classList.contains('is-open')) {

		StudioOS.closeSearch?.();

		return true;

	}

	if (closeFocusedWindowIfUnpinned()) return true;

	let topId = null;

	let topZ = -1;

	StudioOS.windows.forEach((win, id) => {

		if (!isWindowVisible(id)) return;

		if (isProtectedFromDesktopClose(id)) return;

		const tab = StudioOS.els.tabbar?.querySelector(`[data-tab-id="${id}"]`);

		if (tab?.classList.contains('is-pinned')) return;

		const z = parseInt(win.style.zIndex, 10) || 0;

		if (z >= topZ) {

			topZ = z;

			topId = id;

		}

	});

	if (topId) {

		closeWindow(topId);

		return true;

	}

	return false;

}



function handleDesktopBackgroundClick() {

	pauseAllGamePlayers();

	closeTopUnpinnedWindow();

}



function positionClutterHint(clutter) {

	const hint = clutter.querySelector('[data-clutter-hint]');

	const note = clutter.querySelector('[data-note-id="projects"]');

	if (!hint || !note || hint.classList.contains('is-dismissed')) return;

	const clutterRect = clutter.getBoundingClientRect();

	const noteRect = note.getBoundingClientRect();

	const noteCx = noteRect.left - clutterRect.left + noteRect.width * 0.45;

	const noteCy = noteRect.top - clutterRect.top + noteRect.height * 0.55;

	hint.style.left = `${Math.max(10, noteCx - 155)}px`;

	hint.style.top = `${Math.max(10, noteCy - 128)}px`;

}



function syncHudToDock() {

	const dock = StudioOS.els.dock;

	const hud = document.querySelector('.studio-hud');

	if (!dock || !hud) return;

	hud.style.width = `${dock.offsetWidth}px`;

}



function buildPlayWindowHtml(game, targetAttr, statChips, hasNotes) {

	return `

		${buildGameTitlebarHtml(game)}

		<div class="studio-window-body studio-game-body studio-game-body--player">

			<div class="studio-game-layout studio-game-layout--play">

				<div class="studio-game-preview-col">

					<div class="studio-win-play is-paused">

						<iframe data-play-src="${game.playUrl}" title="Play ${game.title}" allow="autoplay; fullscreen; gamepad *" allowfullscreen></iframe>

						<button type="button" class="studio-win-play-start" aria-label="Play ${game.title}">

							<img class="studio-win-play-poster" src="${game.imgSrc}" alt="" aria-hidden="true">

							<span class="studio-win-play-start-btn"><i class="ri-play-fill" aria-hidden="true"></i> <span class="studio-win-play-start-label">Play</span></span>

						</button>

					</div>

				</div>

				<div class="studio-game-panel-col">

					<div class="studio-game-header">

						<h3 class="studio-win-title">${game.title}</h3>

						<div class="studio-win-stats">${statChips}</div>

					</div>

					<div class="studio-win-tabs" role="tablist">

						<button type="button" class="studio-win-tab is-active" role="tab" data-panel="overview" aria-selected="true">Overview</button>

						${hasNotes ? '<button type="button" class="studio-win-tab" role="tab" data-panel="notes" aria-selected="false">Dev notes</button>' : ''}

						<button type="button" class="studio-win-tab" role="tab" data-panel="tech" aria-selected="false">Tech</button>

					</div>

					<div class="studio-win-panels">

						<div class="studio-win-panel is-active" data-panel="overview" role="tabpanel">

							<p class="studio-win-desc">${game.desc}</p>

							${buildPlayTipsHtml(game)}

						</div>

						${

							hasNotes

								? `

						<div class="studio-win-panel" data-panel="notes" role="tabpanel">

							<div class="studio-win-notes">

								<p class="studio-win-notes-label">dev notes</p>

								<h5>${game.storyTitle}</h5>

								<p>${game.storyText}</p>

								${game.date ? `<span class="studio-win-notes-date">${game.date}</span>` : ''}

							</div>

						</div>

						`

								: ''

						}

						<div class="studio-win-panel" data-panel="tech" role="tabpanel">

							<ul class="studio-win-tech-list">

								<li><span>Engine</span><strong>${game.engine}</strong></li>

								${game.date ? `<li><span>Released</span><strong>${game.date}</strong></li>` : ''}

								<li><span>Stack</span><strong>${game.tags.join(', ')}</strong></li>

							</ul>

							<div class="studio-win-tags">${game.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>

						</div>

					</div>

					<div class="studio-win-actions">

						<a href="${game.href}" class="studio-win-launch"${targetAttr}>${game.visitLabel} <i class="ri-rocket-2-line" aria-hidden="true"></i></a>

					</div>

					<p class="studio-win-play-note">In browser · <a href="${game.href}"${targetAttr}>itch.io</a></p>

					<p class="studio-win-kbd-hint"><kbd>P</kbd> pin tab</p>

				</div>

			</div>

		</div>

	`;

}



function buildWindowHtml(game) {

	const targetAttr = game.target ? ` target="${game.target}" rel="noopener noreferrer"` : '';

	const hasPreview = Boolean(game.hoverSrc);

	const hasNotes = Boolean(game.storyTitle && game.storyText);

	const hasPlay = Boolean(game.playUrl);

	const statChips = [

		game.date ? `<span class="studio-win-stat">${game.date}</span>` : '',

		`<span class="studio-win-stat studio-win-stat--engine">${game.engine}</span>`,

		...(game.genreTags || []).slice(0, 2).map((t) => `<span class="studio-win-stat">${t}</span>`),

	]

		.filter(Boolean)

		.join('');



	if (hasPlay) return buildPlayWindowHtml(game, targetAttr, statChips, hasNotes);



	return `

		${buildGameTitlebarHtml(game)}

		<div class="studio-window-body studio-game-body">

			<div class="studio-game-layout">

				<div class="studio-game-preview-col">

					<div class="studio-win-preview${hasPreview ? ' has-preview' : ''}">

						<img class="studio-win-img" src="${game.imgSrc}" alt="${game.imgAlt}" loading="lazy">

						${hasPreview ? `<img class="studio-win-img-hover" src="${game.hoverSrc}" alt="" loading="lazy" aria-hidden="true">` : ''}

						${

							hasPreview

								? `

						<div class="studio-win-preview-overlay" aria-hidden="true">

							<span class="studio-win-play-badge"><i class="ri-play-fill"></i></span>

						</div>

						`

								: ''

						}

						${game.isNew ? '<span class="studio-win-ribbon">New release</span>' : ''}

					</div>

					${

						hasPreview

							? `

					<button type="button" class="studio-win-preview-expand" aria-label="Expand preview">

						<i class="ri-fullscreen-line" aria-hidden="true"></i> Expand

					</button>

					`

							: ''

					}

				</div>

				<div class="studio-game-panel-col">

					<div class="studio-game-header">

						<h3 class="studio-win-title">${game.title}</h3>

						<div class="studio-win-stats">${statChips}</div>

					</div>

					<div class="studio-win-tabs" role="tablist">

						<button type="button" class="studio-win-tab is-active" role="tab" data-panel="overview" aria-selected="true">Overview</button>

						${hasNotes ? '<button type="button" class="studio-win-tab" role="tab" data-panel="notes" aria-selected="false">Dev notes</button>' : ''}

						<button type="button" class="studio-win-tab" role="tab" data-panel="tech" aria-selected="false">Tech</button>

					</div>

					<div class="studio-win-panels">

						<div class="studio-win-panel is-active" data-panel="overview" role="tabpanel">

							<p class="studio-win-desc">${game.desc}</p>

						</div>

						${

							hasNotes

								? `

						<div class="studio-win-panel" data-panel="notes" role="tabpanel">

							<div class="studio-win-notes">

								<p class="studio-win-notes-label">dev notes</p>

								<h5>${game.storyTitle}</h5>

								<p>${game.storyText}</p>

								${game.date ? `<span class="studio-win-notes-date">${game.date}</span>` : ''}

							</div>

						</div>

						`

								: ''

						}

						<div class="studio-win-panel" data-panel="tech" role="tabpanel">

							<ul class="studio-win-tech-list">

								<li><span>Engine</span><strong>${game.engine}</strong></li>

								${game.date ? `<li><span>Released</span><strong>${game.date}</strong></li>` : ''}

								<li><span>Stack</span><strong>${game.tags.join(', ')}</strong></li>

							</ul>

							<div class="studio-win-tags">${game.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>

						</div>

					</div>

					<div class="studio-win-actions">

						<a href="${game.href}" class="studio-win-launch"${targetAttr}>${game.visitLabel} <i class="ri-rocket-2-line" aria-hidden="true"></i></a>

					</div>

					<p class="studio-win-kbd-hint"><kbd>Enter</kbd> launch · <kbd>P</kbd> pin tab</p>

				</div>

			</div>

		</div>

	`;

}



function openGameWindow(game) {

	const id = 'game-' + game.title.replace(/\W+/g, '-').toLowerCase();



	if (StudioOS.windows.has(id)) {

		showWindow(id);

						return;

	}



	const win = document.createElement('div');

	const accent = getGameAccent(game);

	win.className = `studio-window studio-game-window ${getGameAnimClass(game)}${game.hoverSrc ? ' has-preview' : ''}${game.playUrl ? ' has-play' : ''}`;

	win.dataset.id = id;

	win.style.setProperty('--game-accent', accent.color);

	win.style.setProperty('--game-accent-glow', accent.glow);

	win.innerHTML = buildWindowHtml(game);



	const isPhone = window.matchMedia('(max-width: 600px)').matches;

	const offset = isPhone ? 0 : StudioOS.windows.size * 20;

	win.style.left = `calc(50% + ${offset}px)`;

	win.style.transform = 'translateX(-50%)';

	win.style.top = `${(isPhone ? 64 : 72) + offset}px`;

	win.style.width = 'min(720px, calc(100vw - 24px))';

	win.style.maxHeight = '';



	attachGameWindowExtras(win, game);

	finalizeWindow(win, id, game.title, { game });

}



function pinTab(id) {

	StudioOS.els.tabbar?.querySelector(`[data-tab-id="${id}"]`)?.classList.add('is-pinned');

}



function dismissClutterHint(persist = true) {

	const hint = document.querySelector('[data-clutter-hint]');

	if (!hint || hint.classList.contains('is-dismissed')) return;

	hint.classList.add('is-dismissed');

	if (persist) localStorage.setItem('sam-os-hint-dismissed-v3', '1');

}



function getClutterNoteRotation(note) {

	const inline = note.style.getPropertyValue('--note-rot');

	if (inline) return inline.trim();

	return note.classList.contains('studio-clutter-note--pink') ? '4deg' : '-5deg';

}



const DESKTOP_NOTES = [

	{

		id: 'play',

		color: 'mint',

		rot: '-5deg',

		label: 'play',

		text: 'Play my latest games →',

		onTap: () => {

			const latest = StudioOS.zones[0]?.games[0] || StudioOS.games[0];

			if (latest) openGameWindow(latest);

		},

	},

	{

		id: 'projects',

		color: 'pink',

		rot: '4deg',

		label: 'my projects',

		text: 'Browse all my games →',

		onTap: () => {

			openProjectsWindow();

		},

	},

];



function renderDesktopNote(note) {

	const wideClass = note.wide ? ' studio-clutter-note--wide' : '';

	return `

		<button type="button" class="studio-clutter-note studio-clutter-note--${note.color} studio-clutter-note--clickable${wideClass}" data-note-id="${note.id}" style="--note-rot:${note.rot}">

			<p class="studio-clutter-label">${note.label}</p>

			<p>${note.text}</p>

		</button>`;

}



function applyClutterNotePosition(note, left, top, { lift = false } = {}) {

	note.style.left = `${left}px`;

	note.style.top = `${top}px`;

	note.style.right = 'auto';

	note.style.bottom = 'auto';

	const rot = getClutterNoteRotation(note);

	note.style.transform = lift ? 'rotate(0deg) scale(1.04)' : `rotate(${rot})`;

	note.classList.add('is-placed');

}



function clampClutterNotePosition(note, container, x, y) {

	const maxX = Math.max(0, container.clientWidth - note.offsetWidth);

	const maxY = Math.max(0, container.clientHeight - note.offsetHeight);

	return {

		x: Math.min(maxX, Math.max(0, x)),

		y: Math.min(maxY, Math.max(0, y)),

	};

}



function snapClutterNoteToPixels(note, container) {

	if (note.classList.contains('is-placed')) return;

	const rect = note.getBoundingClientRect();

	const parentRect = container.getBoundingClientRect();

	applyClutterNotePosition(note, rect.left - parentRect.left, rect.top - parentRect.top);

}



function makeClutterNoteDraggable(note, container, noteId, onTap) {

	if (!note) return;

	const storageKey = `sam-os-note-pos:${noteId}`;

	const saved = window.matchMedia('(max-width: 600px)').matches ? null : localStorage.getItem(storageKey);

	if (saved) {

		try {

			const { left, top } = JSON.parse(saved);

			if (Number.isFinite(left) && Number.isFinite(top)) applyClutterNotePosition(note, left, top);

		} catch {

			/* ignore */

		}

	}



	let pointerId = null;

	let offsetX = 0;

	let offsetY = 0;

	let moveX = 0;

	let moveY = 0;

	let startClientX = 0;

	let startClientY = 0;

	let totalMove = 0;

	let rafId = null;

	const TAP_THRESHOLD = 5;



	const flushMove = () => {

		rafId = null;

		applyClutterNotePosition(note, moveX, moveY, { lift: true });

	};



	const onPointerMove = (e) => {

		if (e.pointerId !== pointerId) return;

		const parentRect = container.getBoundingClientRect();

		const next = clampClutterNotePosition(

			note,

			container,

			e.clientX - parentRect.left - offsetX,

			e.clientY - parentRect.top - offsetY

		);

		moveX = next.x;

		moveY = next.y;

		totalMove = Math.max(totalMove, Math.hypot(e.clientX - startClientX, e.clientY - startClientY));

		if (!rafId) rafId = requestAnimationFrame(flushMove);

	};



	const endDrag = (e) => {

		if (e.pointerId !== pointerId) return;

		if (rafId) {

			cancelAnimationFrame(rafId);

			rafId = null;

		}

		note.releasePointerCapture(pointerId);

		note.removeEventListener('pointermove', onPointerMove);

		pointerId = null;

		note.classList.remove('is-dragging');

		applyClutterNotePosition(note, moveX, moveY);

		if (totalMove >= TAP_THRESHOLD) {

			localStorage.setItem(storageKey, JSON.stringify({ left: moveX, top: moveY }));

			return;

		}

		onTap?.();

	};



	note.addEventListener('pointerdown', (e) => {

		if (e.button !== 0) return;

		e.preventDefault();

		snapClutterNoteToPixels(note, container);

		const parentRect = container.getBoundingClientRect();

		const rect = note.getBoundingClientRect();

		offsetX = e.clientX - rect.left;

		offsetY = e.clientY - rect.top;

		moveX = rect.left - parentRect.left;

		moveY = rect.top - parentRect.top;

		startClientX = e.clientX;

		startClientY = e.clientY;

		totalMove = 0;

		pointerId = e.pointerId;

		note.setPointerCapture(pointerId);

		note.classList.add('is-dragging');

		StudioSounds.peel();

		applyClutterNotePosition(note, moveX, moveY, { lift: true });

		note.addEventListener('pointermove', onPointerMove);

	});



	note.addEventListener('pointerup', endDrag);

	note.addEventListener('pointercancel', endDrag);

}



const PROTECTED_WINDOW_IDS = new Set(['about']);

function isProtectedFromDesktopClose(id) {

	return PROTECTED_WINDOW_IDS.has(id);

}




function initDesktopClutter(os) {

	const clutter = document.createElement('div');

	clutter.className = 'studio-clutter';

	clutter.setAttribute('aria-hidden', 'true');

	const showHint = !localStorage.getItem('sam-os-hint-dismissed-v3');

	clutter.innerHTML = `

		${showHint ? `

		<div class="studio-clutter-hint" data-clutter-hint>

			<p class="studio-clutter-hint-text">click me</p>

			<svg class="studio-clutter-hint-arrow" viewBox="0 0 140 110" aria-hidden="true">

				<path class="studio-hint-path studio-hint-path--ghost" d="M 12 14 C 34 48, 72 72, 118 88 C 124 90, 128 92, 132 94" />

				<path class="studio-hint-path" d="M 10 12 C 32 46, 70 70, 116 86 C 122 88, 126 90, 130 92" />

				<path class="studio-hint-path studio-hint-head" d="M 122 78 L 130 92 L 121 95" />

			</svg>

		</div>

		` : ''}

		${DESKTOP_NOTES.map(renderDesktopNote).join('')}

	`;

	const tabbar = os.querySelector('.studio-tabbar');

	os.insertBefore(clutter, tabbar);



	requestAnimationFrame(() => {

		clutter.querySelectorAll('.studio-clutter-note--clickable').forEach((note) => {

			if (!note.classList.contains('is-placed')) snapClutterNoteToPixels(note, clutter);

		});

		positionClutterHint(clutter);

	});



	const clutterRoot = clutter;



	DESKTOP_NOTES.forEach((noteDef) => {

		const el = clutter.querySelector(`[data-note-id="${noteDef.id}"]`);

		makeClutterNoteDraggable(el, clutterRoot, noteDef.id, () => {

			dismissClutterHint();

			noteDef.onTap?.();

		});

	});



	initMascot();

}



const MASCOT_V = '?v=studio130';

const mascotClip = (strip, w, h, count, footPad, fps, id) => ({ strip, w, h, count, footPad, fps, id });



// Each roaming character links to one of Sam's games and opens it on click.

function initMascot() {

	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Dock buddies — the characters perch on top of the dock and patrol it.
	// Every character is scaled to the same on-screen height (charH = the
	// character's real pixel height in its idle frame, measured from the art).

	const TARGET_H = 50;

	const characters = [

		{

			game: 'Boss Two',

			label: 'Open Boss Two',

			charH: 42,

			start: 0.16,

			idle: mascotClip('img/mascot/idle.png' + MASCOT_V, 96, 64, 6, 11, 6, 'idle'),

			walk: mascotClip('img/mascot/walk.png' + MASCOT_V, 96, 64, 18, 11, 17, 'walk')

		},

		{

			game: 'Recall',

			label: "Open Recall — Sam's puzzle platformer",

			charH: 16,

			h: 34,

			start: 0.40,

			idle: mascotClip('img/mascot/recall-idle.png' + MASCOT_V, 16, 16, 2, 0, 3, 'idle'),

			walk: null

		},

		{

			game: 'The Frog Prince',

			label: 'Open The Frog Prince',

			charH: 30,

			start: 0.62,

			faceLeft: true,

			idle: mascotClip('img/mascot/frog-idle.png' + MASCOT_V, 32, 32, 1, 0, 3, 'idle'),

			walk: mascotClip('img/mascot/frog-walk.png' + MASCOT_V, 48, 48, 5, 8, 8, 'walk')

		},

		{

			game: 'Sneaky Soxs',

			label: 'Open Sneaky Soxs — Sox the raccoon puzzle heist',

			charH: 138,

			start: 0.84,

			z: 0,

			idle: mascotClip('img/mascot/raccoon-idle.png' + MASCOT_V, 180, 170, 6, 2, 4, 'idle'),

			walk: mascotClip('img/mascot/raccoon-walk.png' + MASCOT_V, 180, 170, 4, 2, 10, 'walk')

		}

	];

	const mount = () => {

		const dock = StudioOS.els && StudioOS.els.dock;

		if (!dock) { requestAnimationFrame(mount); return; }

		let perch = dock.querySelector('.studio-dock-perch');

		if (!perch) {

			perch = document.createElement('div');

			perch.className = 'studio-dock-perch';

			dock.appendChild(perch);

		}

		characters.forEach((cfg) => spawnMascot(perch, cfg, reduceMotion, TARGET_H));

	};

	mount();

}



function spawnMascot(container, cfg, reduceMotion, targetH) {

	const SCALE = (cfg.h || targetH) / cfg.charH;

	const faceLeft = !!cfg.faceLeft;

	const IDLE = cfg.idle;

	const WALK = cfg.walk || cfg.idle;

	const wrap = document.createElement('div');

	wrap.className = 'studio-mascot-wrap';

	wrap.style.left = (cfg.start * 100) + '%';

	wrap.style.zIndex = String(cfg.z != null ? cfg.z : 3);

	wrap.innerHTML = `

		<div class="studio-mascot" role="button" tabindex="0" aria-label="${cfg.label}" title="${cfg.game}"></div>

	`;

	container.appendChild(wrap);



	const sprite = wrap.querySelector('.studio-mascot');



	const state = { mode: 'idle', flipped: false, busy: false, walkTimer: null, idleTimer: null, onEnd: null, anim: null };



	const detachMove = () => {

		if (state.onEnd) {

			wrap.removeEventListener('transitionend', state.onEnd);

			state.onEnd = null;

		}

	};



	// Paint a looping clip onto the sprite; frames driven by the Web Animations API.

	// Each clip's feet are pinned to the wrap's floor line via footPad.

	const playClip = (c) => {

		if (state.anim) { state.anim.cancel(); state.anim = null; }

		const w = c.w * SCALE;

		const h = c.h * SCALE;

		const total = w * c.count;

		sprite.style.width = w + 'px';

		sprite.style.height = h + 'px';

		sprite.style.marginLeft = (-w / 2) + 'px';

		sprite.style.bottom = (-c.footPad * SCALE) + 'px';

		sprite.style.backgroundImage = 'url("' + c.strip + '")';

		sprite.style.backgroundSize = total + 'px ' + h + 'px';

		sprite.style.backgroundPosition = '0 0';

		state.mode = c.id || 'clip';

		if (reduceMotion || c.count <= 1) return;

		const duration = (c.count / c.fps) * 1000;

		state.anim = sprite.animate(

			[{ backgroundPositionX: '0px' }, { backgroundPositionX: (-total) + 'px' }],

			{ duration, easing: 'steps(' + c.count + ')', iterations: Infinity }

		);

	};

	const playLoop = (c) => playClip(c);

	const setIdle = () => playClip(IDLE);



	const setFlipped = (flip) => {

		state.flipped = flip;

		sprite.classList.toggle('is-flipped', flip);

	};



	const getBounds = () => {

		const cw = container.clientWidth || 320;

		return { min: 24, max: Math.max(60, cw - 24) };

	};



	const scheduleWalk = () => {

		if (reduceMotion) return;

		clearTimeout(state.idleTimer);

		const delay = 1600 + Math.random() * 3000;

		state.idleTimer = setTimeout(() => {

			if (!state.busy && state.mode === 'idle') {

				doRoam();

			} else {

				scheduleWalk();

			}

		}, delay);

	};



	const WALK_SPEED = 72;



	// Glide the wrap (and the knight with it) to an x while looping clip c.

	const moveTo = (target, c, speed, onArrive) => {

		const bounds = getBounds();

		target = Math.round(Math.max(bounds.min, Math.min(bounds.max, target)));

		const current = wrap.offsetLeft;

		const distance = Math.abs(target - current);

		if (distance < 10) { if (onArrive) onArrive(); return; }

		const movingLeft = target < current;

		setFlipped(faceLeft ? !movingLeft : movingLeft);

		playLoop(c);

		const duration = Math.max(0.25, distance / speed);

		let arrived = false;

		const arrive = () => {

			if (arrived) return;

			arrived = true;

			detachMove();

			clearTimeout(state.walkTimer);

			wrap.style.transitionDuration = '0s';

			if (onArrive) onArrive();

		};

		const onEnd = (e) => {

			if (e.target === wrap && e.propertyName === 'left') arrive();

		};

		detachMove();

		state.onEnd = onEnd;

		wrap.addEventListener('transitionend', onEnd);

		wrap.style.transitionDuration = `${duration}s`;

		wrap.style.left = `${target}px`;

		clearTimeout(state.walkTimer);

		state.walkTimer = setTimeout(arrive, duration * 1000 + 220);

	};



	const doRoam = () => {

		const bounds = getBounds();

		const current = wrap.offsetLeft;

		const step = 32 + Math.random() * 90;

		const dir = Math.random() < 0.5 ? -1 : 1;

		let target = current + dir * step;

		if (target < bounds.min || target > bounds.max) target = current - dir * step;

		if (Math.abs(target - current) < 14) { scheduleWalk(); return; }

		moveTo(target, WALK, WALK_SPEED, () => { setIdle(); scheduleWalk(); });

	};



	const openGame = () => {

		const game = StudioOS.games.find((g) => g.title === cfg.game);

		if (game) openGameWindow(game);

	};



	sprite.addEventListener('click', openGame);

	sprite.addEventListener('keydown', (e) => {

		if (e.key === 'Enter' || e.key === ' ') {

			e.preventDefault();

			openGame();

		}

	});



	setIdle();

	if (!reduceMotion) scheduleWalk();

}



function openAboutWindow() {

	const id = 'about';

	if (StudioOS.windows.has(id)) {

		showWindow(id);

		return;

	}



	const win = document.createElement('div');

	win.className = 'studio-window studio-about-win studio-window--protected';

	win.dataset.id = id;

	win.innerHTML = `

		${buildTitlebarHtml('Sam.app')}

		<div class="studio-window-body">

			<div class="studio-about-row">

				<img class="studio-about-photo" src="img/sam_hero.jpg" alt="Sam Hu">

				<div class="studio-about-info">

					<span class="studio-about-handle">@Hamsu-dev</span>

					<div class="social-row">

						<a href="https://github.com/Hamsu-dev" target="_blank" rel="noopener" aria-label="GitHub"><i class="ri-github-line"></i></a>

						<a href="https://www.instagram.com/s1_lui/" target="_blank" rel="noopener" aria-label="Instagram"><i class="ri-instagram-line"></i></a>

						<a href="https://www.linkedin.com/in/sam-uoa/" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="ri-linkedin-box-line"></i></a>

					</div>

				</div>

			</div>

			<a href="Assets/Sam_Hu_Resume.docx.pdf" class="studio-about-cv" download><i class="ri-download-line"></i> Download CV</a>

		</div>

	`;

	if (window.matchMedia('(max-width: 600px)').matches) {

		win.style.left = '50%';

		win.style.top = '210px';

		win.style.transform = 'translateX(-50%)';

		win.style.width = 'min(330px, calc(100vw - 28px))';

	} else {

		win.style.left = '28px';

		win.style.top = '56px';

		win.style.transform = 'none';

		win.style.width = 'min(340px, calc(100vw - 32px))';

	}



	finalizeWindow(win, id, 'Sam.app', { container: document.querySelector('[data-about-slot]') });

}



function openProjectsWindow() {

	const id = 'projects';

	if (StudioOS.windows.has(id)) {

		showWindow(id);

		return;

	}



	const sections = StudioOS.zones

		.map(

			(z) => `

		<div class="studio-projects-section">

			<p class="studio-projects-label">${z.label}</p>

			<ul class="studio-projects-list">

				${z.games

					.map(

						(g) => `

					<li>

						<button type="button" class="studio-projects-item" data-title="${g.title.replace(/"/g, '&quot;')}">

							<img src="${g.imgSrc}" alt="">

							<div>

								<span>${g.title}</span>

								<small>${g.engine}</small>

							</div>

							<i class="ri-arrow-right-s-line" aria-hidden="true"></i>

						</button>

					</li>

				`

					)

					.join('')}

			</ul>

		</div>

	`

		)

		.join('');



	const win = document.createElement('div');

	win.className = 'studio-window studio-projects-win';

	win.dataset.id = id;

	win.innerHTML = `

		${buildTitlebarHtml('Projects.app')}

		<div class="studio-window-body">

			${sections}

		</div>

	`;



	if (window.matchMedia('(max-width: 600px)').matches) {

		win.style.left = '50%';

		win.style.right = 'auto';

		win.style.top = '84px';

		win.style.transform = 'translateX(-50%)';

		win.style.width = 'min(360px, calc(100vw - 24px))';

		win.style.maxHeight = 'min(64vh, 460px)';

	} else {

		win.style.left = 'auto';

		win.style.right = '104px';

		win.style.top = '72px';

		win.style.transform = 'none';

		win.style.width = 'min(340px, calc(100vw - 144px))';

		win.style.maxHeight = 'min(72vh, 560px)';

	}



	win.querySelectorAll('.studio-projects-item').forEach((btn) => {

		btn.addEventListener('click', () => {

			const game = StudioOS.games.find((g) => g.title === btn.dataset.title);

			if (game) openGameWindow(game);

		});

	});

	finalizeWindow(win, id, 'Projects');

}



function initSearch() {

	const panel = StudioOS.els.search;

	const input = panel.querySelector('.studio-search-input');

	const list = panel.querySelector('.studio-search-list');

	let highlight = 0;

	let filtered = [];



	const renderList = (query) => {

		const q = query.trim().toLowerCase();

		filtered = StudioOS.games.filter(

			(g) =>

				!q ||

				g.title.toLowerCase().includes(q) ||

				g.engine.toLowerCase().includes(q) ||

				g.tags.some((t) => t.toLowerCase().includes(q))

		);

		highlight = 0;

		list.innerHTML = filtered

			.map(

				(g, i) => `

			<button type="button" class="studio-search-item${i === 0 ? ' is-highlighted' : ''}" data-idx="${i}">

				<img src="${g.imgSrc}" alt="">

				<div><span>${g.title}</span><small>${g.engine} · ${g.metaLine.split('·').pop()?.trim() || ''}</small></div>

			</button>

		`

			)

			.join('');



		list.querySelectorAll('.studio-search-item').forEach((item) => {

			item.addEventListener('click', () => {

				openGameWindow(filtered[Number(item.dataset.idx)]);

				closeSearch();

			});

		});

	};



	const openSearch = () => {

		panel.classList.add('is-open');

		input.value = '';

		renderList('');

		StudioSounds.play('search');

		setTimeout(() => input.focus(), 50);

	};



	const closeSearch = () => {

		panel.classList.remove('is-open');

	};



	panel.addEventListener('click', (e) => {

		if (e.target === panel) closeSearch();

	});



	input.addEventListener('input', () => renderList(input.value));



	input.addEventListener('keydown', (e) => {

		if (e.key === 'Escape') {

			closeSearch();

			return;

		}

		if (e.key === 'ArrowDown') {

			e.preventDefault();

			highlight = Math.min(highlight + 1, filtered.length - 1);

			list.querySelectorAll('.studio-search-item').forEach((el, i) => el.classList.toggle('is-highlighted', i === highlight));

		}

		if (e.key === 'ArrowUp') {

			e.preventDefault();

			highlight = Math.max(highlight - 1, 0);

			list.querySelectorAll('.studio-search-item').forEach((el, i) => el.classList.toggle('is-highlighted', i === highlight));

		}

		if (e.key === 'Enter' && filtered[highlight]) {

			openGameWindow(filtered[highlight]);

			closeSearch();

		}

	});



	window.addEventListener('keydown', (e) => {

		if (e.key === '/' && !e.target.matches('input, textarea')) {

			e.preventDefault();

			openSearch();

		}

		if (e.key === 'Escape') {

			if (panel.classList.contains('is-open')) closeSearch();

			else closeTopUnpinnedWindow();

		}

	});



	StudioOS.closeSearch = closeSearch;

	StudioOS.openSearch = openSearch;

}



function getWallpaperPeriod(hour = new Date().getHours()) {

	if (hour >= 5 && hour < 8) return 'dawn';

	if (hour >= 8 && hour < 17) return 'day';

	if (hour >= 17 && hour < 20) return 'dusk';

	return 'night';

}



function applyWallpaperTime(wallpaper) {

	if (!wallpaper) return;

	wallpaper.dataset.time = getWallpaperPeriod();

}



function initWallpaperTime(os) {

	const wallpaper = os.querySelector('.studio-wallpaper');

	if (!wallpaper) return;

	applyWallpaperTime(wallpaper);

	if (StudioOS.wallpaperTimer) clearInterval(StudioOS.wallpaperTimer);

	StudioOS.wallpaperTimer = setInterval(() => applyWallpaperTime(wallpaper), 60000);

}



function parseLevelGames(levelEl) {

	const games = [];

	levelEl.querySelectorAll('.portfolio-section').forEach((section) => {

		const grid = section.querySelector('.games-grid');

		if (!grid) return;

		const label = section.querySelector('.section-title')?.textContent.trim() || 'Projects';

		const sectionGames = [...grid.querySelectorAll('.portfolio-game')].map(parseGameFromCard).filter(Boolean);

		sectionGames.forEach((g) => {

			g.zoneLabel = label;

		});

		games.push(...sectionGames);

	});

	return games;

}



function buildStudioLevelShell(wallpaper = 'day') {

	const os = document.createElement('div');

	os.className = 'studio-os studio-os--lite';

	os.innerHTML = `<div class="studio-wallpaper" data-time="${wallpaper}" aria-hidden="true"></div>`;

	return os;

}



function renderLevelGamesPanel(panel, games, heading, blurb) {

	panel.innerHTML = `

		<div class="studio-level-panel-head">

			<h3>${heading}</h3>

			<p>${blurb}</p>

		</div>

		<div class="studio-level-grid">

			${games

				.map(

					(g) => `

				<a class="studio-level-card" href="${g.href}" ${g.target ? `target="${g.target}" rel="noopener"` : ''}>

					<img src="${g.imgSrc}" alt="${g.imgAlt || g.title}">

					<div>

						<h4>${g.title}</h4>

						<p>${g.desc}</p>

					</div>

					<i class="${g.playUrl ? 'ri-play-circle-line' : 'ri-external-link-line'}" aria-hidden="true"></i>

				</a>`

				)

				.join('')}

		</div>`;

}



function renderLevelConnectPanel(panel) {

	panel.innerHTML = `

		<div class="studio-level-panel-head">

			<h3>Reach out</h3>

			<p>More levels and pages coming soon. For now — play the games, grab my CV, or say hi.</p>

		</div>

		<div class="studio-level-socials">

			<a href="https://github.com/Hamsu-dev" target="_blank" rel="noopener" aria-label="GitHub"><i class="ri-github-line"></i></a>

			<a href="https://www.instagram.com/s1_lui/" target="_blank" rel="noopener" aria-label="Instagram"><i class="ri-instagram-line"></i></a>

			<a href="https://www.linkedin.com/in/sam-uoa/" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="ri-linkedin-box-line"></i></a>

			<a href="https://hamsu-dev.itch.io/" target="_blank" rel="noopener" aria-label="itch.io"><i class="ri-gamepad-line"></i></a>

		</div>

		<div class="studio-level-actions">

			<a class="is-primary" href="Assets/Sam_Hu_Resume.docx.pdf" download>Download CV</a>

			<a class="is-ghost" href="https://hamsu-dev.itch.io/" target="_blank" rel="noopener">Play on itch.io</a>

		</div>`;

}



function initStudioLevelLite(levelEl) {

	const portfolioContent = levelEl.querySelector('.portfolio-content');

	if (!portfolioContent) return;

	const wallpaper = levelEl.dataset.wallpaper || 'day';

	const os = buildStudioLevelShell(wallpaper);

	portfolioContent.replaceChildren(os);

	initWallpaperTime(os);

}



function initConnectFinale(levelEl) {

	const portfolioContent = levelEl.querySelector('.portfolio-content');

	if (!portfolioContent) return;

	const wallpaper = levelEl.dataset.wallpaper || 'night';

	const sections = (StudioOS.zones || [])

		.map(

			(z) => `

		<div class="studio-projects-section">

			<p class="studio-projects-label">${z.label}</p>

			<ul class="studio-projects-list">

				${z.games

					.map(

						(g) => `

					<li>

						<button type="button" class="studio-projects-item" data-title="${g.title.replace(/"/g, '&quot;')}">

							<img src="${g.imgSrc}" alt="">

							<div>

								<span>${g.title}</span>

								<small>${g.engine}</small>

							</div>

							<i class="ri-arrow-right-s-line" aria-hidden="true"></i>

						</button>

					</li>

				`

					)

					.join('')}

			</ul>

		</div>

	`

		)

		.join('');

	const os = document.createElement('div');

	os.className = 'studio-os studio-os--lite studio-os--finale';

	os.innerHTML = `

		<div class="studio-wallpaper" data-time="${wallpaper}" aria-hidden="true"></div>

		<div class="studio-sky" aria-hidden="true">

			<div class="sky-aurora"><div class="sky-aurora-glow"></div></div>

			<div class="sky-stars sky-stars--far"></div>

			<div class="sky-stars sky-stars--near"></div>

		</div>

		<div class="studio-finale">

			<div class="studio-finale-head">

				<h2 class="studio-finale-title">Let's make something.</h2>

				<p class="studio-finale-sub">Thanks for stopping by — grab my CV, play a game, or say hi.</p>

			</div>

			<div class="studio-finale-apps">

				<div class="studio-finale-win studio-about-win">

					${buildTitlebarHtml('Sam.app')}

					<div class="studio-window-body">

						<img class="studio-about-photo" src="img/sam_hero.jpg" alt="Sam Hu">

						<div class="studio-finale-about-name">Sam Hu</div>

						<span class="studio-about-handle">@Hamsu-dev</span>

						<div class="social-row">

							<a href="https://github.com/Hamsu-dev" target="_blank" rel="noopener" aria-label="GitHub"><i class="ri-github-line"></i></a>

							<a href="https://www.instagram.com/s1_lui/" target="_blank" rel="noopener" aria-label="Instagram"><i class="ri-instagram-line"></i></a>

							<a href="https://www.linkedin.com/in/sam-uoa/" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="ri-linkedin-box-line"></i></a>

						</div>

						<a href="Assets/Sam_Hu_Resume.docx.pdf" class="studio-about-cv" download><i class="ri-download-line"></i> Download CV</a>

					</div>

				</div>

				<div class="studio-finale-win studio-projects-win">

					${buildTitlebarHtml('Projects.app')}

					<div class="studio-window-body">

						${sections}

					</div>

				</div>

			</div>

		</div>

	`;

	portfolioContent.replaceChildren(os);

	initWallpaperTime(os);

	os.querySelectorAll('.studio-projects-item').forEach((btn) => {

		btn.addEventListener('click', () => {

			const g = StudioOS.games.find((x) => x.title === btn.dataset.title);

			if (g) openGameWindow(g);

		});

	});

	const finale = os.querySelector('.studio-finale');

	const io = new IntersectionObserver((entries) => {

		entries.forEach((entry) => {

			finale.classList.toggle('is-open', entry.isIntersecting);

		});

	}, { threshold: 0.2 });

	io.observe(finale);

}



const PROJECT_PAGES = {

	'boss-two': {

		num: '02',

		kicker: 'Featured Project',

		title: 'Boss Two',

		hero: 'img/BossTwoHero.png',

		video: 'videos/boss-two-trailer.mp4',

		hook: 'Read the pattern. Time the dodge. Topple the titan.',

		facts: ['Unity', 'Boss Fight', 'Jun 2026'],

		gameTitle: 'Boss Two',

		playLabel: 'Play Boss Two',

		itch: 'https://hamsu-dev.itch.io/bosstwo',

		role: 'Solo project · Boss FSM & C# gameplay',

		work: [

			'Hit-confirmed combos — attack state only chains the next swing if the last one landed.',

			'Intent dispatcher — Move and Idle poll for openings, then hand off to the matching state.',

			'State machine core — Enter/Update/Exit lifecycle shared by every player and boss state.',

		],

		code: [

			{

				file: 'StateMachine.cs · core',

				lang: 'C#',

				caption: 'Tiny state machine: every transition runs Exit then Enter.',

				snippet: `public class StateMachine
{
    public EntityState currentState { get; private set; }

    public void Initialize(EntityState startState)
    {
        currentState = startState;
        currentState.Enter();
    }

    // One transition path: exit the old, enter the new.
    public void ChangeState(EntityState newState)
    {
        currentState.Exit();
        currentState = newState;
        currentState.Enter();
    }

    public void UpdateActiveState() => currentState.Update();
}`,

			},

			{

				file: 'Boss_AttackState.cs · combo',

				lang: 'C#',

				caption: 'Combo advances on animation events and only if a hit connected.',

				snippet: `public override void Update()
{
    base.Update();

    // Hit-confirm: chain mid-combo the instant a swing lands.
    if (TryChainFromAttackOneHit())
        return;

    // Wait for the swing's animation event to resolve the step.
    if (!triggeredCalled)
        return;

    triggeredCalled = false;

    if (ShouldContinueCombo())
    {
        comboStep++;
        BeginSwing();
        return;
    }

    enemy.OnAttackSequenceEnded();
    enemy.CompleteAttackAndTransition(stateMachine);
}`,

			},

		],

	},

	'sneaky-soxs': {

		num: '03',

		kicker: 'Featured Project',

		title: 'Sneaky Soxs',

		hero: 'img/SneakySoxsHero.jpg',

		video: 'videos/sneaky-soxs-trailer.mp4',

		hook: 'Outsmart the guards. Crack the security. Pull off the heist.',

		facts: ['Godot', '2D Stealth / Puzzle', 'Team Project'],

		gameTitle: 'Sneaky Soxs',

		playLabel: 'Play Sneaky Soxs',

		itch: 'https://hamsu-dev.itch.io/sock-for-sox',

		role: 'Team project · Player movement & gameplay programming',

		work: [

			'Player state machine — thirteen states share an Enter/Update/Exit lifecycle for idle, run, jump, dash and wall climb.',

			'Forgiving jump feel — coyote time and jump buffering let slightly late or early presses still register cleanly.',

			'Wall climbing — raycasts grab ledges and walls while a stamina budget limits how long you cling.',

		],

		code: [

			{

				file: 'player.gd · state machine',

				lang: 'GDScript',

				caption: 'Active state drives movement, and every transition runs Exit then Enter.',

				snippet: `extends CharacterBody2D
class_name PlayerController

func _physics_process(delta):
    GetInputStates()
    UpdateRayCast()
    PushObjects()
    currentState.Update(delta)   # active state drives movement
    move_and_slide()

# A transition exits the old state, then enters the new one
func ChangeState(nextState):
    if nextState == null or currentState == nextState:
        return
    previousState = currentState
    currentState.ExitState()
    currentState = nextState
    currentState.EnterState()`,

			},

			{

				file: 'player.gd · jump feel',

				lang: 'GDScript',

				caption: 'Coyote time and a jump buffer keep jumps responsive near ledges.',

				snippet: `# Walked off a ledge? Start coyote time, do not just fall
func HandleFalling():
    if not is_on_floor():
        CoyoteTimer.start(CoyoteTime)
        ChangeState(States.Fall)

# Pressed jump a touch early? Buffer it for a few frames
func HandleJumpBuffer():
    if KeyJumpPressed and CoyoteTimer.time_left <= 0:
        JumpBufferTimer.start(JumpBufferTime)

func HandleJump():
    if is_on_floor() and jumps < MaxJumps:
        if KeyJumpPressed or JumpBufferTimer.time_left > 0:
            JumpBufferTimer.stop()
            jumps += 1
            ChangeState(States.Jump)
    elif CoyoteTimer.time_left > 0 and KeyJumpPressed:
        CoyoteTimer.stop()
        jumps += 1
        ChangeState(States.Jump)`,

			},

		],

	},

};



function initProjectLevel(levelEl) {

	const portfolioContent = levelEl.querySelector('.portfolio-content');

	if (!portfolioContent) return;

	const cfg = PROJECT_PAGES[levelEl.dataset.project];

	if (!cfg) { initStudioLevelLite(levelEl); return; }

	const wallpaper = levelEl.dataset.wallpaper || 'night';

	const os = document.createElement('div');

	os.className = 'studio-os studio-os--lite studio-os--page studio-os--project';

	os.innerHTML = `

		<div class="studio-wallpaper" data-time="${wallpaper}" aria-hidden="true"></div>

		<div class="studio-sky" aria-hidden="true">

			<div class="sky-aurora"><div class="sky-aurora-glow"></div></div>

			<div class="sky-stars sky-stars--far"></div>

			<div class="sky-stars sky-stars--near"></div>

		</div>

		<div class="proj">

			<button type="button" class="proj-media${cfg.video ? ' has-video' : ''}" aria-label="Play ${cfg.title}">

				${cfg.video

					? `<video class="proj-hero" poster="${cfg.hero}" muted playsinline preload="none" data-src="${cfg.video}"></video><span class="proj-media-badge"><i class="ri-movie-line"></i> Trailer</span><span class="proj-media-play proj-media-replay" role="button" tabindex="0" aria-label="Replay trailer"><i class="ri-restart-line"></i></span>`

					: `<img class="proj-hero" src="${cfg.hero}" alt="${cfg.title}"><span class="proj-media-play"><i class="ri-play-fill"></i></span>`}

			</button>

			<div class="proj-info">

				<p class="proj-kicker"><span>${cfg.num}</span> ${cfg.kicker}</p>

				<h2 class="proj-title">${cfg.title}</h2>

				<p class="proj-hook">${cfg.hook}</p>

				<div class="proj-facts">${cfg.facts.map((f) => `<span>${f}</span>`).join('')}</div>

				<div class="proj-cta">

					<button type="button" class="proj-play"><i class="ri-play-fill"></i> ${cfg.playLabel || 'Play now'}</button>

					<a class="proj-link" href="${cfg.itch}" target="_blank" rel="noopener">View on itch.io <i class="ri-external-link-line"></i></a>

				</div>

			</div>

		</div>

	`;

	const deepHTML = buildProjectDeep(cfg);

	if (deepHTML) os.insertAdjacentHTML('beforeend', deepHTML);

	portfolioContent.replaceChildren(os);

	initWallpaperTime(os);

	const deep = os.querySelector('.proj-deep');

	if (deep) {

		deep.querySelectorAll('.proj-code-tab').forEach((tab) => {

			tab.addEventListener('click', () => {

				const i = tab.dataset.i;

				deep.querySelectorAll('.proj-code-tab, .proj-code-pane, .proj-code-cap').forEach((el) => {

					el.classList.toggle('is-active', el.dataset.i === i);

				});

			});

		});

		const revealIO = new IntersectionObserver((entries, obs) => {

			entries.forEach((entry) => {

				if (entry.isIntersecting) { deep.classList.add('is-in'); obs.disconnect(); }

			});

		}, { threshold: 0.16 });

		revealIO.observe(deep);

	}

	const launch = () => {

		if (cfg.gameTitle) {

			const g = StudioOS.games.find((x) => x.title === cfg.gameTitle);

			if (g) { openGameWindow(g); return; }

		}

		if (cfg.itch) window.open(cfg.itch, '_blank', 'noopener');

	};

	os.querySelector('.proj-play')?.addEventListener('click', launch);

	os.querySelector('.proj-media')?.addEventListener('click', launch);

	initProjectTilt(os.querySelector('.proj-media'));

	const video = os.querySelector('video.proj-hero');

	if (video) {

		const media = os.querySelector('.proj-media');

		const replay = os.querySelector('.proj-media-replay');

		video.addEventListener('ended', () => media?.classList.add('is-ended'));

		video.addEventListener('play', () => media?.classList.remove('is-ended'));

		const doReplay = (e) => {

			e.stopPropagation();

			video.currentTime = 0;

			video.play().catch(() => {});

		};

		replay?.addEventListener('click', doReplay);

		replay?.addEventListener('keydown', (e) => {

			if (e.key === 'Enter' || e.key === ' ') doReplay(e);

		});

		const io = new IntersectionObserver((entries) => {

			entries.forEach((entry) => {

				if (entry.isIntersecting) {

					if (!video.src) video.src = video.dataset.src;

					if (!video.ended) video.play().catch(() => {});

				} else {

					video.pause();

				}

			});

		}, { threshold: 0.25 });

		io.observe(video);

	}

}



function highlightCode(src) {

	const esc = src.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

	const kws = 'public|private|protected|internal|static|void|class|struct|enum|new|return|if|else|switch|case|default|break|continue|for|foreach|while|do|in|using|namespace|var|float|int|bool|string|double|true|false|null|this|base|override|virtual|abstract|const|readonly|get|set|out|ref|func|extends|class_name|and|or|not|elif|pass|self|signal|onready|export|match|await|yield';

	const re = new RegExp(

		'(\\/\\/[^\\n]*|#[^\\n]*)' +

		'|("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')' +

		'|(\\b\\d+(?:\\.\\d+)?f?\\b)' +

		'|(\\b(?:' + kws + ')\\b)' +

		'|(\\b[A-Z][A-Za-z0-9_]*\\b)',

		'g');

	const html = esc.replace(re, (m, com, str, num, kw, type) => {

		if (com) return `<span class="tok-com">${com}</span>`;

		if (str) return `<span class="tok-str">${str}</span>`;

		if (num) return `<span class="tok-num">${num}</span>`;

		if (kw) return `<span class="tok-kw">${kw}</span>`;

		if (type) return `<span class="tok-type">${type}</span>`;

		return m;

	});

	return html.split('\n').map((line) => `<span class="proj-code-line">${line || ' '}</span>`).join('');

}



function buildProjectDeep(cfg) {

	const hasWork = Array.isArray(cfg.work) && cfg.work.length;

	const hasCode = Array.isArray(cfg.code) && cfg.code.length;

	if (!hasWork && !hasCode) return '';

	const workCol = hasWork

		? `<div class="proj-work">

				<p class="proj-deep-kicker">What I worked on</p>

				${cfg.role ? `<p class="proj-role">${cfg.role}</p>` : ''}

				<ul class="proj-work-list">${cfg.work.map((w) => `<li>${w}</li>`).join('')}</ul>

			</div>`

		: '';

	const codeCol = hasCode

		? `<div class="proj-code-wrap">

				<div class="proj-code">

					<div class="proj-code-head">

						<span class="proj-code-dots"><i></i><i></i><i></i></span>

						<div class="proj-code-tabs">${cfg.code.map((c, i) => `<button type="button" class="proj-code-tab${i === 0 ? ' is-active' : ''}" data-i="${i}">${c.file}</button>`).join('')}</div>

					</div>

					<div class="proj-code-panes">${cfg.code.map((c, i) => `<div class="proj-code-pane${i === 0 ? ' is-active' : ''}" data-i="${i}"><pre class="proj-code-body"><code>${highlightCode(c.snippet)}</code></pre></div>`).join('')}</div>

				</div>

				${cfg.code.map((c, i) => `<p class="proj-code-cap${i === 0 ? ' is-active' : ''}" data-i="${i}">${c.caption || ''}</p>`).join('')}

			</div>`

		: '';

	return `<section class="proj-deep"><div class="proj-deep-inner">${workCol}${codeCol}</div></section>`;

}



function initProjectTilt(media) {

	if (!media) return;

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	let raf = null, rx = 0, ry = 0;

	const apply = () => {

		raf = null;

		media.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;

	};

	media.addEventListener('pointermove', (e) => {

		const r = media.getBoundingClientRect();

		const px = (e.clientX - r.left) / r.width - 0.5;

		const py = (e.clientY - r.top) / r.height - 0.5;

		ry = px * 10;

		rx = -py * 10;

		if (!raf) raf = requestAnimationFrame(apply);

	});

	media.addEventListener('pointerleave', () => {

		rx = 0; ry = 0;

		if (!raf) raf = requestAnimationFrame(apply);

	});

}



function initLevelScrollBlend() {

	const levels = [...document.querySelectorAll('.studio-level')];

	if (!levels.length) return;

	const update = () => {

		const vh = window.innerHeight;

		let activeId = null;

		let bestRatio = -1;

		levels.forEach((level) => {

			const rect = level.getBoundingClientRect();

			const visibleTop = Math.max(0, rect.top);

			const visibleBottom = Math.min(vh, rect.bottom);

			const visibleH = Math.max(0, visibleBottom - visibleTop);

			const ratio = Math.min(1, visibleH / vh);

			if (ratio > bestRatio) {

				bestRatio = ratio;

				activeId = level.id;

			}

			level.classList.toggle('is-level-focused', ratio > 0.78);

		});

		if (StudioOS.els.levelRail && activeId) {

			StudioOS.els.levelRail.querySelectorAll('.studio-level-rail-item').forEach((item) => {

				item.classList.toggle('is-active', item.dataset.levelTarget === activeId);

			});

		}

	};



	let ticking = false;

	window.addEventListener(

		'scroll',

		() => {

			if (!ticking) {

				requestAnimationFrame(() => {

					update();

					ticking = false;

				});

				ticking = true;

			}

		},

		{ passive: true }

	);

	update();

}



function initStudioLevelRail() {

	const levels = [...document.querySelectorAll('.studio-level')];

	if (!levels.length) return;

	const rail = document.createElement('nav');

	rail.className = 'studio-level-rail';

	rail.setAttribute('aria-label', 'Site levels');

	levels.forEach((level) => {

		const id = level.id;

		if (!id) return;

		const num = level.dataset.levelNum || '00';

		const title = level.dataset.levelTitle || 'Level';

		const link = document.createElement('a');

		link.className = 'studio-level-rail-item';

		link.href = `#${id}`;

		link.dataset.levelTarget = id;

		link.innerHTML = `<span class="studio-level-rail-num">${num}</span><span class="studio-level-rail-name">${title}</span><span class="studio-level-rail-dot" aria-hidden="true"></span>`;

		link.addEventListener('click', (e) => {

			e.preventDefault();

			scrollToLevel(level, { behavior: 'smooth' });

		});

		rail.appendChild(link);

	});

	document.body.appendChild(rail);

	StudioOS.els.levelRail = rail;

	if (levels[0]?.id) {

		rail.querySelector(`[data-level-target="${levels[0].id}"]`)?.classList.add('is-active');

	}

}



function initStudioChrome() {

	if (StudioOS.chromeReady) return;

	StudioOS.chromeReady = true;

	initStudioLevelRail();

	const dock = document.createElement('div');

	dock.className = 'studio-dock';

	document.body.appendChild(dock);

	StudioOS.els.dock = dock;

	const windows = document.createElement('div');

	windows.className = 'studio-windows';

	document.body.appendChild(windows);

	StudioOS.els.windows = windows;

	const tabbar = document.createElement('div');

	tabbar.className = 'studio-tabbar';

	tabbar.setAttribute('role', 'tablist');

	tabbar.setAttribute('aria-label', 'Open windows');

	document.body.appendChild(tabbar);

	StudioOS.els.tabbar = tabbar;

	const search = document.createElement('div');

	search.className = 'studio-search';

	search.setAttribute('aria-hidden', 'true');

	search.innerHTML = `

		<div class="studio-search-panel">

			<input class="studio-search-input" type="text" placeholder="Search projects..." autocomplete="off">

			<div class="studio-search-list"></div>

		</div>

	`;

	document.body.appendChild(search);

	StudioOS.els.search = search;

	const soundDock = document.createElement('button');

	soundDock.type = 'button';

	soundDock.className = 'studio-dock-item studio-dock-app studio-dock-sound';

	let lastSoundClick = 0;

	soundDock.addEventListener('click', () => {

		const now = Date.now();

		if (now - lastSoundClick < 280) {

			lastSoundClick = 0;

			StudioSounds.toggleMute();

			StudioSounds.toggleAmbient();

			return;

		}

		lastSoundClick = now;

		StudioSounds.toggleMute();

	});

	dock.appendChild(soundDock);

	StudioSounds.bindDockButton(soundDock);

	const projectsDock = document.createElement('button');

	projectsDock.type = 'button';

	projectsDock.className = 'studio-dock-item studio-dock-app';

	projectsDock.dataset.appId = 'projects';

	projectsDock.setAttribute('data-tip', 'Browse all projects');

	projectsDock.setAttribute('aria-label', 'Browse all projects');

	projectsDock.innerHTML = '<i class="ri-folder-open-line"></i>';

	projectsDock.addEventListener('click', () => toggleDockApp('projects', openProjectsWindow));

	dock.appendChild(projectsDock);

	const aboutDock = document.createElement('button');

	aboutDock.type = 'button';

	aboutDock.className = 'studio-dock-item studio-dock-app';

	aboutDock.dataset.appId = 'about';

	aboutDock.setAttribute('data-tip', 'Sam.app — about me');

	aboutDock.setAttribute('aria-label', 'About me and bio');

	aboutDock.innerHTML = '<i class="ri-user-smile-line"></i>';

	aboutDock.addEventListener('click', () => toggleDockApp('about', openAboutWindow));

	dock.appendChild(aboutDock);

	const cvDock = document.createElement('a');

	cvDock.className = 'studio-dock-item studio-dock-app';

	cvDock.href = 'Assets/Sam_Hu_Resume.docx.pdf';

	cvDock.download = '';

	cvDock.setAttribute('data-tip', 'Download my CV');

	cvDock.setAttribute('aria-label', 'Download CV');

	cvDock.innerHTML = '<i class="ri-file-download-line"></i>';

	dock.appendChild(cvDock);

	const itchDock = document.createElement('a');

	itchDock.className = 'studio-dock-item studio-dock-app';

	itchDock.href = 'https://hamsu-dev.itch.io/';

	itchDock.target = '_blank';

	itchDock.rel = 'noopener';

	itchDock.setAttribute('data-tip', 'Play on itch.io');

	itchDock.setAttribute('aria-label', 'Play games on itch.io');

	itchDock.innerHTML = '<i class="ri-gamepad-line"></i>';

	dock.appendChild(itchDock);

	syncHudToDock();

	if (!StudioOS.resizeBound) {

		StudioOS.resizeBound = true;

		let resizeTimer;

		window.addEventListener('resize', () => {

			clearTimeout(resizeTimer);

			resizeTimer = setTimeout(() => {

				relayoutMaximizedWindows();

				syncHudToDock();

			}, 100);

		});

	}

}



function initStudioWorld() {

	StudioSounds.init();

	initStudioChrome();

	const levels = [...document.querySelectorAll('.studio-level')];

	if (!levels.length) return;

	levels.forEach((levelEl, index) => {

		if (index === 0) initStudioOS(levelEl);

		else if (levelEl.dataset.project) initProjectLevel(levelEl);

		else if (levelEl.dataset.levelKind === 'connect') initConnectFinale(levelEl);

		else initStudioLevelLite(levelEl);

	});

	initLevelScrollBlend();

}



function initHeroHeadline(os) {

	if (!os || os.querySelector('.studio-hero')) return;

	const hero = document.createElement('div');

	hero.className = 'studio-hero';

	hero.setAttribute('aria-hidden', 'true');

	hero.innerHTML = `

		<p class="studio-hero-kicker"></p>

		<h1 class="studio-hero-title"></h1>

		<p class="studio-hero-sub"></p>

	`;

	os.appendChild(hero);



	const kicker = hero.querySelector('.studio-hero-kicker');

	const title = hero.querySelector('.studio-hero-title');

	const sub = hero.querySelector('.studio-hero-sub');

	kicker.innerHTML = '<span class="studio-hero-dot"></span>Available for work · Auckland, NZ';

	sub.textContent = 'Game Developer · making games worth playing';



	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const words = [{ text: 'Sam', accent: false }, { text: 'Hu', accent: true }];

	let li = 0;

	words.forEach((word, wi) => {

		const wspan = document.createElement('span');

		wspan.className = 'studio-hero-word' + (word.accent ? ' is-accent' : '');

		[...word.text].forEach((ch) => {

			const letter = document.createElement('span');

			letter.className = 'studio-hero-letter';

			letter.textContent = ch;

			if (!reduce) letter.style.animationDelay = (0.35 + li * 0.06) + 's';

			li++;

			wspan.appendChild(letter);

		});

		title.appendChild(wspan);

		if (wi < words.length - 1) title.appendChild(document.createTextNode('\u00A0'));

	});

}



function initHeroSky(os) {

	const sky = os?.querySelector('.studio-sky');

	if (!sky) return;

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;



	// Cursor-reactive 3D parallax — layers shift toward the pointer at varying
	// depth so the desktop reads as stacked planes: wallpaper (deepest, gently
	// counter-moves), sky/stars (mid), hero headline (foreground, floats most).

	const auroraEl = sky.querySelector('.sky-aurora');

	const farEl = sky.querySelector('.sky-stars--far');

	const nearEl = sky.querySelector('.sky-stars--near');

	const wallEl = os.querySelector('.studio-wallpaper');

	if (wallEl) {

		wallEl.style.willChange = 'transform';

		wallEl.style.transition = 'transform 0.25s ease-out, background 1.4s ease, opacity 0.35s ease';

	}

	let heroEl = null;

	let raf = null, nx = 0, ny = 0;

	const apply = () => {

		raf = null;

		if (wallEl) wallEl.style.transform = `scale(1.07) translate(${(nx * -9).toFixed(1)}px, ${(ny * -7).toFixed(1)}px)`;

		if (auroraEl) auroraEl.style.transform = `translate(${(nx * 18).toFixed(1)}px, ${(ny * 15).toFixed(1)}px)`;

		if (farEl) farEl.style.transform = `translate(${(nx * 9).toFixed(1)}px, ${(ny * 8).toFixed(1)}px)`;

		if (nearEl) nearEl.style.transform = `translate(${(nx * 26).toFixed(1)}px, ${(ny * 21).toFixed(1)}px)`;

		if (!heroEl) {

			heroEl = os.querySelector('.studio-hero');

			if (heroEl) heroEl.style.transition = 'transform 0.3s ease-out';

		}

		if (heroEl) heroEl.style.transform = `translate(${(nx * 34).toFixed(1)}px, ${(ny * 23).toFixed(1)}px)`;

	};

	os.addEventListener('mousemove', (e) => {

		const r = os.getBoundingClientRect();

		if (!r.width) return;

		nx = ((e.clientX - r.left) / r.width - 0.5) * 2;

		ny = ((e.clientY - r.top) / r.height - 0.5) * 2;

		if (!raf) raf = requestAnimationFrame(apply);

	});

	os.addEventListener('mouseleave', () => {

		nx = 0; ny = 0;

		if (!raf) raf = requestAnimationFrame(apply);

	});

}



function initStudioOS(levelEl) {

	const portfolioContent = levelEl?.querySelector('.portfolio-content') || document.querySelector('.portfolio-content');

	if (!portfolioContent) return;



	const zones = [];

	levelEl.querySelectorAll('.portfolio-section').forEach((section, zi) => {

		const grid = section.querySelector('.games-grid');

		if (!grid) return;

		const label = section.querySelector('.section-title')?.textContent.trim() || 'Projects';

		const games = [...grid.querySelectorAll('.portfolio-game')].map(parseGameFromCard).filter(Boolean);

		games.forEach((g) => {

			g.isNew = zi === 0;

		});

		zones.push({ label, games, zi });

		StudioOS.games.push(...games);

		section.replaceChildren();

	});



	StudioOS.zones = zones;



	const os = document.createElement('div');

	os.className = 'studio-os';

	os.innerHTML = `

		<div class="studio-wallpaper" aria-hidden="true"></div>

		<div class="studio-sky" aria-hidden="true">

			<div class="sky-aurora"><div class="sky-aurora-glow"></div></div>

			<div class="sky-stars sky-stars--far"></div>

			<div class="sky-stars sky-stars--near"></div>

		</div>

		<div class="studio-about-slot" data-about-slot></div>

	`;



	portfolioContent.replaceChildren(os);



	initWallpaperTime(os);

	initHeroSky(os);

	initHeroHeadline(os);

	initDesktopClutter(os);



	os.addEventListener('mousedown', (e) => {

		if (

			e.target.closest(

				'.studio-window, .studio-dock, .studio-tabbar, .studio-search, .studio-clutter-note, .studio-mascot-wrap, .studio-hud, .studio-achievement-toast, .studio-level-rail'

			)

		)

			return;

		handleDesktopBackgroundClick();

	});



	initSearch();

	if (!window.matchMedia('(max-width: 600px)').matches) {

		setTimeout(() => openAboutWindow(), 300);

	}

	setTimeout(syncHudToDock, 400);

}



function updateScrollProgress() {

	const scrollTop = window.scrollY || window.pageYOffset;

	const docHeight = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

	const progressBar = document.querySelector('.scroll-progress-bar');

	if (!progressBar) return;

	const scrollPercent = docHeight <= 0 ? 0 : Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));

	progressBar.style.width = scrollPercent + '%';

}



function optimizePerformance() {

	['img/sam_hero.jpg', 'img/BossTwoHero.png', 'img/FairyForest.png'].forEach((src) => {

		const img = new Image();

		img.src = src;

	});



	let scrollTicking = false;

	window.addEventListener('scroll', () => {

		if (!scrollTicking) {

			requestAnimationFrame(() => {

				updateScrollProgress();

				scrollTicking = false;

			});

			scrollTicking = true;

		}

	});

}



	document.addEventListener('DOMContentLoaded', () => {

	runBoot(() => {

		initStudioWorld();

		optimizePerformance();

		updateScrollProgress();

	});

});


