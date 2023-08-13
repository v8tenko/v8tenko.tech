import type { Node } from './base';

export const Types = {
	/** <p> content </p> */
	pure: Symbol.for('type.pure'),
	/**
	 * string | number | boolean
	 * not accepts falsey values
	 */
	primitive: Symbol.for('type.primitive'),
	/** const Component = () => <p> content </p> */
	compoment: Symbol.for('type.component')
} as const;

export type Type = keyof typeof Types;

export const SynteticPropsList = ['children'] as const;

export type SynteticProps = {
	children: Node[];
};

export type NodeProps = Partial<HTMLElement & SynteticProps>;
export type NodeProp = keyof NodeProps;
