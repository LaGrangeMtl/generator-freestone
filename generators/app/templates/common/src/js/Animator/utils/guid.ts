//@ts-check

export function guid():string {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function elemGuid(element:HTMLElement):string {
	let id = element.getAttribute('data-guid');
	if (!id) {
		id = guid();
		element.setAttribute('data-guid', id);
	}
	return id;
}
