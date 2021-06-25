export const constrain = (num:(string|number), min:number, max:number):number => {
	const n = typeof num === 'string' ? parseInt(num, 10) : num;
	return Math.min(Math.max(n, min), max);
};
