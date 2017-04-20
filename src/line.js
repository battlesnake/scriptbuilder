import Fragment from './fragment';

const $line = (...args) => {
	const $render = () => {
		return args.map(x => {
			if (x instanceof Fragment) {
				return x.$render();
			} else if (typeof x === 'string') {
				return x;
			} else {
				console.dir(args);
				throw new Error(`Invalid type: ${typeof x}`);
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
