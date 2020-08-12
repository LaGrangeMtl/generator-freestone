import Animator from '@lagrange/animator';
import TweenMax from 'gsap/TweenMaxBase';
import { Power3 } from 'gsap';
import offset from '../utils/offset';

import Scroller, { NATIVE_SCROLLER } from './Scroller';

const scrollingElement = document.scrollingElement || document.documentElement;

const defaults = {
	offset: 0,
	duration: 0.9,
	delay: 0,
	container: scrollingElement,
	onUpdate: () => {},
	onComplete: () => {},
};

export class NativeScroller extends Scroller {
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
	constructor(el = scrollingElement, id = '') {
		super(NATIVE_SCROLLER);
		this.el = el || scrollingElement;
		this.id = id;

		this.setupEvents();

		Scroller.addToList(this);
	}

	setupEvents = () => {
		window.addEventListener('scroll', this.debouncedUpdate);
	}

	debouncedUpdate = () => {
		cancelAnimationFrame(this.loop);
		this.loop = requestAnimationFrame(this.update);
	}

	update = () => {
		Animator.instances.forEach(
			(animator) => {
				animator.virtualScroll(this.el, scrollingElement.scrollTop);
			}
		);
	}

	setScroll = (value) => {
		this.scrollTo(value, { duration: 0 });
	}

	/**
	 * @param {number} value
	 */
	scrollTo = (pos, options = {}) => {
		const opt = Object.assign({}, defaults, options);

		const scroll = {
			y: opt.container.scrollTop,
		};

		TweenMax.to(scroll, opt.duration, {
			y: -pos + opt.offset + scroll.y,
			ease: opt.ease || Power3.easeInOut,
			onUpdate: () => {
				opt.container.scrollTop = scroll.y;
				opt.onUpdate(scroll.y);
			},
			delay: opt.delay,
			onComplete: opt.onComplete,
		});
	}

	/**
	 * @param {HTMLElement} elem
	 * @param {number} offset Value in pixels for offsetting the final scroll position (eg. clearing the menu)
	 */
	scrollToElem = (el, options = {}) => {
		const opt = Object.assign({}, defaults, options);
		this.scrollTo(offset(el).top, opt);
	};
}
