// hooks/useSpeechToText.js - Browser Speech Recognition hook (from Project B)
import { useState, useEffect, useRef } from 'react';

export const useSpeechToText = (onResult) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [recognition, setRecognition] = useState(null);

  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = "en-IN";
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      rec.onend = () => setIsListening(false);

      rec.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setError("Microphone access denied. Please enable it in your browser settings.");
        } else {
          setError(`Microphone error: ${event.error}`);
        }
      };

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        onResultRef.current(text);
      };

      setRecognition(rec);
    } else {
      setError("Voice search is not supported in this browser.");
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return { isListening, error, toggleListening, setError };
};
