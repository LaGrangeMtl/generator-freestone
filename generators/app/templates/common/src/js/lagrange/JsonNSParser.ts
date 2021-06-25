import ns from '../NameSpace';

function fetchAndParse(ctx) {
	Array.from(ctx.querySelectorAll('[data-ns-key]')).forEach((scriptTag:HTMLScriptElement) => {
		try {
			const key = scriptTag.getAttribute('data-ns-key');
			const json = JSON.parse(scriptTag.innerText);

			if (ns[key]) {
				if (Array.isArray(ns[key])) {
					ns[key] = [
						...ns[key],
						...json,
					];
				} else {
					ns[key] = {
						...ns[key],
						...json,
					};
				}
			} else {
				ns[key] = json;
			}
		} catch (e) {
			console.error(e);
		}
	});
}

export default {
	fetchAndParse,
};
