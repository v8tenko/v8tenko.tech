import state from '../../state';
import { Nullable } from '../../utils/nullable';
import { Node } from '../base';
import { NodeProps, SynteticProps } from '../typings';

export class ComponentNode extends Node<unknown> {
	protected target: Nullable<Text | HTMLElement>;

	private id: number;
	private factory: ReHTML.Component;
	private node: Nullable<Node>;

	constructor(factory: ReHTML.Component, props: NodeProps) {
		super();

		this.id = state.newComponent();
		this.factory = () => factory(props);
	}

	render(): unknown {
		if (!this.node) {
			throw new Error('Unable to render node before first mount');
		}

		const content = this.node.render();

		return content;
	}

	mount(): Text | HTMLElement {
		const node = this.factory({});

		this.node = node;
		this.target = node.mount();

		return this.target;
	}

	unmount(): void {
		this.target?.remove();
	}
}

declare global {
	export namespace ReHTML {
		export type Component<Props extends Object = {}> = (
			props: Props & Partial<SynteticProps>
		) => Node<unknown>;
	}
}
