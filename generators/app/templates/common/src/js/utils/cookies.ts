

export function getCookie(name:string):string|null {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();

	return null;
}

/*
 * If value is null, deletes the cookie
 */
export function setCookie(name:string, value:any, domain:string = null, expiration:Date = null) {
	// delete cookie
	if (value === null) {
		document.cookie = `${name}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
		return;
	}

	let cookieString = '';
	cookieString += `${name}=${value}; path=/;`;

	if (domain) {
		cookieString += ` domain=${domain};`;
	}

	if (expiration) {
		cookieString += ` expires=${(new Date(expiration)).toISOString()}`;
	}

	document.cookie = cookieString;
}