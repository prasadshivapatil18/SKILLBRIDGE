import { useState, useEffect, useRef } from "react";

export function useTranslation() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            isFinal = true;
            currentTranscript += event.results[i][0].transcript;
          } else {
            currentTranscript += event.results[i][0].transcript;
          }
        }

        setTranscript(currentTranscript);

        if (isFinal) {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(async () => {
            try {
              const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  text: currentTranscript,
                  targetLanguage,
                  sourceLanguage: "en"
                })
              });
              
              if (res.ok) {
                const data = await res.json();
                setTranslatedText(data.translatedText);
              }
            } catch (err) {
              console.error("Translation failed:", err);
            }
          }, 500);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        // Automatically restart if it was unexpectedly stopped but still "listening" in state
        setIsListening((prev) => {
          if (prev) {
            try {
              recognition.start();
            } catch (e) {
              // Ignore already started errors
            }
          }
          return prev;
        });
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [targetLanguage]);

  const startListening = () => {
    setTranslatedText("");
    setTranscript("");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Error starting recognition", e);
      }
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSetTargetLanguage = (lang: string) => {
    setTargetLanguage(lang);
    setTranslatedText("");
  };

  const clearTranscript = () => {
    setTranscript("");
    setTranslatedText("");
  };

  return {
    isListening,
    transcript,
    translatedText,
    targetLanguage,
    isSupported,
    startListening,
    stopListening,
    setTargetLanguage: handleSetTargetLanguage,
    clearTranscript
  };
}
