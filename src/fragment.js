import _ from 'lodash';
import render from './render';

export default class Fragment {
	constructor(format, extend) {
		/* istanbul ignore if */
		if (typeof extend.$render !== 'function') {
			throw new Error('$render method required for fragment');
		}
		_.assign(this, extend);
		this.format = format;
		this.toString = () => render[format](this);
	}
}
