import render from './render';
import Fragment from './fragment';

const $pipe = (...blocks) => {
	const $render = () => blocks.length ?
		blocks.map(render.verbatim).map(s => `( ${s} )`).join(' | ') :
		':';
	return new Fragment('command', { $render });
};

export default $pipe;
