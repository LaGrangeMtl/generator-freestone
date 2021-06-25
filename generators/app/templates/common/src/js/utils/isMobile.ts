/**
 * Check if the viewport width is smaller or equal to a treshold
 *
 * @param {Number} treshold
 * 
 * @return {Boolean}
 */
export const isMobile = (treshold = 1279) => window.matchMedia(`(max-width: ${treshold}px)`).matches;