import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import './App.css';

function App() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [socket, setSocket] = useState(null);
    const [audioUrl, setAudioUrl] = useState('');

    useEffect(() => {
        // For local development (ensure the Flask app runs on port 5001)
        /*
            const ws = io('http://127.0.0.1:5001', {
              transports: ['websocket'],
            });
        */

        // For deployment, replace with your deployed URL (e.g., Render)
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

        // Save the WebSocket connection in state
        setSocket(ws);

        // Cleanup on component unmount
        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = () => {
        if (message && socket) {
            socket.send(message);
        }
    };

    return (
        <div>
            <h1>WebSocket Test</h1>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message to convert"
            />
            <button onClick={sendMessage}>Send Message</button>
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