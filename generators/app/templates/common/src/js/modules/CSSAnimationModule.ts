// @ts-check

import { gsap } from 'gsap/all';
import imagesloaded from 'imagesloaded';
import { GENERAL_THRESHOLD } from '../Constants';

import ScrollModule from '../scroller/ScrollModule';
import getCssVariable from '../utils/getCssVariable';

const CLASSES = {
	ENTER: 'enter',
	ENTER_ACTIVE: 'enter-active',
};

const THRESHOLD_ATTR = 'data-module-treshold';

class CSSAnimationModule {
	duration: number;
	sm: ScrollModule;
	node:HTMLElement;

	constructor(node) {
		this.node = node;

		const duration = getCssVariable(this.node, '--animation-duration') ?? 1.2;
		const delay = getCssVariable(this.node, '--animation-delay') ?? 0;
		const globalduration = parseFloat(duration) + parseFloat(delay);
		const threshold = Number(this.node.getAttribute(THRESHOLD_ATTR)) || GENERAL_THRESHOLD;
		
		this.duration = globalduration;

		this.sm = new ScrollModule(this.node, {
			onWakeUp: this.onWakeUp,
			onSleep: () => {},
			threshold: threshold,
		});
	}

	onWakeUp = () => {
		imagesloaded(this.node, null, () => {
			requestAnimationFrame(() => {
				this.node.classList.add(CLASSES.ENTER_ACTIVE);
				
				gsap.delayedCall(this.duration, () => {
					this.node.classList.remove(CLASSES.ENTER);
					this.node.classList.remove(CLASSES.ENTER_ACTIVE);
	
					this.sm.kill();
				});
			});
		});
	}

	dispose = () => {
		this.sm.kill();
	}
}

let elems = [];
function init(ctx) {
	elems = Array.from(ctx.querySelectorAll('[data-simple-module-animation]'))
		.map(node => new CSSAnimationModule(node));
}

function kill() {
	elems.forEach(sma => sma.dispose());
}

export default {
	init,
	kill,
};
