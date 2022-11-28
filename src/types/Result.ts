type Ok<ok> = { ok: ok };

type Err<err> = { err: err };

type ResultMethods<ok, err> = {
  map: <U>(fn: (value: ok) => U) => Result<U, err>;
  mapErr: <U>(fn: (value: err) => U) => Result<ok, U>;
  chain: <U>(fn: (value: ok) => Result<U, err>) => Result<U, err>;
  chainErr: <U>(fn: (value: err) => Result<ok, U>) => Result<ok, U>;
  getOrDefault: (defaultValue: ok) => ok;
  getOrElse: (fn: () => ok) => ok;
  getErrOrDefault: (defaultValue: err) => err;
  getErrOrElse: (fn: () => err) => err;
};

export type Result<ok, err> = (Ok<ok> | Err<err>) & ResultMethods<ok, err>;

const ok = <ok, err>(value: ok): Ok<ok> & ResultMethods<ok, err> => ({
  ok: value,
  map: (fn) => ok(fn(value)),
  mapErr: () => ok(value),
  chain: (fn) => fn(value),
  chainErr: () => ok(value),
  getOrDefault: () => value,
  getOrElse: () => value,
  getErrOrDefault: (defaultValue) => defaultValue,
  getErrOrElse: (fn) => fn(),
});

const err = <ok, err>(value: err): Err<err> & ResultMethods<ok, err> => ({
  err: value,
  map: () => err(value),
  mapErr: (fn) => err(fn(value)),
  chain: () => err(value),
  chainErr: (fn) => fn(value),
  getOrDefault: (defaultValue) => defaultValue,
  getOrElse: (fn) => fn(),
  getErrOrDefault: () => value,
  getErrOrElse: () => value,
});

const isOk = <ok, err>(
  value: Result<ok, err>
): value is Ok<ok> & ResultMethods<ok, err> => {
  return "ok" in value;
};

const isErr = <ok, err>(
  value: Result<ok, err>
): value is Err<err> & ResultMethods<ok, err> => {
  return "err" in value;
};

export const Result = {
  ok,
  err,
  isOk,
  isErr,
};

export default Result;
