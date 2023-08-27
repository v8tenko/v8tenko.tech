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
	compoment: Symbol.for('type.component'),
	fragment: Symbol.for('type.fragment'),
	list: Symbol.for('type.list')
} as const;

export type Type = keyof typeof Types;

export const MoveSynteticPropSymbol = Symbol.for('prop.move');

export const SynteticPropsSpace: Record<string, Symbol | string> = {
	children: MoveSynteticPropSymbol,
	className: 'class'
};

export type SynteticProps = Partial<{
	children: Node[];
}>;

export type NodeProps = Partial<HTMLElement>;
export type NodeProp = keyof NodeProps;

type MapNodePropToReHTMLProp<T extends string> = T extends `on${infer U}`
	? `on${Capitalize<U>}`
	: T;

// @todo replace with map
export type ReHTMLProps = Partial<
	{
		[key in NodeProp as MapNodePropToReHTMLProp<key>]: NodeProps[key];
	} & SynteticProps
>;

export type DOMNode = HTMLElement | Text;
