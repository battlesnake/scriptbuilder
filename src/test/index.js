require('source-map-support').install();

import 'mocha';
import chai from 'chai';

const { describe, it } = global;
const { expect } = chai;

import { spawnSync } from 'child_process';

import {
	$if,
	$try,
	$echo,
	$declare,
	$local,
	$literal,
	$nest,
	$not,
	$or,
	$and,
	$nor,
	$nand,
	$eval,
	$var,
	$line,
	render
} from '../';

const assert = (status, output, description, script) => {
	const run = () => {
		const embedded = render.block(script);
		if (process.env.dump) {
			console.info(embedded);
		}
		const cp = spawnSync('bash', ['-Eeuo', 'pipefail', '-c', embedded], { stdio: ['ignore', 'pipe', 'ignore'] });
		expect(cp.error).to.equal(void 0);
		expect(cp.signal).to.equal(null);
		expect(cp.status).to.equal(status);
		expect(cp.stdout.toString('utf8')).to.equal(output);
	};
	if (description === null) {
		run();
	} else {
		it(description, run);
	}
};

describe('Render', () => {
	it('block', () => {
		expect(String(render.block(null))).to.equal('');
		expect(String(render.block([null]))).to.equal('');
		expect(render.block(['true', 'false'])).to.equal('true\nfalse');
		expect(() => render.block(void 0)).to.throw();
	});
	it('literal', () => {
		expect(render.literal(['true', 'false'])).to.equal('\'true\nfalse\'');
	});
	it('verbatim', () => {
		expect(render.verbatim('some example text')).to.equal('some example text');
		expect(() => render.verbatim(null)).to.throw();
	});
	it('command', () => {
		expect(render.command('tar', 'czf', 'potato.tar.gz', $literal('eesti stuff'))).to.equal('tar czf potato.tar.gz \'eesti stuff\'');
		expect(render.command(['tar', 'czf', 'potato.tar.gz', $literal('eesti stuff')])).to.equal('tar czf potato.tar.gz \'eesti stuff\'');
		expect(render.command($echo('hello world'))).to.equal('echo \'hello world\'');
		expect(() => render.command()).to.throw();
		expect(() => render.command(null)).to.throw();
		expect(() => render.command([void 0])).to.throw();
	});
	it('nesting', () => {
		assert(0, 'hello\n', null,
			$line('sh', '-c', $nest($echo('hello'))));
		assert(0, 'tere tulemast\n', null,
			$line('sh', '-c', $nest($echo('tere tulemast'))));
		assert(0, 'tere, $USER\n', null,
			$line('sh', '-c', $nest($echo('tere, $USER'))));
		assert(0, 'head isu, $USER\'s pig\n', null,
			$line('sh', '-c', $nest($echo('head isu, $USER\'s pig'))));
	});
});

describe('$line', () => {
	it('Invalid input', () => {
		expect(() => $line(null).$render()).to.throw();
		expect(() => $line('first-is-valid', null).$render()).to.throw();
	});
});

describe('$literal', () => {
	it('Invalid input', () => {
		expect(() => $literal(null).$render()).to.throw();
		expect(() => $literal('a', 'b').$render()).to.throw();
	});
});

describe('$try...catch...finally (empty blocks)', () => {
	assert(0, 'finally\n',
		'Empty try',
		$try().$catch($echo('catch')).$finally($echo('finally')));
	assert(0, 'try\n',
		'Empty finally',
		$try($echo('try')).$catch($echo('catch')).$finally());
	assert(0, 'try\n',
		'Empty catch + no finally',
		$try($echo('try'), 'false').$catch());
	assert(0, 'try\nfinally\n',
		'Empty catch',
		$try($echo('try'), 'false').$catch().$finally($echo('finally')));
});

describe('$try...catch...finally (no error)', () => {
	assert(0, 'try\nfinally\n',
		'try/catch/finally',
		$try($echo('try')).$catch($echo('catch')).$finally($echo('finally')));
	assert(0, 'try\n',
		'try/catch',
		$try($echo('try')).$catch($echo('catch')));
	assert(0, 'try\nfinally\n',
		'try/finally',
		$try($echo('try')).$finally($echo('finally')));
});

describe('$try...catch...finally (caught error)', () => {
	assert(0, 'try\ncatch\nfinally\n',
		'try/catch/finally',
		$try($echo('try'), 'false').$catch($echo('catch')).$finally($echo('finally')));
	assert(0, 'try\ncatch\n',
		'try/catch',
		$try($echo('try'), 'false').$catch($echo('catch')));
	assert(1, 'try\nfinally\n',
		'try/finally',
		$try($echo('try'), 'false').$finally($echo('finally')));
});

describe('$try...catch...finally (rethrow default error)', () => {
	assert(1, 'try\ncatch\nfinally\n',
		'try/catch/finally',
		$try($echo('try'), 'false').$catch($echo('catch')).$rethrow().$finally($echo('finally')));
	assert(1, 'try\ncatch\n',
		'try/catch',
		$try($echo('try'), 'false').$catch($echo('catch')).$rethrow());
});
describe('$try...catch...finally (rethrow new error)', () => {
	assert(2, 'try\ncatch\nfinally\n',
		'try/catch/finally',
		$try($echo('try'), 'false').$catch($echo('catch')).$rethrow(2).$finally($echo('finally')));
	assert(2, 'try\ncatch\n',
		'try/catch',
		$try($echo('try'), 'false').$catch($echo('catch')).$rethrow(2));
});
describe('$try...catch...finally (error in "finally")', () => {
	assert(1, 'try\nfinally\n',
		'try/finally',
		$try($echo('try')).$finally($echo('finally'), 'false'));
	assert(1, 'try\ncatch\nfinally\n',
		'try(throw)/catch',
		$try($echo('try'), 'false').$catch($echo('catch')).$rethrow(2).$finally($echo('finally'), 'false'));
	assert(1, 'try\nfinally\n',
		'try(throw)/finally',
		$try($echo('try'), 'false').$finally($echo('finally'), 'false'));
});

describe('$try...catch...finally (finaliser error)', () => {
	assert(1, 'try\nfinally\n',
		'try/finally',
		$try($echo('try')).$finally($echo('finally'), 'false'));
});

describe('$if...then...else (true)', () => {
	assert(0, 'yes\n',
		'if/then/else',
		$if('true').$then($echo('yes')).$else($echo('no')));
	assert(0, 'yes\n',
		'if/then',
		$if('true').$then($echo('yes')));
	assert(0, '',
		'if/else',
		$if('true').$else($echo('no')));
	assert(0, 'no\n',
		'if-not/then/else',
		$if.$not('true').$then($echo('yes')).$else($echo('no')));
	assert(0, 'yes\n',
		'if-not/then/else',
		$if.$not('false').$then($echo('yes')).$else($echo('no')));
});

describe('$if...then...else (false)', () => {
	assert(0, 'no\n',
		'if/then/else',
		$if('false').$then($echo('yes')).$else($echo('no')));
	assert(0, '',
		'if/then',
		$if('false').$then($echo('yes')));
	assert(0, 'no\n',
		'if/else',
		$if('false').$else($echo('no')));
});

describe('$echo & escaping', () => {
	const echo_literal_test = s => assert(0, `${s}\n`, `literal: ${s}`, $echo(s));
	echo_literal_test('text');
	echo_literal_test('text with spaces and\ta tab');
	echo_literal_test('special & symbols | which ( shell ) would ~ normally {want,to,do,stuff,with}');
	echo_literal_test('it\'s an apostrophe');
	echo_literal_test('c:\\windows\\system32\\backslash');
	echo_literal_test('/some/path/to-a-file/a_b_c.xyz');
	echo_literal_test('http://user:password@some-domain.tld:port/path/to/item?key=value&key2=value2#search');
	expect(render.command($literal.$list('return', '42'))).to.equal('return 42');
});

	//	dump(['ssh', 'root@host', $nest('sh', '-c', $nest('printf', ...$literal.list('%s\\n', 'Hello world!')))].join(' '));

describe('Composition', () => {
	assert(0, 'try\nif\nthen\nfinally\n',
		'if/then/else within try/catch/finally',
		$try($echo('try'), $if($echo('if')).$then($echo('then')).$else($echo('else'))).$catch($echo('catch')).$finally($echo('finally')));
});

describe('Variable declaration', () => {
	const test = (expr, str) => expect(render.block(expr)).to.equal(str);
	it('String', () => {
		test($declare('name'), 'declare -r name');
		test($declare('name').$expr('$other'), 'declare -r name=$other');
		test($declare('name').$eval('whoami'), 'declare -r name="$(whoami)"');
		test($declare('name').$value('some expression'), 'declare -r name=\'some expression\'');
	});
	it('Mutable', () => {
		test($declare('name').$mutable(), 'declare name');
	});
	it('Exported', () => {
		test($declare('name').$value('potato').$export(), 'declare -rx name=potato');
	});
	it('Integer', () => {
		test($declare('name').$integer(), 'declare -ri name=0');
		test($declare('name').$mutable().$integer(2), 'declare -i name=2');
		test($declare('name').$integer('a+b'), 'declare -ri name=a+b');
	});
	it('Local function variable', () => {
		test($local('name'), 'local -r name');
	});
});

describe('Variable usage', () => {
	const test = (expr, str) => expect(render.block(expr)).to.equal(str);
	it('Quoted', () => {
		test($var('name'), '"${name}"');
	});
	it('Unquoted', () => {
		test($var('name').$noquote(), '${name}');
	});
	it('Default value', () => {
		test($var('name').$default('x'), '"${name:-x}"');
	});
	it('Array element', () => {
		test($var('name').$index('2'), '"${name[2]}"');
	});
	it('Array expansion', () => {
		test($var('name').$all(), '"${name[@]}"');
	});
	it('Multiple', () => {
		test($var.$list('one', 'two', 'three'), '"${one}"\n"${two}"\n"${three}"');
	});
	it('Invalid parameters', () => {
		expect(() => $var()).to.throw();
		expect(() => $var(null)).to.throw();
		expect(() => $var('var', 'more')).to.throw();
	});
});

describe('Boolean operators', () => {
	it('Not', () => {
		assert(0, '', null, $not('false'));
		assert(1, '', null, $not('true'));
	});
	it('Or', () => {
		assert(1, '', null, $or());
		assert(1, '', null, $or('false'));
		assert(1, '', null, $or('false', 'false'));
		assert(0, '', null, $or('true'));
		assert(0, '', null, $or('false', 'true'));
		assert(0, '', null, $or('true', 'false'));
		assert(0, '', null, $or('true', 'true'));
	});
	it('And', () => {
		assert(1, '', null, $and('false'));
		assert(1, '', null, $and('false', 'false'));
		assert(1, '', null, $and('false', 'true'));
		assert(0, '', null, $and());
		assert(0, '', null, $and('true'));
		assert(1, '', null, $and('true', 'false'));
		assert(0, '', null, $and('true', 'true'));
	});
	it('Nor', () => {
		assert(0, '', null, $nor('false', 'false'));
		assert(1, '', null, $nor('false', 'true'));
		assert(1, '', null, $nor('true', 'false'));
		assert(1, '', null, $nor('true', 'true'));
	});
	it('Nand', () => {
		assert(0, '', null, $nand('false', 'false'));
		assert(0, '', null, $nand('false', 'true'));
		assert(0, '', null, $nand('true', 'false'));
		assert(1, '', null, $nand('true', 'true'));
	});
});

describe('Subexpression', () => {
	it('Single command', () => {
		assert(0, 'test\n', null, $eval.$noquote($echo('echo test')));
		assert(0, 'test\n', null, $eval($echo('echo test')).$noquote());
		assert(0, '', null, $eval($echo('true')));
		assert(1, '', null, $eval($echo('false')));
	});
	it('Command block', () => {
		assert(0, 'hello\nworld\n', null, $eval.$noquote($echo('echo hello'), $echo('echo world')));
		assert(0, 'hello\n', null, $eval.$noquote($echo('echo hello'), 'true'));
		assert(1, 'hello\n', null, $eval.$noquote($echo('echo hello'), 'false'));
	});
});
