import Promise from 'Promise';
import $ from 'jquery';

export const docReady= new Promise((resolve, reject) => {
	$(document).ready(() => {
		resolve();
	});
});
