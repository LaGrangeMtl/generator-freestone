import { transform2d, transform2dRaw } from './transform2d';
import transformValues from './transformValues';
import { isIdentity2d } from '../utils/CssMatrix';

export default function calculate2dTransforms(el:AnimatorElement, st:number, sl:number):AnimatorAnimValues {
	const vals = transformValues(el, st, sl);
	const vRaw = transform2dRaw(vals);
	const v = transform2d(vals);
	if (v.transform && el.initialMatrix && !isIdentity2d(el.initialMatrix)) {
		const [a, b, c, d, tx, ty] = el.initialMatrix;

		const scaleX = Math.sign(a) * Math.sqrt((a * a) + (b * b));
		const scaleY = Math.sign(d) * Math.sqrt((c * c) + (d * d));
		const rotation = Math.atan2(-b, a);

		v.transform = transform2d({
			scaleX: scaleX * vRaw.sx,
			scaleY: scaleY * vRaw.sy,
			rotation: rotation + vRaw.r,
			x: tx + vRaw.tx,
			y: ty + vRaw.ty,
		}).transform;
	}

	return v;
}
