import If from './if-then-else';
import Try from './try-catch-finally';
import Literal from './literal';
import Nest from './nest';
import render from './render';

const dump = cmd => {
	console.log('--------------------------------------------------------------------------------');
	console.log(render.all(cmd).map(s => s.replace(/\t/g, '  ')).map(s => `\t${s}`).join('\n'));
};

const test = () => {
	dump(Try('echo Hello', 'false').Catch('echo Failed', 'echo Lol').Finally('echo Finalisation'));
	dump(Try('echo Hello', 'false').Catch('echo Failed', 'echo Lol'));
	dump(Try('echo Hello', 'false').Finally('echo Finalisation'));

	dump(If('grep potato').Then('echo Found', 'blah').Else('echo Not found', 'bleh'));
	dump(If('grep potato').Then('echo Found', 'blah'));
	dump(If('grep potato').Else('echo Not found', 'bleh'));

	dump(Literal('literal'));
	dump(Literal('one literal & another literal'));
	dump(Literal('a space'));
	dump(Literal('it\'s an apostrophe'));
	dump(Literal('/some/path/to-a-file/a_b_c.xyz'));
	dump(Literal('http://user:password@some-domain.tld/path/to/item?key=value&key2=value2#search'));

	dump(['ssh', 'root@host', Nest('sh', '-c', Nest('printf', ...Literal.list('%s\\n', 'Hello world!')))].join(' '));

	dump(Try(If('condition').Then('yes').Else('no')).Catch('handle error').Finally('clean up'));
};

export default { test };
