import { VERTICAL } from '../Constants';
import { constrain } from '../utils/constrain';
import Easings from '../utils/Easings';
import { map } from '../utils/map';

/**
 * @param {object} c 
 * @param {AnimatorProp} prop 
 */
export default function constrainValues(c, prop:AnimatorPropDefinition) {
	const {
		st,
		sl,
		key,
		ease,
		dir,
		startOffset,
		endOffset,
		startValue,
		endValue,
	} = prop;

	const constrained = constrain(dir === VERTICAL ? st : sl, startOffset, endOffset);
	const prc = map(constrained, startOffset, endOffset, 0, 1);

	if (ease) {
		c[key] = Easings[ease](prc, startValue, endValue - startValue, 1);
	} else {
		c[key] = map(constrained, startOffset, endOffset, startValue, endValue);
	}
	return c;
}
