import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [socket, setSocket] = useState(null);
    const [audioUrl, setAudioUrl] = useState('');

    useEffect(() => {

/*            const ws = io('http://127.0.0.1:5001', {
              transports: ['websocket'],
            });*/

        const ws = io('wss://pythonprojectn8n.onrender.com/', {
            transports: ['websocket'],
        });

        ws.on('connect', () => {
            console.log('WebSocket connection opened');
        });

        ws.on('response', (data) => {
            console.log('Message from server:', data);

            if (data.status === 'success' && data.url) {
                setAudioUrl(data.url);
                setResponse("Audio URL received!");
            } else if (data.status === 'error') {
                setResponse(`Error: ${data.message}`);
            }
        });

        ws.on('disconnect', () => {
            console.log('WebSocket connection closed');
        });

        ws.on('connect_error', (error) => {
            console.error('WebSocket error:', error);
        });

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = () => {
        if (message && socket) {
            let messageObject = { message }
            socket.emit('message', messageObject);
            setAudioUrl('');
            setResponse("Please w8, processing!");
        }
    };

    return (
        <div className="main-container">
            <h1>Text to audio converter</h1>
            <input
                className="input-initial"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message to convert"
            />

            <div className="send-container">
                <button onClick={sendMessage}>Send Message</button>
            </div>


            <p>{response}</p>

            {audioUrl && (
                <div>
                    <audio controls>
                        <source src={audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
        </div>
    );
}

export default App;