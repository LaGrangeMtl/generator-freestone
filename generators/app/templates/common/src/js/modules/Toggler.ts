class Toggler {
	node: HTMLElement;
	static list:Toggler[] = [];
	constructor(node:HTMLElement) {
		this.node = node;
		Toggler.list.push(this);

		this.resize();
	}
	resize = () => {
		this.node.style.setProperty('--scroll-height', this.node.scrollHeight + 'px');
	}
	static update() {
		Toggler.list.forEach(toggler => toggler.resize);
	}
}
function init() {
	document.querySelectorAll('[data-toggler]').forEach(node => new Toggler(node as HTMLElement));
	window.addEventListener('resize', Toggler.update);
}
function kill() {
	window.removeEventListener('resize', Toggler.update);
}
export default {
	init,
	kill,
}