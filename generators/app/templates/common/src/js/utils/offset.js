/**
 * Returns the offset position of an element (relative to the top of the document)
 * @param {HTMLElement} elem 
 */
export default function offset(elem) {
	const rect = elem.getBoundingClientRect();
	const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}
