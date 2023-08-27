import { Nullable, isNotNull, isNull } from '../utils/nullable';

import { Node } from './base';
import { ComponentNode } from './component';
import { NodeProp, NodeProps, Types } from './typings';

type VirtualPureNode = {
	tag: string;
	children: Nullable<Node>[];
	props: NodeProps;
};

export class PureNode extends Node<VirtualPureNode> {
	static type = Types.pure;
	target: Nullable<HTMLElement> = null;

	protected tag: string;
	protected children: Nullable<Node>[];
	protected props: NodeProps;

	static is(target: unknown): target is PureNode {
		if (isNull(target)) {
			return false;
		}

		if (typeof target !== 'object') {
			return false;
		}

		return target instanceof PureNode;
	}

	constructor(type: string, children: Nullable<Node>[], props: NodeProps) {
		super();

		this.tag = type;
		this.children = children;
		this.props = props;
	}

	render(): VirtualPureNode {
		return {
			tag: this.tag,
			children: this.children,
			props: this.props
		};
	}

	protected get keys(): NodeProp[] {
		return Object.keys(this.props) as NodeProp[];
	}

	protected handleProp<Key extends keyof NodeProps>(target: HTMLElement, key: Key) {
		if (key.startsWith('on')) {
			const event = key.slice(2);

			target.addEventListener(event, this.props[key] as EventListener);

			return;
		}

		target.setAttribute(key, `${this.props[key]}`);
	}

	protected applyNextProps(next: PureNode) {
		next.keys.forEach((key) => {
			if (Object.hasOwn(this.props, key)) {
				if (key.startsWith('on')) {
					const event = key.slice(2);

					this.target?.removeEventListener(event, this.props[key] as EventListener);
					this.target?.addEventListener(event, next.props[key] as EventListener);

					return;
				}

				this.target?.setAttribute(key, `${next.props[key]}`);

				return;
			}

			this.target?.removeAttribute(key);
		});
	}

	protected applyNextChildren(next: PureNode) {
		let renderedCount = 0;

		this.children.forEach((child, i) => {
			const nextChild = next.children[i];

			if (isNotNull(child)) {
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

				child.patch(nextChild, { parent: this.target!, startIndex: renderedCount });

				renderedCount += nextChild?.size ?? 0;

				return;
			}

			if (isNotNull(nextChild)) {
				const childAfter = this.target!.childNodes[renderedCount];

				this.target!.insertBefore(nextChild.mount(), childAfter);

				renderedCount += nextChild.size;
			}
		});

		next.children.slice(this.children.length).forEach((node) => {
			if (!node) {
				return;
			}

			this.target?.appendChild(node.mount());
		});
	}

	patch(next: Node<unknown>): void {
		if (!PureNode.is(next)) {
			super.patch(next);

			return;
		}

		if (this.tag !== next.tag) {
			super.patch(next);

			return;
		}

		next.target = this.target;

		this.applyNextProps(next);
		this.applyNextChildren(next);
	}

	mount(): HTMLElement {
		const element = document.createElement(this.tag);

		this.keys.forEach((key) => {
			this.handleProp(element, key);
		});

		this.children.forEach((node) => {
			if (isNull(node)) {
				return;
			}

			element.appendChild(node.mount());
		});

		this.target = element;

		return this.target;
	}

	unmount(): void {
		this.target?.remove();
	}
}
