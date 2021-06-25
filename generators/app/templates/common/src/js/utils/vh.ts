'format es6';
'use strict';

function onResize() {
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
}
 
export default {
	init(ctx:HTMLElement) {
		window.addEventListener('resize', onResize);
		onResize();
	},
};
