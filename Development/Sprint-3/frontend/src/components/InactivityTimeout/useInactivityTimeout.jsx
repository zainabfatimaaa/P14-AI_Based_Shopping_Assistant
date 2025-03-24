import { useEffect } from 'react';

const useInactivityTimeout = (timeout, onTimeout) => {
  useEffect(() => {
    const lastActivity = localStorage.getItem('lastActivity');
    const currentTime = Date.now();
    if (lastActivity && currentTime - lastActivity > timeout) {
      onTimeout();
    }

    const updateLastActivity = () => {
      localStorage.setItem('lastActivity', Date.now());
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    events.forEach(event => window.addEventListener(event, updateLastActivity));

    const checkInactivity = setInterval(() => {
      const lastActivity = localStorage.getItem('lastActivity');
      if (lastActivity && Date.now() - lastActivity > timeout) {
        onTimeout();
      }
    }, 1000);

    return () => {
      events.forEach(event => window.removeEventListener(event, updateLastActivity));
      clearInterval(checkInactivity);
    };
  }, [timeout, onTimeout]);
};

export default useInactivityTimeout;
