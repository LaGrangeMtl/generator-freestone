// @ts-check
import VirtualScroll from 'virtual-scroll';
import Animator from '@lagrange/animator';
import Scroller, { SMOOTH_SCROLLER } from './Scroller';
import { lerp } from '../utils/lerp';
import { preventScroll } from './functions/preventScroll';
import ScrollModule from './ScrollModule';
import precision from '../utils/precision';
import { Animations } from '../Animations';
import { map } from '../utils/map';
import { debounceAnimationFrame } from '../utils/animation';

const LS_KEY = 'smooth_scroll';
const html = document.querySelector('html');

const winDim = {
	height: window.innerHeight,
	width: window.innerWidth,
};

/**
 * @typedef {object} Section
 * @property {HTMLElement} node
 * @property {number} top
 * @property {number} bottom
 */
export class SmoothScroller extends Scroller {
	/** @type {VirtualScroll} */
	scroll = null;

	/** @type {HTMLElement} */
	el = null;

	height = 0;

	scrolltop = 0;

	lastScrollTop = 0;

	targetScrollTop = 0;

	freezeScroll = false;

	isScrubbing = false;

	loop = null;

	/** @type {Section[]} */
	sections = [];

	/** @type {ScrollModule[]} */
	sectionModules = [];

	hasCustomHashFunction = false;

	/**
	 * @param {HTMLElement} el 
	 */
	constructor(el, id = '') {
		super(SMOOTH_SCROLLER);
		this.el = el;
		this.id = id;
		preventScroll();
		this.refreshElements();
		this.initVirtualScroll(el);
		this.createScrollbar();
		this.setupEvents();
		this.updateScrollHeight();
		document.documentElement.classList.add('smooth-scroll');
		this.initialScroll();
		this.update(0, true);
		Scroller.addToList(this);
		this.onResize();
	}

	createScrollbar = () => {
		this.scrollbar = document.createElement('div');
		this.scrollbar.classList.add('scrollbar');
		this.thumb = document.createElement('div');
		this.thumb.classList.add('thumb');
		this.scrollbar.appendChild(this.thumb);
		this.el.appendChild(this.scrollbar);
	}

	initialScroll = () => {
		let ls = sessionStorage.getItem(LS_KEY);
		if (ls) {
			ls = JSON.parse(ls);
			const url = window.location.href;
			if (ls[url] && ls[url][this.id]) {
				this.setScroll(ls[url][this.id]);
			}
		}
	}

	setInitialScroll = () => {
		const url = window.location.href;
		sessionStorage.setItem(LS_KEY, JSON.stringify({
			[url]: {
				[this.id]: this.scrollTop,
			},
		}));
	}

	refreshElements = (ctx = null) => {
		const context = ctx || document;
		let els = /** @type {HTMLElement[]} */ (Array.from(context.querySelectorAll('[data-scroll-section]')));

		//Filter nested data-scroll-sections
		els = els.filter(section => !section.parentElement.closest('[data-scroll-section]'));

		this.sections = els.map(el => {
			return {
				node: el,
				top: 0,
				bottom: 0,
			};
		});
		this.updateSections();
		this.sectionModules = this.sections.map(section => {
			const sm = new ScrollModule(section.node, {
				onWakeUp: () => {
					section.node.classList.remove('inactive');
				},
				onSleep: () => {
					section.node.classList.add('inactive');
				},
			});
			return sm;
		});
	}

	initVirtualScroll = (el) => {
		this.scroll = new VirtualScroll({
			el,
			mouseMultiplier: navigator.platform.indexOf('Win') > -1 ? 1 : 0.4,
			touchMultiplier: 2,
			firefoxMultiplier: 75,
			useKeyboard: false,
		});
	}

	/**
	 * @param {KeyboardEvent} e
	 */
	onKeyDown = (e) => {
		const { key } = e;
		if (key === 'Tab') {
			requestAnimationFrame(() => {
				html.scrollTop = 0;
				html.scrollLeft = 0;
				document.body.scrollTop = 0;
				document.body.scrollLeft = 0;
				this.el.scrollTop = 0;
				this.el.scrollLeft = 0;
				// @ts-ignore
				this.scrollToElem(document.activeElement, winDim.height / 2); 
			});
		}
	};

	constrainScrollTop = () => {
		this.targetScrollTop = Math.max((this.height - winDim.height) * -1, this.targetScrollTop);
		this.targetScrollTop = Math.min(0, this.targetScrollTop);
	}

	onThumbMouseDown = (e) => {
		this.isScrubbing = true;
		this.scrollbar.classList.add('active');
		document.addEventListener('mousemove', this.onThumbMouseMove);
		document.addEventListener('mouseup', this.onThumbMouseUp);
	}

	/**
	 * @param {MouseEvent} e
	 */
	onThumbMouseMove = (e) => {
		const scrollTop = map(e.clientY, 0, winDim.height, 0, this.height);
		this.scrollTo(scrollTop);
	}

	onThumbMouseUp = () => {
		this.isScrubbing = false;
		this.scrollbar.classList.remove('active');
		document.removeEventListener('mousemove', this.onThumbMouseMove);
		document.removeEventListener('mouseup', this.onThumbMouseUp);
	}

	onHashChange = () => {
		const { hash } = window.location;
		if (this.hasCustomHashFunction || !hash) return false;

		const elem = document.querySelector(hash);
		if (elem) this.scrollToElem(elem);
	}

	setupEvents = () => {
		this.scroll.on((e) => {
			if (!this.freezeScroll) {
				this.targetScrollTop += e.deltaY;
				this.constrainScrollTop();
				this.update(0, true);
			}
		}, null);
		this.thumb.addEventListener('mousedown', this.onThumbMouseDown);
		window.addEventListener('resize', this.onResize);
		window.addEventListener('keydown', this.onKeyDown, false);
		window.addEventListener('hashchange', this.onHashChange);
	}

	update = debounceAnimationFrame((time = 0, force = false) => {
		this.scrollTop = lerp(this.scrollTop, this.targetScrollTop, this.isScrubbing ? 0.05 : 0.1);
		this.setInitialScroll();
		if (force || precision(this.lastScrollTop - this.scrollTop, 0.01) !== 0) {
			Animator.instances.forEach(
				(animator) => {
					animator.virtualScroll(this.el, -this.scrollTop);
				}
			);
			// if (!this.isScrubbing) {
			const percent = -this.scrollTop / (this.height - winDim.height);
			const final = map(percent, 0, 1, 0, 100 - (winDim.height / this.height * 100));
			this.thumb.style.transform = `translate(0, ${final}vh)`;
			// }
			this.sections.forEach((section, i) => {
				const { node, bottom, top } = section;
				if (node.classList.contains('js-sticky')) return;
				if (bottom > -this.scrollTop - winDim.height && top < -this.scrollTop + (winDim.height) * 2) {
					node.classList.add('section-visible');
					node.style.transform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,${this.scrollTop},0,1)`;
				} else {
					node.classList.remove('section-visible');
				}
			});
			this.runCallbacks();
			this.update();
		}
		// this.el.setAttribute('data-scroll-top', this.scrollTop.toString());
		this.lastScrollTop = this.scrollTop;
	})

	updateSections = () => {
		const olds = this.sections.map(section => {
			const old = section.node.style.transform;
			section.node.style.transform = '';
			section.node.style.visibility = 'visible';
			return old;
		});
		Animator.instances.forEach(instance => instance.setAnimations(Animations.get(winDim.width)));
		this.sections.forEach((section, i) => {
			const rect = section.node.getBoundingClientRect();
			section.node.style.transform = olds[i];
			section.node.style.visibility = '';
			section.top = rect.top;
			section.bottom = rect.bottom;
		});
	}

	onResize = () => {
		winDim.height = window.innerHeight;
		winDim.width = window.innerWidth;

		this.updateSections();
		this.updateScrollHeight();
	}

	updateScrollHeight = () => {
		this.height = this.el.offsetHeight;
		this.thumb.style.height = (winDim.height / this.height * 100) + '%';
		this.setScroll(this.scrollTop);
	}

	setScroll = (value) => {
		this.targetScrollTop = value;
		this.scrollTop = value;
		this.constrainScrollTop();
		this.update(0, true);
	}

	/**
	 * @param {number} value
	 */
	scrollTo = (value) => {
		this.targetScrollTop = -value;
		this.constrainScrollTop();
		this.update(0, true);
	}

	/**
	 * @param {HTMLElement} elem
	 * @param {Object} options
	 */
	scrollToElem = (elem, options = {}) => {
		const defaults = {
			offset: 0,
		};
		const opt = Object.assign({}, defaults, options);
		const olds = this.sections.map(section => {
			const old = section.node.style.transform;
			section.node.style.transform = '';
			return old;
		});
		const position = elem.getBoundingClientRect().top + opt.offset;
		this.sections.forEach((section, i) => {
			section.node.style.transform = olds[i];
		});
		this.scrollTo(position);
	}
}
