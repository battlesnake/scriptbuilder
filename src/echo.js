import $line from './line';
import $literal from './literal';

const $echo = text => $line('echo', $literal(text));

export default $echo;
