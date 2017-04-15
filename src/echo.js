import Literal from './literal';

const Echo = text => `echo ${Literal(text)}`;

export default Echo;
