declare module 'raspi-io' {
  export interface IOptions {
    includePins?: Array<number | string>;
    excludePins?: Array<number | string>;
    enableSerial?: boolean;
    enableI2C?: boolean;
  }

  export class RaspiIO {
    constructor({ includePins, excludePins, enableSerial, enableI2C }?: IOptions);
  }
}
