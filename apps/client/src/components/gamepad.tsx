import { ControlType, Direction, IDirection } from '@herbie/types';
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
  const [value, setValue] = useState(1280);

  const calcDirectionVertical = (axe: number) => {
    if (axe < -0.2) {
      return 'up';
    }

    if (axe > 0.2) {
      return 'down';
    }
  };

  const calcDirectionHorizontal = (axe: number) => {
    if (axe < -0.2) {
      return 'left';
    }

    if (axe > 0.2) {
      return 'right';
    }
  };

  useEffect(() => {
    const horizontal = calcDirectionHorizontal(rightStick);

    if (horizontal === 'left' && value > 0) {
      setValue(value - 10);
    }

    if (horizontal === 'right' && value < 2560) {
      setValue(value + 10);
    }
  }, [controller?.axes, rightStick, value]);

  useEffect(() => {
    if (hasStarted && control?.canControl) {
      dispatch(moveHead({ control: ControlType.Controller, postion: value }));
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

      const horizontal = calcDirectionHorizontal(controller?.axes[0]);
      const vertical = calcDirectionVertical(controller?.axes[1]);

      const directions: IDirection[] = [
        { direction: Direction.Forward, value: dPad.up || vertical === 'up' },
        { direction: Direction.Left, value: dPad.left || horizontal === 'left' },
        { direction: Direction.Backward, value: dPad.down || vertical === 'down' },
        { direction: Direction.Right, value: dPad.right || horizontal === 'right' }
      ];

      const direction = directions.find((direction) => direction.value);
      dispatch(moveWheels(direction));
    }
  }, [controller, dispatch, hasStarted, control?.canControl]);

  return null;
};
