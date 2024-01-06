import { useEffect, useState } from 'react'
let recognition;

if (typeof webkitSpeechRecognition !== 'undefined') {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";
} else {
  // Handle the case when webkitSpeechRecognition is not available
  console.error('Speech recognition not supported in this browser.');
}

const useSpeechRecognition = () => {
    const [text, setText] = useState("");
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if (!recognition) {
            return;
        }

        recognition.onresult = (event) => {
            console.log("onresult event: ", event);
            setText(event.results[0][0].transcript);
            
            recognition.stop();
            setIsListening(false);
        };
    }, []);

    const startListening = () => {
        setText("");
        setIsListening(true);
        recognition.start();
    }
    const stopListening = () => {
        setIsListening(false);
        recognition.stop();
    };

    const resetText = () => setText("");

    return {
        text, 
        isListening,
        startListening,
        resetText,
        hasRecognitionSupport: !!recognition,
    };
};

export default useSpeechRecognition;