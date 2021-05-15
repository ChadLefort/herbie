import { Action, IKeyMap } from '@herbie/types';

export const moveHead = (mouseX: number) => ({ action: Action.moveHead, payload: Math.round(mouseX / 14.21) });
export const moveWheels = (pressedKey: IKeyMap) => ({ action: Action.keypress, payload: pressedKey });
export const startHerbie = () => ({ action: Action.start });
export const stopHerbie = () => ({ action: Action.stop });
export const ping = (inches: number) => ({ action: Action.ping, payload: inches });
export const canControl = () => ({ action: Action.canControl, payload: 'You can control Herbie!' });
export const cannotControl = () => ({
  action: Action.cannotControl,
  payload: 'Only one client can be connected at a time.'
});
