// @ts-check

import { SCROLL_PRIMARY } from '../Constants';
import Scroller from '../scroller/Scroller';

const CLASS = 'data-sticky';
const STICKY_CLASS = 'is-sticky';

const BOTTOM = 'bottom';
const TOP = 'top';

class Sticky {
	static list:Sticky[] = [];
	offset = 0;
	node: HTMLElement;
	parent: HTMLElement;
	scroller: Scroller;
	stickyType: string;
	y: number;
	rect: any;

	constructor(node:HTMLElement) {
		this.node = node;
		this.parent = this.node.parentElement;
		this.scroller = Scroller.getById(SCROLL_PRIMARY);
		this.stickyType = node.getAttribute(`${CLASS}`) === BOTTOM ? BOTTOM : TOP;

		this.y = 0;
		this.rect = this.node.getBoundingClientRect();

		if (this.scroller) {
			this.scroller.on(this.onScroll);
		}

		Sticky.list.push(this);
	}

	onScroll = (scrollTop) => {
		const parentRect = this.parent.getBoundingClientRect();
		const { top, height, bottom } = parentRect;
		const max = height - this.rect.height;

		if (this.stickyType === BOTTOM) {
			if (scrollTop >= top - window.innerHeight && bottom - window.innerHeight >= 0) {
				// this.y = -top + parentRect.top;
				this.node.classList.add('sticky');
				this.y = -top + window.innerHeight - this.rect.height;
			} else if (bottom - window.innerHeight <= 0) {
				this.node.classList.remove('sticky');
				this.y = 0;
			}

			this.node.classList[top <= 0 ? 'add' : 'remove']('inside');
		} else {
			// eslint-disable-next-line no-lonely-if
			if (top <= 0 && -top >= max) {
				this.node.classList.remove(STICKY_CLASS);
				this.y = max;
			} else if (top <= 0 && -top < max) {
				this.node.classList.add(STICKY_CLASS);
				this.y = -top;
			} else {
				this.node.classList.remove(STICKY_CLASS);
				this.y = 0;
			}
		}

		this.updatePosition();
	}

	updatePosition = () => {
		this.node.style.transform = 'translate(0, ' + this.y + 'px)';
	}

	dispose = () => {
		this.scroller.off(this.onScroll);
	}
}

function init(ctx) {
	const stickies = ctx.querySelectorAll(`[${CLASS}]`);

	stickies.forEach(sticky => new Sticky(sticky));
}

function kill() {
	Sticky.list.forEach(sticky => sticky.dispose());
	Sticky.list = [];
}

export default {
	init,
	kill,
};
