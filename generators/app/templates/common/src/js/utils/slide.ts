//@ts-check

import gsap, { Power1 } from 'gsap';

/**
 * @param {HTMLElement} elem 
 * @param {number} time 
 * @param {object} ease 
 */
export function slideUp(elem, time = 0.3, ease = Power1.easeOut) {
	return new Promise((resolve) => {
		gsap.to(elem, { duration: time, height: 0, onComplete: resolve, ease });
	});
}

/**
 * @param {HTMLElement} elem 
 * @param {number} time 
 * @param {object} ease 
 */
export function slideDown(elem, time = 0.3, ease = Power1.easeOut) {
	return new Promise((resolve) => {
		gsap.to(elem, { duration: time, height: elem.scrollHeight, onComplete: resolve, ease });
	});
}

/**
 * @param {HTMLElement} elem 
 * @param {number} time
 */
export function slideToggle(elem, time = 0.3) {
	if (elem.getBoundingClientRect().height === 0) {
		return slideDown(elem, time);
	}

	return slideUp(elem, time);
}
