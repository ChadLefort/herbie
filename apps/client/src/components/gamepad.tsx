import { IKeyMap } from '@herbie/types';
import { moveHead, moveWheels, send } from '@herbie/utils';
import React, { useEffect, useState } from 'react';
import { useGamepads } from 'react-gamepads';

// import { wsControl } from '../app/ws';

interface GamepadRef {
  [key: number]: Gamepad;
}

export const Gamepad: React.FC = () => {
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
    console.log('move head', value);

    // send(wsControl, moveHead(value));
  }, [value]);

  useEffect(() => {
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
    // send(wsControl, moveWheels(pressedKey));
  }, [controller]);

  return null;

  // const gamepadDisplay = Object.keys(gamepads).map((gamepadId) => {
  //   // console.log('displaying gamepad', gamepads[gamepadId]);
  //   return (
  //     <div>
  //       <h2>{gamepads[gamepadId].id}</h2>
  //       {gamepads[gamepadId].buttons &&
  //         gamepads[gamepadId].buttons.map((button, index) => (
  //           <div>
  //             {index}: {button.pressed ? 'True' : 'False'}
  //           </div>
  //         ))}
  //     </div>
  //   );
  // });

  // return (
  //   <div className="Gamepads">
  //     <h1>Gamepads</h1>
  //     {gamepadDisplay}
  //   </div>
  // );
};
