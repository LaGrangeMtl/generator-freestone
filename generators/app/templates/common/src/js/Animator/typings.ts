
type AnimatorRect = {
	top: number,
	left: number,
	height: number,
	width: number,
};

type AnimatorAnimValues = {
	[key: string]: string|number,
} & {
	rotation?: number,
	scaleX?: number,
	scaleY?: number,
	x?: number,
	y?: number,
	z?: number,
	transform?: string,
}

type AnimationDictionary = {[key:string]: AnimatorAnim};

type WhenElemHorizontal = 'el' | 'ehc' | 'er';
type WhenScreenHorizontal = 'sl' | 'shc' | 'sr';
type WhenElemVertical = 'et' | 'ec' | 'eb';
type WhenScreenVertical = 'st' | 'sc' | 'sb';

type AnimatorWhen = [WhenElemHorizontal, WhenScreenHorizontal]|[WhenElemVertical, WhenScreenVertical];

type AnimatorAnimProp = {
	[key: string]: string|number|AnimatorWhen,
} & {
	when: AnimatorWhen,
}

type AnimatorPropDefinition = {
	ease: string,
	endOffset: number,
	endValue: number,
	key: string,
	dir: string,
	st: number,
	sl: number,
	startOffset: number,
	startValue: number,
}

type AnimatorAnimChildren = {
	selector: string,
	props: AnimatorAnimProp[],
	ease?: string,
};

type AnimatorAnim = {
	props?: AnimatorAnimProp[],
	children?: AnimatorAnimChildren[],
	callback?: Function,
	ease?: string,
	force3d?: boolean,
}

type AnimatorKeyFrames = {
	[key: string]: [string|number, string|number, string|number];
}

type AnimatorElement = {
	node: HTMLElement,
	parent?: HTMLElement,
	context: HTMLElement,
	is3DMatrix: boolean,
	ease: string,
	keyframes: AnimatorKeyFrames,
	keys: string[],
	initialMatrix: number[],
	callback: Function,
}

type AnimatorScrollPositions = {
	st: number,
	sl: number,
}

type AnimatorHandlerDictionnary = {
	[key: string]: Function,
}

type AnimatorLoopDictionnary = {
	[key: string]: number,
}

type AnimatorLastValuesDictionnary = {
	[key: string]: string,
}

type AnimatorTopDictionnary = {
	[key: string]: number,
}

type AnimatorAnimations = {
	[key: string]: AnimatorAnim,
}

type AnimatorRawTransforms = {
	tx: number,
	ty: number,
	sx: number,
	sy: number,
	r: number,
}
