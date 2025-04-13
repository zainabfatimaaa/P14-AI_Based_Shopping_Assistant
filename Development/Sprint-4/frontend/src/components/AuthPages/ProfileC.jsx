import React, { useState, useEffect } from 'react';
import Profile from '../Profile/Profile.jsx';

function ProfileC() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token not found. User unauthorized access attempted.');
            window.location.href = '/';
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    if (isAuthenticated === null) {
        return null;
    }
    return <Profile />;
}

export default ProfileC;