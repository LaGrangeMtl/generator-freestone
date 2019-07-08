'format es6';
'use strict';

import 'core-js/fn/array/find';
// import Scrollbar from 'smooth-scrollbar';
import {
	scale,
	rotate,
	translate,
	compose,
	toCSS,
} from 'transformation-matrix';

import Ease from './Easings';

export const ELEM_BOTTOM = 'eb';
export const ELEM_TOP = 'et';
export const ELEM_CENTER = 'ec';

export const SCREEN_BOTTOM = 'sb';
export const SCREEN_TOP = 'st';
export const SCREEN_CENTER = 'sc';

/**
 * Limits a number between a range of 2 numbers
 * @param {number} num 
 * @param {number} min 
 * @param {number} max 
 */
const constrain = (num, min, max) => {
	return Math.min(Math.max(parseInt(num, 10), min), max);
};

/**
 * Map a number between two ranges
 * 
 * @param {number} num 
 * @param {number} in_min 
 * @param {number} in_max 
 * @param {number} out_min 
 * @param {number} out_max 
 */
const map = (num, in_min, in_max, out_min, out_max) => {
	if (in_max === in_min) return out_max;
	return (((num - in_min) * (out_max - out_min)) / (in_max - in_min)) + out_min;
};

const instances = [];

export function updateAll() {
	instances.forEach((instance) => {
		instance.updateElements();
	});
}

export function Animator() {
	let animations = [];
	let elements = [];
	let contexts = [];

	const win = {
		width: 0,
		height: 0,
	};

	instances.push(this);

	function getContextScrollTop(context) {
		let ctx = context;
		if (context.tagName === 'HTML') ctx = document.scrollingElement || context;
		return ctx.scrollTop;
	}

	function parseWhen(context, rect, when) {
		const parts = when.split('_');
		if (parts.length !== 2) throw new Error('Missing parameters in animation "when" (expects: ELEM_SCREEN)');

		const st = getContextScrollTop(context);

		let obj;
		switch (parts[0]) {
			default:
			case ELEM_TOP: obj = rect.top - st; break;
			case ELEM_CENTER: obj = rect.top + (rect.height / 2) - st; break;
			case ELEM_BOTTOM: obj = rect.top + rect.height - st; break;
		}
		
		let screen;
		switch (parts[1]) {
			default:
			case SCREEN_TOP: screen = context.animator_top + st; break;
			case SCREEN_CENTER: screen = context.animator_top + (win.height / 2) + st; break;
			case SCREEN_BOTTOM: screen = context.animator_top + win.height + st; break;
		}

		return obj - screen;
	}

	function parseRelativeVal(prop, value, elem) {
		switch (prop) {
			case 'y': return (value / 100) * elem.clientHeight;
			case 'x':
			default: return (value / 100) * elem.clientWidth;
		}
	}

	function parseVal(prop, value, elem) {
		if (typeof value === 'number') return value;

		let [total, val, unit] = value.match(/([-0-9.]+)(.+)/); //eslint-disable-line
		val = parseFloat(val);

		switch (unit) {
			case 'vh': return (val / 100) * window.innerHeight;
			case 'vw': return (val / 100) * window.innerWidth;
			case '%':
			default: return parseRelativeVal(prop, val, elem);
		}
	}

	function getKeyframes(context, elem, rect, animationId, props = null, children = null) {
		let animation = animations[animationId];

		if (props) {
			animation = props;
		} else if (animation && !Array.isArray(animation)) {
			animation = animation.props;
		}

		if (!animation) return [];
		return animation.reduce((c, anim) => {
			let values = { ...anim };
			delete values.when;
			values = Object.keys(values).map(key => [key, anim[key]]);
			const from = parseWhen(context, rect, anim.when);

			return values.reduce((c2, value) => {
				const [key, val] = value;
				c[key] = c[key] || [];
				c[key].push([from, parseVal(key, val, children || elem)]);
				return c;
			}, c);
		}, {});
	}

	function getChildren(context, elem, rect, animationId) {
		if (Array.isArray(animations[animationId])) {
			return [];
		}
		
		const children = (animations[animationId] && animations[animationId].children) || [];

		return children.reduce((c, anim) => {
			const arr = Array.from(elem.querySelectorAll(anim.selector));
			
			arr.forEach((el) => {
				const keyframes = getKeyframes(context, elem, rect, null, anim.props, el);
				
				c.push({
					node: el,
					context,
					ease: anim.ease,
					keyframes,
					keys: Object.keys(keyframes),
				});
			});
			return c;
		}, []);
	}

	function getRect(context, elem) {
		const rect = elem.getBoundingClientRect();
		const st = getContextScrollTop(context);

		return {
			top: (rect.top - context.animator_top) + st,
			height: rect.height,
		};
	}

	function getContext(elem) {
		let context = null;
		let el = elem;
		while (el.parentNode && !context) {
			el = el.parentNode;
			if (el.getAttribute('data-scrollbar') || el.getAttribute('data-scrollbar') === '') {
				context = el;
			}
		}
		if (!contexts.find(ctx => context === ctx)) {
			context.animator_top = el.getBoundingClientRect().top;
			contexts.push(context);
		}
		return context;
	}

	function constrainValues(c, prop) {
		const constrained = constrain(prop.st, prop.startOffset, prop.endOffset);
		const prc = map(constrained, prop.startOffset, prop.endOffset, 0, 1);
		if (prop.ease) {
			c[prop.key] = Ease[prop.ease](prc, prop.startValue, prop.endValue - prop.startValue, 1);
		} else {
			c[prop.key] = map(constrained, prop.startOffset, prop.endOffset, prop.startValue, prop.endValue);
		}
		return c;
	}

	function transformValues(el, st) {
		return el.keys.map((propKey) => {
			return el.keyframes[propKey].reduce((propCarry, propVal) => {
				const [offset, value] = propVal;
				if (propCarry.startOffset === undefined || st >= offset) {
					propCarry.startOffset = offset;
					propCarry.startValue = value;

					if (propCarry.endOffset <= propCarry.startOffset) {
						propCarry.endOffset = offset;
						propCarry.endValue = value;
					}
				}
				if (propCarry.endOffset === undefined || st <= offset) {
					propCarry.endOffset = offset;
					propCarry.endValue = value;
				}
				return {
					st,
					ease: el.ease,
					key: propKey,
					...propCarry,
				};
			}, {});
		}).reduce(constrainValues, {});
	}

	function hasChanged(el, values) {
		if (!el.animator__lastValues) return true;
		return el.animator__lastValues !== JSON.stringify(values);
	}

	function scroll(ctx) {
		if (ctx.animation_loop) {
			cancelAnimationFrame(ctx.animation_loop);
		}
		// Setup the new requestAnimationFrame()
		ctx.animation_loop = requestAnimationFrame(() => {
			update(ctx);
		});
	}

	function matrix(values) {
		values.transform = toCSS(compose(
			translate(values.x || 0, values.y || 0),
			rotate(values.rotation || 0),
			scale(values.scaleX || 1, values.scaleY || 1),
		));
		delete values.rotation;
		delete values.scaleX;
		delete values.scaleY;
		delete values.x;
		delete values.y;
		delete values.z;
		return values;
	}

	function update(ctx) {
		const st = getContextScrollTop(ctx);
		elements.forEach((el) => {
			if (el.context !== ctx) return;
			
			const values = matrix(transformValues(el, st));
			values['will-change'] = 'transform';
			if (hasChanged(el, values)) {
				// TweenMax.set(el.node, values);
				Object.assign(el.node.style, values);
				el.animator__lastValues = values;
			}
		});
	}

	function getEase(animationId) {
		return (animations[animationId] && animations[animationId].ease) || null;
	}

	function parseElements(list, elem) {
		const context = getContext(elem);
		const animationId = elem.getAttribute('data-animator-id');

		const rect = getRect(context, elem);

		const keyframes = getKeyframes(context, elem, rect, animationId);

		list.push({
			node: elem,
			context,
			ease: getEase(animationId),
			keyframes,
			keys: Object.keys(keyframes),
		});

		return list.concat(getChildren(context, elem, rect, animationId));
	}

	function updateContext(ctx) {
		const context = ctx.tagName === 'HTML' ? window : ctx;
		if (ctx.animator_scrollHandler) {
			context.removeEventListener('scroll', ctx.animator_scrollHandler);
		} else {
			const st = getContextScrollTop(ctx);
			ctx.animator_scrollHandler = () => { scroll(ctx, st); };
		}
		
		context.addEventListener('scroll', ctx.animator_scrollHandler);
		ctx.animator_scrollHandler(ctx);
	}

	this.updateElements = () => {
		contexts = [];
		win.width = window.innerWidth;
		win.height = window.innerHeight;
		const nodeList = document.querySelectorAll('[data-animator-id]');
		elements = Array.from(nodeList).reduce(parseElements, []);

		window.animator___elements = elements;

		contexts.forEach(updateContext);
	};

	this.setAnimations = (anims) => {
		animations = anims;
		this.updateElements();
	};
}
