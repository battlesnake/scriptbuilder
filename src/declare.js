import Fragment from './fragment';
import $literal from './literal';

const s_local = Symbol('local');

const $declare = (name, ...args) => {
	let local = false;
	if (name === s_local) {
		name = args[0];
		args.shift();
		local = true;
	}
	let value = null;
	let mutable = false;
	let integer = false;
	let export_ = false;
	const $render = () => {
		let flags = '';
		if (!mutable) {
			flags += 'r';
		}
		if (integer) {
			flags += 'i';
		}
		if (export_) {
			flags += 'x';
		}
		return [
			local ? 'local' : 'declare',
			...(flags.length ? [`-${flags}`] : []),
			name + (value === null ? '' : `=${value}`)
		].join(' ');
	};
	const $export = () => {
		export_ = true;
		return new Fragment('command', { $render });
	};
	const $value = val => {
		value = $literal(val);
		return new Fragment('command', { $render, $export });
	};
	const $expr = val => {
		value = val;
		return new Fragment('command', { $render, $export });
	};
	const $eval = expr => {
		value = `"$(${expr})"`;
		return new Fragment('command', { $render, $export });
	};
	const $integer = (expr = 0) => {
		integer = true;
		value = expr;
		return new Fragment('command', { $render, $value, $expr, $eval });
	};
	const $mutable = () => {
		mutable = true;
		return new Fragment('command', { $render, $integer, $value, $expr, $eval });
	};
	return new Fragment('command', { $render, $integer, $mutable, $value, $expr, $eval });
};

$declare.s_local = s_local;

export default $declare;
