import { useRef, useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const useCall = () => {
  const { socket } = useAuthStore();

  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const ringtoneRef = useRef(null);

  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callType, setCallType] = useState("video");

  const [callStatus, setCallStatus] = useState("idle"); // idle | ringing | connecting | connected
  const [callStartTime, setCallStartTime] = useState(null);

  // 🔥 create peer
  const createPeer = (targetUserId) => {
    const peer = new RTCPeerConnection();
    peerRef.current = peer;

    peer.ontrack = (event) => {
      remoteStreamRef.current = event.streams[0];
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: targetUserId,
          candidate: event.candidate,
        });
      }
    };

    return peer;
  };

  // 🔥 START CALL
  const startCall = async (userId, type = "video") => {
    try {
      if (isCalling) {
        alert("Call already running ⚠️");
        return;
      }

      setCallType(type);
      setCallStatus("connecting");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === "video",
        audio: true,
      });

      localStreamRef.current = stream;
      setIsCalling(true);

      const peer = createPeer(userId);

      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.emit("call-user", {
        to: userId,
        offer,
        type,
      });

    } catch (error) {
      console.error("❌ Call error:", error);
      alert(error.message);
    }
  };

  // ✅ ACCEPT CALL
  const acceptCall = async () => {
    if (!incomingCall) return;

    const { from, offer } = incomingCall;

    ringtoneRef.current?.pause();
    setCallStatus("connecting");

    const stream = await navigator.mediaDevices.getUserMedia({
      video: callType === "video",
      audio: true,
    });

    localStreamRef.current = stream;
    setIsCalling(true);
    setIncomingCall(null);

    const peer = createPeer(from);

    stream.getTracks().forEach((track) => {
      peer.addTrack(track, stream);
    });

    await peer.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("answer-call", {
      to: from,
      answer,
    });
  };

  // ❌ REJECT CALL
  const rejectCall = () => {
    ringtoneRef.current?.pause();
    setIncomingCall(null);
    setCallStatus("idle");
  };

  // 🔥 SOCKET EVENTS
  useEffect(() => {
    if (!socket) return;

    // 📲 incoming call
    socket.on("incoming-call", ({ from, offer, type }) => {
      setIncomingCall({ from, offer });
      setCallType(type || "video");
      setCallStatus("ringing");

      const audio = new Audio("/ringtone.mp3");
      audio.loop = true;
      audio.play().catch(() => {});
      ringtoneRef.current = audio;
    });

    // ✅ call accepted
    socket.on("call-accepted", async ({ answer }) => {
      await peerRef.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );

      setCallStatus("connected");
      setCallStartTime(Date.now());
    });

    // ICE receive
    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await peerRef.current?.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (err) {
        console.error("ICE error:", err);
      }
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("ice-candidate");
    };
  }, [socket, callType]);

  // 🔥 END CALL
  const endCall = () => {
    ringtoneRef.current?.pause();

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

    remoteStreamRef.current = null;

    setIsCalling(false);
    setIncomingCall(null);
    setCallStatus("idle");
    setCallStartTime(null);
  };

  return {
    startCall,
    endCall,
    acceptCall,
    rejectCall,
    incomingCall,
    localStreamRef,
    remoteStreamRef,
    isCalling,
    callType,
    callStatus,
    callStartTime,
  };
};

export default useCall;