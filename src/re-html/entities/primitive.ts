import { Nullable, isNull } from '../utils/nullable';

import { Node } from './base';
import { Types } from './typings';

type Primitive = string | number | true;

export class PrimitiveNode extends Node<Primitive> {
	static type = Types.primitive;
	protected target: Nullable<Text>;

	private value: Primitive;

	static is(target: unknown): target is PrimitiveNode {
		return target instanceof PrimitiveNode;
	}

	static matches(target: unknown): target is PrimitiveNode {
		if (isNull(target)) {
			return false;
		}

		const conditions = [
			target !== false,
			target !== 0,
			typeof target === 'string' || typeof target === 'number'
		];

		return !conditions.includes(false);
	}

	constructor(value: Primitive) {
		super();
		this.value = value;
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
