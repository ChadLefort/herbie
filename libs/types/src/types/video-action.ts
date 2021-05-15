export enum What {
  answer = 'answer',
  hangup = 'hangup',
  addIceCandidate = 'addIceCandidate',
  call = 'call',
  offer = 'offer',
  message = 'message',
  iceCandidate = 'iceCandidate',
  iceCandidates = 'iceCandidates'
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
