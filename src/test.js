import 'mocha';
import chai from 'chai';
import 'blanket';

const { describe, it } = global;
const { expect } = chai;
chai.should();

import { If, Try, Echo, render } from '../';
import { spawnSync } from 'child_process';

const assert = (status, output, description, script) => it(description, () => {
	const embedded = render.all(script).join('\n');
	const cp = spawnSync('bash', ['-Eeuo', 'pipefail', '-c', embedded], { stdio: ['ignore', 'pipe', 'ignore'] });
	expect(cp.error).to.equal(undefined);
	expect(cp.signal).to.equal(null);
	expect(cp.status).to.equal(status);
	expect(cp.stdout.toString('utf8')).to.equal(output);
});

describe('Try...catch...finally (no error)', () => {
	assert(0, 'try\nfinally\n',
		'try/catch/finally',
		Try(Echo('try')).Catch(Echo('catch')).Finally(Echo('finally')));
	assert(0, 'try\n',
		'try/catch',
		Try(Echo('try')).Catch(Echo('catch')));
	assert(0, 'try\nfinally\n',
		'try/finally',
		Try(Echo('try')).Finally(Echo('finally')));
});

describe('Try...catch...finally (caught error)', () => {
	assert(0, 'try\ncatch\nfinally\n',
		'try/catch/finally',
		Try(Echo('try'), 'false').Catch(Echo('catch')).Finally(Echo('finally')));
	assert(0, 'try\ncatch\n',
		'try/catch',
		Try(Echo('try'), 'false').Catch(Echo('catch')));
	assert(1, 'try\nfinally\n',
		'try/finally',
		Try(Echo('try'), 'false').Finally(Echo('finally')));
});

describe('Try...catch...finally (rethrown error)', () => {
	assert(1, 'try\ncatch\nfinally\n',
		'try/catch/finally',
		Try(Echo('try'), 'false').Catch(Echo('catch'), 'false').Finally(Echo('finally')));
	assert(1, 'try\ncatch\n',
		'try/catch',
		Try(Echo('try'), 'false').Catch(Echo('catch'), 'false'));
	assert(1, 'try\nfinally\n',
		'try/finally',
		Try(Echo('try'), 'false').Finally(Echo('finally'), 'false'));
});

describe('Try...catch...finally (finaliser error)', () => {
	assert(1, 'try\nfinally\n',
		'try/finally',
		Try(Echo('try')).Finally(Echo('finally'), 'false'));
});

describe('If...then...else (true)', () => {
	assert(0, 'yes\n',
		'if/then/else',
		If('true').Then(Echo('yes')).Else(Echo('no')));
	assert(0, 'yes\n',
		'if/then',
		If('true').Then(Echo('yes')));
	assert(0, '',
		'if/else',
		If('true').Else(Echo('no')));
});

describe('If...then...else (false)', () => {
	assert(0, 'no\n',
		'if/then/else',
		If('false').Then(Echo('yes')).Else(Echo('no')));
	assert(0, '',
		'if/then',
		If('false').Then(Echo('yes')));
	assert(0, 'no\n',
		'if/else',
		If('false').Else(Echo('no')));
});

describe('Echo & escaping', () => {
	const echo_literal_test = s => assert(0, `${s}\n`, `Literal: ${s}`, Echo(s));
	echo_literal_test('text');
	echo_literal_test('text with spaces and\ta tab');
	echo_literal_test('special & symbols | which ( shell ) would ~ normally {want,to,do,stuff,with}');
	echo_literal_test('it\'s an apostrophe');
	echo_literal_test('c:\\windows\\system32\\backslash');
	echo_literal_test('/some/path/to-a-file/a_b_c.xyz');
	echo_literal_test('http://user:password@some-domain.tld:port/path/to/item?key=value&key2=value2#search');
});

	//	dump(['ssh', 'root@host', Nest('sh', '-c', Nest('printf', ...Literal.list('%s\\n', 'Hello world!')))].join(' '));

describe('Composition', () => {
	assert(0, 'try\nif\nthen\nfinally\n',
		'if/then/else within try/catch/finally',
		Try(Echo('try'), If(Echo('if')).Then(Echo('then')).Else(Echo('else'))).Catch(Echo('catch')).Finally(Echo('finally')));
});
