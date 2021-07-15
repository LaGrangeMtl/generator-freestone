// @ts-check
import VirtualScroll from 'virtual-scroll';
import Animator from '../Animator';

import Scroller, { SMOOTH_SCROLLER } from './Scroller';
import { lerp } from '../utils/lerp';
import { preventScroll } from './functions/preventScroll';
import ScrollModule from './ScrollModule';
import precision from '../utils/precision';
import { Animations } from '../Animations';
import { map } from '../utils/map';
import { debounceAnimationFrame } from '../utils/animation';
import ResizeObserver from 'resize-observer-polyfill';
import debounce from '../Animator/utils/debounce';

export const HOOKS = {
	UPDATE_SECTION: 'update-section',
}

export const SCROLLER_MODES = {
	VERTICAL: 'vertical',
	HORIZONTAL: 'horizontal',
	BOTH: 'both', // TODO
};

const LS_KEY = 'smooth_scroll';
const html = document.querySelector('html');

const winDim = {
	height: window.innerHeight,
	width: window.innerWidth,
};

type Section = {
	node: HTMLElement,
	top: number,
	bottom: number,
	left: number,
	right: number,
}

export class SmoothScroller extends Scroller {
	mode:string = SCROLLER_MODES.VERTICAL;
	scroll:VirtualScroll = null;
	width = 0;
	height = 0;
	scrollTop = 0;
	scrollLeft = 0;
	lastScrollTop = 0;
	lastScrollLeft = 0;
	targetScrollTop = 0;
	targetScrollLeft = 0;
	freezeScroll = false;
	isScrubbing = false;
	hasCustomHashFunction = false;
	sections:Section[] = [];
	sectionModules:ScrollModule[] = [];
	scrollbar:HTMLElement = null;
	thumb:HTMLElement = null;
	resizeObserver:ResizeObserver = null;

	constructor(el:HTMLElement, id = '', mode = SCROLLER_MODES.VERTICAL) {
		super(SMOOTH_SCROLLER);
		this.el = el;
		this.id = id;

		this.mode = mode;

		this.el.setAttribute('data-scrollmode', this.mode);

		preventScroll();
		this.refreshElements();
		this.initVirtualScroll(el);
		this.createScrollbar();
		this.setupEvents();

		this.updateScrollDimension();
		this.initialScroll();
		this.update(0, true);

		Scroller.addToList(this);
		this.onResize();
	}

	createScrollbar = () => {
		this.scrollbar = document.createElement('div');
		this.scrollbar.classList.add('scrollbar');
		this.scrollbar.setAttribute('data-scrollbar-element', '');
		this.thumb = document.createElement('div');
		this.thumb.classList.add('thumb');
		this.thumb.classList.add('hue-shift');
		this.scrollbar.appendChild(this.thumb);
		this.el.appendChild(this.scrollbar);
	}

	initialScroll = () => {
		let ls = sessionStorage.getItem(LS_KEY);
		if (ls) {
			ls = JSON.parse(ls);
			const url = window.location.href;
			if (ls[url] && ls[url][this.id]) {
				const st = this.mode === SCROLLER_MODES.VERTICAL ? ls[url][this.id] : 0;
				const sl = this.mode === SCROLLER_MODES.HORIZONTAL ? ls[url][this.id] : 0;
				this.setScroll(st, sl);
			}
		}
	}

	setInitialScroll = () => {
		const url = window.location.href;
		sessionStorage.setItem(LS_KEY, JSON.stringify({
			[url]: {
				[this.id]: this.mode === SCROLLER_MODES.VERTICAL ? this.scrollTop : this.scrollLeft,
			},
		}));
	}

	refreshElements = (ctx = null) => {
		const context = ctx || document;
		let els = (Array.from(context.querySelectorAll('[data-scroll-section]') as HTMLElement[]));

		//Filter nested data-scroll-sections
		els = els.filter(section => !section.parentElement.closest('[data-scroll-section]'));

		this.sections = els.map(el => {
			return {
				node: el,
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
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
			firefoxMultiplier: 100,
			useKeyboard: false,
			passive: true,
		});

		document.documentElement.classList.add('smooth-scroll');
	}

	onKeyDown = (e:KeyboardEvent) => {
		const { key, ctrlKey, altKey, shiftKey, metaKey } = e;
		if (key === 'Tab') {
			requestAnimationFrame(() => {
				html.scrollTop = 0;
				html.scrollLeft = 0;
				document.body.scrollTop = 0;
				document.body.scrollLeft = 0;
				this.el.scrollTop = 0;
				this.el.scrollLeft = 0;
				// @ts-ignore
				this.scrollToElem(document.activeElement, { offset: -winDim.height / 2 }); 
			});
		}

		
		if (key === 'PageDown') {
			this.scrollTo(-this.scrollTop + window.innerHeight);
		} else if (key === 'PageUp') {
			this.scrollTo(-this.scrollTop - window.innerHeight);
		}
		
		const tags = ['input', 'select', 'option', 'textarea'];

		//Break for input elements
		if (tags.includes(document.activeElement.tagName.toLowerCase())) return;

		if (key === 'ArrowDown') {
			if (ctrlKey || metaKey) {
				this.scrollTo(this.height);
			} else {
				this.scrollTo(-this.scrollTop + window.innerHeight / 4);
			}
		} else if (key === 'ArrowUp') {
			if (ctrlKey || metaKey) {
				this.scrollTo(0);
			} else {
				this.scrollTo(-this.scrollTop - window.innerHeight / 4);
			}
		} else if (key === 'Home') {
			this.scrollTo(0);
		} else if (key === 'End') {
			this.scrollTo(this.height);
		}
	};

	constrainScroll = () => {
		this.targetScrollTop = Math.max((this.height - winDim.height) * -1, this.targetScrollTop);
		this.targetScrollTop = Math.min(0, this.targetScrollTop);

		this.targetScrollLeft = Math.max((this.width - winDim.width) * -1, this.targetScrollLeft);
		this.targetScrollLeft = Math.min(0, this.targetScrollLeft);
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
		let scroll = 0;

		if (this.mode === SCROLLER_MODES.VERTICAL) {
			scroll = map(e.clientY, 0, winDim.height, 0, this.height);
		} else if (this.mode === SCROLLER_MODES.HORIZONTAL) {
			scroll = map(e.clientX, 0, winDim.width, 0, this.width);
		}
		
		this.scrollTo(scroll);
	}

	onThumbMouseUp = () => {
		this.isScrubbing = false;
		this.scrollbar.classList.remove('active');
		document.removeEventListener('mousemove', this.onThumbMouseMove);
		document.removeEventListener('mouseup', this.onThumbMouseUp);
	}

	setupEvents = () => {
		this.scroll.on((e) => {
			if (!this.freezeScroll) {
				if (this.mode === SCROLLER_MODES.VERTICAL) {
					this.targetScrollTop += e.deltaY;
				} else {
					this.targetScrollLeft += e.deltaY;
				}
				this.constrainScroll();
				this.update(0, true);
			}
		}, null);
		this.thumb.addEventListener('mousedown', this.onThumbMouseDown);

		window.addEventListener('resize', this.onResize);
		window.addEventListener('load', this.onLoad);
		window.addEventListener('keydown', this.onKeyDown, false);
		window.addEventListener('hashchange', this.onHashChange);

		this.onResize();
	}

	removeListeners() {
		this.thumb.removeEventListener('mousedown', this.onThumbMouseDown);
		
		window.addEventListener('resize', this.onResize);
		window.removeEventListener('load', this.onLoad);
		window.removeEventListener('keydown', this.onKeyDown);
		window.removeEventListener('hashchange', this.onHashChange);
	}

	update = debounceAnimationFrame((time = 0, force = false) => {
		const props = this.mode === SCROLLER_MODES.VERTICAL ? {
			scroll: 'scrollTop',
			targetScroll: 'targetScrollTop',
			lastScroll: 'lastScrollTop',
		} : {
			scroll: 'scrollLeft',
			targetScroll: 'targetScrollLeft',
			lastScroll: 'lastScrollLeft',
		};

		this[props.scroll] = lerp(this[props.scroll], this[props.targetScroll], this.isScrubbing ? 0.05 : 0.1);

		this.setInitialScroll();
		if (force || precision(this[props.lastScroll] - this[props.scroll], 0.01) !== 0) {
			Animator.instances.forEach(
				(animator) => {
					// We need to invert the scroll for both axis.
					animator.virtualScroll(this.el, -this.scrollTop, -this.scrollLeft);
				}
			);

			if (this.mode === SCROLLER_MODES.VERTICAL) {
				const percent = -this[props.scroll] / (this.height - winDim.height);
				const final = map(percent, 0, 1, 0, 100 - (winDim.height / this.height * 100));
				this.thumb.style.setProperty('--amount', final);
				this.thumb.style.transform = `translate(0, ${final}vh)`;
			} else if (this.mode === SCROLLER_MODES.HORIZONTAL) {
				const percent = -this[props.scroll] / (this.width - winDim.width);
				const final = map(percent, 0, 1, 0, 100 - (winDim.width / this.width * 100));
				this.thumb.style.setProperty('--amount', final);
				this.thumb.style.transform = `translate(${final}vw, 0)`;
			}
			
			this.sections.forEach((section, i) => {
				const {
					node,
					bottom,
					top,
					right,
					left,
				} = section;

				if (node.classList.contains('js-sticky')) return;
				if (this.mode === SCROLLER_MODES.VERTICAL) {
					if (bottom > -this[props.scroll] - winDim.height * 1.5 && top < -this[props.scroll] + (winDim.height * 1.5)) {
						node.classList.add('section-visible');
						node.style.transform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,${this[props.scroll]},0,1)`;
					} else {
						node.classList.remove('section-visible');
					}
				} else if (this.mode === SCROLLER_MODES.HORIZONTAL) {
					if (right > -this[props.scroll] - winDim.width * 1.5 && left < -this[props.scroll] + (winDim.width * 1.5)) {
						node.classList.add('section-visible');
						node.style.transform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,${this[props.scroll]},0,0,1)`;
					} else {
						node.classList.remove('section-visible');
					}
				}
			});
			this.runCallbacks();
			this.update();
		}
		// this.el.setAttribute('data-scroll-top', this.scrollTop.toString());
		this[props.lastScroll] = this[props.scroll];
	})

	updateSections = () => {
		const olds = this.sections.map(section => {
			const old = section.node.style.transform;
			section.node.style.transform = '';
			section.node.style.visibility = 'visible';
			return old;
		});

		this.updateScrollDimension();
		this.hooks.do(HOOKS.UPDATE_SECTION);

		this.sections.forEach((section, i) => {
			const rect = section.node.getBoundingClientRect();
			section.node.style.transform = olds[i];
			section.node.style.visibility = '';
			section.top = rect.top;
			section.bottom = rect.bottom;
			section.left = rect.left;
			section.right = rect.right;
		});
	}

	cleanSections = () => {
		this.sections.forEach(section => {
			section.node.style.transform = '';
			section.node.style.visibility = '';
		});
	}

	onHashChange = () => {
		const { hash } = window.location;
		if (this.hasCustomHashFunction || !hash) return false;
		const elem = document.querySelector(hash);
		if (elem) this.scrollToElem(elem);
	}

	onResizeDebounced = debounce(() => {
		winDim.height = window.innerHeight;
		winDim.width = window.innerWidth;

		this.updateSections();
		this.updateScrollDimension();
	}, 250);

	onResize = () => {
		this.onResizeDebounced();
	}

	onLoad = () => {
		if (window.location.hash !== '') {
			const elem = document.querySelector(window.location.hash);
			
			if (elem) {
				setTimeout(() => {
					this.scrollToElem(elem);
				}, 200);
			}
		}
	}

	updateScrollDimension = () => {
		this.height = this.el.scrollHeight;
		this.width = this.el.scrollWidth;

		if (this.thumb) {
			if (this.mode === SCROLLER_MODES.VERTICAL) {
				this.thumb.style.setProperty('--thumb-size', (winDim.height / this.height * 100) + '%');
			} else if (this.mode === SCROLLER_MODES.HORIZONTAL) {
				this.thumb.style.setProperty('--thumb-size', (winDim.width / this.width * 100) + '%');
			}
		}

		this.setScroll(this.scrollTop, this.scrollLeft);
	}

	setScroll = (st, sl) => {
		this.targetScrollTop = st;
		this.scrollTop = st;
		this.targetScrollLeft = sl;
		this.scrollLeft = sl;
		this.constrainScroll();
		this.update(0, true);
	}

	dispose = () => {
		this.setScroll(0, 0);
		this.cleanSections();
		this.scrollbar.parentNode.removeChild(this.scrollbar);
		this.removeListeners();
		this.scroll.destroy();
		document.documentElement.classList.remove('smooth-scroll');
	}

	/**
	 * @param {number} value
	 */
	scrollTo = (value) => {
		if (this.mode === SCROLLER_MODES.VERTICAL) {
			this.targetScrollTop = -value;
		} else if (this.mode === SCROLLER_MODES.HORIZONTAL) {
			this.targetScrollLeft = -value;
		}

		this.constrainScroll();
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

		const rect = elem.getBoundingClientRect();
		const position = (this.mode === SCROLLER_MODES.VERTICAL ? rect.top : rect.left) + opt.offset;

		this.sections.forEach((section, i) => {
			section.node.style.transform = olds[i];
		});
		this.scrollTo(position);
	}
}
