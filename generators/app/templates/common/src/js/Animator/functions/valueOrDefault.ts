import precision from './precision';

export default function valueOrDefault(value:number, defaultValue:number = 0):number {
	return value !== undefined ? precision(value) : defaultValue;
}
