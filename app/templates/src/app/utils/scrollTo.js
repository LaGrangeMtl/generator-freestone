import gsap, { TweenMax } from 'gsap';
import $ from 'jquery';

const $window = $(window);
const defaults = {
	offset: 0,
	time: 1.2,
	container: $window,
	onUpdate() { return; },
	onComplete() { return; },
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
		y: opt.container.scrollTop(),
	};

	TweenMax.to(scroll, opt.time, {
		y: pos + opt.offset,
		ease: gsap.Cubic.easeInOut,
		onUpdate: () => {
			opt.container.scrollTop(scroll.y);
			opt.onUpdate(scroll.y);
		},
		onComplete: opt.onComplete,
	});
};

/**
 * Scrolls to an element.
 *
 * @param {JQuery} el
 * @param {Object} options
 */
export const scrollToElem = (el, options = {}) => {
	const opt = Object.assign({}, defaults, options);

	const $el = $(el);
	scrollTo($el.offset().top, opt);
};
