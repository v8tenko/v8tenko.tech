import { getHookState, rebuild } from '..';
import { invoke } from '../../utils';

import { BaseHook } from './typings';

export type UseState<T> = {
	type: 'state';
	value: T;
} & BaseHook;

type Update<T> = T | ((oldState: T) => T);
type UseStateResult<T> = [T, (value: Update<T>) => void];
export const useState = <T>(initial?: T): UseStateResult<T> => {
	const { state, id } = getHookState();

	if (state.inProgress) {
		state.hooks[state.current] = {
			id,
			type: 'state',
			value: initial
		};
	}

	const hook = state.hooks[state.current] as UseState<T>;

	state.current++;

	const update = (value: Update<T>) => {
		hook.value = invoke(value, hook.value);

		rebuild(id);
	};

	return [hook.value, update];
};
