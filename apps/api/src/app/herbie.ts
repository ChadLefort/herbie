import { IKeyMap } from '@herbie/types';
import { send } from '@herbie/utils';
import { Board, Proximity, Servo, Servos } from 'johnny-five';
import PiIO from 'pi-io';
import ws from 'ws';

import { logger } from './logger';

const servoController = 'PCA9685';
const proximityController = 'HCSR04';

interface IInformation {
  name: string;
  nickname?: string;
  age: number;
  version: string;
}

interface IBody {
  eyes: Proximity;
  head: Servo;
  wheels: IWheels;
}

interface IWheels {
  left: Servo;
  right: Servo;
  both?: Servos;
}

export class Herbie {
  private hasStarted = false;

  board = new Board({
    io: new PiIO()
  });

  body: IBody = {
    eyes: new Proximity({
      controller: proximityController,
      pin: 'GPIO18',
      freq: 500
    }),
    head: new Servo({
      controller: servoController,
      pin: 0,
      invert: true
    }),
    wheels: {
      left: new Servo({
        controller: servoController,
        pin: 1,
        type: 'continuous'
      }),
      right: new Servo({
        controller: servoController,
        pin: 2,
        type: 'continuous',
        invert: true
      })
    }
  };

  getInfo(): IInformation {
    return {
      name: 'Herbert',
      nickname: 'Herbie',
      age: 6,
      version: '3.0.0'
    };
  }

  start(ws: ws) {
    this.hasStarted = true;
    const { wheels, eyes } = this.body;

    eyes.on('change', ({ inches }) => {
      if (this.hasStarted) {
        logger.info(`PING))): ${inches} inches`);
        send(ws, { action: 'ping', payload: inches }, logger);
      }
    });

    wheels.both = new Servos([wheels.left, wheels.right]);
  }

  stop() {
    this.hasStarted = false;

    const { head, wheels } = this.body;
    head.center();
    wheels.both?.stop();
  }

  moveHead(pos: number) {
    this.body.head.to(Math.round((pos + Number.EPSILON) * 10) / 10);
  }

  keyPress(keyMap: IKeyMap) {
    const { wheels } = this.body;

    if (keyMap) {
      switch (keyMap.key) {
        case 'w':
          wheels.both?.cw();
          break;
        case 'a':
          wheels.left.ccw();
          wheels.right.cw();
          break;
        case 's':
          wheels.both?.ccw();
          break;
        case 'd':
          wheels.left.cw();
          wheels.right.ccw();
          break;
        default:
          wheels.both?.stop();
      }
    } else {
      wheels.both?.stop();
    }
  }
}
