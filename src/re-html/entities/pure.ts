import { Falsey, Nullable } from '../utils/nullable';

import { Node } from './base';
import { naivePatcher } from './patcher';
import { NodeProp, NodeProps, Types } from './typings';
import { DOM } from './utils';

export class PureNode extends Node {
	static type = Types.pure;
	target: Nullable<HTMLElement>;

	tag: string;
	children: Falsey<Node>[];
	props: NodeProps;

	static is(target: unknown): target is PureNode {
		return target instanceof PureNode;
	}

	constructor(type: string, children: Falsey<Node>[], props: NodeProps) {
		super();

		this.tag = type;
		this.children = children;
		this.props = props;

		this.children.forEach((node) => {
			if (Node.is(node)) {
				node.parent = this;
			}
		});
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

	patch(next: Node): void {
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

		const context = {
			parent: this.target,
			elementBefore: this.elementBefore
		};

		naivePatcher(this, next, context);
	}

	mount(): HTMLElement {
		const element = document.createElement(this.tag);

		this.target = element;

		this.keys.forEach((key) => {
			this.handleProp(element, key);
		});

		this.children.forEach((node) => {
			if (!Node.is(node)) {
				return;
			}

			DOM.append(element, node, {
				parent: element,
				elementBefore: element.lastChild as Nullable<HTMLElement>
			});
		});

		return this.target;
	}

	unmount(): void {
		this.target?.remove();
	}
}
