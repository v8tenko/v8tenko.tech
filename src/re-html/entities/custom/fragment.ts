import { Falsey, Nullable } from '../../utils';
import { Node, PatchContext } from '../base';
import { ComponentNode } from '../component';
import { DOMNode } from '../typings';

export class FragmentNode extends Node<Falsey<Node>[]> {
	target: Nullable<DOMNode>;
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

	render(): Falsey<Node>[] {
		return this.children;
	}

	patch(next: Node<unknown>, options: PatchContext): void {
		if (!FragmentNode.is(next)) {
			super.patch(next);

			return;
		}

		const { parent, startIndex } = options;
		let renderedCount = 0;

		this.children.forEach((child, i) => {
			const nextChild = next.children[i];

			if (Node.is(child)) {
				if (
					ComponentNode.is(child) &&
					ComponentNode.is(nextChild) &&
					child.isTheSameComponent(nextChild)
				) {
					nextChild.restore(child);
					nextChild.render();

					renderedCount += nextChild.size;

					return;
				}

				child.patch(nextChild, { parent, startIndex: startIndex + renderedCount });

				if (Node.is(nextChild)) {
					renderedCount += nextChild.size;
				}

				return;
			}

			if (Node.is(nextChild)) {
				const childAfter = parent.childNodes[startIndex + renderedCount];

				parent.insertBefore(nextChild.mount(), childAfter);

				renderedCount += nextChild.size;
			}
		});

		next.children.slice(this.children.length).forEach((node) => {
			if (!node) {
				return;
			}

			const childAfter = parent.childNodes[startIndex + renderedCount];

			renderedCount++;

			parent.insertBefore(node.mount(), childAfter);
		});

		next.size = renderedCount;
	}

	mount(): HTMLElement {
		const fragment = document.createDocumentFragment();

		this.size = 0;

		this.children.forEach((node) => {
			if (!node) {
				return;
			}

			this.size++;

			const element = node.mount();

			fragment.appendChild(element);
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
