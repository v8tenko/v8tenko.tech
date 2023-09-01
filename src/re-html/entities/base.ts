import { Falsey, Nullable, isNull } from '../utils/nullable';

import { DOMElement } from './typings';

export type PatchContext = {
	parent: Nullable<HTMLElement>;
	elementBefore: Nullable<DOMElement>;
};

export abstract class Node {
	static readonly type: Symbol;
	abstract target: Nullable<DOMElement>;

	parent: Nullable<Node>;
	elementBefore: Nullable<DOMElement>;

	static is(target: unknown): target is Node {
		return target instanceof Node;
	}

	static matches(target: unknown): target is unknown {
		throw new Error('Base node does not matches anything.');
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	patch(next: Falsey<Node>, context?: PatchContext) {
		if (!Node.is(next)) {
			this.unmount();

			return;
		}

		if (isNull(this.target)) {
			throw new Error('Unable to patch nullable Node');
		}

		this.target.replaceWith(next.mount(null));
	}

	/**
	 * first render only
	 * creates initial DOM, linking hooks
	 */
	abstract mount(at: Nullable<HTMLElement>): DOMElement;
	abstract unmount(): void;
}
