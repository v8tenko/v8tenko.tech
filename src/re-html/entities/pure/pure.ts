import { Nullable, isNull } from '../../utils/nullable';
import { Node } from '../base';
import { NodeProp, NodeProps, Types } from '../typings';

type VirtualPureNode = {
	tag: string;
	children: Node[];
	props: NodeProps;
};

export class PureNode extends Node<VirtualPureNode> {
	static type = Types.pure;
	protected target: Nullable<HTMLElement> = null;

	private tag: string;
	private children: Node[];
	private props: NodeProps;

	static is(target: unknown): target is PureNode {
		if (isNull(target)) {
			return false;
		}

		if (typeof target !== 'object') {
			return false;
		}

		return target instanceof PureNode;
	}

	constructor(type: string, children: Node[], props: NodeProps) {
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

	private get keys(): NodeProp[] {
		return Object.keys(this.props) as NodeProp[];
	}

	private handleProp<Key extends keyof NodeProps>(target: HTMLElement, key: Key) {
		if (key.startsWith('on')) {
			const event = key.slice(2).toLowerCase();

			target.addEventListener(event, this.props[key] as EventListener);

			return;
		}

		target.setAttribute(key, `${this.props[key]}`);
	}

	mount(): HTMLElement {
		const element = document.createElement(this.tag);

		this.keys.forEach((key) => {
			this.handleProp(element, key);
		});

		this.children.forEach((node) => {
			element.appendChild(node.mount());
		});

		this.target = element;

		return this.target;
	}

	unmount(): void {
		throw new Error('Method not implemented.');
	}
}
