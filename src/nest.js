import $literal from './literal';
import render from './render';

const $nest = (...args) => $literal(render.command(args));

export default $nest;
