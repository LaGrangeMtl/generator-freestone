import './utils/polyfills';

import Animator from './Animator';
import { Animations } from './Animations';
import Barba from './Barba';
import context from './lagrange/context';
import { docReady } from './utils/docReady';
import { HOOKS } from './scroller/SmoothScroller';
import SizeHelper from './utils/SizeHelper';

import VideoObserver from './lagrange/VideoObserver';
import CSSAnimationModule from './modules/CSSAnimationModule';
import AnimatedTitle from './modules/AnimatedTitle';
import { updateScroller } from './scroller/DefaultScroller';
import vh from './utils/vh';

docReady.then(() => {
	if (navigator.userAgent.search('Safari') >= 0 && navigator.userAgent.search('Chrome') < 0)  {
		document.documentElement.classList.add('safari');
	}

	document.querySelectorAll('video').forEach(VideoObserver.onUpdate);

	const scroller = updateScroller();

	[
		//List global modules here
		vh,
	].forEach(c => c.init(context()));
	
	Barba.init([
		SizeHelper,
		CSSAnimationModule,
		AnimatedTitle,
	]);

	const animator = new Animator();

	const setAnimations = () => {
		animator.setAnimations(Animations.get(window.innerWidth));
	};
	
	scroller.hooks.register(HOOKS.UPDATE_SECTION, setAnimations);
	setAnimations();
}).catch(e => {
	console.error(e);
});
