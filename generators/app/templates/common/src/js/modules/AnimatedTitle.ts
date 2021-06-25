// @ts-check

import ScrollModule from '../scroller/ScrollModule';
import getCssVariable from '../utils/getCssVariable';
import { GENERAL_THRESHOLD } from '../Constants';

const ATTR_NAME = 'data-animated-title';
const SPLIT_BY_ATTR = 'data-split-by';
const THRESHOLD_ATTR = 'data-module-treshold';


let titles:AnimatedTitle[] = [];

const MODE_LETTER = 'letter';
const MODE_WORD = 'word';
const MODE_LINE = 'line';

function span(className:string, text:string) {
	return `<span class="${className}">${text}</span>`;
}

function mask(text:string, index:number) {
	return `<span class="mask" style="--i: ${index}">${text}</span>`;
}

function byLetter(text:string, index = 0) {
	return text.split('').map((t, i) => mask(span('letter', t), index + i));
}

function byWordLetter(text:string, index = 0) {
	return text.split(' ').reduce((c, v, i) => {
		const l = byLetter(v, c.index);
		c.index += l.length;
		c.list.push(span('word', l.join('')));
		return c;
	}, { index: 0, list: [] }).list;
}

function byWord(text:string, index = 0, masked = true) {
	return text.split(' ').map((t, i) => masked ? mask(span('word', t), index + i) : span('word', t));
}

function stringToHTML(str) {
	const doc = new DOMParser().parseFromString(str, 'text/html');
	return doc.querySelectorAll('body > *'); // to get a Static NodeList https://developer.mozilla.org/en-US/docs/Web/API/NodeList
}

function recursiveSplit(node:HTMLElement, mode:string, startIndex = { value: 0 }) {
	const childrens = Array.from(node.childNodes).map((childNode) => {
		if (childNode.nodeType === 3) { // text
			const htmlStrings = mode === MODE_LETTER ? byWordLetter(childNode.textContent, startIndex.value) : byWord(childNode.textContent, startIndex.value);
			startIndex.value += htmlStrings.length;

			const htmlString = htmlStrings.join('<span> </span> ');
			return stringToHTML(htmlString);
		}

		return recursiveSplit(childNode as HTMLElement, mode, startIndex);
	});

	node.innerHTML = '';
	childrens.forEach(child => {
		if (child instanceof HTMLElement) {
			node.appendChild(child);
		} else {
			child.forEach(cn => {
				node.appendChild(cn);
			})
		}
	});

	return node;
}

class AnimatedTitle {
	node:HTMLElement = null;
	
	textContent = '';
	parent: HTMLElement;
	innerHTMLCacheCache: string;
	totalDuration: number;
	sm: ScrollModule;
	animationDuration: number;
	animationDelay: number;
	animationStagger: number;
	numWords: number;
	mode: string;
	parentModule: HTMLElement;
	trigger: HTMLElement;

	constructor(node:HTMLElement, parent:HTMLElement = null) {
		this.node = node;
		this.parent = parent;
		this.parentModule = this.node.closest('[data-simple-module-animation]');
		this.trigger = this.parentModule ?? this.node;

		this.innerHTMLCacheCache = node.innerHTML;
		const threshold = Number(this.trigger.getAttribute(THRESHOLD_ATTR)) || GENERAL_THRESHOLD;
		
		if(this.parent) {
			this.mode = this.parent.getAttribute(SPLIT_BY_ATTR) || MODE_WORD;
		} else {
			this.mode = this.node.getAttribute(SPLIT_BY_ATTR) || MODE_WORD;
		}

		this.totalDuration = 0.9;

		this.sm = new ScrollModule(this.trigger, {
			onWakeUp: this.onWakeUp,
			threshold: threshold,
		});

		window.addEventListener('resize', this.onResize);
		this.onResize();
	}

	onWakeUp = () => {
		this.node.classList.add('animated-title-in');
		setTimeout(() => {
			this.node.classList.add('complete');
		}, this.totalDuration * 1000);
	}

	onResize = () => {
		this.animationDuration = parseFloat(getCssVariable(this.parent || this.node, '--animation-duration', '[data-animated-title]'));
		this.animationDelay = parseFloat(getCssVariable(this.parent || this.node, '--animation-delay', '[data-animated-title]'));
		this.animationStagger = parseFloat(getCssVariable(this.parent || this.node, '--animation-stagger', '[data-animated-title]'));

		this.node.innerHTML = this.innerHTMLCacheCache;
		recursiveSplit(this.node, this.mode);
		if (this.mode === MODE_LINE) {
			let lineIndex = -1;
			let lastTop = 0;
			const list:HTMLElement[] = Array.from(this.node.querySelectorAll('.mask'));
			list.forEach(word => {
				let t = word.getBoundingClientRect().top;
				if (lastTop < t) {
					lineIndex++;
				}

				word.style.setProperty('--line', lineIndex.toString());
				lastTop = t;
			});
		}

		this.node.classList.add('active');
	}

	dispose = () => {
		window.removeEventListener('resize', this.onResize);
		this.sm.kill();
	}
}

function init(ctx:HTMLElement) {
	titles = (Array.from(ctx.querySelectorAll('[data-animated-title]')) as HTMLElement[]).reduce((elems, elem) => {
		if (elem.getAttribute('data-animated-title') === 'children') {
			Array.from(elem.children || []).forEach((child:HTMLElement) => {
				child.setAttribute('data-animated-wrapper', '');
				elems.push(new AnimatedTitle(child, elem));
			});
		} else {
			elems.push(new AnimatedTitle(elem));
			elem.setAttribute('data-animated-wrapper', '');
		}

		return elems;
	}, []);
}

function kill() {
	titles.forEach(x => x.dispose());
}

export default {
	init,
	kill,
};
