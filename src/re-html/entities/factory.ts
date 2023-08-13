import { array } from '../utils';

import { Node } from './base';
import { ComponentNode } from './component/component';
import { PrimitiveNode } from './primitive';
import { PureNode } from './pure/pure';
import { NodeProps, SynteticProps, SynteticPropsList } from './typings';

const AvailableNodes = [PrimitiveNode] as const;

const applyCustomNodes = (collection: unknown[], variants = AvailableNodes): Node[] => {
	const mapped = collection.map((node) => {
		if (Node.is(node)) {
			return node;
		}

		const constructor = variants.find((Class) => Class.matches(node));

		if (!constructor) {
			return false;
		}

		return new constructor(node as any);
	}) as Node[];

	return mapped.filter(Boolean);
};

const extractSynteticProps = (props: NodeProps): Partial<SynteticProps> => {
	const foundSynteticProps: Partial<SynteticProps> = {};

	SynteticPropsList.forEach((key) => {
		if (Object.hasOwn(props, key)) {
			foundSynteticProps[key] = props[key];

			delete props[key];
		}
	});

	return foundSynteticProps;
};

export const factory = (
	tagOrConstructor: string | ReHTML.Component,
	props: NodeProps = {}
): Node => {
	const { children } = extractSynteticProps(props);
	const nodes = applyCustomNodes(array(children || []));

	if (typeof tagOrConstructor === 'string') {
		return new PureNode(tagOrConstructor, nodes, props);
	}

	if (typeof tagOrConstructor === 'function') {
		return new ComponentNode(tagOrConstructor, props);
	}

	throw new Error(`There is no Node for type ${typeof tagOrConstructor}`);
};
