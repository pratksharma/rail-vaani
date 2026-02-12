"use client";
import { useState } from "react";
import { Github } from "lucide-react";
import { getTrainAudio, getMetroAudio } from "./utils/get-audio";
import Modal from "../components/modal";

export default function Home() {
  const [activeTab, setActiveTab] = useState("train");
  const [trainNumber, setTrainNumber] = useState("");
  const [metroStation, setMetroStation] = useState("");
  const [audioData, setAudioData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [announcementType, setAnnouncementType] = useState(null);

  const handleTrainGenerate = async (e) => {
    e.preventDefault();
    setIsModalOpen(true);
    setIsLoading(true);
    setAudioData(null);
    setAnnouncementType('train');

    try {
      const result = await getTrainAudio(trainNumber);
      if (result && result.success) {
        setAudioData(result.audioUrl);
        setInfo(result.trainInfo);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetroGenerate = async (e) => {
    e.preventDefault();
    setIsModalOpen(true);
    setIsLoading(true);
    setAudioData(null);
    setAnnouncementType('metro');

    try {
      const result = await getMetroAudio(metroStation);
      if (result && result.success) {
        setAudioData(result.audioUrl);
        setInfo(result.stationInfo);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAudioData(null);
    setInfo(null);
    setAnnouncementType(null);
  };

  return (
    <div
      className="h-screen max-h-svh flex items-center justify-center px-4 py-8"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    >
      <div className="max-w-md w-full">
        {/* Card with Gradient Background */}
        <div className="rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section with Gradient Background */}
          <div className="p-6 sm:p-8 text-center overflow-hidden"

            style={{
              backgroundImage: 'url(/banner.jpg)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <h1 className="font-serif text-3xl md:text-4xl text-white">
              RailVaani
            </h1>
          </div>

          {/* White Form Section */}
          <div className="bg-white px-6 sm:px-8 py-6">
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-5">
              {activeTab === "train" ? "Generate Train Announcement" : "Generate Metro Announcement"}
            </h2>

            {/* Tab Selector */}
            <div className="flex gap-2 mb-5 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("train")}
                className={`cursor-pointer flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all duration-200 ${activeTab === "train"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                🚂 Train
              </button>
              <button
                onClick={() => setActiveTab("metro")}
                className={`cursor-pointer flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all duration-200 ${activeTab === "metro"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                🚇 Metro
              </button>
            </div>

            {/* Forms */}
            {activeTab === "train" ? (
              <form onSubmit={handleTrainGenerate} className="space-y-4">
                <div>
                  <label htmlFor="trainNumber" className="block text-xs font-medium text-gray-700 mb-1.5">
                    Train Number
                  </label>
                  <input
                    type="text"
                    id="trainNumber"
                    value={trainNumber}
                    onChange={(e) => setTrainNumber(e.target.value)}
                    placeholder="Enter 5-digit train number"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 transition-all"
                    pattern="[0-9]{5}"
                    title="Please enter a valid 5-digit train number"
                    required
                  />
                  <p className="mt-1 text-[10px] text-gray-500">
                    Enter a valid 5-digit Indian train number
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-2.5 px-4 text-sm rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
                >
                  Generate
                </button>
              </form>
            ) : (
              <form onSubmit={handleMetroGenerate} className="space-y-4">
                <div>
                  <label htmlFor="metroStation" className="block text-xs font-medium text-gray-700 mb-1.5">
                    Metro Station
                  </label>
                  <input
                    type="text"
                    id="metroStation"
                    value={metroStation}
                    onChange={(e) => setMetroStation(e.target.value)}
                    placeholder="Enter metro station name"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 transition-all"
                    required
                  />
                  <p className="mt-1 text-[10px] text-gray-500">
                    Enter the name of any Indian metro station
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-2.5 px-4 text-sm rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
                >
                  Generate
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        audioUrl={audioData}
        isLoading={isLoading}
        info={info}
        announcementType={announcementType}
      />
      <a
        href="https://github.com/pratksharma/rail-vaani"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-600 hover:text-gray-900 transition inline-flex items-center gap-2"
        target="_blank"
        rel="noreferrer"
      >
        <Github className="w-4 h-4" />
        GitHub
      </a>
    </div>
  );
}
