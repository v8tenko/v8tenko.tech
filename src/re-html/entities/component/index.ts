import state from '../../state';
import { Nullable, isNotNull, isNull } from '../../utils/nullable';
import { Node } from '../base';
import { FragmentNode } from '../custom';
import { DOMElement, SynteticProps } from '../typings';

import { ComponentLifecycle } from './lifecycle';

export class ComponentNode<T extends Object = {}> extends Node implements ComponentLifecycle {
	target: Nullable<DOMElement>;
	position: Nullable<number>;
	props: T;

	protected id: Nullable<number>;
	protected factory: ReHTML.Component<T>;
	protected build: ReHTML.Component;
	protected node: Nullable<Node>;

	constructor(factory: ReHTML.Component<T>, props: T) {
		super();

		this.factory = factory;
		this.props = props;
		this.build = () => {
			this.componentWillCreate();
			const node = factory(this.props);

			node.target = this.target;

			this.componentDidCreate();

			return node;
		};
	}

	static is(target: unknown): target is ComponentNode {
		return target instanceof ComponentNode;
	}

	restore(from: ComponentNode) {
		this.node = from.node;
		this.target = from.target;
		this.id = from.id;
	}

	shareTarget(target: DOMElement) {
		if (FragmentNode.is(this.node)) {
			this.node.target = target;
		}
	}

	isTheSameComponent(target: ComponentNode) {
		return this.factory === target.factory;
	}

	componentWillCreate(): void {
		this.id = state.registerComponent(this.id, this.commit.bind(this));
	}

	componentDidCreate(): void {
		state.allHookRunned(this.id!);
	}

	commit() {
		if (isNull(this.node)) {
			throw new Error('Unable to render node before first mount');
		}

		const next = this.build({});
		const context = {
			parent: this.target! as HTMLElement,
			elementBefore: this.elementBefore
		};

		this.node.patch(next, context);

		this.node = next;
	}

	componentDidMount(): void {
		console.log(this, 'has been mount');
	}

	mount(at: Nullable<HTMLElement>): DOMElement {
		if (isNotNull(this.node)) {
			throw new Error('Unable to call mount second time. Use render insted');
		}

		const node = this.build({});

		node.elementBefore = this.elementBefore;
		this.node = node;

		const parent = FragmentNode.is(node) ? at : (this.node.target as HTMLElement);
		const result = node.mount(parent);

		this.target = parent;
		this.componentDidMount();

		return result;
	}

	componentWillUnmount(): void {
		state.cleanup(this.id!);
	}

	unmount(): void {
		this.componentWillUnmount();
		this.node?.unmount();
	}
}

declare global {
	export namespace ReHTML {
		export type Component<Props extends Object = {}> = (props: Props & SynteticProps) => Node;
	}
}
