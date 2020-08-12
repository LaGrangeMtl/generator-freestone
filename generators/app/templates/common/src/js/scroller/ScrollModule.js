//@ts-check

import 'intersection-observer';

/**
 * @typedef {Object} ScrollModuleOptions
 * @property {Function} onWakeUp
 * @property {Function} onSleep
 */

const defaultOptions = {};

export default class ScrollModule {
	wasIntersecting = false;

	/** @type {Function} */
	onWakeUp = null;

	/** @type {Function} */
	onSleep = null;

	/** @type {Function} */
	onUpdate = null;

	/**
	 * @param {Element} element 
	 * @param {ScrollModuleOptions} element 
	 */
	constructor(element, options = defaultOptions) {
		this.element = element;
		this.observer = new IntersectionObserver(this.onIntersectionCallback, options);

		if (options.onWakeUp) this.onWakeUp = options.onWakeUp;
		if (options.onSleep) this.onSleep = options.onSleep;
		if (options.onUpdate) this.onUpdate = options.onUpdate;

		this.observer.observe(this.element);
	}

	/**
	 * @param {IntersectionObserverEntry[]} entries
	 */
	onIntersectionCallback = (entries) => {
		entries.forEach(
			entry => {
				if (!this.wasIntersecting && entry.isIntersecting) {
					this.wasIntersecting = true;
					this.wakeUp();
				} else if (this.wasIntersecting && !entry.isIntersecting) {
					this.wasIntersecting = false;
					this.sleep();
				}

				this.update(entry.boundingClientRect, entry.intersectionRatio);
			},
		);
	}
	
	wakeUp() {
		if (this.onWakeUp) {
			this.onWakeUp();
		}
	}

	sleep() {
		if (this.onSleep) {
			this.onSleep();
		}
	}
	
	update(rect, ratio) {
		if (this.onUpdate) {
			this.onUpdate(rect, ratio);
		}
	}

	kill() {
		this.observer.unobserve(this.element);
	}
}
