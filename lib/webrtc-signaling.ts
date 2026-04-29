import { db } from "./firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  addDoc, 
  getDoc, 
  updateDoc 
} from "firebase/firestore";

const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

export class WebRTCSignaling {
  pc: RTCPeerConnection;
  localStream: MediaStream | null = null;
  remoteStream: MediaStream | null = null;
  callId: string;

  constructor(callId: string) {
    this.pc = new RTCPeerConnection(servers);
    this.callId = callId;
  }

  async setupLocalStream() {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    this.remoteStream = new MediaStream();

    this.localStream.getTracks().forEach((track) => {
      if (this.localStream) this.pc.addTrack(track, this.localStream);
    });

    this.pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        if (this.remoteStream) this.remoteStream.addTrack(track);
      });
    };

    return { local: this.localStream, remote: this.remoteStream };
  }

  async createCall() {
    const callDoc = doc(db, "calls", this.callId);
    const offerCandidates = collection(callDoc, "offerCandidates");
    const answerCandidates = collection(callDoc, "answerCandidates");

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(offerCandidates, event.candidate.toJSON());
      }
    };

    const offerDescription = await this.pc.createOffer();
    await this.pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await setDoc(callDoc, { offer });

    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!this.pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        this.pc.setRemoteDescription(answerDescription);
      }
    });

    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          this.pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  }

  async joinCall() {
    const callDoc = doc(db, "calls", this.callId);
    const answerCandidates = collection(callDoc, "answerCandidates");
    const offerCandidates = collection(callDoc, "offerCandidates");

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(answerCandidates, event.candidate.toJSON());
      }
    };

    const callData = (await getDoc(callDoc)).data();
    if (!callData) throw new Error("Call not found");

    const offerDescription = callData.offer;
    await this.pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await updateDoc(callDoc, { answer });

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          this.pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  }

  cleanup() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    this.pc.close();
  }
}
