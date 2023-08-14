import state from '../../state';
import { Nullable, isNotNull, isNull } from '../../utils/nullable';
import { Node } from '../base';
import { SynteticProps } from '../typings';

import { ComponentLifecycle } from './lifecycle';

export class ComponentNode<T extends Object = {}>
	extends Node<unknown>
	implements ComponentLifecycle
{
	target: Nullable<Text | HTMLElement>;
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
		this.target = from.target;
		this.id = from.id;
	}

	isTheSameComponent(target: ComponentNode) {
		return this.factory === target.factory;
	}

	componentWillCreate(): void {
		this.id = state.registerComponent(this.id, this.render.bind(this));
	}

	componentDidCreate(): void {
		state.allHookRunned(this.id!);
	}

	render(): unknown {
		if (isNull(this.node)) {
			throw new Error('Unable to render node before first mount');
		}

		const next = this.build({});

		this.node.patch(next);
		this.node = next;

		return this.node.render();
	}

	mount(): Text | HTMLElement {
		if (isNotNull(this.node)) {
			throw new Error('Unable to call mount second time. Use render insted');
		}

		const node = this.build({});

		this.node = node;
		this.target = node.mount();

		return this.target;
	}

	componentWillUnmount(): void {
		state.cleanup(this.id!);
	}

	unmount(): void {
		this.componentWillUnmount();
		this.target?.remove();
	}
}

declare global {
	export namespace ReHTML {
		export type Component<Props extends Object = {}> = (
			props: Props & SynteticProps
		) => Node<unknown>;
	}
}
