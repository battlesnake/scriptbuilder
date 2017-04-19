import render from './render';
import Fragment from './fragment';

const $eval = (...args) => {
	if (args.length === 0) {
		throw new Error('Subexpression expected');
	}
	const $render = () => args.map(x => `$(${render.block(x)})`);
	return new Fragment('verbatim', { $render });
};

export default $eval;
