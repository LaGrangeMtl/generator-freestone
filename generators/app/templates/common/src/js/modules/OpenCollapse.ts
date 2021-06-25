'format es6';

import { TweenMax } from 'gsap';
import { slideToggle } from '../utils/slide';
import { getScroller } from '../scroller/DefaultScroller';
import Scroller from '../scroller/Scroller';

class Collapse {
	static list:Collapse[] = [];

	parent:HTMLElement;
	controller:HTMLElement;
	target:HTMLElement;
	scroll:Scroller;
	
	constructor(collapser) {
		this.parent = collapser;
		this.controller = this.parent.querySelector('[data-collapser-controler]');
		this.target = this.parent.querySelector('[data-collapser-target]');
		this.scroll = getScroller();
		this.controller.addEventListener('click', this.handleCollapser);

		Collapse.list.push(this);
	}

	handleCollapser = (e) => {
		e.preventDefault();
		this.controller.removeEventListener('click', this.handleCollapser);
		this.parent.classList.toggle('open');

		slideToggle(this.target).then(() => {
			// to prevent content to be cropped or too long on resize, we cleared inline style.
			TweenMax.set(this.target, { clearProps: 'all' });
			this.target.classList.toggle('open');
			this.scroll.updateScrollDimension();
		});

		this.controller.addEventListener('click', this.handleCollapser);
	}

	dispose = () => {
		this.controller.removeEventListener('click', this.handleCollapser);
	}
}

function init(ctx:HTMLElement) {
	const collapsers = Array.from(ctx.querySelectorAll('[data-collapser]'));
	if (collapsers) collapsers.forEach(collapser => new Collapse(collapser));
}

function kill() {
	Collapse.list.forEach(x => x.dispose());
	Collapse.list = [];
}

export default {
	init,
	kill,
};
