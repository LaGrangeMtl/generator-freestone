export default function getContextScrollPositions(context:HTMLElement):AnimatorScrollPositions {
	let ctx = context;
	if (context.tagName === 'HTML') ctx = (document.scrollingElement as HTMLElement) || context;

	return {
		st: ctx.scrollTop,
		sl: ctx.scrollLeft,
	};
}
