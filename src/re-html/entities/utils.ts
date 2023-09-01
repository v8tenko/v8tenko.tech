import { Falsey } from '../utils';

import { Node, PatchContext } from './base';

const append = (
	target: HTMLElement | DocumentFragment,
	node: Falsey<Node>,
	context: PatchContext
) => {
	if (!Node.is(node)) {
		return 0;
	}

	const { parent, elementBefore: lastElement } = context;

	node.elementBefore = lastElement;
	target.appendChild(node.mount(parent));
};

const insert = (node: Falsey<Node>, context: PatchContext) => {
	if (!Node.is(node)) {
		return;
	}

	if (!context.elementBefore) {
		context.parent?.prepend(node.mount(context.parent));

		return;
	}

	context.elementBefore?.after(node.mount(context.parent));
};

export const DOM = {
	append,
	insert
};
