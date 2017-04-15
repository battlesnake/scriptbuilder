import $literal from './literal';

const $echo = text => `echo ${$literal(text)}`;

export default $echo;
