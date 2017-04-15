import Fragment from './fragment';
import $literal from './literal';

const $echo = text => new Fragment('command', { $render: () => `echo ${$literal(text)}` });

export default $echo;
