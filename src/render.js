import _ from 'lodash';
import $literal from './literal';

const indent = s => `\t${s}`;

const is_block = cmd => cmd && typeof cmd.$render === 'function';

function render_one(cmd) {
	if (typeof cmd === 'string') {
		return [cmd];
	} else if (cmd instanceof Array) {
		return render_all(cmd).map(indent);
	} else {
		return render_all(cmd);
	}
}

function render_all(cmds) {
	if (typeof cmds === 'string') {
		return [cmds];
	} else if (is_block(cmds)) {
		return render_all(cmds.$render());
	} else if (cmds instanceof Array) {
		return _.flatMap(cmds, render_one);
	} else {
		if (process.env.DEBUG) {
			console.error('Error term:', cmds);
		}
		throw new Error('Failed to render command block');
	}
}

const render_string = cmds => render_all(cmds).join('\n');

const render_literal = cmds => $literal(render_string(cmds));

export default {
	all: render_all,
	one: render_one,
	string: render_string,
	literal: render_literal
};
