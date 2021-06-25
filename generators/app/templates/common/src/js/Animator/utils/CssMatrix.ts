export const i2d = [
	1, 0, 0, 1, 0, 0,
];

export const i3d = [
	1, 0, 0, 0,
	0, 1, 0, 0,
	0, 0, 1, 0,
	0, 0, 0, 1,
];

export function identity() {
	return [...i3d];
}

export function identity2d() {
	return [...i2d];
}

export function translate(x:number, y:number, z:number) {
	return [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		x, y, z, 1,
	];
}

export function scale(w:number, h:number, d:number) {
	return [
		w, 0, 0, 0,
		0, h, 0, 0,
		0, 0, d, 0,
		0, 0, 0, 1,
	];
}

export function rotate(a:number) {

	return [
		Math.cos(a), -Math.sin(a), 0, 0,
		Math.sin(a), Math.cos(a), 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	];
}

export function toCSS(array:number[]):string {
	return 'matrix3d(' + array.join(',') + ')';
}

export function fromString(string:string):number[] {
	return string.replace(/matrix(?:3d)?\(/i, '').replace(')', '').split(',').map(x => parseFloat(x.trim()));
}

export function isIdentity2d(matrix:number[]) {
	return matrix.every((x, i) => x === i2d[i]);
}

export function matrix2dto3d(m:number[]) {
	if (m.length === 16) return m;
	const n = composeMultiple([
		identity(),
		translate(m[4], m[5], 0),
		rotate(0),
		scale(m[0], m[3], 1),
	]);
	return n;
}

export function compose(a:number[], b:number[]):number[] {
	const result = [];

	const a00 = a[0];
	const a01 = a[1];
	const a02 = a[2];
	const a03 = a[3];
	const a10 = a[4];
	const a11 = a[5];
	const a12 = a[6];
	const a13 = a[7];
	const a20 = a[8];
	const a21 = a[9];
	const a22 = a[10];
	const a23 = a[11];
	const a30 = a[12];
	const a31 = a[13];
	const a32 = a[14];
	const a33 = a[15];

	// Cache only the current line of the second matrix
	let b0 = b[0];
	let b1 = b[1];
	let b2 = b[2];
	let b3 = b[3];
	result[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	result[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	result[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	result[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

	b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7]; //eslint-disable-line
	result[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	result[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	result[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	result[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

	b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11]; //eslint-disable-line
	result[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	result[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	result[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	result[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

	b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15]; //eslint-disable-line
	result[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	result[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	result[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	result[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

	return result;
}

export function composeMultiple(matrices:number[][]) {
	let inputMatrix = matrices[0];

	for (let i = 1; i < matrices.length; i += 1) {
		inputMatrix = compose(inputMatrix, matrices[i]);
	}

	return inputMatrix;
}
