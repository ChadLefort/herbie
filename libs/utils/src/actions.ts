import { HerbieControlWebSocketAction as Action, IKeyMap } from '@herbie/types';

export const moveHead = (mouseX: number) => ({ action: Action.MoveHead, payload: Math.round(mouseX / 14.21) });
export const moveWheels = (pressedKey: IKeyMap) => ({ action: Action.Keypress, payload: pressedKey });
export const startHerbie = () => ({ action: Action.Start });
export const stopHerbie = () => ({ action: Action.Stop });
export const ping = (inches: number) => ({ action: Action.Ping, payload: inches });
export const canControl = () => ({ action: Action.CanControl, payload: 'You can control Herbie!' });
export const cannotControl = () => ({
  action: Action.CannotControl,
  payload: 'Only one client can be connected at a time.'
});
