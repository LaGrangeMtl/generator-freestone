/**
 * 2020-08-27 : Note
 * Function was copied from node_modules/debounceAnimationFrame because its Babel settings are not set properly, 
 * therefore causing it to not be transpiled correctly, inducing errors in IE11.
 * 
 * @param {Function} fn 
 */
export const debounceAnimationFrame = (fn) => {
	let timeout;
	const debouncedFn = (...args) => {
		cancelAnimationFrame(timeout);
		return new Promise(resolve => {
			timeout = requestAnimationFrame(() => {
				const result = fn(...args);
				resolve(result);
			});
		});
	};
	return debouncedFn;
};
