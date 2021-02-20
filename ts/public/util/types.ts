export type NonNullish<T> = Exclude<T, null | undefined>;
export type Class<T, TArgs extends any[]> = Function & { construct(...args: TArgs): T }