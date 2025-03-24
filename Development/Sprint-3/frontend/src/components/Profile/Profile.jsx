import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import './Profile.css';

function Profile() {
    const [selectedOption, setSelectedOption] = useState('Profile');
    const [searchQuery, setSearchQuery] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        email: '',
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch('https://sproj-p14-code.onrender.com/api/userinfo', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserInfo({
                    fullName: data.fullName,
                    email: data.email,
                });
            } else {
                console.error('Failed to fetch user information');
            }
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage("New passwords don't match!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const currentPassword = passwords.currentPassword;
            const newPassword = passwords.newPassword;
            const response = await fetch('http://localhost:10000/api/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword, token }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Password changed successfully!');
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage(data.message || 'Failed to change password');
            }
        } catch (error) {
            setMessage('Error changing password');
            console.error(error);
        }
    };

    return (
        <div>
                        <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setGenderFilter={setGenderFilter}
            />
        <div className="profile-container" style={{ fontFamily: "'Glacial Indifference', sans-serif" }}>

            <div className="sidebar">
                <h2>Account Settings</h2>
                <ul>
                    <li className={selectedOption === 'Profile' ? 'active' : ''} onClick={() => setSelectedOption('Profile')}>
                        Profile
                    </li>
                    <li className={selectedOption === 'ChangePassword' ? 'active' : ''} onClick={() => setSelectedOption('ChangePassword')}>
                        Change Password
                    </li>
                </ul>
            </div>

            <div className="profile-content">
                {selectedOption === 'Profile' && (
                    <div>
                        <h2>Profile Information</h2>
                        <p><strong>Full Name:</strong> {userInfo.fullName}</p>
                        <p><strong>Email:</strong> {userInfo.email}</p>
                    </div>
                )}

                {selectedOption === 'ChangePassword' && (
                    <div>
                        <h2>Change Password</h2>
                        {message && <p className={message === 'Password changed successfully!' ? 'success-message' : 'error-message'}>{message}</p>}
                        <form onSubmit={handleChangePassword}>
                            <label>Current Password:</label>
                            <input
                                type="password"
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                required
                            />

                            <label>New Password:</label>
                            <input
                                type="password"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                required
                            />

                            <label>Confirm New Password:</label>
                            <input
                                type="password"
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                required
                            />

                            <button type="submit">Update Password</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
}

export default Profile;
