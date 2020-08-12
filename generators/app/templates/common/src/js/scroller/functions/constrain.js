/**
 * Limits a number between a range of 2 numbers
 * @param {(string|number)} num 
 * @param {number} min 
 * @param {number} max 
 */
export const constrain = (num, min, max) => {
	const n = typeof num === 'string' ? parseInt(num, 10) : num;
	return Math.min(Math.max(n, min), max);
};
