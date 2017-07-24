import Fragment from './fragment';

const $line = (...args) => {
	const $render = () => {
		return args.map((x, i) => {
			if (x instanceof Fragment) {
				return x.$render();
			} else if (typeof x === 'string') {
				return x;
			} else {
				console.dir(args);
				throw new Error(`Expected fragments of type "string" or "Fragment" for $line.$render, but element[${i}] has type: ${typeof x}`);
			}
		}).join(' ');
	};
	const $append = (...extra) => {
		args.push(...extra);
		return new Fragment('verbatim', {
			$render,
			$append
		});
	};
	return $append();
};

export default $line;
