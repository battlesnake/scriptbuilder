import Fragment from './fragment';

const $literal = (...args) => {
	/* istanbul ignore if */
	if (args.length !== 1 || typeof args[0] !== 'string') {
		throw new Error('One string argument expected (did you mean $nest?)');
	}
	const s = args[0];
	const no_quote = /^[A-Za-z0-9-+%._=/]+$/.test(s);
	const $render = () => no_quote ? s : `'${s.replace(/'/g, '\'\\\'\'')}'`;
	return new Fragment('verbatim', { $render });
};

$literal.$list = (...args) => args.map(s => $literal(s));

export default $literal;
