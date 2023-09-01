import { PatchContext, Node } from '../base';
import { ComponentNode } from '../component';
import { FragmentNode } from '../custom';
import { PureNode } from '../pure';
import { DOM } from '../utils';

type PatchableNode = PureNode | FragmentNode;

const patchExisting = <T extends PatchableNode>(curr: T, next: T, context: PatchContext) => {
	curr.children.forEach((child, i) => {
		const nextChild = next.children[i];

		// debugger;

		if (Node.is(child)) {
			if (
				ComponentNode.is(child) &&
				ComponentNode.is(nextChild) &&
				child.isTheSameComponent(nextChild)
			) {
				nextChild.elementBefore = context.elementBefore ?? nextChild.elementBefore;
				nextChild.restore(child);
				nextChild.commit();

				return;
			}

			child.patch(nextChild, context);

			if (Node.is(nextChild)) {
				context.elementBefore = nextChild.target ?? context.elementBefore;
			}

			return;
		}

		if (Node.is(nextChild)) {
			DOM.insert(nextChild, context);

			context.elementBefore = nextChild.target ?? context.elementBefore;
		}
	});
};

const createNew = <T extends PatchableNode>(curr: T, next: T, context: PatchContext): number => {
	next.children.slice(curr.children.length).forEach((node) => {
		if (Node.is(node)) {
			DOM.insert(node, context);

			context.elementBefore = node.target ?? context.elementBefore;
		}
	});

	return 0;
};

/** @returns count of not-null child nodes (using in collections) */
export const naivePatcher = <T extends PatchableNode>(curr: T, next: T, context: PatchContext) => {
	patchExisting(curr, next, context);
	createNew(curr, next, context);
};
