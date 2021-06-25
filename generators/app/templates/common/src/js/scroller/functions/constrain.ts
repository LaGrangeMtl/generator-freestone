/**
 * Limits a number between a range of 2 numbers
 */
export const constrain = (num:(string|number), min:number, max:number) => {
	const n = typeof num === 'string' ? parseInt(num, 10) : num;
	return Math.min(Math.max(n, min), max);
};
