import { Nullable, array, isNotNull } from '../utils';

import { Node } from './base';
import { ComponentNode } from './component';
import { PrimitiveNode } from './primitive';
import { PureNode } from './pure';
import {
	MoveSynteticPropSymbol,
	NodeProps,
	ReHTMLProps,
	SynteticProps,
	SynteticPropsSpace
} from './typings';

const AvailableNodes = [PrimitiveNode] as const;

const applyCustomNodes = (collection: unknown[], variants = AvailableNodes): Nullable<Node>[] => {
	const mapped = collection.map((node) => {
		if (Node.is(node)) {
			return node;
		}

		const constructor = variants.find((Class) => Class.matches(node));

		if (!constructor) {
			return undefined;
		}

		return new constructor(node as any);
	}) as Nullable<Node>[];

	return mapped;
};

type MapResult = {
	props: NodeProps;
} & SynteticProps;

// @todo fix ts typings
const mapReHTMLPropsToNodeProps = (props: ReHTMLProps): MapResult => {
	const syntetic: SynteticProps = {};
	const nodeProps: NodeProps = {};

	Object.keys(props).forEach((key) => {
		if (!Object.hasOwn(SynteticPropsSpace, key)) {
			// @ts-ignore
			nodeProps[key.toLocaleLowerCase()] = props[key];

			return;
		}

		if (SynteticPropsSpace[key] === MoveSynteticPropSymbol) {
			// @ts-ignore
			syntetic[key] = props[key];

			return;
		}

		// @ts-ignore
		nodeProps[key] = props[key];
	});

	return {
		...syntetic,
		props: nodeProps
	};
};

export const factory = (
	tagOrConstructor: string | ReHTML.Component,
	reHTMLProps: ReHTMLProps = {}
): Node => {
	const { children, props } = mapReHTMLPropsToNodeProps(reHTMLProps);
	const nodes = applyCustomNodes(array(isNotNull(children) ? children : []));

	if (typeof tagOrConstructor === 'string') {
		return new PureNode(tagOrConstructor, nodes, props);
	}

	if (typeof tagOrConstructor === 'function') {
		return new ComponentNode(tagOrConstructor, props);
	}

	throw new Error(`There is no Node for type ${typeof tagOrConstructor}`);
};
