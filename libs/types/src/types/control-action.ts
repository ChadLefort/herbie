export enum Action {
  start = 'start',
  stop = 'stop',
  moveHead = 'move head',
  keypress = 'keypress',
  ping = 'ping',
  canControl = 'can control',
  cannotControl = 'cannot control'
}

export type ControlAction<T = any> = {
  action: Action;
  payload?: T;
};
