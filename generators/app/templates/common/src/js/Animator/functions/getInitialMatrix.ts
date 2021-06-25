import { fromString, matrix2dto3d } from '../utils/CssMatrix';

export function getInitialMatrix(elem:HTMLElement, is3D:boolean = false):number[] {
	const prev = elem.style.transform;
	elem.style.transform = '';
	const transform = window.getComputedStyle(elem).getPropertyValue('transform');
	elem.style.transform = prev;
	
	if (transform === 'none') return null;

	let m = fromString(transform);
	m = (m.length < 16 && is3D) ? matrix2dto3d(m) : m;
	
	return m;
}
