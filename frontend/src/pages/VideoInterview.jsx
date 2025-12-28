import React, { useEffect, useRef, useState, useContext } from 'react';
import { Copy, Phone, PhoneOff, Mic, MicOff, Video, VideoOff, User } from 'lucide-react';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { AppContext } from '../context/AppContext';

const VideoInterview = () => {
    const { backendUrl } = useContext(AppContext);
    const [me, setMe] = useState("");
    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [idToCall, setIdToCall] = useState("");
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");
    
    // Media controls
    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const socketRef = useRef();

    useEffect(() => {
        // Initialize socket
        try {
            // If deployed on same origin (Render/Heroku monorepo), io() works automatically.
            // If local development with proxy, it also works.
            socketRef.current = io("/", {
                path: "/socket.io", // Ensure default path is used
                transports: ["websocket", "polling"]
            });
        } catch (err) {
            toast.error("Connection failed");
            return;
        }

        const socket = socketRef.current;

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }
            })
            .catch((err) => {
                toast.error("Failed to access camera/microphone: " + err.message);
            });

        socket.on("me", (id) => {
            setMe(id);
        });

        socket.on("callUser", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setName(data.name);
            setCallerSignal(data.signal);
            toast("Incoming Video Call!", { icon: "📞" });
        });
        
        socket.on("callAccepted", (signal) => {
            setCallAccepted(true);
            // We need to handle this differently now that peer is local to callUser
            // But wait, callAccepted is for the caller.
            // The peer instance needs to be accessible here.
            // We'll store peer in connectionRef.
            if (connectionRef.current) {
                connectionRef.current.signal(signal);
            }
        });

        // Clean up on unmount
        return () => {
           socket.disconnect();
           // Optional: stop stream tracks
           // stream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    const callUser = (id) => {
        if (!id) return toast.error("Please enter an ID to call");
        
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        });

        peer.on("signal", (data) => {
            socketRef.current.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name || "User"
            });
        });

        peer.on("stream", (currentStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
        });

        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        });

        peer.on("signal", (data) => {
            socketRef.current.emit("answerCall", { signal: data, to: caller });
        });

        peer.on("stream", (currentStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        if (connectionRef.current) {
            connectionRef.current.destroy();
        }
        window.location.reload(); // Simple reload to reset state
    };

    const toggleMic = () => {
        setMicOn(!micOn);
        if (stream) {
            stream.getAudioTracks()[0].enabled = !micOn;
        }
    };

    const toggleVideo = () => {
        setVideoOn(!videoOn);
        if (stream) {
            stream.getVideoTracks()[0].enabled = !videoOn;
        }
    };

    const copyId = () => {
        navigator.clipboard.writeText(me);
        toast.success("ID Copied to Clipboard");
    };

    return (
        <div className="min-h-screen bg-gray-50/30 p-6 pt-24">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
                        <Video className="w-8 h-8 text-indigo-600" />
                        Video Interview Room
                    </h1>
                    <p className="text-gray-500 mt-2">Secure, high-quality video interviews for Campus Connect</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* My Video */}
                    <div 
                        className="glass-panel p-4 rounded-2xl relative overflow-hidden"
                    >
                        <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative">
                            {stream ? (
                                <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover transform scale-x-[-1]" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    Loading Camera...
                                </div>
                            )}
                            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm backdrop-blur-sm">
                                You {name ? `(${name})` : ""}
                            </div>
                            <div className="absolute top-4 right-4 flex gap-2">
                                {!micOn && <div className="bg-red-500 p-1.5 rounded-full"><MicOff className="w-4 h-4 text-white" /></div>}
                                {!videoOn && <div className="bg-red-500 p-1.5 rounded-full"><VideoOff className="w-4 h-4 text-white" /></div>}
                            </div>
                        </div>
                    </div>

                    {/* Remote Video */}
                    <div 
                         className="glass-panel p-4 rounded-2xl"
                    >
                         <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative flex items-center justify-center">
                            {callAccepted && !callEnded ? (
                                <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-6">
                                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <User className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-400">Waiting for other participant...</p>
                                </div>
                            )}
                             {callAccepted && !callEnded && (
                                <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm backdrop-blur-sm">
                                    Remote User
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Controls */}
                    <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <button 
                                onClick={toggleMic}
                                className={`p-4 rounded-full transition-all ${micOn ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-red-100 text-red-600'}`}
                            >
                                {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                            </button>
                            <button 
                                onClick={toggleVideo}
                                className={`p-4 rounded-full transition-all ${videoOn ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-red-100 text-red-600'}`}
                            >
                                {videoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                            </button>
                            
                            {callAccepted && !callEnded && (
                                <button 
                                    onClick={leaveCall}
                                    className="px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 flex items-center gap-2 shadow-lg shadow-red-200"
                                >
                                    <PhoneOff className="w-5 h-5" /> End Call
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Connection Panel */}
                    <div className="glass-panel p-6 rounded-2xl">
                         {!callAccepted ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Your ID</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={me} 
                                            readOnly 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 font-mono" 
                                        />
                                        <button 
                                            onClick={copyId}
                                            className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Share this ID with the person you want to talk to.</p>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Call Someone</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={idToCall}
                                            onChange={(e) => setIdToCall(e.target.value)}
                                            placeholder="Enter Remote ID" 
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm" 
                                        />
                                        <button 
                                            onClick={() => callUser(idToCall)}
                                            className="btn-primary px-4"
                                        >
                                            <Phone className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {receivingCall && !callAccepted && (
                                    <div 
                                        className="mt-4 bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="font-bold text-indigo-900">{name || "Someone"} is calling...</p>
                                            <p className="text-xs text-indigo-600">Incoming video call</p>
                                        </div>
                                        <button 
                                            onClick={answerCall}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 animate-pulse"
                                        >
                                            Answer
                                        </button>
                                    </div>
                                )}
                            </div>
                         ) : (
                             <div className="text-center py-8">
                                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                     <Phone className="w-8 h-8" />
                                 </div>
                                 <h3 className="font-bold text-green-700">Connected</h3>
                                 <p className="text-sm text-green-600">Call is in progress</p>
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoInterview;
