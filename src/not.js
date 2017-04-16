import render from './render';
import Fragment from './fragment';

const $not = block => {
	const $render = () => `! ( ${render.verbatim(block)} )`;
	return new Fragment('command', { $render });
};

export default $not;
