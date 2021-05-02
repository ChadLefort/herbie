declare module 'raspi-sonar' {
    import { Peripheral } from 'raspi-peripheral';
  
    export class Sonar extends Peripheral {
      read(callback: (duration: number) => void): void;
    }
  }
  