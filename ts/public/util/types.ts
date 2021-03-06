export type NonNullish<T> = Exclude<T, null | undefined>;
export type Class<T, TArgs extends any[]> = new (...args: TArgs) => any & { construct(...args: TArgs): T };
export type Constructor<TInstance = any, TArgs extends any[] = any[]> = new (...args: TArgs) => TInstance;
export type JSON = Record<string, Exclude<any, Function>> | Exclude<any, Function>[];
export type ArgsType<T extends (...args: any[]) => any> = T extends (...args: (infer A)) => any ? A : never;