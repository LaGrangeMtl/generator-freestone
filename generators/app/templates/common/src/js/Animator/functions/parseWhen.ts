import {
	ELEM_TOP, ELEM_CENTER, ELEM_BOTTOM, ELEM_LEFT, ELEM_RIGHT, ELEM_H_CENTER, HORIZONTAL, VERTICAL, 
} from '../Constants';
import { screen as dims } from '../utils/screen';

export default function parseWhen(rect:AnimatorRect, when:AnimatorWhen) {
	const [ elem, screen ] = when;
	if (when.length !== 2) throw new Error('Missing parameters in animation "when" (expects: ELEM_* | SCREEN_*)');

	let obj;
	switch (elem) {
		default:
		case ELEM_TOP: obj = rect.top; break;
		case ELEM_CENTER: obj = rect.top + (rect.height / 2); break;
		case ELEM_BOTTOM: obj = rect.top + rect.height; break;
		
		case ELEM_LEFT: obj = rect.left; break;
		case ELEM_H_CENTER: obj = rect.left + (rect.width / 2); break;
		case ELEM_RIGHT: obj = rect.left + rect.width; break;
	}

	let dir;
	switch (elem) {
		default:
		case ELEM_TOP:
		case ELEM_CENTER:
		case ELEM_BOTTOM: dir = VERTICAL; break;
		
		case ELEM_LEFT:
		case ELEM_H_CENTER:
		case ELEM_RIGHT: dir = HORIZONTAL; break;
	}
	
	return { dir, when: obj - dims[screen] };
}
