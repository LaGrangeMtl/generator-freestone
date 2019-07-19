/**
 * Returns the value of an URL param by name.
 * 
 * @param {String} name The name of the parameter
 * @param {String} url The url in which it will look for. If ommited, will be the current location
 * 
 * @return {any} result Can return multiple values (null, '' or the value of the parameter)
 */
export const getParameterByName = (name, url = window.location.href) => {
	const n = name.replace(/[\[\]]/g, '\\$&'); //eslint-disable-line
	const regex = new RegExp(`[?&]${n}(=([^&#]*)|&|#|$)`);
	const results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
