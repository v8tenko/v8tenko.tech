import { Falsey, Nullable } from '../../utils';
import { Node, PatchContext } from '../base';
import { naivePatcher } from '../patcher';
import { DOMElement } from '../typings';
import { DOM } from '../utils';

export class FragmentNode extends Node {
	target: Nullable<DOMElement>;
	children: Falsey<Node>[];

	constructor(children: Falsey<Node>[]) {
		super();
		this.children = children;
	}

	static is(target: unknown): target is FragmentNode {
		return target instanceof FragmentNode;
	}

	static matches(target: unknown): target is Array<unknown> {
		return Array.isArray(target);
	}

	patch(next: Node, context: PatchContext): void {
		if (!FragmentNode.is(next)) {
			super.patch(next, context);

			return;
		}

		naivePatcher(this, next, context);
	}

	mount(at: Nullable<HTMLElement>): HTMLElement {
		const fragment = document.createDocumentFragment();

		this.target = at;

		this.children.forEach((node) => {
			if (!node) {
				return;
			}

			DOM.append(fragment, node, {
				parent: at,
				elementBefore: (fragment.lastChild as Nullable<HTMLElement>) ?? this.elementBefore
			});
		});

		return fragment as any;
	}

	unmount(): void {
		this.children.forEach((node) => {
			if (Node.is(node)) {
				node.unmount();
			}
		});
	}
}
