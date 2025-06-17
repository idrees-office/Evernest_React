// src/utils/echo.tsx
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: any;
    }
}

// Make Pusher globally available
window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'reverb',
    key: 'aaokmzip3cio74osv4im', // Replace with your actual Reverb app key
    wsHost: 'socket.leadshub.ae',
    wsPort: 443,
    wssPort: 443,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    auth: {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
});

export default echo;