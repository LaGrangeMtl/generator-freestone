import { NativeScroller } from "./NativeScroller";
import Scroller from "./Scroller";
import { SmoothScroller } from "./SmoothScroller";

export const SCROLL_PRIMARY = 'primary';

enum MODE {
	DESKTOP,
	MOBILE
}

const isMobile = (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const main = document.querySelector('[data-main]') as HTMLElement;

let mode:MODE = null;

let scroller:Scroller = null;

export function updateScroller() {
	const nextMode = isMobile ? MODE.MOBILE : MODE.DESKTOP;

	if (nextMode !== mode) {
		mode = nextMode;
		if (scroller) {
			scroller.dispose();
		}
		Scroller.list = [];

		if (mode === MODE.DESKTOP) {
			scroller = new SmoothScroller(main, SCROLL_PRIMARY);
		} else {
			scroller = new NativeScroller(main, SCROLL_PRIMARY);
		}

		document.documentElement.scrollTop = 0;
		document.documentElement.scrollLeft = 0;
	}

	return scroller;
}

window.addEventListener('resize', updateScroller);

export function getScroller() {
	return scroller;
}