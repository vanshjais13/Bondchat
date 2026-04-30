import { useEffect, useRef, useState } from "react";
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  RefreshCw,
} from "lucide-react";

const CallScreen = ({
  localStreamRef,
  remoteStreamRef,
  endCall,
  callType,
  callStatus,
  callStartTime,
  user,
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [duration, setDuration] = useState("00:00");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [facingMode, setFacingMode] = useState("user");

  // 🎥 attach streams
  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [localStreamRef.current]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStreamRef?.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, [remoteStreamRef?.current]);

  // ⏱ TIMER
  useEffect(() => {
    if (!callStartTime) return;

    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - callStartTime) / 1000);
      const min = String(Math.floor(diff / 60)).padStart(2, "0");
      const sec = String(diff % 60).padStart(2, "0");
      setDuration(`${min}:${sec}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [callStartTime]);

  // 🎤 toggle
  const toggleMute = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    }
  };

  // 📷 toggle
  const toggleCamera = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsCameraOff(!track.enabled);
    }
  };

  // 🔊 SPEAKER TOGGLE (limited support)
  const toggleSpeaker = async () => {
    const el = remoteVideoRef.current;
    if (!el) return;

    try {
      await el.setSinkId(isSpeakerOn ? "default" : "communications");
      setIsSpeakerOn(!isSpeakerOn);
    } catch (err) {
      console.log("Speaker not supported", err);
    }
  };

  // 🔄 SWITCH CAMERA (mobile)
  const switchCamera = async () => {
    try {
      const newMode = facingMode === "user" ? "environment" : "user";
      setFacingMode(newMode);

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newMode },
        audio: true,
      });

      const newVideoTrack = newStream.getVideoTracks()[0];

      // replace track in local stream
      const oldTrack = localStreamRef.current.getVideoTracks()[0];
      if (oldTrack) oldTrack.stop();

      localStreamRef.current.removeTrack(oldTrack);
      localStreamRef.current.addTrack(newVideoTrack);

      // update video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }

    } catch (err) {
      console.log("Camera switch error", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center text-white">

      {/* 🎥 Remote */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* 👤 Top Info */}
      <div className="absolute top-10 text-center">
        <img
          src={user?.profilePic || "/avatar.png"}
          className="w-20 h-20 rounded-full mx-auto mb-2 border-2"
        />
        <h2 className="text-xl font-semibold">{user?.fullName}</h2>

        <p className="text-sm opacity-80">
          {callStatus === "ringing" && "Ringing..."}
          {callStatus === "connecting" && "Connecting..."}
          {callStatus === "connected" && duration}
        </p>
      </div>

      {/* 👤 Local */}
      {callType === "video" && (
        <video
          ref={localVideoRef}
          autoPlay
          muted
          className="absolute top-4 right-4 w-32 h-44 rounded-lg border"
        />
      )}

      {/* 🎮 Controls */}
      <div className="absolute bottom-10 flex gap-5">

        {/* 🎤 */}
        <button onClick={toggleMute} className="bg-gray-700 p-4 rounded-full">
          {isMuted ? <MicOff /> : <Mic />}
        </button>

        {/* 📷 */}
        {callType === "video" && (
          <button onClick={toggleCamera} className="bg-gray-700 p-4 rounded-full">
            {isCameraOff ? <VideoOff /> : <Video />}
          </button>
        )}

        {/* 🔄 */}
        {callType === "video" && (
          <button onClick={switchCamera} className="bg-gray-700 p-4 rounded-full">
            <RefreshCw />
          </button>
        )}

        {/* 🔊 */}
        <button onClick={toggleSpeaker} className="bg-gray-700 p-4 rounded-full">
          {isSpeakerOn ? <Volume2 /> : <VolumeX />}
        </button>

        {/* ❌ */}
        <button onClick={endCall} className="bg-red-600 p-5 rounded-full">
          <PhoneOff />
        </button>

      </div>
    </div>
  );
};

export default CallScreen;