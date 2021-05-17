import { What } from '../enums/what';

export type VideoAction = {
  what: What;
  options?: {
    force_hw_vcodec: boolean;
    vformat: number;
    trickle_ice: boolean;
  };
  data?: string;
};
