"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Pause, Download, AlertCircle } from "lucide-react";

export default function Modal({ isOpen, onClose, audioUrl, isLoading, info, announcementType }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            const audio = audioRef.current;

            const updateTime = () => setCurrentTime(audio.currentTime);
            const updateDuration = () => setDuration(audio.duration);
            const handleEnded = () => setIsPlaying(false);

            audio.addEventListener("timeupdate", updateTime);
            audio.addEventListener("loadedmetadata", updateDuration);
            audio.addEventListener("ended", handleEnded);

            return () => {
                audio.removeEventListener("timeupdate", updateTime);
                audio.removeEventListener("loadedmetadata", updateDuration);
                audio.removeEventListener("ended", handleEnded);
            };
        }
    }, [audioUrl]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setIsPlaying(false);
            setCurrentTime(0);
            setDuration(0);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
    }, [isOpen]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        if (audio) {
            const newTime = (e.target.value / 100) * duration;
            audio.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleDownload = () => {
        if (audioUrl) {
            const a = document.createElement('a');
            a.href = audioUrl;
            const filename = announcementType === 'train'
                ? `railvaani-train-${info?.train_no || 'announcement'}.wav`
                : `railvaani-metro-${info?.station_name || 'announcement'}.wav`;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 h-10 w-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 transition cursor-pointer"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Content */}
                        <div className="text-center">
                            <h3 className="font-serif text-2xl mb-2">
                                RailVaani
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                {isLoading ? "Generating announcement..." : "Your announcement is ready"}
                            </p>

                            {isLoading ? (
                                // Skeleton Loading State
                                <div className="space-y-4 animate-pulse">
                                    <div className="bg-gray-100 rounded-2xl p-4 flex gap-4 items-center">
                                        <div className="h-20 w-20 rounded-full bg-gray-300" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 bg-gray-200 rounded w-1/3" />
                                            <div className="h-4 bg-gray-300 rounded w-3/4" />
                                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-2 bg-gray-200 rounded w-full" />
                                        <div className="flex justify-between">
                                            <div className="h-3 bg-gray-200 rounded w-8" />
                                            <div className="h-3 bg-gray-200 rounded w-8" />
                                        </div>
                                    </div>
                                    <div className="h-9 bg-gray-200 rounded-lg w-36 ml-auto" />
                                </div>
                            ) : audioUrl ? (
                                // Audio Player
                                <div className="space-y-4">
                                    {/* Audio Element */}
                                    <audio ref={audioRef} src={audioUrl} preload="metadata" />

                                    <div className="bg-gray-100 rounded-2xl p-4 flex gap-4 items-center">
                                        <button
                                            onClick={togglePlay}
                                            className="cursor-pointer relative h-20 w-20 rounded-full overflow-hidden flex items-center justify-center transition"
                                            style={{ backgroundImage: "url(/banner.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
                                            aria-label={isPlaying ? "Pause" : "Play"}
                                        >
                                            <span className="absolute inset-0 bg-black/35" />
                                            {isPlaying ? (
                                                <Pause className="relative w-7 h-7 text-white" />
                                            ) : (
                                                <Play className="relative w-7 h-7 text-white" />
                                            )}
                                        </button>

                                        <div className="flex-1 text-left">
                                            {info && (
                                                <div>
                                                    {announcementType === "train" ? (
                                                        <>
                                                            <p className="text-xs text-gray-500 mb-2">Train Information</p>
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                {info.train_name}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                {info.from_stn_name} → {info.to_stn_name}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-xs text-gray-500 mb-2">Metro Station</p>
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                {info.station_name}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                Next station announcement
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={duration ? (currentTime / duration) * 100 : 0}
                                            onChange={handleSeek}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>{formatTime(currentTime)}</span>
                                            <span>{formatTime(duration)}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleDownload}
                                            className="cursor-pointer bg-gray-900 text-white py-2 px-4 text-xs rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 active:scale-[0.98] flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Error State
                                <div className="py-8">
                                    <div className="text-red-500 mb-4">
                                        <AlertCircle className="w-12 h-12 mx-auto" />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Failed to generate audio. Please try again.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
