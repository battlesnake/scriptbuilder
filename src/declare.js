import $literal from './literal';

const $declare = name => {
	let value = null;
	let mutable = false;
	let integer = false;
	const $render = () => {
		let flags = '';
		if (!mutable) {
			flags += 'r';
		}
		if (integer) {
			flags += 'i';
		}
		return [
			'declare',
			...(flags.length ? [`-${flags}`] : []),
			name + (value === null ? '' : `=${value}`)
		].join(' ');
	};
	const $value = val => {
		value = $literal(val);
		return { $render };
	};
	const $expr = val => {
		value = val;
		return { $render };
	};
	const $eval = expr => {
		value = `"$(${expr})"`;
		return { $render };
	};
	const $integer = (expr = 0) => {
		integer = true;
		value = expr;
		return { $render, $value, $expr, $eval };
	};
	const $mutable = () => {
		mutable = true;
		return { $render, $integer, $value, $expr, $eval };
	};
	return { $render, $integer, $mutable, $value, $expr, $eval };
};

export default $declare;
