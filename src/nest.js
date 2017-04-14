import Literal from './literal';

const Nest = (...args) => Literal(args.map(x => x instanceof Array ? Nest(...x) : x).join(' '));

export default Nest;
