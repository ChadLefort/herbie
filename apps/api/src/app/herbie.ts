import { Board, Servo, Servos } from 'johnny-five';
import { RaspiIO as Raspi } from 'raspi-io';
import { Sonar } from 'raspi-sonar';
import ws from 'ws';

import { logger } from './logger';

const controller = 'PCA9685';

export interface IInformation {
  name: string;
  nickname?: string;
  age: number;
  version: string;
}

interface IBody {
  eyes: Sonar;
  head: Servo;
  wheels: IWheels;
}

interface IWheels {
  left: Servo;
  right: Servo;
  both?: Servos;
}

export interface IKeyMap {
  key: string;
  value: boolean;
}

export class Herbie {
  private hasStarted = false;

  board = new Board({
    io: new Raspi(),
    repl: false
  });

  body: IBody = {
    eyes: new Sonar(1),
    head: new Servo({
      controller,
      pin: 0,
      invert: true
    }),
    wheels: {
      left: new Servo({
        controller,
        pin: 1,
        type: 'continuous'
      }),
      right: new Servo({
        controller,
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

    setInterval(() => {
      if (this.hasStarted) {
        eyes.read((duration) => {
          const distance = ((343.0 * duration) / 10000) * 0.5;
          const inches = Math.round(distance * 0.3937 * 100 + Number.EPSILON) / 100;
          logger.info(`PING))): ${inches} inches`);
          ws.send(JSON.stringify({ action: 'ping', payload: inches }));
        });
      }
    }, 1500);

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
