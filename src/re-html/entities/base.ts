import { Falsey, Nullable, isNull } from '../utils/nullable';

import { DOMNode } from './typings';

export type PatchContext = {
	parent: HTMLElement;
	startIndex: number;
};

export abstract class Node<T = unknown> {
	static readonly type: Symbol;
	abstract target: Nullable<DOMNode>;
	size: number = 1;

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

		this.target.replaceWith(next.mount());
	}

	/**
	 * called after state changed
	 * implements step-by-stem architecture:
	 * 	1. Got compoment to rerender
	 * 	2. Call State.componentWillMount to get actual hook state of component
	 * 	3. Running factory with new props / hooks state
	 * 	4. Iterating overs it's children and patching them
	 * 	5. If we find a new component - repeat this
	 */
	abstract render(): T;

	/**
	 * first render only
	 * creates initial DOM, linking hooks
	 */
	abstract mount(): DOMNode;
	abstract unmount(): void;
}
