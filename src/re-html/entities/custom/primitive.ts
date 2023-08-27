import { Nullable, isNull } from '../../utils/nullable';
import { Node } from '../base';
import { Types } from '../typings';

type Primitive = string | number | true;

export class PrimitiveNode extends Node<Primitive> {
	static type = Types.primitive;

	target: Nullable<Text>;
	protected value: Primitive;

	static is(target: unknown): target is PrimitiveNode {
		return target instanceof PrimitiveNode;
	}

	static matches(target: unknown): target is PrimitiveNode {
		if (isNull(target)) {
			return false;
		}

		if (typeof target === 'function') {
			throw new Error('Function can not be used as ReHTML child.');
		}

		if (typeof target === 'object' && !Array.isArray(target)) {
			throw new Error(
				`Object can not be used as ReHTML child. Got object: ${JSON.stringify(target)}`
			);
		}

		const conditions = [
			target !== false,
			typeof target === 'string' || typeof target === 'number'
		];

		return !conditions.includes(false);
	}

	constructor(value: Primitive) {
		super();
		this.value = value;
	}

	patch(next: Nullable<Node<unknown>>): void {
		if (!PrimitiveNode.is(next)) {
			super.patch(next);

			return;
		}

		next.target = this.target;

		if (this.value !== next.value) {
			super.patch(next);
		}
	}

	render(): Primitive {
		return this.value;
	}

	mount(): Text {
		const element = document.createTextNode(this.value.toString());

		this.target = element;

		return this.target;
	}

	unmount(): void {
		this.target?.remove();
	}
}
