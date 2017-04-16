import $and from './and';
import $not from './not';

const $nand = (...blocks) => $not($and(...blocks));

export default $nand;
