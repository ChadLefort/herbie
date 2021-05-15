/* eslint-disable no-case-declarations */

import { isOpen } from '@herbie/utils';

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
    if (this.ws && isOpen(this.ws)) {
      const request = { what: 'hangup' };
      this.ws.send(JSON.stringify(request));
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

            const request = {
              what: 'addIceCandidate',
              data: JSON.stringify(candidate)
            };

            this.ws?.send(JSON.stringify(request));
          }
        };

        this.pc.ontrack = (event) => onStream(event.streams[0]);

        const request = {
          what: 'call',
          options: {
            force_hw_vcodec: true,
            vformat: 30 /* 30=640x480, 30 fps */,
            trickle_ice: false
          }
        };

        this.ws?.send(JSON.stringify(request));
      };

      this.ws.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        const { what, data } = msg;

        switch (what) {
          case 'offer':
            const mediaConstraints: RTCOfferOptions = {
              offerToReceiveAudio: false,
              offerToReceiveVideo: true
            };

            try {
              await this.pc?.setRemoteDescription(new RTCSessionDescription(JSON.parse(data)));
              this.hasRemoteDesc = true;
              this.addIceCandidates();

              try {
                const sessionDescription = await this.pc?.createAnswer(mediaConstraints);

                if (sessionDescription) {
                  this.pc?.setLocalDescription(sessionDescription);
                  const request = {
                    what: 'answer',
                    data: JSON.stringify(sessionDescription)
                  };

                  this.ws?.send(JSON.stringify(request));
                }
              } catch (error) {
                if (onError) {
                  onError(`Failed to create answer: ${error}`);
                }
              }
            } catch (error) {
              if (onError) {
                onError(`Failed to set the remote description: ${event}`);
              }

              this.ws?.close();
            }
            break;
          case 'answer':
            break;
          case 'message':
            if (onMessage) {
              onMessage(msg.data);
            }
            break;
          case 'iceCandidate':
            if (!msg.data) {
              break;
            }

            const elt = JSON.parse(msg.data);
            const candidate = new RTCIceCandidate({
              sdpMLineIndex: elt.sdpMLineIndex,
              candidate: elt.candidate
            });

            this.iceCandidates.push(candidate);
            this.addIceCandidates();
            break;
          case 'iceCandidates':
            const candidates: RTCIceCandidate[] = JSON.parse(msg.data);

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

      this.ws.onerror = () => onError && onError('An error has occurred with the video feed');
    }
  }
}
