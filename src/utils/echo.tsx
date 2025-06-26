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
    wsHost: 'websocke1.ddev.site',
    wsPort: 8082,
    wssPort: 8083,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
});

export default echo;