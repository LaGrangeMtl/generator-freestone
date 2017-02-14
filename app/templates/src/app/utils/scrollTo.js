import gsap, { TweenMax } from 'gsap';
import $ from 'jquery';

/**
 * Scrolls to position using TweenMax. If an offset is 
 * defined, scrolls that amount higher than the target element.
 *
 * @param {Number} pos
 * @param {Number} offset
 */
export const scrollTo = (pos, offset = 0, time = 1.2) => {
    const scroll = {
        y: $window.scrollTop(),
    };

    TweenMax.to(scroll, time, {
        y: pos + offset,
        ease: Cubic.easeInOut,
        onUpdate: () => {
            $window.scrollTop(scroll.y);
        },
    });
};

/**
 * Scrolls to an element.
 *
 * @param {jQuery Object | DOM Node} el
 * @param {Number} offset
 */
export const scrollToElem = (el, offset = 0) => {
    const $el = $(el);
    scrollTo($el.offset().top, offset);
};