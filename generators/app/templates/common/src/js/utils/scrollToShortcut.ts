//@ts-check

import { scrollTo } from "./scrollTo";
import { MAIN_CONTAINER } from '../Constants';
import { getScroller } from '../scroller/DefaultScroller';
import Scroller from "../scroller/Scroller";

let elems:ScrollToShortcut[] = [];

class ScrollToShortcut {
	container:HTMLElement;
	direction:string;
	parent:HTMLElement;
	scroll:Scroller;

	constructor(container) {
		this.container = container;
		this.direction = this.container.getAttribute('data-scroll');
		this.parent = this.container.closest('[data-scroll-section]') as HTMLElement;
		this.container.addEventListener('click', this.handleScroll);
		this.scroll = getScroller();
	}
	
	handleScroll = () => {
		switch(this.direction) {
			case 'next' :
				this.scroll.scrollTo(this.parent.getBoundingClientRect().height);
				break;
				case 'down' :
				this.scroll.scrollTo(MAIN_CONTAINER.getBoundingClientRect().height);
				break;
			default:
				this.scroll.scrollTo(0);
		}
	}

	dispose = () => {
		this.container.removeEventListener('click', this.handleScroll);
	}
}

function kill() {
	elems.forEach(w => w.dispose());
}

function init(ctx) {
	const scrollElements = Array.from(ctx.querySelectorAll('[data-scroll]'));
	if (scrollElements.length <= 0) return;

	elems = scrollElements.map(trigger => new ScrollToShortcut(trigger));
}

export default {
	init,
	kill,
};
