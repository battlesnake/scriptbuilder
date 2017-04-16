import $or from './or';
import $not from './not';

const $nor = (...blocks) => $not($or(...blocks));

export default $nor;
