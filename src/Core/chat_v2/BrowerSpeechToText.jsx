import { useRef } from 'react';
import { useState, useEffect } from 'react';

const BrowserSpeechToText = ({
    isListening,
    language,
    setIsListening,
    setTranscript,
}) => {
    const [recognition] = useState(
        'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
            ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
            : null
    );
    const timeout = useRef(null)

    useEffect(() => {
        if (timeout.current) {
            clearTimeout(timeout.current)
            timeout.current = null
        }
        if (recognition) {
            recognition.interimResults = true;
            recognition.continuous = true;
            recognition.lang = language;

            recognition.onresult = (event) => {
                let currentTranscript = '';
                clearTime()
                setTime()

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    const text = result[0].transcript;

                    if (result.isFinal) {
                        setTranscript(text);
                    } else {
                        currentTranscript += text;
                    }
                }
            };

            recognition.onerror = (event) => {
                // console.log('Error:', event.error);
                setIsListening(false);
            };
        } else {
            // console.log('SpeechRecognition API is not supported in this browser');
            clearTime()
            setTime()
        }

        return () => {
            if (recognition) {
                recognition.stop();
            }
        };
    }, [isListening, language, recognition]);

    const setTime = () => {
        timeout.current = setTimeout(() => {
            if (recognition) {
                recognition.stop();
            }
            setIsListening(false);
        }, 5000)
    }
    const clearTime = () => {
        if (timeout.current) {
            clearTimeout(timeout.current)
            timeout.current = null
        }
    }

    useEffect(() => {
        if (isListening) {
            if (recognition) {
                recognition.start();
                setTime()
            }
        } else {
            if (recognition) {
                recognition.stop();
                clearTime()
            }
        }
    }, [isListening, recognition]);

    return null;
};

export default BrowserSpeechToText;
