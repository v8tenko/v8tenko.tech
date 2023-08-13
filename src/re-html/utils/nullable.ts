export type Nullable<T> = T | null | undefined;
export type NotNull<T> = T & {};

export const isNotNull = <T>(value: Nullable<T>): value is NotNull<T> =>
	value !== null && value !== undefined;

export const isNull = <T>(value: Nullable<T>): value is null | undefined => !isNotNull(value);
