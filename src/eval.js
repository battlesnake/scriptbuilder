import render from './render';
import Fragment from './fragment';

const s_noquote = Symbol();

const $eval = (...args) => {
	let quote = args[0] !== s_noquote;
	if (!quote) {
		args.shift();
	}
	/* istanbul ignore if */
	if (args.length === 0) {
		throw new Error('Subexpression expected');
	}
	const $render = () => {
		const res = args.map(x => `$(${render.block(x)})`);
		return quote ? `"${res}"` : res;
	};
	const $noquote = () => {
		quote = false;
		return new Fragment('verbatim', { $render });
	};
	return new Fragment('verbatim', { $render, $noquote });
};

$eval.$noquote = (...args) => $eval(s_noquote, ...args);

export default $eval;
