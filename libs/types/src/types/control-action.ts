export enum HerbieControlWebSocketAction {
  Start = 'start',
  Stop = 'stop',
  MoveHead = 'move head',
  Keypress = 'keypress',
  Ping = 'ping',
  CanControl = 'can control',
  CannotControl = 'cannot control'
}

export type ControlAction<T = any> = {
  action: HerbieControlWebSocketAction;
  payload?: T;
};
