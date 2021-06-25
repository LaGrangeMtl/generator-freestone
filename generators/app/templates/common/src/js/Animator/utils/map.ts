/**
 * Map a number between two ranges
 */
export const map = (num:number, in_min:number, in_max:number, out_min:number, out_max:number):number => {
	if (in_max === in_min) return out_max;
	return (((num - in_min) * (out_max - out_min)) / (in_max - in_min)) + out_min;
};
