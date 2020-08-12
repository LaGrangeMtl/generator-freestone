export default function precision(value, smallest = 0.00001) {
	if (!value || (value < smallest && value > -smallest)) return 0;
	return value;
}
