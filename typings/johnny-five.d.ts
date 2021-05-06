declare module 'johnny-five' {
  export interface AccelerometerOption {
    controller: string;
  }

  export interface AccelerometerGeneralOption {
    controller?: string;
  }

  export interface AccelerometerAnalogOption extends AccelerometerGeneralOption {
    pins: Array<string>;
    sensitivity?: number;
    aref?: number;
    zeroV?: number | Array<number>;
    autoCalibrate?: boolean;
  }

  export interface AccelerometerMPU6050Option extends AccelerometerGeneralOption {
    sensitivity?: number;
  }

  export interface AccelerometerMMA7361Option extends AccelerometerGeneralOption {
    sleepPin?: number | string;
  }

  export class Accelerometer {
    constructor(
      option:
        | AccelerometerGeneralOption
        | AccelerometerAnalogOption
        | AccelerometerMPU6050Option
        | AccelerometerMMA7361Option
    );

    id: string;
    zeroV: number;
    pins: Array<string>;
    readonly pitch: number;
    readonly roll: number;
    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly acceleration: number;
    readonly inclination: number;
    readonly orientation: number;

    on(event: string, cb: () => void): this;
    on(event: 'change', cb: () => void): this;
    on(event: 'data', cb: (freq: any) => void): this;
    hasAxis(name: string): void;
    enable(): void;
    disable(): void;
  }

  export interface AltimeterOption {
    controller: string;
    address?: number;
    freq?: number;
    elevation?: number;
  }

  export class Altimeter {
    constructor(option: AltimeterOption);

    id: string;
    readonly feet: number;
    readonly meters: number;

    on(event: string, cb: () => void): this;
    on(event: 'change', cb: () => void): this;
    on(event: 'data', cb: (data: any) => void): this;
  }

  export class Animation {
    constructor(option: Servo | Array<Servo>);

    target: number;
    duration: number;
    cuePoints: Array<number>;
    keyFrames: number;
    easing: string;
    loop: boolean;
    loopback: number;
    metronomic: boolean;
    progress: number;
    currentSpeed: number;
    fps: number;

    enqueue(segment: any): void;
    play(): void;
    pause(): void;
    stop(): void;
    next(): void;
    speed(speed: Array<number>): void;
  }

  export interface BoardOption {
    id?: number | string;
    port?: string | any;
    repl?: boolean;
    debug?: boolean;
    timeout?: number;
    io?: any;
  }

  export class Board {
    constructor(option?: BoardOption);

    io: any;
    id: string;
    repl: Repl;
    isReady: boolean;
    pins: Array<Pin>;
    port: string;

    on(event: string, cb: () => void): this;
    on(event: 'ready', cb: () => void): this;
    on(event: 'connect', cb: () => void): this;
    pinMode(pin: number | string, mode: number): void;
    analogWrite(pin: number | string, value: number): void;
    analogRead(pin: number | string, cb: (item: number) => void): void;
    digitalWrite(pin: number | string, value: number): void;
    digitalRead(pin: number | string, cb: (item: number) => void): void;
    servoWrite(pin: number | string, angle: number): void;
    shiftOut(dataPin: Pin, clockPin: Pin, isBigEndian: boolean, value: number): void;
    wait(ms: number, cb: () => void): void;
    loop(ms: number, cb: () => void): void;
    samplingInterval(ms: number): void;
  }

  export interface ButtonOption {
    pin: number | string;
    invert?: boolean;
    isPullup?: boolean;
    isPulldown?: boolean;
    holdtime?: number;
  }

  export class Button {
    constructor(pin: number | string | ButtonOption);

    id: string;
    pin: number | string;
    downValue: number;
    upValue: number;
    holdtime: number;

    on(event: string, cb: () => void): this;
    on(event: 'hold', cb: (holdTime: number) => void): this;
    on(event: 'down', cb: () => void): this;
    on(event: 'press', cb: () => void): this;
    on(event: 'up', cb: () => void): this;
    on(event: 'release', cb: () => void): this;
  }

  export interface CollectionPinOptions {
    pins: Array<string | number>;
    [key: string]: any;
  }

  export class Collection<Base = {}> {
    static installMethodForwarding(target: object, source: object): object;

    constructor(options: Array<number | string | object> | CollectionPinOptions);

    type?: Base;

    add(...args: Array<number | object>): number;

    each(callback: (item: Base, index: number) => void): this;

    forEach(callback: (item: Base, index: number) => void): this;

    includes(item: Base): boolean;

    indexOf(item: Base): number;

    map(callback: (item: Base, index: number) => void): Array<any>;

    slice(begin?: number, end?: number): Collection<Base>;

    byId(id: any): Base | undefined;
  }

  export interface CompassOption {
    controller: string;
    gauss?: number;
  }

  export class Compass {
    constructor(option: CompassOption);

    readonly heading: number;
    readonly bearing: { name: string; abbr: string; low: number; high: number; heading: number };

    on(event: string, cb: () => void): this;
    on(event: 'change', cb: () => void): this;
    on(event: 'data', cb: (data: any) => void): this;
  }

  export interface ESCOption {
    pin: number | string;
    pwmRange?: Array<number>;
    address?: string;
    controller?: 'PCA9685' | 'DEFAULT';
    device?: 'FORWARD' | 'FORWARD_REVERSE' | 'FORWARD_REVERSE_BRAKE';
    neutral?: number;
  }

  export class ESC {
    static Collection: ESCs;

    constructor(option: number | string | ESCOption);

    id: string;
    pin: number | string;
    pwmRange: Array<number>;
    readonly value: number;

    throttle(value: number): this;
    brake(): this;
  }

  export class ESCs extends Collection<ESC> {
    constructor(option: Array<number | string | ESCOption>);

    throttle(value: number): this;
    brake(): this;
  }

  export class Fn {
    static constrain(value: number, lower: number, upper: number): number;
    static inRange(value: number, lower: number, upper: number): boolean;
    static map(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number;
    static fmap(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number;
    static range(lower: number, upper: number, tick: number): Array<number>;
    static scale(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number;
    static fscale(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number;
    static sum(values: Array<number>): number;
    static toFixed(number: number, digits: number): number;
    static uid(): string;
    static bitSize(n: number): number;
    static bitValue(bit: number): number;
    static int16(msb: number, lsb: number): number;
    static uint16(msb: number, lsb: number): number;
    static int24(b16: number, b8: number, b0: number): number;
    static uint24(b16: number, b8: number, b0: number): number;
    static int32(b24: number, b16: number, b8: number, b0: number): number;
    static uint32(b24: number, b16: number, b8: number, b0: number): number;
  }

  export interface GyroGeneralOption {
    controller?: string;
  }

  export interface GyroAnalogOption extends GyroGeneralOption {
    pins: Array<string>;
    sensitivity: number;
    resolution?: number;
  }

  export interface GyroMPU6050Option extends GyroGeneralOption {
    sensitivity: number;
  }

  export class Gyro {
    constructor(option: GyroGeneralOption | GyroAnalogOption | GyroMPU6050Option);

    id: string;
    pins: Array<string>;
    readonly isCalibrated: boolean;
    readonly pitch: any;
    readonly roll: any;
    readonly yaw: any;
    readonly rate: any;
    readonly x: number;
    readonly y: number;
    readonly z: number;

    on(event: string, cb: () => void): this;
    on(event: 'change', cb: () => void): this;
    on(event: 'data', cb: (data: any) => void): this;
    recalibrate(): void;
  }

  export interface HygrometerOption {
    controller?: string;
    freq?: number;
  }

  export class Hygrometer {
    constructor(option: HygrometerOption);

    id: string;
    readonly relativeHumidity: number;
    readonly RH: number;

    on(event: string, cb: () => void): this;
    on(event: 'change', cb: () => void): this;
    on(event: 'data', cb: (data: any) => void): this;
  }

  export interface IMUGeneralOption {
    controller?: string;
    freq?: number;
  }

  export interface IMUMPU6050Option extends IMUGeneralOption {
    address: number;
  }

  export class IMU {
    constructor(option: IMUGeneralOption | IMUMPU6050Option);

    readonly accelerometer: Accelerometer;
    readonly compass: Compass;
    readonly gyro: Gyro;
    readonly orientation: Orientiation;
    readonly thermometer: Thermometer;

    on(event: string, cb: () => void): this;
    on(event: 'change', cb: () => void): this;
    on(event: 'data', cb: (data: any) => void): this;
    on(event: 'calibrated', cb: () => void): this;
  }

  export module IR {
    export interface ArrayOption {
      pins: Array<number> | Array<string>;
      emitter: number | string;
      freq?: number;
    }

    export interface LoadCalibrationOption {
      min: Array<number>;
      max: Array<number>;
    }

    export module Reflect {
      export class Array {
        constructor(option: ArrayOption);
        enable(): void;
        disable(): void;
        calibrate(): void;
        calibrateUntil(predicate: () => void): void;
        loadCalibration(option: LoadCalibrationOption): void;
        on(event: string, cb: () => void): this;
        on(event: 'data', cb: (data: any) => void): this;
        on(event: 'calibratedData', cb: (data: any) => void): this;
        on(event: 'line', cb: (data: any) => void): this;
      }
    }
  }

  export interface JoystickOption {
    pins: Array<string>;
    invert?: boolean;
    invertX?: boolean;
    invertY?: boolean;
  }

  export class Joystick {
    constructor(option: JoystickOption);

    id: string;
    readonly x: number;
    readonly y: number;
    axis: Array<number>;
    raw: Array<number>;

    on(event: string, cb: () => void): this;
    on(event: 'data', cb: (data: any) => void): this;
    on(event: 'change', cb: () => void): this;
    on(event: 'axismove', cb: (error: Error, date: Date) => void): this;
  }

  export interface LCDGeneralOption {
    rows?: number;
    cols?: number;
  }

  export interface LCDI2COption extends LCDGeneralOption {
    controller: string;
    backlight?: number;
  }

  export interface LCDParallelOption extends LCDGeneralOption {
    pins: Array<any>;
    backlight?: number;
  }

  export class LCD {
    constructor(option: LCDGeneralOption | LCDI2COption | LCDParallelOption);

    id: string;
    rows: number;
    cols: number;

    print(message: string): this;
    useChar(char: string): this;
    clear(): this;
    cursor(row: number, col: number): this;
    home(): this;
    on(): this;
    off(): this;
    display(): this;
    noDisplay(): this;
    blink(): this;
    noBlink(): this;
    autoscroll(): this;
    noAutoscroll(): this;
    bgColor(color: any): this;
    noBacklight(): this;
    backlight(): this;
  }

  export interface LedOption {
    pin: number;
    type?: string;
    controller?: string;
    address?: number;
    isAnode?: boolean;
  }

  export class Led {
    constructor(option: number | LedOption);

    id: string;
    pin: number;

    on(): void;
    off(): void;
    toggle(): void;
    strobe(ms: number): void;
    blink(): void;
    blink(ms: number): void;
    brightness(val: number): void;
    fade(brightness: number, ms: number): void;
    fadeIn(ms: number): void;
    fadeOut(ms: number): void;
    pulse(ms: number): void;
    stop(ms: number): void;
  }

  export module Led {
    export interface DigitsOption {
      pins: any;
      devices?: number;
      controller?: string;
    }

    export class Digits {
      constructor(option: DigitsOption);

      readonly isMatrix: boolean;
      readonly devices: number;
      digitOrder: number;

      on(): void;
      on(index: number): void;
      off(): void;
      off(index: number): void;
      clear(): void;
      clear(index: number): void;
      brightness(value: number): void;
      brightness(index: number, value: number): void;
      draw(position: number, character: number): void;
      draw(index: number, position: number, character: number): void;
    }

    export interface MatrixOption {
      pins: any;
      devices?: number;
    }

    export interface MatrixIC2Option {
      controller: string;
      addresses?: Array<any>;
      isBicolor?: boolean;
      dims?: any;
      rotation?: number;
    }

    export class Matrix {
      constructor(option: MatrixOption | MatrixIC2Option);

      readonly isMatrix: boolean;
      readonly devices: number;

      on(): void;
      on(index: number): void;
      off(): void;
      off(index: number): void;
      clear(): void;
      clear(index: number): void;
      brightness(value: number): void;
      brightness(index: number, value: number): void;
      led(row: number, col: number, state: any): void;
      led(index: number, row: number, col: number, state: any): void;
      row(row: number, val: number): void;
      row(index: number, row: number, val: number): void;
      column(row: number, val: number): void;
      column(index: number, row: number, val: number): void;
      draw(position: number, character: number): void;
      draw(index: number, position: number, character: number): void;
    }

    export interface RGBOption {
      pins: Array<number>;
      isAnode?: boolean;
      controller?: string;
    }

    export class RGB {
      constructor(option: RGBOption);

      red: Led;
      green: Led;
      blue: Led;
      readonly isAnode: boolean;

      on(): void;
      off(): void;
      color(value: string): void;
      toggle(): void;
      strobe(ms: number): void;
      intensity(value: number): void;
      fadeIn(ms: number): void;
      fadeOut(ms: number): void;
      pulse(ms: number): void;
      stop(ms: number): void;
    }
  }

  export interface MotionOption {
    pin: number | string;
  }

  export class Motion {
    constructor(option: number | MotionOption);
    on(event: string, cb: () => void): this;
    on(event: 'data', cb: (data: any) => void): this;
    on(event: 'motionstart', cb: () => void): this;
    on(event: 'motionend', cb: () => void): this;
    on(event: 'calibrated', cb: () => void): this;
  }

  export interface MotorPins {
    pwm: number;
    dir: number;
    cdir?: number;
    brake?: number;
  }

  export interface MotorOption {
    pins: MotorPins;
    current?: SensorOption;
    invertPWM?: boolean;
    address?: number;
    controller?: string;
    register?: any;
    bits?: any;
  }

  export class Motor {
    constructor(option: number[] | MotorOption);

    readonly isOn: boolean;

    forward(speed: number): void;
    fwd(speed: number): void;
    reverse(speed: number): void;
    rev(speed: number): void;
    start(speed?: number): void;
    stop(): void;
    brake(): void;
    release(): void;
  }

  export class Motors {
    constructor(option: number[] | MotorOption[]);

    readonly isOn: boolean;

    forward(speed: number): void;
    fwd(speed: number): void;
    reverse(speed: number): void;
    rev(speed: number): void;
    start(speed?: number): void;
    stop(): void;
    brake(): void;
    release(): void;
  }

  export interface OrientiationOption {
    controller?: string;
    freq?: number;
  }

  export class Orientiation {
    constructor(option: OrientiationOption);

    readonly euler: any;
    readonly quarternion: any;

    on(event: string, cb: () => void): this;
    on(event: 'change', cb: () => void): this;
    on(event: 'data', cb: (data: any) => void): this;
    on(event: 'calibrated', cb: () => void): this;
  }

  export interface PiezoOption {
    pin: number;
  }

  export class Piezo {
    constructor(option: number | PiezoOption);

    id: string;
    pin: number;
    readonly mode: number;
    readonly isPlaying: boolean;

    frequency(frequency: number, duration: number): void;
    play(tune: any, cb?: () => void): void;
    tone(frequency: number, duration: number): void;
    noTone(): void;
    off(): void;
  }

  export interface PinOption {
    id?: number | string;
    pin: number | string;
    type?: string;
  }

  export interface PinState {
    supportedModes: Array<number>;
    mode: number;
    value: number;
    report: number;
    analogChannel: number;
  }

  export class Pin {
    constructor(option: number | string | PinOption);

    id: number | string;
    pin: number | string;
    type: 'digital' | 'analog';
    value: number;
    mode: number;

    static write(pin: number, value: number): void;
    static read(pin: number, cb: (error: Error, data: number) => void): void;
    query(cb: (pin: PinState) => void): void;
    high(): void;
    low(): void;
    write(value: number): void;
    read(cb: (error: Error, value: number) => void): void;
    on(event: string, cb: () => void): this;
    on(event: 'high', cb: () => void): this;
    on(event: 'low', cb: () => void): this;
    on(event: 'data', cb: (data: any) => void): this;
  }

  export interface PingOption {
    pin: number | string;
    freq?: number;
    pulse?: number;
  }

  export class Ping {
    constructor(option: number | PingOption);
  }

  export interface ProximityOption {
    pin?: number | string;
    controller: string;
    freq?: number;
  }

  export interface ProximityData {
    centimeters: number;
    inches: number;
  }

  export class Proximity {
    constructor(option: number | ProximityOption);
    on(event: string, cb: () => void): this;
    on(event: 'data', cb: (data: ProximityData) => void): this;
    on(event: 'change', cb: () => void): this;

    centimeters: number;
    inches: number;
  }

  export interface RelayOption {
    pin: number | string;
    type?: string;
  }

  export class Relay {
    constructor(option: number | RelayOption);

    id: string;
    pin: number | string;
    readonly isOn: boolean;
    readonly type: string;

    open(): void;
    close(): void;
    toggle(): void;
  }

  export interface Repl {
    inject(object: any): void;
  }

  export interface SensorOption {
    pin: number | string;
    freq?: boolean;
    threshold?: number;
    enabled?: boolean;
  }

  export class Sensor {
    constructor(option: number | string | SensorOption);

    id: string;
    pin: number | string;
    threshold: number;
    readonly boolean: boolean;
    readonly raw: number;
    readonly analog: number;
    readonly constrained: number;
    readonly value: number;

    scaleTo(low: number, high: number): number;
    fscaleTo(low: number, high: number): number;
    scaleTo(range: Array<number>): number;
    fscaleTo(range: Array<number>): number;
    booleanAt(barrier: number): boolean;
    within(range: Array<number>, cb: () => void): void;
    on(event: string, cb: () => void): this;
    on(event: 'change', cb: () => void): this;
    on(event: 'data', cb: (data: any) => void): this;
  }

  export interface ServoGeneralOption {
    pin: number | string;
    range?: Array<number>;
    type?: string;
    startAt?: number;
    invert?: boolean;
    center?: boolean;
    controller?: string;
    deadband?: Array<number>;
  }

  export interface ServoPCA9685Option extends ServoGeneralOption {
    address?: number;
  }

  export interface ServoSweepOpts {
    range: Array<number>;
    interval?: number;
    step?: number;
  }

  export class Servo {
    constructor(option: number | string | ServoGeneralOption);

    id: string;
    pin: number | string;
    range: Array<number>;
    invert: boolean;
    history: Array<any>;
    interval: number;
    isMoving: boolean;
    readonly last: any;
    readonly position: number;
    value: number;
    startAt: number;

    to(degrees: number, ms?: number, rage?: number): void;
    min(): void;
    max(): void;
    center(): void;
    home(): void;
    sweep(): void;
    sweep(range: Array<number>): void;
    sweep(opt: ServoSweepOpts): void;
    stop(): void;
    cw(speed?: number): void;
    ccw(speed?: number): void;
    on(event: string, cb: () => void): this;
    on(event: 'move:complete', cb: () => void): this;
  }

  export class Servos {
    constructor(option: Servo[]);

    id: string;
    pin: number | string;
    range: Array<number>;
    invert: boolean;
    history: Array<any>;
    interval: number;
    isMoving: boolean;
    readonly last: any;
    readonly position: number;
    value: number;
    startAt: number;

    to(degrees: number, ms?: number, rage?: number): void;
    min(): void;
    max(): void;
    center(): void;
    home(): void;
    sweep(): void;
    sweep(range: Array<number>): void;
    sweep(opt: ServoSweepOpts): void;
    stop(): void;
    cw(speed?: number): void;
    ccw(speed?: number): void;
    on(event: string, cb: () => void): this;
    on(event: 'move:complete', cb: () => void): this;
  }

  export interface ShiftRegisterOption {
    pins: any;
    isAnode?: boolean;
  }

  export class ShiftRegister {
    constructor(option: ShiftRegisterOption);

    id: string;
    pins: any;
    readonly value: any;
    readonly isAnode: boolean;

    clear(): void;
    display(number: number | string): void;
    reset(): void;
    send(...value: Array<number>): void;
  }

  export interface SonarOption {
    pin: number | string;
    device: string;
    freq?: number;
    threshold?: number;
  }

  export class Sonar {
    constructor(option: number | string | SonarOption);

    within(range: Array<number>, cb: () => void): void;
    within(range: Array<number>, unit: string, cb: () => void): void;
    on(event: string, cb: () => void): this;
    on(event: 'change', cb: () => void): this;
    on(event: 'data', cb: (data: any) => void): this;
  }

  export interface StepperOption {
    pins: any;
    stepsPerRev: number;
    type: number;
    rpm?: number;
    direction?: number;
  }

  export module Stepper {
    export class TYPE {
      static DRIVER: number;
      static TWO_WIRE: number;
      static FOUR_WIRE: number;
    }
  }

  export class Stepper {
    constructor(option: number | string | StepperOption);

    step(stepsOrOpts: any, cb: () => void): void;
    rpm(): Stepper;
    rpm(value: number): Stepper;
    speed(): Stepper;
    speed(value: number): Stepper;
    direction(): Stepper;
    direction(value: number): Stepper;
    accel(): Stepper;
    accel(value: number): Stepper;
    decel(): Stepper;
    decel(value: number): Stepper;
    cw(): Stepper;
    ccw(): Stepper;
    within(range: Array<number>, cb: () => void): void;
    within(range: Array<number>, unit: string, cb: () => void): void;
    on(event: string, cb: () => void): this;
    on(event: 'change', cb: () => void): this;
    on(event: 'data', cb: (data: any) => void): this;
  }

  export interface SwitchOption {
    pin: number | string;
    type?: 'NO' | 'NC';
  }

  export class Switch {
    constructor(option: number | string | SwitchOption);

    id: string;
    pin: number | string;
    readonly isClosed: boolean;
    readonly isOpen: boolean;

    on(event: 'open', cb: () => void): this;
    on(event: 'close', cb: () => void): this;
  }

  export interface ThermometerOption {
    controller?: string;
    pin: string | number;
    toCelsius?: (val: number) => number;
    freq?: number;
  }

  export class Thermometer {
    constructor(option: ThermometerOption);

    id: string;
    pin: number | string;
    readonly celsius: number;
    readonly fahrenheit: number;
    readonly kelvin: number;
    readonly C: number;
    readonly F: number;
    readonly K: number;

    on(event: string, cb: () => void): this;
    on(event: 'data', cb: (data: any) => void): this;
    on(event: 'change', cb: () => void): this;
  }
}
