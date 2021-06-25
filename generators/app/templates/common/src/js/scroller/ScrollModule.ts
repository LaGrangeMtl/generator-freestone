//@ts-check

import 'intersection-observer';

type ScrollModuleOptions = {
	onWakeUp?: Function,
	onSleep?: Function,
	onUpdate?: Function,
	threshold?: number|number[]
}

const defaultOptions:ScrollModuleOptions = {
	onWakeUp: null,
	onSleep: null,
	onUpdate: null,
};

export default class ScrollModule {
	wasIntersecting = false;
	element:HTMLElement;
	observer:IntersectionObserver;

	onWakeUp:Function = null;
	onSleep:Function = null;
	onUpdate:Function = null;

	constructor(element:HTMLElement, options = defaultOptions) {
		this.element = element;
		this.observer = new IntersectionObserver(this.onIntersectionCallback, options);

		if (options.onWakeUp) this.onWakeUp = options.onWakeUp;
		if (options.onSleep) this.onSleep = options.onSleep;
		if (options.onUpdate) this.onUpdate = options.onUpdate;

		this.observer.observe(this.element);
	}

	onIntersectionCallback = (entries:IntersectionObserverEntry[]) => {
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
