'format es6';
'use strict';

/**
 * @function isEdge
 * 
 * @param {Number[]} versions Array of version numbers 
 * 
 * @return {Boolean}
 */
export function isEdge(versions) {
	return versions.reduce((c, version) => {
		return c + (~window.navigator.userAgent.indexOf(`Edge/${version}`) ? 1 : 0);
	}, 0) !== 0;
}