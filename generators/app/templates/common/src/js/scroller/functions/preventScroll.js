const preventDefault = (e) => e.preventDefault();

export function preventScroll() {
	document.addEventListener('touchmove', preventDefault);
}

export function restoreScroll() {
	document.removeEventListener('touchmove', preventDefault);
}
