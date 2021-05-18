declare namespace NodeJS {
  export interface ProcessEnv {
    NX_DOMAIN: string;
    NX_API_PORT: number;
    NX_VIDEO_PORT: number;
    NX_GAMEPAD_DEBUG: boolean;
  }
}
