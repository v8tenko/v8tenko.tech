import { Nullable, isNull } from '../utils/nullable';

export abstract class Node<T = unknown> {
	static readonly type: Symbol;
	protected abstract target: Nullable<Text | HTMLElement>;

	static is(target: unknown): target is Node {
		return target instanceof Node;
	}

	static matches(target: unknown): target is unknown {
		throw new Error('Base node does not matches anything.');
	}

	patch(next: Nullable<Node>) {
		if (isNull(next)) {
			this.unmount();

			return;
		}

		const nextTarget = next.mount();

		this.target?.replaceWith(nextTarget);
		this.target = nextTarget;
	}

	abstract render(): T;
	abstract mount(): Text | HTMLElement;
	abstract unmount(): void;
}
