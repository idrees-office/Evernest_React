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
    key: 'aaokmzip3cio74osv4im',
    wsHost: 'socket.leadshub.ae',
    wsPort: 8080,
    wssPort: 8080,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/broadcasting/auth', // Add this
    auth: {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    }
});

export default echo;