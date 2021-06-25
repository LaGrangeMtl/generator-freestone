import valueOrDefault from './valueOrDefault';

function getValueOrDefaults(values):AnimatorRawTransforms {
	return {
		tx: valueOrDefault(values.x, 0),
		ty: valueOrDefault(values.y, 0),
		r: valueOrDefault(values.rotation, 0),
		sx: valueOrDefault(values.scaleX, 1),
		sy: valueOrDefault(values.scaleY, 1),
	};
}

function hasValues(values:AnimatorAnimValues):boolean {
	return (
		values.rotation !== undefined
		|| values.scaleX !== undefined
		|| values.scaleY !== undefined
		|| values.x !== undefined
		|| values.y !== undefined
		|| values.z !== undefined
	);
}

function transform2d(values):AnimatorAnimValues {
	if (hasValues) {
		const {
			tx, ty, r: rot, sx, sy,
		} = getValueOrDefaults(values);

		const t = `translate(${tx}px, ${ty}px)`;
		const r = `rotate(${rot}deg)`;
		const s = `scale(${sx}, ${sy})`;

		values.transform = `${t} ${r} ${s}`;
	}
	
	return values;
}

/**
 * @param {*} values
 * @returns {RawTransforms}
 */
function transform2dRaw(values):AnimatorRawTransforms {
	if (hasValues) {
		const {
			tx, ty, r: rot, sx, sy,
		} = getValueOrDefaults(values);

		const t = `translate(${tx}px, ${ty}px)`;
		const r = `rotate(${rot}deg)`;
		const s = `scale(${sx}, ${sy})`;

		values.transform = `${t} ${r} ${s}`;

		return {
			tx,
			ty,
			sx,
			sy,
			r: rot,
		};
	}

	return getValueOrDefaults({});
}

export { transform2d, transform2dRaw };
