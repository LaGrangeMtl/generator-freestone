const tolerance = 0.05;

class SyncedUpdate {
	constructor(targetFps, callback) {
		this.loop = null;
		this.previousDelta = 0;
		this.fps = targetFps;
		this.callback = callback;
		
		if (!this.callback) {
			console.error('No callback set for SyncedUpdate');
		}
	}

	start = () => {
		if (!this.loop) {
			this.loop = requestAnimationFrame(this.update);
		}
	}

	update = (currentDelta) => {
		this.loop = requestAnimationFrame(this.update);

		const delta = currentDelta - this.previousDelta;

		if (this.fps && delta < 1000 / this.fps) {
			return;
		}

		if (this.callback) {
			this.callback();
		}

		this.previousDelta = currentDelta;
	}

	stop = () => {
		cancelAnimationFrame(this.loop);
		this.loop = null;
	}
}

export default SyncedUpdate;
