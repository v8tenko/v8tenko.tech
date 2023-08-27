import { Node, PatchContext } from '../base';

import { FragmentNode } from './fragment';

export class CollectionNode extends FragmentNode {
	patch(next: Node<unknown>, options: PatchContext): void {
		// @todo implement key-based patching

		super.patch(next, options);
	}
}
