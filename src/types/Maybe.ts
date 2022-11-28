type Just<T> = { just: T };

type Nothing = { nothing: true };

type MaybeMethods<T> = {
  map: <U>(fn: (value: T) => U) => Maybe<U>;
  chain: <U>(fn: (value: T) => Maybe<U>) => Maybe<U>;
  getOrDefault: (defaultValue: T) => T;
  getOrElse: (fn: () => T) => T;
};

export type Maybe<T> = (Just<T> | Nothing) & MaybeMethods<T>;

const just = <T>(value: T): Just<T> & MaybeMethods<T> => ({
  just: value,
  map: (fn) => just(fn(value)),
  chain: (fn) => fn(value),
  getOrDefault: () => value,
  getOrElse: () => value,
});

const nothing: <T>() => Nothing & MaybeMethods<T> = () => ({
  nothing: true,
  map: () => nothing(),
  chain: () => nothing(),
  getOrDefault: (defaultValue) => defaultValue,
  getOrElse: (fn) => fn(),
});

const isJust = <T>(value: Maybe<T>): value is Just<T> & MaybeMethods<T> => {
  return "just" in value;
};

const isNothing = <T>(value: Maybe<T>): value is Nothing & MaybeMethods<T> => {
  return "nothing" in value;
};

export const Maybe = {
  just,
  nothing,
  isJust,
  isNothing,
};

export default Maybe;
