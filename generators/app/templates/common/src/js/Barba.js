import Promise from 'bluebird';
import imagesloaded from 'imagesloaded';
import gsap, { Power4 } from 'gsap';
import barba from '@lagrange/barba-core';

import ns from './NameSpace';
import VideoObserver from './lagrange/VideoObserver';
import JsonNSParser from './lagrange/JsonNSParser';

const conf = {
	updateAnimator: null,
};

const bootstrapContainer = (ctx, modules) => {
	JsonNSParser.fetchAndParse(ctx);

	modules.forEach(c => c.init(ctx));

	ctx.querySelectorAll('video').forEach(VideoObserver.onUpdate);
	
	conf.updateAnimator();
	imagesloaded(ctx, conf.updateAnimator);
};

function init(modules, updateAnimator) {
	const wiper = document.querySelector('[data-wiper]');

	conf.updateAnimator = updateAnimator;
	
	barba.hooks.stateChange((should, current, next) => {
		if (~current.indexOf(ns.experience.base_url) && ~next.indexOf(ns.experience.base_url)) {
			should.change = false;
		}
	});

	barba.init({
		// debug: true,
		// logLevel: 'debug',
		transitions: [{
			appear({ current }) {
				bootstrapContainer(current.container, modules);
				imagesloaded(document.querySelector('body'), () => {
					wiper.classList.remove('active');
				});
			},
			beforeLeave() {
				wiper.classList.add('active');
				scrollTo(0, { ease: Power4.easeInOut });
			},
			leave() {
				return new Promise(resolve => {
					gsap.delayedCall(0.7, resolve);
				});
			},
			afterEnter({ next }) {
				bootstrapContainer(next.container);

				gsap.delayedCall(0.6, () => {
					wiper.classList.remove('active');
				});
			},
		}],
	});
}

export default {
	init,
};
