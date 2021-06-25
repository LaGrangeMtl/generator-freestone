import { SCROLL_PRIMARY } from "../Constants";
import Scroller from "../scroller/Scroller";

function init(ctx:HTMLElement) {
	const anchors = Array.from(ctx.querySelectorAll('a[href^="#"]')) as HTMLAnchorElement[];

	anchors.forEach(anchor => {

		const anchorVal = anchor.getAttribute('href');
		if (anchorVal === '#') return false;
		
		anchor.addEventListener('click', (e) => {
			e.preventDefault();
			const target = ctx.querySelector(anchorVal) as HTMLElement;
			if (target) Scroller.getById(SCROLL_PRIMARY).scrollToElem(target);

			return false;
		});
	});
}

export default {
	init,
}