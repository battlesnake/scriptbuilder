import $literal from './literal';

const $nest = (...args) => $literal(args.map(x => x instanceof Array ? $nest(...x) : x).join(' '));

export default $nest;
