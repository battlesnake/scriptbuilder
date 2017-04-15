const Try = (...cmds) => {
	const t = [];
	const c = [];
	const f = [];
	t.push(...cmds);
	const $render = () => {
		const out = [];
		out.push('function _try {');
		out.push(t.length ? t : [':']);
		out.push('}');
		if (c.length) {
			out.push('function _catch {');
			out.push(c);
			out.push(['exit 0']);
			out.push('}');
			out.push('trap _catch ERR');
		}
		if (f.length) {
			out.push('function _finally {');
			out.push(f);
			out.push('}');
			out.push('trap _finally EXIT');
		}
		out.push('_try');
		return [
			'(',
			out,
			')'
		];
	};
	return {
		Catch: (...cmds2) => {
			c.push(...cmds2);
			return {
				Finally: (...cmds3) => {
					f.push(...cmds3);
					return { $render };
				},
				$render
			};
		},
		Finally: (...cmds2) => {
			f.push(...cmds2);
			return { $render };
		}
	};
};

export default Try;
