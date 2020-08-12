// @ts-check

import VirtualScroll from 'virtual-scroll';
import imagesLoaded from 'imagesloaded';
import Animator from '@lagrange/animator';

import Scroller, { SMOOTH_SCROLLER } from './Scroller';
import { lerp } from '../utils/lerp';
import { preventScroll } from './functions/preventScroll';
import ScrollModule from './ScrollModule';
import precision from '../utils/precision';

const html = document.querySelector('html');

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

	loop = null;


	/** @type {HTMLElement[]} */
	sections = [];

	/** @type {ScrollModule[]} */
	sectionModules = [];

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
		this.setupEvents();
		this.updateScrollHeight();

		document.body.classList.add('smooth-scroll');

		imagesLoaded(el, this.updateScrollHeight);

		this.update();

		Scroller.addToList(this);
	}

	refreshElements = (ctx = null) => {
		const context = ctx || document;
		this.sections = Array.from(context.querySelectorAll('[data-scroll-section]'));

		this.sectionModules = this.sections.map(section => {
			const sm = new ScrollModule(section, {
				onWakeUp: () => {
					section.classList.remove('inactive');
				},
				onSleep: () => {
					section.classList.add('inactive');
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
				this.scrollToElem(document.activeElement, -window.innerHeight / 2); 
			});
		}
	};

	constrainScrollTop = () => {
		this.targetScrollTop = Math.max((this.height - window.innerHeight) * -1, this.targetScrollTop);
		this.targetScrollTop = Math.min(0, this.targetScrollTop);
	}

	setupEvents = () => {
		this.scroll.on((e) => {
			if (!this.freezeScroll) {
				this.targetScrollTop += e.deltaY;
				this.constrainScrollTop();
			}
		}, null);
		
		window.addEventListener('resize', this.updateScrollHeight);
		window.addEventListener('keydown', this.onKeyDown, false);
	}

	update = (time = 0, force = false) => {
		cancelAnimationFrame(this.loop);
		this.loop = requestAnimationFrame(this.update);

		this.scrollTop = precision(lerp(this.scrollTop, this.targetScrollTop, 0.15));

		if (force || this.lastScrollTop !== this.scrollTop) {
			Animator.instances.forEach(
				(animator) => {
					animator.virtualScroll(this.el, -this.scrollTop);
				}
			);
			
			this.sections.forEach(section => {
				if (section.classList.contains('js-sticky')) return;

				section.style.transform = `translate(0, ${this.scrollTop}px)`;
			});
		}

		this.el.style.setProperty('--scroll-top', this.scrollTop.toString());
		this.lastScrollTop = this.scrollTop;
	}

	updateScrollHeight = () => {
		this.height = this.el.scrollHeight;
		// Animator.instances.forEach(inst => inst.updateElements());
	}

	setScroll = (value) => {
		this.targetScrollTop = value;
		this.scrollTop = value;
		this.update(0, true);
	}

	/**
	 * @param {number} value
	 */
	scrollTo = (value) => {
		this.targetScrollTop = value;
	}

	/**
	 * @param {HTMLElement} elem
	 * @param {number} offset Value in pixels for offsetting the final scroll position (eg. clearing the menu)
	 */
	scrollToElem = (elem, offset = 0) => {
		this.targetScrollTop = this.scrollTop - elem.getBoundingClientRect().top + offset;
		this.constrainScrollTop();
	}
}
