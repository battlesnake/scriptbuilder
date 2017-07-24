import Fragment from './fragment';

const $var = (...args) => {
	if (args.length !== 1) {
		console.dir(args);
		throw new Error(`Exactly one argument expected for $var, but ${args} received`);
	}
	if (typeof args[0] !== 'string') {
		console.dir(args);
		throw new Error(`Exactly one string argument expected for $var but argument of type ${typeof args[0]} received`);
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
