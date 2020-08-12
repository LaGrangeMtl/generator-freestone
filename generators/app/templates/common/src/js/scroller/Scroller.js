export const SMOOTH_SCROLLER = 'smooth';
export const NATIVE_SCROLLER = 'native';

export default class Scroller {
	static list = [];

	/**
	 * @param {String} id 
	 * @returns {Scroller}
	 */
	static getById = (id) => {
		return Scroller.list.find(x => x.id === id);
	}

	scrollTop = 0;

	/**
	 * @param {String} type 
	 */
	constructor(type = SMOOTH_SCROLLER) {
		this.type = type;
	}

	/**
	 * @param {Number} value
	 */
	scrollTo = (elem) => {}

	/**
	 * 
	 */
	update = () => {}

	/**
	 * @param {HTMLElement} elem
	 */
	scrollToElem = (elem) => {}

	refreshElements = (ctx = null) => {}

	updateScrollHeight = () => {}

	setupEvents = () => {}

	update = (time = 0, force = false) => {}

	static updateAll = () => {
		Scroller.list.forEach(x => x.updateScrollHeight());
	}

	static addToList(instance) {
		Scroller.list.push(instance);
	}
}

window.__scroller = Scroller;
