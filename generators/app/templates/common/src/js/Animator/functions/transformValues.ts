import constrainValues from './constrainValues';

/**
 * @param {AnimatorElement} el
 * @param {number} st
 */
export default function transformValues(el:AnimatorElement, st:number, sl:number):AnimatorPropDefinition {
	return el.keys.map((propKey) => {
		return {
			st,
			sl,
			ease: el.ease,
			key: propKey,
			...el.keyframes[propKey]
				.reduce((propCarry, propVal, i) => {
					const [offset, value, dir] = propVal as any;

					switch (i) {
						case 0: 
							propCarry.startOffset = offset;
							propCarry.startValue = value;
							break;
						case 1:
						default:
							propCarry.endOffset = offset;
							propCarry.endValue = value;
							break;
					}

					propCarry.dir = dir;
					
					return propCarry;
				}, {} as AnimatorPropDefinition),
		};
	}).reduce(constrainValues, {});
}
