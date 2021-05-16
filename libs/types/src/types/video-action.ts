export enum What {
  Answer = 'answer',
  Hangup = 'hangup',
  AddIceCandidate = 'addIceCandidate',
  Call = 'call',
  Offer = 'offer',
  Message = 'message',
  IceCandidate = 'iceCandidate',
  IceCandidates = 'iceCandidates'
}

export type VideoAction = {
  what: What;
  options?: {
    force_hw_vcodec: boolean;
    vformat: number;
    trickle_ice: boolean;
  };
  data?: string;
};
