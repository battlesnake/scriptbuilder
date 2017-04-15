import 'mocha';
import chai from 'chai';

const { describe, it } = global;
const { expect } = chai;
chai.should();

import { $if, $try, $echo, $declare, render } from '../';
import { spawnSync } from 'child_process';

const assert = (status, output, description, script) => it(description, () => {
	const embedded = render.all(script).join('\n');
	const cp = spawnSync('bash', ['-Eeuo', 'pipefail', '-c', embedded], { stdio: ['ignore', 'pipe', 'ignore'] });
	expect(cp.error).to.equal(void 0);
	expect(cp.signal).to.equal(null);
	expect(cp.status).to.equal(status);
	expect(cp.stdout.toString('utf8')).to.equal(output);
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

describe('$try...catch...finally (rethrown error)', () => {
	assert(1, 'try\ncatch\nfinally\n',
		'try/catch/finally',
		$try($echo('try'), 'false').$catch($echo('catch'), 'false').$finally($echo('finally')));
	assert(1, 'try\ncatch\n',
		'try/catch',
		$try($echo('try'), 'false').$catch($echo('catch'), 'false'));
	assert(1, 'try\nfinally\n',
		'try/finally',
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
});

	//	dump(['ssh', 'root@host', $nest('sh', '-c', $nest('printf', ...$literal.list('%s\\n', 'Hello world!')))].join(' '));

describe('Composition', () => {
	assert(0, 'try\nif\nthen\nfinally\n',
		'if/then/else within try/catch/finally',
		$try($echo('try'), $if($echo('if')).$then($echo('then')).$else($echo('else'))).$catch($echo('catch')).$finally($echo('finally')));
});

describe('Variable declaration', () => {
	const test = (expr, str) => expect(render.all(expr).join('\n')).to.equal(str);
	it('String', () => {
		test($declare('name'), 'declare -r name');
		test($declare('name').$integer(), 'declare -ri name=0');
		test($declare('name').$mutable().$integer(2), 'declare -i name=2');
		test($declare('name').$integer('a+b'), 'declare -ri name=a+b');
		test($declare('name').$expr('$other'), 'declare -r name=$other');
		test($declare('name').$eval('whoami'), 'declare -r name="$(whoami)"');
		test($declare('name').$value('some expression'), 'declare -r name=\'some expression\'');
	});
	it('Integer', () => {
		test($declare('name').$integer(), 'declare -ri name=0');
		test($declare('name').$mutable().$integer(2), 'declare -i name=2');
		test($declare('name').$integer('a+b'), 'declare -ri name=a+b');
	});
});
