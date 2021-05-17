import { HerbieControlWebSocketAction } from '../enums/herbie-control-ws-actions';

export type ControlAction<T = any> = {
  action: HerbieControlWebSocketAction;
  payload?: T;
};
