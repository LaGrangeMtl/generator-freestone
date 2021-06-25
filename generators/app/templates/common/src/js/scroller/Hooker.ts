export default class Hooker {
	hooks = {};

	register(hookName, fn, priority = 0) {
		if (!this.hooks[hookName]) this.hooks[hookName] = [];
		if (this.hooks[hookName].indexOf(fn) >= 0) return;
		this.hooks[hookName].push({ fn, priority });
	}

	unregister(hookName, fn) {
		if (!this.hooks[hookName]) return;

		if (!fn) delete this.hooks[hookName];
		this.hooks[hookName] = this.hooks[hookName].filter(x => x.fn !== fn);
	}

	do(hookName) {
		if (!this.hooks[hookName]) return;
		this.hooks[hookName].sort((a, b) => a.priority - b.priority).forEach(h => h.fn());
	}
}