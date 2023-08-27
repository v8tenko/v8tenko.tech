export type Nullable<T> = T | null | undefined;
export type NotNull<T> = T & {};

export type Falsey<T> = T | false | 0 | null | undefined;

export const isNotNull = <T>(value: Nullable<T>): value is NotNull<T> =>
	value !== null && value !== undefined;

export const isNull = <T>(value: Nullable<T>): value is null | undefined => !isNotNull(value);
