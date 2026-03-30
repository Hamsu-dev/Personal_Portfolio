/**
 * Interaction #1 — Konami code easter egg (↑ ↑ ↓ ↓ ← → ← → B A)
 * Remove this file and its <script> tag to disable.
 */
(function () {
	const sequence = [
		"ArrowUp",
		"ArrowUp",
		"ArrowDown",
		"ArrowDown",
		"ArrowLeft",
		"ArrowRight",
		"ArrowLeft",
		"ArrowRight",
		"b",
		"a",
	];

	function normalizeKey(e) {
		if (
			e.key === "ArrowUp" ||
			e.key === "ArrowDown" ||
			e.key === "ArrowLeft" ||
			e.key === "ArrowRight"
		) {
			return e.key;
		}
		if (e.key.length === 1) {
			return e.key.toLowerCase();
		}
		return "";
	}

	let step = 0;

	function injectStylesOnce() {
		if (document.getElementById("konami-style")) return;
		const s = document.createElement("style");
		s.id = "konami-style";
		s.textContent =
			"@keyframes konamiFall{to{transform:translate3d(var(--dx),100vh,0) rotate(var(--rot));opacity:0}}" +
			".konami-bit{position:fixed;width:9px;height:9px;top:-12px;border-radius:2px;z-index:100000;" +
			"pointer-events:none;animation:konamiFall var(--dur) ease-in forwards;animation-delay:var(--del);will-change:transform}" +
			".konami-toast{position:fixed;left:50%;bottom:22%;transform:translateX(-50%);z-index:100001;" +
			"background:linear-gradient(135deg,#2a2827,#1d1c1b);border:2px solid #ea5445;color:#fff;" +
			"font:700 14px Jost,system-ui,sans-serif;padding:14px 26px;border-radius:14px;box-shadow:0 16px 50px rgba(0,0,0,.5);" +
			"text-align:center;animation:konamiT 0.35s ease-out both}" +
			"@keyframes konamiT{from{opacity:0;transform:translate(-50%,12px) scale(.94)}}" +
			".konami-toast small{display:block;margin-top:6px;font-weight:500;opacity:.85;font-size:12px;color:#ea5445}";
		document.head.appendChild(s);
	}

	function confetti() {
		injectStylesOnce();
		const colors = ["#ea5445", "#00d4ff", "#ffffff", "#fbbf24", "#8b5cf6", "#00ff88"];
		for (let n = 0; n < 72; n++) {
			const bit = document.createElement("div");
			bit.className = "konami-bit";
			bit.style.left = Math.random() * 100 + "vw";
			bit.style.background = colors[n % colors.length];
			bit.style.setProperty("--dur", 1.1 + Math.random() * 1.1 + "s");
			bit.style.setProperty("--del", Math.random() * 0.35 + "s");
			bit.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
			bit.style.setProperty("--rot", (Math.random() * 1080 - 540) + "deg");
			document.body.appendChild(bit);
			window.setTimeout(function () {
				bit.remove();
			}, 3200);
		}
	}

	function toast(msg, sub) {
		injectStylesOnce();
		const el = document.createElement("div");
		el.className = "konami-toast";
		el.setAttribute("role", "status");
		el.innerHTML = msg + (sub ? "<small>" + sub + "</small>" : "");
		document.body.appendChild(el);
		window.setTimeout(function () {
			el.style.opacity = "0";
			el.style.transition = "opacity .35s ease";
			window.setTimeout(function () {
				el.remove();
			}, 400);
		}, 2600);
	}

	function trigger() {
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reduce) {
			toast("Nice find!", "Konami code");
			return;
		}
		confetti();
		toast("Achievement: Cheat unlocked", "Thanks for playing · Sam Hu");
	}

	document.addEventListener(
		"keydown",
		function (e) {
			const t = e.target && e.target.nodeName;
			if (t === "INPUT" || t === "TEXTAREA" || t === "SELECT") return;
			if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
			const k = normalizeKey(e);
			if (!k) return;

			const expected = sequence[step];
			const want = expected.length === 1 ? expected.toLowerCase() : expected;

			if (k === want) {
				step++;
				if (step >= sequence.length) {
					step = 0;
					trigger();
				}
				return;
			}

			const first = sequence[0];
			const firstWant = first.length === 1 ? first.toLowerCase() : first;
			step = k === firstWant ? 1 : 0;
		},
		true
	);
})();
