const Literal = (...args) => {
	if (args.length !== 1 || typeof args[0] !== 'string') {
		throw new Error('One string argument expected');
	}
	const s = args[0];
	const no_quote = /^[A-Za-z0-9-+%._=/]+$/.test(s);
	return no_quote ? s : `'${s.replace(/'/g, '\'\\\'\'')}'`;
};

Literal.list = (...args) => args.map(s => Literal(s));

export default Literal;
