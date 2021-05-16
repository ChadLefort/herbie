import { HerbieControlWebSocketAction } from '@herbie/types';
import { websocketBuilder } from '@herbie/utils';

import { setControl, setPing } from './controls.slice';

export const herbieWebsocketBuilder = websocketBuilder()
  .add(HerbieControlWebSocketAction.Ping, (payload: number) => (dispatch) => {
    dispatch(setPing(payload));
  })
  .add(HerbieControlWebSocketAction.CanControl, (payload: string) => (dispatch) => {
    dispatch(setControl({ canControl: true, message: payload }));
  })
  .add(HerbieControlWebSocketAction.CannotControl, (payload: string) => (dispatch) => {
    dispatch(setControl({ canControl: false, message: payload }));
  });
