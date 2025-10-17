import React, { useState, useEffect } from 'react';
import Main from "./components/Main.jsx";
import Login from "./components/Login.jsx";
import "./App.css";
import "./Login.css";

export default function APP() {
    const [currentPage, setCurrentPage] = useState('main');
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // 컴포넌트 마운트 시 로컬스토리지에서 토큰 확인
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogin = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentPage('main');
    };

    const handleLogout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentPage('main');
    };

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    // 페이지 전환
    return (
        <>
            {currentPage === 'main' && (
                <Main 
                    user={user}
                    token={token}
                    onNavigate={handleNavigate}
                    onLogout={handleLogout}
                />
            )}
            
            {(currentPage === 'signin' || currentPage === 'signup') && (
                <Login 
                    initialPage={currentPage}
                    onBack={() => setCurrentPage('main')}
                    onLogin={handleLogin}
                />
            )}
        </>
    );
}