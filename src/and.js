import render from './render';
import Fragment from './fragment';

const $and = (...blocks) => {
	const $render = () => blocks.length ?
		blocks.map(render.verbatim).map(s => `( ${s} )`).join(' && ') :
		'true';
	return new Fragment('command', { $render });
};

export default $and;
