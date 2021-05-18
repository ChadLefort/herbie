import { IKeyMap } from '@herbie/types';
import React, { useEffect, useState } from 'react';
import { useGamepads } from 'react-gamepads';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { moveHead, moveWheels } from '../slices/controls';

interface GamepadRef {
  [key: number]: Gamepad;
}

export const Gamepad: React.FC = () => {
  const { control, hasStarted } = useAppSelector((state) => state.controls);
  const dispatch = useAppDispatch();
  const [gamepads, setGamepads] = useState<GamepadRef>({});

  useGamepads((gamepads) => setGamepads(gamepads));

  const controller = gamepads[0] ?? undefined;
  const rightStick = controller?.axes[2];
  const [value, setValue] = useState(90);

  useEffect(() => {
    // // going left
    if (rightStick === -1 && value > 0) {
      setValue(value - 2);
    }

    // // going right
    if (rightStick === 1 && value < 180) {
      setValue(value + 2);
    }
  }, [controller?.axes, rightStick, value]);

  useEffect(() => {
    if (hasStarted && control?.canControl) {
      console.log('move head', value);
      dispatch(moveHead(value));
    }
  }, [control?.canControl, dispatch, hasStarted, value]);

  useEffect(() => {
    if (hasStarted && control?.canControl) {
      const dPad = {
        up: controller?.buttons[12]?.pressed,
        left: controller?.buttons[14]?.pressed,
        right: controller?.buttons[15]?.pressed,
        down: controller?.buttons[13]?.pressed
      };

      const keys: IKeyMap[] = [
        { key: 'w', value: dPad.up || controller?.axes[1] === -1 },
        { key: 'a', value: dPad.left || controller?.axes[0] === -1 },
        { key: 's', value: dPad.down || controller?.axes[1] === 1 },
        { key: 'd', value: dPad.right || controller?.axes[0] === 1 }
      ];

      const pressedKey = keys.find((key) => key.value);
      pressedKey && dispatch(moveWheels(pressedKey));
    }
  }, [controller, dispatch, hasStarted, control?.canControl]);

  return process.env.NX_GAMEPAD_DEBUG ? (
    <React.Fragment>
      {Object.keys(gamepads).map((gamepadId) => {
        const id = (gamepadId as unknown) as number;
        console.log('displaying gamepad', gamepads[id]);

        return (
          <div>
            <h2>{gamepads[id].id}</h2>
            {gamepads[id].buttons &&
              gamepads[id].buttons.map((button, index) => (
                <div>
                  {index}: {button.pressed ? 'True' : 'False'}
                </div>
              ))}
          </div>
        );
      })}
    </React.Fragment>
  ) : null;
};
