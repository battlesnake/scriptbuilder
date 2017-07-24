import Fragment from './fragment';

const $var = (...args) => {
	/* istanbul ignore next */
	if (args.length !== 1 || typeof args[0] !== 'string') {
		throw new Error('One string argument expected');
	}
	let quote = true;
	let index = null;
	let def = null;
	const $render = () => {
		let str = args[0];
		if (index) {
			str += `[${index}]`;
		}
		if (def) {
			str += `:-${def}`;
		}
		return quote ? `"\${${str}}"` : `\${${str}}`;
	};
	const $default = val => {
		def = val;
		return new Fragment('verbatim', { $render });
	};
	const $index = idx => {
		index = idx;
		return new Fragment('verbatim', { $render, $default });
	};
	const $all = () => $index('@');
	const $noquote = () => {
		quote = false;
		return new Fragment('verbatim', { $render, $index, $all });
	};
	return new Fragment('verbatim', { $render, $noquote, $index, $all, $default });
};

$var.$list = (...args) => args.map(s => $var(s));

export default $var;
