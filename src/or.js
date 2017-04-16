import render from './render';
import Fragment from './fragment';

const $or = (...blocks) => {
	const $render = () => blocks.length ?
		blocks.map(render.verbatim).map(s => `( ${s} )`).join(' || ') :
		'false';
	return new Fragment('command', { $render });
};

export default $or;
