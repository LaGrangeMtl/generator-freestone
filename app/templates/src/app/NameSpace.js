'format es6';
'use strict';

import $ from 'jquery';
import Promise from 'Promise';
try{require('source-map-'+'support').install();}catch(e){}

const name = '<%= props.projectNamespace %>';

const ns = window[name] = (window[name] || {});

ns.window = $(window);

window.requestAnimFrame = (() => {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		(callback) => {
			window.setTimeout(callback, 1000 / 60);
		};
})();

export default ns;

