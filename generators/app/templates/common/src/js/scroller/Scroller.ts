import Hooker from "./Hooker";

export const SMOOTH_SCROLLER = 'smooth';
export const NATIVE_SCROLLER = 'native';

type ScrollerType = (typeof SMOOTH_SCROLLER | typeof NATIVE_SCROLLER);

export default class Scroller {
	id:string;
	type:ScrollerType;
	el:HTMLElement = null;
	loop:number = null;
	hooks:Hooker;

	static list = [];

	callbacks = [];

	static getById = (id:string):Scroller => {
		return Scroller.list.find(x => x.id === id) || null;
	}

	scrollTop = 0;
	scrollLeft = 0;

	constructor(type:ScrollerType = SMOOTH_SCROLLER) {
		this.type = type;
		this.hooks = new Hooker();
	}

	setScroll = (x:number, y:number) => {
		this.scrollTo(x);
	}

	scrollTo = (value:number) => {}

	scrollToElem = (elem:HTMLElement) => {}

	refreshElements = (ctx:HTMLElement = null) => {}

	updateScrollDimension = () => {}

	setupEvents = () => {}

	update = (time = 0, force = false) => {}

	onResize = () => {}

	on = (callback:Function) => {
		if (this.callbacks.indexOf(callback) === -1) {
			this.callbacks.push(callback);
		}
	}

	dispose = () => {}

	off = (callback = null) => {
		if (!callback) {
			this.callbacks = [];
		} else {
			const index = this.callbacks.indexOf(callback);
			if (index >= 0) {
				this.callbacks.splice(index, 1);
			}
		}
	}

	runCallbacks = () => {
		const st = Math.abs(this.scrollTop);
		this.callbacks.forEach(callback => {
			if (callback) {
				callback(st);
			}
		});
	}

	static updateAll = () => {
		Scroller.list.forEach(x => x.updateScrollHeight());
	}

	static addToList(instance:Scroller) {
		Scroller.list.push(instance);
	}
}

//@ts-ignore
window.__scroller = Scroller;
