declare global {
	namespace JSX {
		interface IntrinsicElements {
			[componentName: string]: unknown;
		}
	}
}

export { factory as jsx } from './entities/factory';
export { factory as jsxs } from './entities/factory';
