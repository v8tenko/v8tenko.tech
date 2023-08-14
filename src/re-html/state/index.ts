import { Nullable, isNotNull, isNull } from '../utils';

import { Hook } from './hooks';

let lastComponentId = 1;
let componentInProgressId: Nullable<number>;

type HooksState = {
	[key: number]: {
		current: number;
		hooks: Hook[];
		inProgress: boolean;
	};
};

const hooks: HooksState = {};
const rerenderById: Record<number, Function> = {};

function registerComponent(id: Nullable<number>, update: Function) {
	if (isNotNull(id)) {
		componentInProgressId = id;
		rerenderById[id] = update;

		return id;
	}

	componentInProgressId = ++lastComponentId;
	rerenderById[componentInProgressId] = update;

	return componentInProgressId;
}

function getHookState() {
	if (isNull(componentInProgressId)) {
		throw new Error('Unable to get hook state: component is not defined');
	}

	if (Object.hasOwn(hooks, componentInProgressId)) {
		return { state: hooks[componentInProgressId], id: componentInProgressId };
	}

	const inProgress = {
		current: 0,
		hooks: [],
		inProgress: true
	};

	hooks[componentInProgressId] = inProgress;

	return { state: inProgress, id: componentInProgressId };
}

function allHookRunned(id: number) {
	if (isNull(hooks[id])) {
		return;
	}

	hooks[id].current = 0;
	hooks[id].inProgress = false;
}

function cleanup(id: number) {
	delete hooks[id];
	delete rerenderById[id];
}

function rebuild(id: number) {
	rerenderById[id]();
}

export { registerComponent, allHookRunned, getHookState, rebuild, cleanup };
export default { registerComponent, allHookRunned, getHookState, rebuild, cleanup };
