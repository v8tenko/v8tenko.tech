import { factory } from '../entities/factory';

export const render = (component: ReHTML.Component, target: HTMLElement) => {
	const root = factory(component);

	target.replaceWith(root.mount());
};
