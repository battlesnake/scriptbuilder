import _ from 'lodash';
import Fragment from './fragment';
import $literal from './literal';

const indent = s => `\t${s}`;

const is_block = cmd => cmd instanceof Fragment;

const stringable = x => _.includes(['string', 'number', 'boolean'], typeof x);

function render_one(cmd) {
	if (stringable(cmd)) {
		return [String(cmd)];
	} else if (cmd instanceof Array) {
		return render_block(cmd).map(indent);
	} else if (cmd === null) {
		return [];
	} else {
		return render_block(cmd);
	}
}

function render_block(cmds) {
	if (stringable(cmds)) {
		return [String(cmds)];
	} else if (is_block(cmds)) {
		return render_block(cmds.$render());
	} else if (cmds instanceof Array) {
		return _.flatMap(cmds, render_one);
	} else if (cmds === null) {
		return [];
	} else {
		console.dir(cmds);
		throw new Error('Failed to render command block');
	}
}

function render_string(cmds) {
	return render_block(cmds).join('\n');
}

function render_verbatim(frag) {
	if (typeof frag === 'string') {
		return frag;
	} else if (frag instanceof Fragment) {
		return frag.$render();
	} else {
		throw new Error('Not a fragment');
	}
}

function render_literal(cmds) {
	return render_verbatim($literal(render_string(cmds)));
}

function render_word(word) {
	if (stringable(word)) {
		return String(word);
	} else if (word instanceof Fragment) {
		return render_command(word.$render());
	} else {
		throw new Error(`Invalid word type: ${typeof word}`);
	}
}

function render_command(...words) {
	if (words.length === 0) {
		throw new Error('No command specified');
	} else if (words.length > 1) {
		return render_command(words);
	} else {
		const cmd = words[0];
		if (typeof cmd === 'string') {
			return cmd;
		} else if (cmd instanceof Array) {
			return cmd.filter(x => x !== null).map(render_word).join(' ');
		} else if (cmd instanceof Fragment) {
			return render_verbatim(cmd);
		} else {
			throw new Error(`Invalid type: ${typeof cmd}`);
		}
	}
}

export default {
	block: render_string,
	verbatim: render_verbatim,
	literal: render_literal,
	command: render_command
};
