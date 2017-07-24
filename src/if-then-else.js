import Fragment from './fragment';

const s_not = Symbol('!');

const $if = (...cmds) => {
	const not = cmds[0] === s_not;
	if (not) {
		cmds.shift();
	}
	const i = [];
	const t = [];
	const e = [];
	i.push(...cmds);
	const $render = () => {
		const out = [];
		if (not) {
			out.push('if ! (');
		} else {
			out.push('if');
		}
		out.push(i);
		if (not) {
			out.push(')');
		}
		out.push('then');
		out.push(t.length ? t : [':']);
		if (e.length) {
			out.push('else');
			out.push(e);
		}
		out.push('fi');
		return out;
	};
	const $else = (...cmds2) => {
		e.push(...cmds2);
		return new Fragment('block', { $render });
	};
	const $then = (...cmds2) => {
		t.push(...cmds2);
		return new Fragment('block', { $render, $else });
	};
	return new Fragment('block', { $render, $then, $else });
};

$if.$not = (...cmds) => $if(s_not, ...cmds);

export default $if;
