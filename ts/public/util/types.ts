export type NonNullish<T> = Exclude<T, null | undefined>;
export type Class<T, TArgs extends any[]> = new (...args: TArgs) => any & { construct(...args: TArgs): T };
export type JSON = Record<string, Exclude<any, Function>> | Exclude<any, Function>[];
export type ArgsType<T extends (...args: any[]) => any> = T extends (...args: (infer A)) => any ? A : never;