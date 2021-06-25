import { gsap } from 'gsap/all';
import barba, { ITransitionPage } from '@barba/core';

import ns from './NameSpace';
import VideoObserver from './lagrange/VideoObserver';
import JsonNSParser from './lagrange/JsonNSParser';
import Scroller from './scroller/Scroller';
import { SCROLL_PRIMARY } from './Constants';

const CLASSES = {
	ACTIVE: 'active',
	ACTIVE_ACTIVE: 'active-active',
	ACTIVE_DONE: 'active-done',
	ENTER: 'enter',
	ENTER_ACTIVE: 'enter-active',
	ENTER_DONE: 'enter-done',
	EXIT: 'exit',
	EXIT_ACTIVE: 'exit-active',
	EXIT_DONE: 'exit-done',
};

const ALL_CLASSES = Object.values(CLASSES);

const ANIMATION_TIMING = {
	IN: 0.7,
	OUT: 0.7,
};

const conf = {
	onUpdateContainer: null,
};

const bootstrapContainer = (ctx, modules) => {
	modules.forEach(m => m.kill && m.kill());
	
	JsonNSParser.fetchAndParse(ctx);

	modules.forEach(c => c.init(ctx));

	ctx.querySelectorAll('video').forEach(VideoObserver.onUpdate);
	
	Scroller.getById(SCROLL_PRIMARY).refreshElements(ctx);
};

const generalTransition = (wiper, modules):ITransitionPage => ({
	once({ next }) {
		bootstrapContainer(next.container, modules);
		scrollTop();
	},
	
	beforeLeave({ current }) {
		// console.log('beforeLeave');
		ALL_CLASSES.forEach(cl => wiper.classList.remove(cl));
		wiper.classList.add(CLASSES.ENTER);
		
		ALL_CLASSES.forEach(cl => current.container.classList.remove(cl));
		current.container.classList.add(CLASSES.EXIT);
		
		return new Promise(resolve => {
			requestAnimationFrame(resolve);
		});
	},
	
	leave({ current }) {
		// console.log('leave');
		wiper.classList.add(CLASSES.ENTER_ACTIVE);
		current.container.classList.add(CLASSES.EXIT_ACTIVE);
	
		return new Promise(resolve => {
			gsap.delayedCall(ANIMATION_TIMING.OUT, resolve);
		});
	},
	
	afterLeave({ current }) {
		ALL_CLASSES.forEach(cl => wiper.classList.remove(cl));
		ALL_CLASSES.forEach(cl => current.container.classList.remove(cl));
		
		current.container.classList.add(CLASSES.EXIT_DONE);
	},
	
	beforeEnter({ next }) {
		scrollTop();
		bootstrapContainer(next.container, modules);
	
		wiper.classList.remove(...ALL_CLASSES);
		wiper.classList.add(CLASSES.EXIT);
		
		ALL_CLASSES.forEach(cl => next.container.classList.remove(cl));
		next.container.classList.add(CLASSES.ENTER);
		
		return new Promise(resolve => {
			requestAnimationFrame(resolve);
		});
	},
	
	enter({ next }) {
		// console.log('enter');
		wiper.classList.add(CLASSES.EXIT_ACTIVE);
		next.container.classList.add(CLASSES.ENTER_ACTIVE);
	
		return new Promise(resolve => {
			gsap.delayedCall(ANIMATION_TIMING.IN, resolve);
		});
	},
	
	afterEnter({ next }) {
		// console.log('afterEnter');
		ALL_CLASSES.forEach(cl => wiper.classList.remove(cl));
		wiper.classList.add(CLASSES.EXIT_DONE);
		
		ALL_CLASSES.forEach(cl => next.container.classList.remove(cl));
		next.container.classList.add(CLASSES.ENTER_DONE);
		
		gsap.delayedCall(ANIMATION_TIMING.OUT, () => {
			wiper.classList.remove(CLASSES.EXIT_DONE);
		});
		
		return new Promise(resolve => {
			requestAnimationFrame(resolve);
		});
	},
});

function scrollTop() {
	Scroller.getById(SCROLL_PRIMARY).setScroll(0, 0);
}

function init(modules, onUpdateContainer = () => {}) {
	const wiper = document.querySelector('[data-wiper]');

	conf.onUpdateContainer = onUpdateContainer;
	
	barba.init({
		debug: true,
		logLevel: 'debug',
		// preventRunning: true,
		timeout: 30000,
		// cacheIgnore: true,
		transitions: [
			//default-transition
			{
				name: 'default-transition',
				...generalTransition(wiper, modules),
			},
		],
	});

	const onEnter = ({ next }) => {
		document.body.setAttribute('data-current-namespace', next.namespace)
	}

	barba.hooks.afterEnter(onEnter);
}

export default {
	init,
	go: (href) => barba.go(href),
	previous: () => barba.history.previous,
	current: () => barba.history.current,
};

// @ts-ignore
window.__barba = barba;
