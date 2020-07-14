
import './utils/polyfills';

import Animator from '@lagrange/animator';
import { Animations } from './Animations';
import Barba from './Barba';
import context from './lagrange/context';
import { docReady } from './utils/docReady';

docReady.then(() => {
	[
		//List global modules here
	].forEach(c => c.init(context()));

	const animator = new Animator();
	const updateAnimator = () => {
		animator.setAnimations(Animations.get(window.innerWidth));
	};

	window.addEventListener('resize', updateAnimator);
	
	Barba.init([
		// List container modules here
	], updateAnimator);
}).catch(e => {
	console.error(e);
});;
