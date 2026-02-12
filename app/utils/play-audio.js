export const playAudio = (audioData, setIsPlaying) => {
    if (audioData) {
        try {
            const audio = new Audio(audioData);
            audio.onplay = () => setIsPlaying(true);
            audio.onended = () => setIsPlaying(false);
            audio.onerror = () => {
                console.error("Error playing audio");
                alert("Error playing audio. The audio format may not be supported.");
                setIsPlaying(false);
            };
            audio.play().catch(error => {
                console.error("Play error:", error);
                setIsPlaying(false);
            });
        } catch (error) {
            console.error("Error creating audio:", error);
            alert("Error creating audio player.");
        }
    } else {
        alert("Please generate speech first!");
    }
}