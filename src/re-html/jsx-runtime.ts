import { Types } from './entities/typings';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			[componentName: string]: unknown;
		}
	}
}

export const Fragment = Types.fragment;
export { factory as jsx } from './entities/factory';
export { factory as jsxs } from './entities/factory';
