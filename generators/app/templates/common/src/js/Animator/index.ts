import './typings';

import { elemGuid } from './utils/guid';
import * as Constants from './Constants';
import { updateScreen } from './utils/screen';
import parseWhen from './functions/parseWhen';
import parseVal from './functions/parseVal';
import getContextScrollPositions from './functions/getContextScrollPositions';
import { transform2d } from './functions/transform2d';
import transformValues from './functions/transformValues';
import matrix from './functions/matrix';
import { i3d } from './utils/CssMatrix';
import { getInitialMatrix } from './functions/getInitialMatrix';
import calculate2dTransforms from './functions/calculate2dTransforms';

const ATTR_NAME = 'data-animator-id';

export default class Animator {
	static instances:Animator[] = [];

	static updateAll() {
		Animator.instances.forEach((instance) => {
			instance.updateElements();
		});
	}

	animations:AnimationDictionary = {};

	elements:AnimatorElement[] = [];

	contexts:HTMLElement[] = [];

	handlerDictionnary:AnimatorHandlerDictionnary = {};

	loopDictionnary:AnimatorLoopDictionnary = {};

	lastValuesDictionnary:AnimatorLastValuesDictionnary = {};
	
	animatorTopDictionnary:AnimatorTopDictionnary = {};

	constructor() {
		Animator.instances.push(this);
	}

	static getConstants() {
		return {
			...Constants,
		};
	}
	
	getKeyframes = (elem:HTMLElement, rect:AnimatorRect, animationId:string, props:AnimatorAnimProp[] = null, child:HTMLElement = null):AnimatorKeyFrames => {
		let animation:AnimatorAnim = this.animations[animationId];
		let animationProps:AnimatorAnimProp[];

		if (props) {
			animationProps = props;
		} else if (animation && !Array.isArray(animation)) {
			animationProps = animation.props;
		}

		if (!animationProps) return {};
		return animationProps.reduce((c, anim) => {
			const valuesMap = Object.keys(anim)
				.filter(k => k !== 'when')
				.map((key):[string, string|number] => [key, anim[key] as (string|number)]);

			const { dir, when } = parseWhen(rect, anim.when);

			return valuesMap.reduce((c2, value) => {
				const [key, val] = value;
				c2[key] = c[key] || [];
				c2[key].push([when, parseVal(key, val, child || elem, elem), dir]);
				return c2;
			}, c);
		}, {});
	}

	getRect = (context:HTMLElement, elem:HTMLElement):AnimatorRect => {
		const style = elem.getAttribute('style');
		elem.setAttribute('style', '');
		const {
			top,
			left,
			height,
			width,
		} = elem.getBoundingClientRect();
		const { st, sl } = getContextScrollPositions(context);
		const id = elemGuid(context);
		elem.setAttribute('style', style);

		return {
			top: (top - this.animatorTopDictionnary[id]) + st,
			left: (left - this.animatorTopDictionnary[id]) + sl,
			height,
			width,
		};
	}

	getContext = (elem: HTMLElement):HTMLElement => {
		let context = null;
		let el = elem;

		while (el.parentElement && !context) {
			el = el.parentElement;
			if (el.getAttribute('data-scrollbar') || el.getAttribute('data-scrollbar') === '') {
				context = el;
			}
		}
		if (!this.contexts.find(ctx => context === ctx)) {
			const id = elemGuid(context);
			this.animatorTopDictionnary[id] = el.getBoundingClientRect().top + el.scrollTop;
			this.contexts.push(context);
		}
		
		return context || document.scrollingElement as HTMLElement || document.documentElement as HTMLElement;
	}

	hasChanged = (id:string, values) => {
		if (!this.lastValuesDictionnary[id]) return true;
		return this.lastValuesDictionnary[id] !== JSON.stringify(values);
	};

	scroll = (ctx:HTMLElement) => {
		const id = elemGuid(ctx);
		const { st, sl } = getContextScrollPositions(ctx);
		if (this.loopDictionnary[id]) {
			cancelAnimationFrame(this.loopDictionnary[id]);
		}
		
		this.loopDictionnary[id] = requestAnimationFrame(() => {
			this.update(ctx, st, sl);
		});
	};

	virtualScroll = (ctx:HTMLElement, st:number = 0, sl:number = 0) => {
		this.update(ctx, st, sl);
	};

	update = (ctx:HTMLElement, st:number, sl:number) => {
		this.elements.forEach((el) => {
			if (el.context !== ctx || Object.keys(el.keyframes).length === 0) return;

			const isSVG = ~el.node.namespaceURI.indexOf('svg');
			let values = null;

			if (isSVG && el.node.tagName.toLowerCase() !== 'svg') {
				values = transform2d(transformValues(el, st, sl));
			} else if (el.is3DMatrix || (el.initialMatrix && el.initialMatrix.length === 16)) {
				if (!el.initialMatrix) el.initialMatrix = [...i3d];
				values = matrix(el.initialMatrix, transformValues(el, st, sl));
			} else {
				values = calculate2dTransforms(el, st, sl);
			}

			const id = elemGuid(el.node);
			if (this.hasChanged(id, values)) {
				if (values) {
					Object.assign(el.node.style, values);
				}

				if (el.callback) {
					el.callback({
						...values,
					});
				}

				this.lastValuesDictionnary[id] = JSON.stringify(values);
			}
		});
	}

	getEase = (animationId:string) => {
		return (this.animations[animationId] && this.animations[animationId].ease) || null;
	}

	is3DMatrix = (animationId:string) => {
		return (this.animations[animationId] && this.animations[animationId].force3d) || false;
	}

	getChildren = (context:HTMLElement, elem:HTMLElement, rect:AnimatorRect, animationId:string) => {
		if (Array.isArray(this.animations[animationId])) {
			return [];
		}
		
		const children = (this.animations[animationId] && this.animations[animationId].children) || [];

		return children.reduce((c, anim) => {
			const arr = Array.from(elem.querySelectorAll(anim.selector)) as HTMLElement[];
			
			arr.forEach((el) => {
				const keyframes = this.getKeyframes(elem, rect, null, anim.props, el);
				
				c.push({
					node: el,
					parent: elem,
					context,
					ease: anim.ease,
					is3DMatrix: this.is3DMatrix(animationId),
					keyframes,
					keys: Object.keys(keyframes),
					initialMatrix: getInitialMatrix(el, this.is3DMatrix(animationId)),
					callback: this.getCallbackByAnimation(anim),
				});
			});
			return c;
		}, []);
	}

	getCallbackByAnimation = (animation:AnimatorAnim) => {
		return animation?.callback;
	}

	getCallbackByAnimationId = (animationId:string) => {
		const animation = this.animations[animationId];
		if (!animation) return null;

		return this.getCallbackByAnimation(animation);
	}

	parseElements = (list: AnimatorElement[], elem: HTMLElement) => {
		const context = this.getContext(elem);
		const animationId = elem.getAttribute(ATTR_NAME);

		const rect = this.getRect(context, elem);

		elemGuid(elem);

		const keyframes = this.getKeyframes(elem, rect, animationId);

		const props:AnimatorElement = {
			node: elem,
			context,
			is3DMatrix: this.is3DMatrix(animationId),
			ease: this.getEase(animationId),
			keyframes,
			keys: Object.keys(keyframes),
			initialMatrix: getInitialMatrix(elem, this.is3DMatrix(animationId)),
			callback: this.getCallbackByAnimationId(animationId),
		};
		list.push(props);

		return list.concat(this.getChildren(context, elem, rect, animationId));
	}

	updateContext = (ctx:HTMLElement) => {
		const id = elemGuid(ctx);
		const context = ctx.tagName === 'HTML' ? window : ctx;
		if (this.handlerDictionnary[id]) {
			context.removeEventListener('scroll', this.handlerDictionnary[id] as EventListener);
		} else {
			this.handlerDictionnary[id] = () => { this.scroll(ctx); };
		}
		
		context.addEventListener('scroll', this.handlerDictionnary[id] as EventListener);

		this.handlerDictionnary[id](ctx);
	};

	updateElements = () => {
		updateScreen();
		this.contexts = [];
		const nodeList = Array.from(document.querySelectorAll(`[${ATTR_NAME}]`)) as HTMLElement[];
		this.elements = nodeList.reduce(this.parseElements, []);

		this.contexts.forEach(this.updateContext);
	};

	setAnimations = (anims:AnimationDictionary) => {
		this.animations = anims;
		this.updateElements();
	};

	/* eslint-disable no-console */
	debug = () => {
		console.log('animations', this.animations);
		console.log('all elements', this.elements);
		console.log('filtered elements', this.elements.filter(x => x.keys.length > 0));
		console.log('contexts', this.contexts);
	};
}

// @ts-ignore
window.__Animator = Animator; // eslint-disable-line
