const $if = (...cmds) => {
	const i = [];
	const t = [];
	const e = [];
	i.push(...cmds);
	const $render = () => {
		const out = [];
		out.push('if');
		out.push(i);
		out.push('then');
		out.push(t.length ? t : [':']);
		if (e.length) {
			out.push('else');
			out.push(e.length ? e : [':']);
		}
		out.push('fi');
		return out;
	};
	const $else = (...cmds2) => {
		e.push(...cmds2);
		return { $render };
	};
	const $then = (...cmds2) => {
		t.push(...cmds2);
		return { $render, $else };
	};
	return { $render, $then, $else };
};

export default $if;
