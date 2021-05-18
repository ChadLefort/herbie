import { Message, What } from '@herbie/types';
import { send } from '@herbie/utils';

export class Signal {
  ws: WebSocket | null = null;
  pc: RTCPeerConnection | null = null;
  iceCandidates: RTCIceCandidate[] = [];
  hasRemoteDesc = false;

  constructor(
    url: string,
    onStream: (stream: MediaStream) => void,
    onClose: () => void,
    onError?: (error: string) => void,
    onMessage?: (message: string) => void
  ) {
    this.ws = new WebSocket(url);
    this.handleSocketEvents(onStream, onClose, onError, onMessage);
  }

  hangup = () => {
    if (this.ws) {
      send(this.ws, { what: What.Hangup });
    }
  };

  addIceCandidates() {
    if (this.hasRemoteDesc) {
      this.iceCandidates.forEach((candidate) => this.pc?.addIceCandidate(candidate));
      this.iceCandidates = [];
    }
  }

  handleSocketEvents(
    onStream: (stream: MediaStream) => void,
    onClose: () => void,
    onError?: (error: string) => void,
    onMessage?: (message: string) => void
  ) {
    if (this.ws) {
      this.ws.onopen = () => {
        const config = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };

        this.pc = new RTCPeerConnection(config);
        this.iceCandidates = [];
        this.hasRemoteDesc = false;

        this.pc.onicecandidate = (event) => {
          if (event.candidate) {
            const candidate = {
              sdpMLineIndex: event.candidate.sdpMLineIndex,
              sdpMid: event.candidate.sdpMid,
              candidate: event.candidate.candidate
            };

            this.ws &&
              send(this.ws, {
                what: What.AddIceCandidate,
                data: JSON.stringify(candidate)
              });
          }
        };

        this.pc.ontrack = (event) => onStream(event.streams[0]);

        this.ws &&
          send(this.ws, {
            what: What.Call,
            options: {
              force_hw_vcodec: true,
              vformat: 30 /* 30=640x480, 30 fps */,
              trickle_ice: false
            }
          });
      };

      this.ws.onmessage = async (event) => {
        const msg: { what: What; data: any } = JSON.parse(event.data);
        const { what, data } = msg;

        switch (what) {
          case What.Offer: {
            try {
              await this.pc?.setRemoteDescription(new RTCSessionDescription(JSON.parse(data)));
              this.hasRemoteDesc = true;
              this.addIceCandidates();

              try {
                const sessionDescription = await this.pc?.createAnswer({
                  offerToReceiveAudio: false,
                  offerToReceiveVideo: true
                });

                if (sessionDescription) {
                  this.pc?.setLocalDescription(sessionDescription);

                  this.ws &&
                    send(this.ws, {
                      what: What.Answer,
                      data: JSON.stringify(sessionDescription)
                    });
                }
              } catch (error) {
                onError && onError(Message.ErrorVideoAnswer);
              }
            } catch (error) {
              onError && onError(Message.ErrorVideoRemote);
              this.ws?.close();
            }
            break;
          }
          case What.Answer: {
            break;
          }
          case What.Message: {
            if (onMessage) {
              onMessage(msg.data);
            }
            break;
          }
          case What.IceCandidate: {
            if (!msg.data) {
              break;
            }

            const elt: RTCIceCandidateInit = JSON.parse(data);

            this.iceCandidates.push(
              new RTCIceCandidate({
                sdpMLineIndex: elt.sdpMLineIndex,
                candidate: elt.candidate
              })
            );
            this.addIceCandidates();
            break;
          }
          case What.IceCandidates: {
            const candidates: RTCIceCandidate[] = JSON.parse(data);

            candidates.forEach((elt) => {
              const candidate = new RTCIceCandidate({
                sdpMLineIndex: elt.sdpMLineIndex,
                candidate: elt.candidate
              });

              this.iceCandidates.push(candidate);
            });

            this.addIceCandidates();
            break;
          }
        }
      };

      this.ws.onclose = () => {
        if (this.pc) {
          this.pc.close();
          this.pc = null;
          this.ws = null;
        }

        if (onClose) {
          onClose();
        }
      };

      this.ws.onerror = () => onError && onError(Message.ErrorVideo);
    }
  }
}
