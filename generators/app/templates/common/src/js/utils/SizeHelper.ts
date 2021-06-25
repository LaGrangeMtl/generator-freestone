const dom = {};
const observer = new ResizeObserver(entries => {
	entries.forEach((entry) => {
		const target = entry.target as HTMLElement;
		let namespace = target.getAttribute('data-size-helper');
		if (namespace) namespace = '-' + namespace;

		let props = {};

		if (entry.borderBoxSize) {
			props = {
				[`--height${namespace}`]: `${(entry.borderBoxSize[0] || entry.borderBoxSize).blockSize}px`,
				[`--width${namespace}`]: `${(entry.borderBoxSize[0] || entry.borderBoxSize).inlineSize}px`,
				// [`--height-no-unit${namespace}`]: `${(entry.borderBoxSize[0] || entry.borderBoxSize).blockSize}`,
				// [`--width-no-unit${namespace}`]: `${(entry.borderBoxSize[0] || entry.borderBoxSize).inlineSize}`,
			};
		} else {
			props = {
				[`--height${namespace}`]: `${(entry.contentRect[0] || entry.contentRect).height}px`,
				[`--width${namespace}`]: `${(entry.contentRect[0] || entry.contentRect).width}px`,
				// [`--height-no-unit${namespace}`]: `${(entry.contentRect[0] || entry.contentRect).height}`,
				// [`--width-no-unit${namespace}`]: `${(entry.contentRect[0] || entry.contentRect).width}`,
			};
		}

		Object.keys(props).forEach(prop => {
			target.style.setProperty(prop, props[prop]);
		});
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
