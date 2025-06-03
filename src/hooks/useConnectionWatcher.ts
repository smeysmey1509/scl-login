import { useEffect, useRef } from 'react';

export const useConnectionWatcher = () => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleOffline = () => {
            // Start 30s timeout when offline
            timeoutRef.current = setTimeout(() => {
                if (!navigator.onLine) {
                    alert('You are offline. Check your connection.');
                }
            }, 30000);
        };

        const handleOnline = () => {
            // Clear the timer when online
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
};
