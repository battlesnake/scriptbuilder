const If = (...cmds) => {
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
	return {
		Then: (...cmds2) => {
			t.push(...cmds2);
			return {
				Else: (...cmds3) => {
					e.push(...cmds3);
					return { $render };
				},
				$render
			};
		},
		Else: (...cmds2) => {
			e.push(...cmds2);
			return { $render };
		}
	};
};

export default If;
