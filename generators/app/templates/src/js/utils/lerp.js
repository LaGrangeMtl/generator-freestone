/**
 * Linear interpolation between 2 numbers
 * @param {number} v0 
 * @param {number} v1 
 * @param {number} t 
 */
export const lerp = function lerp(v0, v1, t) {
	return v0 * (1 - t) + v1 * t;
};
