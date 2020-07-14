// @ts-check

if (!document.elementsFromPoint) {
	document.elementsFromPoint = elementsFromPoint;
}

function elementsFromPoint(x, y) {
	const parents = [];
	let parent = null;
	do {
		if (parent !== document.elementFromPoint(x, y)) {
			parent = document.elementFromPoint(x, y);
			parents.push(parent);
			parent.style.pointerEvents = 'none';
		} else {
			parent = false;
		}
	} while (parent);
	parents.forEach((p) => {
		return p.style.pointerEvents = 'all';
	});
	return parents;
}

/** @type {HTMLElement[]} */
let targets;

let bgs;
const canvas = document.createElement('canvas');
// document.body.appendChild(canvas);
// canvas.style.position = 'fixed';
// canvas.style.top = '0';
// canvas.style.left = '0';
// canvas.style.opacity = '0.25';
// canvas.style.zIndex = '10000';
const ctx = canvas.getContext('2d');

// const throttledUpdate = throttle(update, 50);

let rectCache = new WeakMap();

function init() {
	const allElements = Array.from(document.querySelectorAll('html, body, body *'));
	const elementsWithBg = allElements.filter(node => {
		const bgcolor = window.getComputedStyle(node).backgroundColor;
		return bgcolor !== 'rgba(0, 0, 0, 0)' && bgcolor !== 'transparent';
	}).map(x => ({ node: x, type: 'bg-color' }));
	
	const images = Array.from(document.querySelectorAll('img:not([data-check-exclude])')).map(x => ({ node: x, type: 'img' }));
	const videos = Array.from(document.querySelectorAll('video:not([data-check-exclude])')).map(x => ({ node: x, type: 'video' }));

	bgs = [
		...elementsWithBg,
		...images,
		...videos,
	];

	bgs.reverse();
	onResize();

	window.addEventListener('resize', onResize);
	window.addEventListener('scroll', throttledUpdate);
}

function getLuminance(r, g, b) {
	return ((0.2126 * parseInt(r, 10)) + (0.7152 * parseInt(g, 10)) + (0.0722 * parseInt(b, 10)));
}

/**
 * @param {HTMLElement} node 
 */
const colorRegEx = /rgba?\(([0-9]{1,3}),\s?([0-9]{1,3}),\s?([0-9]{1,3})/;
function isDarkBgColor(node) {
	const color = window.getComputedStyle(node).backgroundColor;
	const [, r, g, b] = colorRegEx.exec(color);
	return getLuminance(r, g, b) < 50;
}

function onResize() {
	requestAnimationFrame(() => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		targets = Array.from(document.querySelectorAll('[data-bg-check]'));
		update();
	});
}

function getRect(node) {
	if (rectCache.has(node)) {
		return rectCache.get(node);
	}

	const rect = node.getBoundingClientRect();
	rectCache.set(node, rect);
	return rect;
}

function isDarkImg(image, targetRect) {
	const imageRect = getRect(image);

	const w = image.naturalWidth;
	const h = image.naturalHeight;
	const scalex = image.width / w;
	const scaley = image.height / h;
	const rect = {
		left: ((targetRect.left - imageRect.left) / imageRect.width) * w,
		top: ((targetRect.top - imageRect.top) / imageRect.height) * h,
		width: targetRect.width / scalex, //imageRect.width * scalex,
		height: targetRect.height / scaley, //imageRect.height * scaley,
	};

	if (imageRect.height === 0 || imageRect.width === 0 || rect.width === 0 || rect.height === 0) return false;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// ctx.clearRect(targetRect.left, targetRect.top, targetRect.width, targetRect.height);
	ctx.drawImage(
		image,
		rect.left, rect.top, rect.width, rect.height,
		targetRect.left, targetRect.top, targetRect.width, targetRect.height
		// imageRect.left, imageRect.top, imageRect.width, imageRect.height
	);

	const pixels = ctx.getImageData(targetRect.left, targetRect.top, targetRect.width, targetRect.height).data;
	// console.log(pixels);
	const { length } = pixels;

	let i = 0;
	let count = 0;
	let r = 0;
	let g = 0;
	let b = 0;

	while ((i += 4) < length) {
		++count;
		r += pixels[i];
		g += pixels[i + 1];
		b += pixels[i + 2];
	}

	r = Math.floor(r / count);
	g = Math.floor(g / count);
	b = Math.floor(b / count);

	return getLuminance(r, g, b) < 50;
}

let updateTimeout = null;
function throttledUpdate() {
	if (updateTimeout) {
		cancelAnimationFrame(updateTimeout);
	}

	updateTimeout = requestAnimationFrame(update);
}

function update() {
	rectCache = new WeakMap();

	if (!targets) return;
	
	targets.map(target => {
		const rect = target.getBoundingClientRect();
		const elems = Array.from(document.elementsFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2));

		return {
			target,
			rect,
			elems,
		};
	}).forEach((obj) => {
		const { target, rect, elems } = obj;

		const isDisplayed = getComputedStyle(target).display !== 'none';
		if (!isDisplayed) return;

		const bg = elems.reduce((c, elem) => {
			const found = bgs.find(b => b.node === elem);
			return (!c && elem !== target && found) ? found : c;
		}, null);
		
		if (bg) {
			let isDark = false;
			switch (bg.type) {
				case 'bg-color':
					isDark = isDarkBgColor(bg.node);
					break;
				case 'img':
				case 'video':
					isDark = isDarkImg(bg.node, rect);
					break;
				default: isDark = true;
			}

			if (isDark) {
				if (!target.classList.contains('background--dark')) {
					target.classList.add('background--dark');
				}
				if (target.classList.contains('background--light')) {
					target.classList.remove('background--light');
				}
			} else {
				if (!target.classList.contains('background--light')) {
					target.classList.add('background--light');
				}
				if (target.classList.contains('background--dark')) {
					target.classList.remove('background--dark');
				}
			}
		}
	});
}

function kill() {
	window.removeEventListener('scroll', throttledUpdate);
	window.removeEventListener('resize', onResize);
}

export default {
	init,
	kill,
	update,
	resize: onResize,
};
