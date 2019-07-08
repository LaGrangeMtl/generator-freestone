import $ from 'jquery';

/**
 * Takes a list of jQuery elements and returns the highest heigh of all.
 * 
 * @param {jQuery} elems List of jQuery object
 * 
 * @return {Number}
 */
export const getHighestHeight = (elems) => {
    if (elems.length === 0) return 0;
    return elems.toArray().reduce((maxh, el) => {
        el = $(el);
        return (el.height() > maxh) ? el.height() : maxh;
    }, $(elems[0]).height());
};