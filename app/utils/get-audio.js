import { SarvamAIClient } from "sarvamai";
import { getTrainInfo } from "irctc-connect";

export const getTrainAudio = async (trainNumber) => {
    console.log("Generating info for train number:", trainNumber);
    const result = await getTrainInfo(trainNumber);
    if (result.success) {
        const { trainInfo } = result.data;

        try {
            const client = new SarvamAIClient({
                apiSubscriptionKey: process.env.NEXT_PUBLIC_SARVAM_API_TOKEN
            });

            const response = await client.textToSpeech.convert({
                text: `यात्रिगण कृपया ध्यान दें, गाड़ी संख्या ${trainInfo.train_no}, ${trainInfo.from_stn_name} से चलकर ${trainInfo.to_stn_name} की ओर जाने वाली ${trainInfo.train_name} एक्सप्रेस, अपने निर्धारित समय पर प्लेटफॉर्म क्रमांक 1 पर आने वाली है।`,
                target_language_code: "hi-IN",
                speaker: "ritu",
                pace: 0.9,
                speech_sample_rate: 22050,
                enable_preprocessing: true,
                model: "bulbul:v3",
                temperature: 0.6
            });

            const audioData = response.audios[0];

            // Handle if audioData is base64 string
            let audioUrl;
            if (typeof audioData === 'string' && audioData.startsWith('data:audio')) {
                audioUrl = audioData;
            } else if (typeof audioData === 'string') {
                // Convert base64 to blob
                const binaryString = atob(audioData);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const audioBlob = new Blob([bytes], { type: 'audio/wav' });
                audioUrl = URL.createObjectURL(audioBlob);
            } else {
                audioUrl = audioData;
            }

            console.log("Audio generated successfully");
            return {
                success: true,
                audioUrl,
                trainInfo,
                type: 'train'
            };
        } catch (error) {
            console.error("Error generating speech:", error);
            return {
                success: false,
                error: error.message
            };
        }
    } else {
        return {
            success: false,
            error: "Failed to fetch train information"
        };
    }
}

export const getMetroAudio = async (stationName) => {
    console.log("Generating metro announcement for station:", stationName);

    try {
        const client = new SarvamAIClient({
            apiSubscriptionKey: process.env.NEXT_PUBLIC_SARVAM_API_TOKEN
        });

        const response = await client.textToSpeech.convert({
            text: `यह स्टेशन ${stationName} है। दरवाज़े दायीं ओर खुलेंगे। कृपया सावधानी से उतरें।`,
            target_language_code: "hi-IN",
            speaker: "shubh",
            pace: 0.9,
            speech_sample_rate: 22050,
            enable_preprocessing: true,
            model: "bulbul:v3",
            temperature: 0.6
        });

        const audioData = response.audios[0];

        // Handle if audioData is base64 string
        let audioUrl;
        if (typeof audioData === 'string' && audioData.startsWith('data:audio')) {
            audioUrl = audioData;
        } else if (typeof audioData === 'string') {
            // Convert base64 to blob
            const binaryString = atob(audioData);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const audioBlob = new Blob([bytes], { type: 'audio/wav' });
            audioUrl = URL.createObjectURL(audioBlob);
        } else {
            audioUrl = audioData;
        }

        console.log("Metro audio generated successfully");
        return {
            success: true,
            audioUrl,
            stationInfo: { station_name: stationName },
            type: 'metro'
        };
    } catch (error) {
        console.error("Error generating speech:", error);
        return {
            success: false,
            error: error.message
        };
    }
}