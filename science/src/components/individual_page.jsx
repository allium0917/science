import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api';

const Individual_page = ({ user, onNavigate, onLogout }) => {
    const [discussions, setDiscussions] = useState([]);
    const [selectedDiscussion, setSelectedDiscussion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            onNavigate('login');
            return;
        }
        fetchDiscussions();
    }, [user]);

    const fetchDiscussions = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem('token');

            const response = await fetch(`${API_URL}/discussions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setDiscussions(data.discussions);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('토론 내역을 불러오는 중 오류가 발생했습니다.');
            console.error('토론 내역 조회 에러:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDiscussion = async (discussionId) => {
        if (!window.confirm('이 토론 내역을 삭제하시겠습니까?')) {
            return;
        }

        try {
            const token = sessionStorage.getItem('token');

            const response = await fetch(`${API_URL}/discussions/${discussionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                alert('토론 내역이 삭제되었습니다.');
                fetchDiscussions();
                if (selectedDiscussion && selectedDiscussion.id === discussionId) {
                    setSelectedDiscussion(null);
                }
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert('토론 내역 삭제 중 오류가 발생했습니다.');
            console.error('삭제 에러:', err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!user) {
        return null;
    }

    return (
        <div className="individual-page">
            <header>
                <div className="logo">JuJu</div>
                <div className="login-join">
                    <span className="status">{user.name}님</span>
                    <button onClick={onLogout} style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}>
                        로그아웃
                    </button>
                </div>
            </header>

            <div className="nav-tabs">
                <div className="active" onClick={() => onNavigate('main')}>메인 페이지</div>
                <div className="active" onClick={() => onNavigate('ai')}>AI와 토론</div>
                <div className="active" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                    개인 페이지
                </div>
            </div>

            <main className="individual-main">
                <div className="profile-section">
                    <div className="profile-avatar">
                        <div className="avatar-circle">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <h2 className="profile-name">{user.name}</h2>
                    <p className="profile-email">{user.email}</p>
                </div>

                <div className="content-section">
                    <div className="section-header">
                        <h3 className="section-title">토론 내역</h3>
                        <p className="section-subtitle">
                            총 {discussions.length}개의 토론
                        </p>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>토론 내역을 불러오는 중...</p>
                        </div>
                    ) : error ? (
                        <div className="error-container">
                            <p>{error}</p>
                        </div>
                    ) : discussions.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">💬</div>
                            <h3>아직 토론 내역이 없습니다</h3>
                            <p>AI와 토론을 시작해보세요!</p>
                            <button
                                className="start-discussion-btn"
                                onClick={() => onNavigate('ai')}
                            >
                                토론 시작하기
                            </button>
                        </div>
                    ) : (
                        <div className="discussions-container">
                            <div className="discussions-list">
                                {discussions.map((discussion) => (
                                    <div
                                        key={discussion.id}
                                        className={`discussion-card ${selectedDiscussion?.id === discussion.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedDiscussion(discussion)}
                                    >
                                        <div className="discussion-header">
                                            <h4 className="discussion-topic">{discussion.topic}</h4>
                                            <button
                                                className="delete-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteDiscussion(discussion.id);
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <div className="discussion-meta">
                                            <span className="message-count">
                                                💬 {discussion.messages.length}개의 메시지
                                            </span>
                                            <span className="discussion-date">
                                                {formatDate(discussion.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedDiscussion && (
                                <div className="discussion-detail">
                                    <div className="detail-header">
                                        <h3>{selectedDiscussion.topic}</h3>
                                        <button
                                            className="close-detail-btn"
                                            onClick={() => setSelectedDiscussion(null)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="messages-container">
                                        {selectedDiscussion.messages.map((message, idx) => (
                                            <div
                                                key={idx}
                                                className={`message ${message.type === 'user' ? 'user-message' : 'ai-message'}`}
                                            >
                                                <div className="message-bubble">
                                                    {message.text}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Individual_page;