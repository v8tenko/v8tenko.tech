import { Nullable } from '../utils/nullable';

export abstract class Node<T = unknown> {
	static readonly type: Symbol;
	protected abstract target: Nullable<Text | HTMLElement>;

	static is(target: unknown): target is Node {
		return target instanceof Node;
	}

	static matches(target: unknown): target is unknown {
		throw new Error('Base node does not matches anything.');
	}

	abstract render(): T;
	abstract mount(): Text | HTMLElement;
	abstract unmount(): void;
}
