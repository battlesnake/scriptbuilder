import Fragment from './fragment';

const $literal = (...args) => {
	if (args.length !== 1) {
		console.dir(args);
		throw new Error(`Exactly one argument expected for $literal, but ${args} received (did you mean $nest?)`);
	}
	if (typeof args[0] !== 'string') {
		console.dir(args);
		throw new Error(`Exactly one string argument expected for $literal but argument of type ${typeof args[0]} received (did you mean $nest?)`);
	}
	const s = args[0];
	const no_quote = /^[A-Za-z0-9-+%._=/]+$/.test(s);
	const $render = () => no_quote ? s : `'${s.replace(/'/g, '\'\\\'\'')}'`;
	return new Fragment('verbatim', { $render });
};

$literal.$list = (...args) => args.map(s => $literal(s));

export default $literal;
