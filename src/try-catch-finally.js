import Fragment from './fragment';

const $try = (...cmds) => {
	const t = [];
	const c = [];
	const f = [];
	let has_c = false;
	let has_f = false;
	let rethrow = 0;
	t.push(...cmds);
	const $render = () => {
		const out = [];
		out.push('function _try {');
		out.push(t.length ? t : [':']);
		out.push('}');
		if (has_c) {
			out.push('function _catch {');
			out.push(c);
			out.push([`exit ${rethrow}`]);
			out.push('}');
			out.push('trap _catch ERR');
		}
		if (has_f) {
			out.push('function _finally {');
			out.push(f.length ? f : [':']);
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
		has_f = true;
		return new Fragment('block', { $render });
	};
	const $rethrow = (code = 1) => {
		rethrow = code;
		return new Fragment('block', { $render, $finally });
	};
	const $catch = (...cmds2) => {
		c.push(...cmds2);
		has_c = true;
		return new Fragment('block', { $render, $rethrow, $finally });
	};
	return new Fragment('block', { $render, $catch, $finally });
};

export default $try;
