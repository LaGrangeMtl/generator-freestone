import {
	toCSS,
	composeMultiple,
	translate,
	rotate,
	scale,
} from '../utils/CssMatrix';
import valueOrDefault from './valueOrDefault';

export default function matrix(initialMatrix:number[], values:AnimatorAnimValues):AnimatorAnimValues {
	if (
		values.rotation !== undefined
		|| values.scaleX !== undefined
		|| values.scaleY !== undefined
		|| values.x !== undefined
		|| values.y !== undefined
		|| values.z !== undefined
	) {
		values.transform = toCSS(composeMultiple([
			initialMatrix,
			translate(valueOrDefault(values.x), valueOrDefault(values.y), valueOrDefault(values.z)),
			rotate(valueOrDefault(values.rotation)),
			scale(valueOrDefault(values.scaleX, 1), valueOrDefault(values.scaleY, 1), valueOrDefault(values.scaleZ, 1)),
		]));
	}

	return values;
}
