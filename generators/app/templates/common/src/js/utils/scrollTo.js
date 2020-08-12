import { TweenMax, Power2 } from 'gsap';
import offset from './offset.js';

const defaults = {
	offset: 0,
	duration: 0.9,
	delay: 0,
	container: (document.scrollingElement || document.documentElement),
	onUpdate: () => {},
	onComplete: () => {},
};

/**
 * Scrolls to position using TweenMax. If an offset is 
 * defined, scrolls that amount higher than the target element.
 *
 * @param {Number} pos
 * @param {Object} options
 */
export const scrollTo = (pos, options = {}) => {
	const opt = Object.assign({}, defaults, options);

	const scroll = {
		y: opt.container.scrollTop,
	};

	TweenMax.to(scroll, opt.duration, {
		y: pos + opt.offset,
		ease: opt.ease || Power2.easeInOut,
		onUpdate: () => {
			opt.container.scrollTop = scroll.y;
			opt.onUpdate(scroll.y);
		},
		delay: opt.delay,
		onComplete: opt.onComplete,
	});
};

/**
 * Scrolls to an element.
 *
 * @param {Element} el
 * @param {Object} options
 */
export const scrollToElem = (el, options = {}) => {
	const opt = Object.assign({}, defaults, options);
	scrollTo(offset(el).top, opt);
};
