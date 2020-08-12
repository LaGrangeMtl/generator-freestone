// @ts-check

const dom = {};
const observer = new ResizeObserver(entries => {
	entries.forEach((entry) => {
		if (entry.borderBoxSize) {
			entry.target.style.setProperty('--height', (entry.borderBoxSize[0] || entry.borderBoxSize).blockSize + 'px');
			entry.target.style.setProperty('--width', (entry.borderBoxSize[0] || entry.borderBoxSize).inlineSize + 'px');
		} else {
			entry.target.style.setProperty('--height', (entry.contentRect[0] || entry.contentRect).height + 'px');
			entry.target.style.setProperty('--width', (entry.contentRect[0] || entry.contentRect).width + 'px');
		}
	});
});

class SizeHelper {
	static list = [];

	constructor(node) {
		this.node = node;

		observer.observe(this.node);

		SizeHelper.list.push(this);
	}

	destroy = () => {
		observer.unobserve(this.node);
	}
}

/**
 * @param {HTMLElement} ctx 
 */
function init(ctx) {
	dom.targets = Array.from(ctx.querySelectorAll('[data-size-helper]'));

	dom.targets.forEach(target => new SizeHelper(target));
}

function kill() {
	SizeHelper.list.forEach(instance => instance.destroy());
	SizeHelper.list = [];
}

export default {
	init,
	kill,
};
