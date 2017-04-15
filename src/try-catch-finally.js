import Fragment from './fragment';

const $try = (...cmds) => {
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
	const $finally = (...cmds2) => {
		f.push(...cmds2);
		return new Fragment('block', { $render });
	};
	const $catch = (...cmds2) => {
		c.push(...cmds2);
		return new Fragment('block', { $render, $finally });
	};
	return new Fragment('block', { $render, $catch, $finally });
};

export default $try;
