import { ComponentNode } from '../entities/component';
import { factory } from '../entities/factory';

export const render = (component: ReHTML.Component, target: HTMLElement) => {
	const root = factory(component) as ComponentNode;

	target.appendChild(root.mount(target, 0));
};

export const renderToString = (component: ReHTML.Component) => {
	const root = factory(component);
	const node = root.mount(null, 0);
	const fictitious = document.createElement('div');

	fictitious.appendChild(node);

	return fictitious.innerHTML;
};
