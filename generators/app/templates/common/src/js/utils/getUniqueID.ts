/**
 *  Get a unique ID, prefixed with "uid"
 * 
 * @return {String}
 */
export const getUniqueID = (() => {
	let id = 0;
	return () => `uid${id++}`;
})();
