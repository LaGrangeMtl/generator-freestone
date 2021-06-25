const videoObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		const target = entry.target as HTMLVideoElement;
		if (!entry.isIntersecting && !target.paused) {
			target.pause();
		} else if (entry.isIntersecting && target.paused) {
			target.play();
		}
	});
});

function onUpdate(vid) {
	if (vid.autoplay) {
		videoObserver.observe(vid);
	}
}

export default {
	videoObserver,
	onUpdate
}