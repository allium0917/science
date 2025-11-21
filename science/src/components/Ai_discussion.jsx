import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api';

const Ai_discussion = ({ user, onNavigate, onLogout }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentTopic, setCurrentTopic] = useState('');
    const [topicInput, setTopicInput] = useState('');
    const [discussionStarted, setDiscussionStarted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const callAI = async (userQuestion) => {
        try {
            const API_KEY = 'AIzaSyC8I0oUhb6AjCZ73R0ze7EWcS8xJBxbCpU';

            const systemPrompt = `당신은 화학 원소와 주기율표 전문가입니다. 
                현재 토론 주제: "${currentTopic}"

                **중요 규칙:**
                1. 반드시 현재 토론 주제("${currentTopic}")와 관련된 질문에만 답변하세요.
                2. 주제와 무관한 질문(예: 날씨, 음식, 일상 대화 등)이 들어오면 "죄송하지만, 현재 토론 주제인 '${currentTopic}'와 관련 없는 질문입니다. 주제와 관련된 질문을 해주세요."라고 답변하세요.
                3. 토론하는 느낌으로 답변하세요. 단순히 정보를 나열하지 말고, 의견을 제시하고 근거를 들어 설명하세요.
                4. 상대방의 의견에 동의하거나 반박하는 식으로 대화를 이어가세요.
                5. 때로는 "그 점에 대해서는 이렇게 생각합니다", "흥미로운 질문이네요", "그 부분에 대해 좀 더 깊이 생각해볼까요?" 같은 표현을 사용하세요.
                6. 한국어로 답변하세요.

                사용자 질문: ${userQuestion}`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: systemPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.9,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API 응답 오류:', errorData);
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
            return '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
    };

    const saveDiscussion = async () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (messages.length === 0) {
            alert('저장할 토론 내용이 없습니다.');
            return;
        }

        setIsSaving(true);

        try {
            const token = sessionStorage.getItem('token');

            const response = await fetch(`${API_URL}/discussions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    topic: currentTopic,
                    messages: messages
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('토론 내역이 저장되었습니다!');
            } else {
                alert(data.message || '저장 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('토론 저장 오류:', error);
            alert('서버 연결에 실패했습니다.');
        } finally {
            setIsSaving(false);
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
        if (messages.length > 0) {
            const shouldSave = window.confirm('현재 토론 내용을 저장하시겠습니까?');
            if (shouldSave && user) {
                saveDiscussion();
            }
        }

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
                <div className="login-join">
                    {user ? (
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
                    ) : (
                        <>
                            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>
                                SIGN IN
                            </a> |
                            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('logup'); }}>
                                SIGN UP
                            </a>
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
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {user && messages.length > 0 && (
                                    <button
                                        onClick={saveDiscussion}
                                        disabled={isSaving}
                                        className="save-discussion-btn"
                                    >
                                        {isSaving ? '저장 중...' : '💾 토론 저장'}
                                    </button>
                                )}
                                <button onClick={handleBackToTopicInput} className="change-topic-btn">
                                    주제 변경
                                </button>
                            </div>
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