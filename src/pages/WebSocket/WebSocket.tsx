// src/pages/websocket/websocket.tsx
import { useEffect, useState } from 'react';
import echo from '../../utils/echo';

export default function WebSocket() {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        
        // Test public channel
        const channel = echo.channel('test_name.1');

        channel.listen('.RealTimeNotification', (data: any) => {
            console.log('Received:', data);
            setMessages(prev => [...prev, data.message]);
        });

        return () => {
            channel.stopListening('.RealTimeNotification');
            echo.leave('test_name.1');
        };
        
    }, []);

    return (
        <div>
            <h1>WebSocket Test</h1>
            <button onClick={() => {
                fetch('https://newcrmbackend.ddev.site/api/broadcast-test')
                    .then(res => res.json());
            }}>
                Send Test Event
            </button>
            <ul>
                {messages.map((msg, i) => (
                    <li key={i}>{msg}</li>
                ))}
            </ul>
        </div>
    );
}