export const docReady = new Promise((resolve) => {
	document.addEventListener('DOMContentLoaded', resolve);
}).catch(e => console.error(e));
