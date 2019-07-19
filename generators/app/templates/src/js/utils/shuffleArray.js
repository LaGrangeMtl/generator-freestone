/**
 * Takes an array as a param, shuffles it and returns it. Does not
 * create a new array.
 *
 * @param {Array} array
 * @return {Array} array
 */
export const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
};
