export type Action<T = any> = {
  action: string;
  payload?: T;
};
