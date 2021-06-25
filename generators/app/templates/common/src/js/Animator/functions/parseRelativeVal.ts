export default function parseRelativeVal(prop:string, value:number, elem:HTMLElement):number {
	const rect = elem.getBoundingClientRect();

	switch (prop) {
		case 'y': return (value / 100) * rect.height;
		case 'x':
		default: return (value / 100) * rect.width;
	}
}
