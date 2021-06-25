export default function precision(value:number, smallest = 0.00001):number {
	if (!value || (value < smallest && value > -smallest)) return 0;
	return value;
}
