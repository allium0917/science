import React, { useState, useEffect, useRef } from 'react';

export default function Ai_discussion({ user, onNavigate, onLogout }) {
    const [topic, setTopic] = useState('');
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isChatActive, setIsChatActive] = useState(false);
    const [currentTopic, setCurrentTopic] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState('');
    const messagesEndRef = useRef(null);

    const exampleTopics = [
        {
            topic: "탄소와 생명",
            question: "탄소가 다른 원소들보다 생명체 구성에 적합한 이유는 무엇인가요?"
        },
        {
            topic: "희귀 원소 채굴",
            question: "리튬, 코발트 같은 희귀 원소 채굴이 환경에 미치는 영향은?"
        },
        {
            topic: "금속과 비금속",
            question: "금속 원소와 비금속 원소의 근본적인 차이는 무엇인가요?"
        },
        {
            topic: "방사성 원소",
            question: "우라늄이나 플루토늄 같은 방사성 원소를 어떻게 안전하게 다뤄야 할까요?"
        }
    ];

    // 예시 주기율표 질문들
    const exampleQuestions = [
        {
            topic: "주기율표 구조",
            question: "주기율표가 18족으로 나뉘는 이유는 무엇인가요?"
        },
        {
            topic: "원자 번호",
            question: "원자 번호가 원소의 어떤 특성을 나타내나요?"
        },
        {
            topic: "전자 배치",
            question: "같은 족의 원소들은 왜 비슷한 화학적 성질을 가지나요?"
        },
        {
            topic: "주기율표 역사",
            question: "멘델레예프가 주기율표를 만들 때 어떤 규칙을 발견했나요?"
        }
    ];

    const handleExampleClick = (example) => {
        setTopic(example.topic);
        setQuestion(example.question);
    };

    const handleReset = () => {
        setTopic('');
        setQuestion('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleStartDiscussion = async () => {
        if (!topic.trim() || !question.trim()) {
            alert('주제와 질문을 모두 입력해주세요.');
            return;
        }

        setCurrentTopic(topic);
        setCurrentQuestion(question);
        setIsChatActive(true);
        setIsLoading(true);

        const userMessage = {
            role: 'user',
            content: question
        };

        setMessages([userMessage]);

        try {
            // 시스템 프롬프트 설정
            const systemPrompt = `당신은 다양한 주제에 대해 토론할 수 있는 AI 토론 파트너입니다.
                현재 토론 주제: "${topic}"

                **중요 규칙:**
                1. 반드시 현재 토론 주제("${topic}")와 관련된 질문에만 답변하세요.
                2. 주제와 무관한 질문(예: 날씨, 음식, 일상 대화 등)이 들어오면 "죄송하지만, 현재 토론 주제인 '${topic}'와 관련 없는 질문입니다. 주제와 관련된 질문을 해주세요."라고 답변하세요.
                3. 토론하는 느낌으로 답변하세요. 단순히 정보를 나열하지 말고, 의견을 제시하고 근거를 들어 설명하세요.
                4. 상대방의 의견에 동의하거나 반박하는 식으로 대화를 이어가세요.
                5. 때로는 "그 점에 대해서는 이렇게 생각합니다", "흥미로운 질문이네요", "그 부분에 대해 좀 더 깊이 생각해볼까요?" 같은 표현을 사용하세요.
                6. 먼저 주제에 관해 간단히 소개하고, 질문에 대해 답변하세요.
                7. 한국어로 답변하세요.`;

            // 실제 API 호출 (여기서는 시뮬레이션)
            // const response = await fetch('/api/chat', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         systemPrompt,
            //         messages: [{ role: 'user', content: question }]
            //     })
            // });

            await new Promise(resolve => setTimeout(resolve, 1500));

            const aiMessage = {
                role: 'assistant',
                content: `안녕하세요! "${topic}" 주제로 토론을 시작하겠습니다.\n\n"${question}"에 대한 제 생각을 말씀드리겠습니다.\n\n이것은 AI의 시뮬레이션 응답입니다. 실제 구현시에는 위의 시스템 프롬프트와 함께 백엔드 API(예: Claude API, GPT API)를 통해 응답을 받아야 합니다.\n\n계속해서 질문해주시면 주제에 맞춰 토론을 이어가겠습니다!`
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error:', error);
            alert('오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: inputMessage
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            // 시스템 프롬프트와 전체 대화 내역을 함께 전송
            const systemPrompt = `당신은 다양한 주제에 대해 토론할 수 있는 AI 토론 파트너입니다.
                현재 토론 주제: "${currentTopic}"
                초기 질문: "${currentQuestion}"

                **중요 규칙:**
                1. 반드시 현재 토론 주제("${currentTopic}")와 관련된 질문에만 답변하세요.
                2. 주제와 무관한 질문이 들어오면 "죄송하지만, 현재 토론 주제인 '${currentTopic}'와 관련 없는 질문입니다. 주제와 관련된 질문을 해주세요."라고 답변하세요.
                3. 토론하는 느낌으로 답변하세요. 단순히 정보를 나열하지 말고, 의견을 제시하고 근거를 들어 설명하세요.
                4. 상대방의 의견에 동의하거나 반박하는 식으로 대화를 이어가세요.
                5. "그 점에 대해서는 이렇게 생각합니다", "흥미로운 관점이네요", "그 부분에 대해 좀 더 깊이 생각해볼까요?" 같은 표현을 사용하세요.
                6. 한국어로 답변하세요.`;

            // 실제 API 호출 예시
            // const response = await fetch('/api/chat', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         systemPrompt,
            //         messages: [...messages, userMessage]
            //     })
            // });

            await new Promise(resolve => setTimeout(resolve, 1500));

            const aiMessage = {
                role: 'assistant',
                content: `"${inputMessage}"에 대한 답변입니다.\n\n실제 구현시에는 위의 시스템 프롬프트와 함께 전체 대화 내역을 백엔드 API로 전송하여 맥락을 유지한 답변을 받아야 합니다.`
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error:', error);
            alert('오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleChangeTopic = () => {
        setIsChatActive(false);
        setMessages([]);
        setTopic('');
        setQuestion('');
        setCurrentTopic('');
        setCurrentQuestion('');
    };

    const handleSaveDiscussion = async () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (messages.length === 0) {
            alert('저장할 대화가 없습니다.');
            return;
        }

        try {
            const discussionData = {
                topic: currentTopic,
                question: currentQuestion,
                messages: messages,
                userId: user.id,
                createdAt: new Date().toISOString()
            };

            console.log('Saving discussion:', discussionData);

            // localStorage에 임시 저장
            const savedDiscussions = JSON.parse(localStorage.getItem('discussions') || '[]');
            savedDiscussions.push(discussionData);
            localStorage.setItem('discussions', JSON.stringify(savedDiscussions));

            alert('토론이 저장되었습니다!');
        } catch (error) {
            console.error('Error saving discussion:', error);
            alert('저장 중 오류가 발생했습니다.');
        }
    };

    const handleKeyPress = (e, isQuestionField = false) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isQuestionField && !isChatActive) {
                handleStartDiscussion();
            } else if (isChatActive) {
                handleSendMessage();
            }
        }
    };

    return (
        <div className="ai-discussion-page gle">
            <header>
                <div className="logo">AI Discussion</div>
                <div className="search-box">
                    <input type="text" placeholder="검색..." />
                    <button className="search-btn">🔍</button>
                </div>
                <div className="login-join">
                    {user ? (
                        <>
                            <span className="status">{user.name}님 환영합니다</span>
                            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>로그아웃</a>
                        </>
                    ) : (
                        <>
                            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>로그인</a>
                            <span>|</span>
                            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('logup'); }}>회원가입</a>
                        </>
                    )}
                </div>
            </header>

            <nav className="nav-tabs">
                <div onClick={() => onNavigate('main')}>메인</div>
                <div className="active">AI 토론</div>
                <div onClick={() => onNavigate('mypage')}>개인 페이지</div>
            </nav>

            <main className="discussion-main">
                {!isChatActive ? (
                    <div className="topic-input-container">
                        <h1 className="topic-heading">AI와 함께하는 토론</h1>

                        <div className="chat-preview-area">
                            <div className="preview-message ai-preview">
                                AI가 다양한 관점에서 여러분의 질문에 답변해드립니다
                            </div>
                            <div className="preview-message user-preview">
                                궁금한 주제와 질문을 입력해보세요
                            </div>
                        </div>

                        {/* 예시 주제 섹션 */}
                        <div className="examples-section">
                            <h3 className="examples-title">주기율표 관련 인기 토론 주제</h3>
                            <div className="examples-grid">
                                {exampleTopics.slice(0, 4).map((example, index) => (
                                    <div
                                        key={index}
                                        className="example-card"
                                        onClick={() => handleExampleClick(example)}
                                    >
                                        <div className="example-topic">{example.topic}</div>
                                        <div className="example-question">{example.question}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="topic-input-area">
                            <div className="input-group">
                                <label className="input-label">주제</label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        className="topic-input-field"
                                        placeholder="토론 주제를 입력하세요 (예: 금속의 특성, 산소의 역할)"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        onKeyPress={(e) => handleKeyPress(e, false)}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">질문</label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        className="question-input-field"
                                        placeholder="구체적인 질문을 입력하세요"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        onKeyPress={(e) => handleKeyPress(e, true)}
                                    />
                                    <div className="input-actions">
                                        <button className="action-btn reset-btn" onClick={handleReset} title="초기화">
                                            초기화
                                        </button>
                                        <button
                                            className="action-btn submit-btn"
                                            onClick={handleStartDiscussion}
                                            disabled={!topic.trim() || !question.trim()}
                                            title="시작"
                                        >
                                            시작
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="chat-active-container">
                        <div className="chat-header-bar">
                            <div>
                                <h2 className="current-topic">{currentTopic}</h2>
                                <p className="topic-subtitle">{currentQuestion}</p>
                            </div>
                            <div className="header-actions">
                                <button className="save-discussion-btn" onClick={handleSaveDiscussion}>
                                    💾 저장
                                </button>
                                <button className="change-topic-btn" onClick={handleChangeTopic}>
                                    주제 변경
                                </button>
                            </div>
                        </div>

                        <div className="messages-area">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`chat-message ${message.role === 'user' ? 'user-msg' : 'ai-msg'}`}
                                >
                                    <div className="message-content">
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="chat-message ai-msg">
                                    <div className="message-content loading-msg">
                                        AI가 답변을 생성하고 있습니다...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-input-area">
                            <input
                                type="text"
                                className="chat-input-field"
                                placeholder="메시지를 입력하세요..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, false)}
                                disabled={isLoading}
                            />
                            <div className="input-actions">
                                <button
                                    className="action-btn submit-btn"
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim() || isLoading}
                                    title="전송"
                                >
                                    전송
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}