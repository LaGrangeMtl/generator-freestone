/**
 * Map a number between two ranges
 * 
 * @param {number} num 
 * @param {number} in_min 
 * @param {number} in_max 
 * @param {number} out_min 
 * @param {number} out_max 
 */
export const map = (num, in_min, in_max, out_min, out_max) => {
	if (in_max === in_min) return out_max;
	return (((num - in_min) * (out_max - out_min)) / (in_max - in_min)) + out_min;
};
