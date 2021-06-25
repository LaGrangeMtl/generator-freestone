import parseRelativeVal from './parseRelativeVal';

export default function parseVal(prop:string, value:string|number, elem:HTMLElement, parent:HTMLElement):number {
	if (typeof value === 'number') return value;
	if (value === '0') return parseFloat(value);

	const matches = value.match(/([-0-9.]+)(.+)/);
	const val = parseFloat(matches[1]);
	const unit = matches[2];

	switch (unit) {
		case 'vh': return (val / 100) * window.innerHeight;
		case 'vw': return (val / 100) * window.innerWidth;
		case 'px': return val;
		case '%p': return parseRelativeVal(prop, val, parent);
		case '%':
		default: return parseRelativeVal(prop, val, elem);
	}
}
