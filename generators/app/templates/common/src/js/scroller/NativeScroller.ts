import gsap, { Power3 } from 'gsap';
import Animator from '../Animator';
import offset from '../utils/offset';

import Scroller, { NATIVE_SCROLLER } from './Scroller';

const scrollingElement = (document.scrollingElement || document.documentElement) as HTMLElement;

const defaults = {
	offset: 0,
	duration: 0.9,
	delay: 0,
	ease: null,
	container: scrollingElement,
	onUpdate: (st) => {},
	onComplete: () => {},
};

export class NativeScroller extends Scroller {
	freezeScroll = false;

	constructor(el:HTMLElement = scrollingElement, id = '') {
		super(NATIVE_SCROLLER);

		this.el = el || scrollingElement;
		this.id = id;

		this.setupEvents();

		Scroller.addToList(this);
	}

	setupEvents = () => {
		window.addEventListener('scroll', this.debouncedUpdate);
	}

	debouncedUpdate = (e) => {
		cancelAnimationFrame(this.loop);
		this.loop = requestAnimationFrame(() => this.update());
	}

	update = () => {
		this.scrollTop = -window.scrollY;
		Animator.instances.forEach(
			(animator) => {
				animator.virtualScroll(this.el, -this.scrollTop);
			}
		);
		this.runCallbacks();
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
		
		gsap.to(scroll, {
			duration: opt.duration,
			y: pos + opt.offset,
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
