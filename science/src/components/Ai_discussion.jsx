import React, { useState } from 'react';

const Ai_discussion = ({ user, onNavigate, onLogout }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentTopic, setCurrentTopic] = useState('');
    const [topicInput, setTopicInput] = useState('');
    const [discussionStarted, setDiscussionStarted] = useState(false);

    const callAI = async (userQuestion) => {
        try {
            const API_KEY = 'AIzaSyBO5EVz8lRvWwfdm0x--IPVVYtpAcxm5JQ';

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `당신은 주기율표와 화학 원소 전문가입니다. "${currentTopic}" 주제에 대해 과학적이고 정확한 정보를 제공하며 토론해주세요.\n\n사용자 질문: ${userQuestion}\n\n답변은 반드시 한국어로 작성해주세요.`
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`API 오류: ${response.status}`);
            }

            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('응답 형식 오류');
            }
        } catch (error) {
            console.error('AI API 호출 오류:', error);
            return '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.';
        }
    };

    const handleStartDiscussion = () => {
        if (!topicInput.trim()) {
            return;
        }

        setCurrentTopic(topicInput);
        setDiscussionStarted(true);
        setMessages([]);
        setTopicInput('');
    };

    const handleResetTopic = () => {
        setTopicInput('');
    };

    const handleBackToTopicInput = () => {
        setDiscussionStarted(false);
        setCurrentTopic('');
        setMessages([]);
        setInput('');
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userQuestion = input;
        const userMessage = { type: 'user', text: userQuestion };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const aiResponse = await callAI(userQuestion);
        const aiMessage = {
            type: 'ai',
            text: aiResponse
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (discussionStarted) {
                handleSend();
            } else {
                handleStartDiscussion();
            }
        }
    };

    return (
        <div className="ai-discussion-page">
            <header>
                <div className="logo">JuJu</div>
                <div className="search-box">
                    <input type="text" placeholder="검색" />
                    <button className="search-btn">🔍</button>
                </div>
                <div className="login-join">
                    {user && (
                        <>
                            <span className="status">{user.name}님</span>
                            <button onClick={onLogout} style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}>
                                로그아웃
                            </button>
                        </>
                    )}
                </div>
            </header>

            <div className="nav-tabs">
                <div className="active" onClick={() => onNavigate('main')}>메인 페이지</div>
                <div className="active" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                    AI와 토론
                </div>
                <div className="active" onClick={() => onNavigate('mypage')}>개인 페이지</div>
            </div>

            <main className="discussion-main">
                {!discussionStarted ? (
                    <div className="topic-input-container">
                        <h1 className="topic-heading">주제 : (입력한 토론 주제)</h1>

                        <div className="chat-preview-area">
                            <div className="preview-message ai-preview">
                                {topicInput ?
                                    `"${topicInput}" 주제로 토론을 시작합니다! 궁금한 점을 물어보세요.` :
                                    '주제를 입력하면 여기에 AI 응답이 표시됩니다.'
                                }
                            </div>
                            <div className="preview-message user-preview">
                                사용자의 질문이 여기에 표시됩니다.
                            </div>
                        </div>

                        <div className="topic-input-area">
                            <input
                                type="text"
                                value={topicInput}
                                onChange={(e) => setTopicInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="주기율표 관련 토론 주제를 입력하세요..."
                                className="topic-input-field"
                            />
                            <div className="input-actions">
                                <button className="action-btn reset-btn" onClick={handleResetTopic}>✕</button>
                                <button className="action-btn refresh-btn">↻</button>
                                <button className="action-btn submit-btn" onClick={handleStartDiscussion}>✓</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="chat-active-container">
                        <div className="chat-header-bar">
                            <h2 className="current-topic">주제 : {currentTopic}</h2>
                            <button onClick={handleBackToTopicInput} className="change-topic-btn">
                                주제 변경
                            </button>
                        </div>

                        <div className="messages-area">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`chat-message ${msg.type === 'user' ? 'user-msg' : 'ai-msg'}`}
                                >
                                    <div className="message-content">
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="chat-message ai-msg">
                                    <div className="message-content loading-msg">
                                        AI가 답변 중입니다...
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="chat-input-area">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="질문을 입력하세요..."
                                disabled={isLoading}
                                className="chat-input-field"
                            />
                            <div className="input-actions">
                                <button className="action-btn reset-btn" onClick={() => setInput('')}>✕</button>
                                <button className="action-btn refresh-btn">↻</button>
                                <button
                                    className="action-btn submit-btn"
                                    onClick={handleSend}
                                    disabled={isLoading}
                                >
                                    ✓
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Ai_discussion;