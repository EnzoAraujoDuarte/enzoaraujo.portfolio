'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BotMessageSquare, FastForward } from 'lucide-react';
import { FiX, FiSend } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';

const getInitializationCode = (language) => {
  const isEnglish = language === 'en-US';
  return [
    "import { EnzoIA } from './chat'",
    "",
    "const enzo = new EnzoIA({",
    "  name: 'Enzo Araujo',",
    "  mode: 'interactive',",
    "  personality: 'friendly'",
    "})",
    "await enzo.initialize()",
    "",
    isEnglish ? "console.log('Connecting...')" : "console.log('Conectando...')",
    isEnglish ? "console.log('Loading memories...')" : "console.log('Carregando memórias...')",
    isEnglish ? "console.log('✓ EnzoIA is online!')" : "console.log('✓ EnzoIA está online!')",
    "",
    "enzo.startChat()"
  ];
};

const getSuggestedQuestions = (language) => {
  const isEnglish = language === 'en-US';
  return isEnglish ? [
    "What are your main technical skills?",
    "Tell me about your professional experience",
    "What projects have you developed?",
    "How did you start programming?",
    "What are your career goals?"
  ] : [
    "Quais são suas principais habilidades técnicas?",
    "Conte-me sobre sua experiência profissional",
    "Quais projetos você já desenvolveu?",
    "Como você começou na programação?",
    "Quais são seus objetivos de carreira?"
  ];
};

export default function EnzoIAChat() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showCodeAnimation, setShowCodeAnimation] = useState(false);
  const [displayedCode, setDisplayedCode] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [codeComplete, setCodeComplete] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const animationScrollRef = useRef(null);

  const INITIALIZATION_CODE = getInitializationCode(language);
  const SUGGESTED_QUESTIONS = getSuggestedQuestions(language);
  const isEnglish = language === 'en-US';

  useEffect(() => {
    if (showCodeAnimation && !codeComplete) {
      const code = getInitializationCode(language);
      const timer = setTimeout(() => {
        if (currentLine < code.length) {
          const line = code[currentLine];

          if (line === '') {
            setDisplayedCode(prev => [...prev, '']);
            setCurrentLine(prev => prev + 1);
            setCurrentChar(0);
          } else if (currentChar < line.length) {
            setDisplayedCode(prev => {
              const newCode = [...prev];
              if (!newCode[currentLine]) {
                newCode[currentLine] = '';
              }
              newCode[currentLine] = line.substring(0, currentChar + 1);
              return newCode;
            });
            setCurrentChar(prev => prev + 1);
          } else {
            if (currentLine === code.length - 1) {
              setTimeout(() => {
                setCodeComplete(true);
                setTimeout(() => {
                  setShowCodeAnimation(false);
                }, 500);
              }, 250);
            } else {
              setCurrentLine(prev => prev + 1);
              setCurrentChar(0);
            }
          }
        }
      }, currentLine >= 10 && currentLine <= 12 ? 50 : 20);

      return () => clearTimeout(timer);
    }
  }, [showCodeAnimation, currentLine, currentChar, codeComplete, language]);

  useEffect(() => {
    if (isOpen && codeComplete && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, codeComplete]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  useEffect(() => {
    if (showCodeAnimation && animationScrollRef.current) {
      const scrollContainer = animationScrollRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight + 50;
    }
  }, [displayedCode, currentLine, currentChar, showCodeAnimation]);

  const createThread = async () => {
    try {
      const response = await fetch('/api/threads', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        const newThreadId = data.thread?.thread_id;
        if (newThreadId) {
          setThreadId(newThreadId);
          return newThreadId;
        }
      }
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
    return null;
  };

  const hasSeenAnimation = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('enzoIA-animation-seen') === 'true';
  };

  const markAnimationAsSeen = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('enzoIA-animation-seen', 'true');
    }
  };

  /**
 * executar resetEnzoIAAnimation() dentro do console do navegador para resetar a animação
 */
  const resetAnimation = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('enzoIA-animation-seen');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.resetEnzoIAAnimation = resetAnimation;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.resetEnzoIAAnimation;
      }
    };
  }, []);

  const handleButtonClick = async () => {
    if (!isOpen) {
      setIsOpen(true);
      const shouldShowAnimation = !hasSeenAnimation();

      if (shouldShowAnimation) {
        setShowCodeAnimation(true);
        setDisplayedCode([]);
        setCurrentLine(0);
        setCurrentChar(0);
        setCodeComplete(false);
        markAnimationAsSeen();
      } else {
        setShowCodeAnimation(false);
        setCodeComplete(true);
      }

      if (!threadId) {
        await createThread();
      }
    } else {
      setIsOpen(false);
    }
  };

  const handleQuestionClick = (question) => {
    handleSendMessage(question);
  };

  const handleSendMessage = async (text = inputValue) => {
    if (!text.trim() || isLoading) return;

    let currentThreadId = threadId;
    if (!currentThreadId) {
      currentThreadId = await createThread();
      if (!currentThreadId) {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: isEnglish ? 'Failed to start conversation. Please try again.' : 'Falha ao iniciar conversa. Por favor, tente novamente.'
        }]);
        return;
      }
    }

    const userMessage = { type: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setStreamingText('');

    try {
      const response = await fetch(`/api/threads/${currentThreadId}/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: text.trim(),
          language: language,
        }),
      });

      if (response.status === 429) {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: isEnglish
            ? 'You are sending too many messages. Please wait a moment before trying again.'
            : 'Você está enviando muitas mensagens. Por favor, aguarde um momento antes de tentar novamente.'
        }]);
        setIsLoading(false);
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error('Stream failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split('\n\n');
        buffer = chunks.pop() || '';

        for (const rawChunk of chunks) {
          const line = rawChunk.trim();
          if (!line.startsWith('data:')) continue;

          const jsonText = line.slice(5).trim();
          if (!jsonText) continue;

          try {
            const payload = JSON.parse(jsonText);

            if (payload.event === 'chunk') {
              const delta = payload.text || '';
              if (delta) {
                accumulatedText += delta;
                setStreamingText(accumulatedText);
              }
            } else if (payload.event === 'final') {
              setStreamingText('');
              setMessages(prev => [...prev, {
                type: 'bot',
                text: accumulatedText || (isEnglish ? 'Sorry, I could not generate a response.' : 'Desculpe, não consegui gerar uma resposta.')
              }]);
            } else if (payload.event === 'error') {
              throw new Error(payload.detail || 'Stream error');
            }
          } catch (parseError) {
            continue;
          }
        }
      }

      if (accumulatedText && !messages.find(m => m.text === accumulatedText)) {
        setStreamingText('');
        setMessages(prev => {
          const lastBot = prev[prev.length - 1];
          if (lastBot?.type === 'bot' && lastBot?.text === accumulatedText) {
            return prev;
          }
          return [...prev, { type: 'bot', text: accumulatedText }];
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setStreamingText('');
      setMessages(prev => [...prev, {
        type: 'bot',
        text: isEnglish ? 'Sorry, I encountered an error. Please try again.' : 'Desculpe, encontrei um erro. Por favor, tente novamente.'
      }]);
    } finally {
      setIsLoading(false);
      setStreamingText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <motion.button
        onClick={handleButtonClick}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <BotMessageSquare className="w-6 h-6" />
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {isEnglish ? 'Chat with my AI version' : 'Converse com minha versão IA'}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {showCodeAnimation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                onClick={() => {
                  if (codeComplete) {
                    setShowCodeAnimation(false);
                  }
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gray-900 rounded-lg p-8 max-w-2xl w-full mx-4 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setShowCodeAnimation(false);
                      setCodeComplete(true);
                    }}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    title={isEnglish ? 'Skip animation' : 'Pular animação'}
                  >
                    <FastForward className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-gray-400 ml-2 font-mono text-sm">terminal</span>
                  </div>
                  <div 
                    ref={animationScrollRef}
                    className="bg-black/50 rounded p-4 h-96 overflow-auto font-mono text-sm hide-scrollbar"
                  >
                    {displayedCode.map((line, index) => (
                      <div key={index} className="mb-1 text-gray-300">
                        {line === '' ? (
                          <span>&nbsp;</span>
                        ) : (
                          <>
                            {line.includes('console.log') ? (
                              <>
                                <span className="text-blue-400">console</span>
                                <span className="text-gray-400">.</span>
                                <span className="text-yellow-400">log</span>
                                <span className="text-gray-400">(</span>
                                <span className="text-green-400">{line.match(/'([^']+)'/)?.[0] || ''}</span>
                                <span className="text-gray-400">)</span>
                              </>
                            ) : line.includes('//') ? (
                              <>
                                <span>{line.split('//')[0]}</span>
                                <span className="text-gray-500">//{line.split('//')[1]}</span>
                              </>
                            ) : (
                              <span>{line}</span>
                            )}
                          </>
                        )}
                        {index === displayedCode.length - 1 &&
                         currentLine < getInitializationCode(language).length &&
                         currentChar < (getInitializationCode(language)[currentLine]?.length || 0) && (
                          <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse"></span>
                        )}
                      </div>
                    ))}
                    {currentLine >= getInitializationCode(language).length && !codeComplete && (
                      <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse"></span>
                    )}
                    {codeComplete && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-400 mt-2"
                      >
                        {isEnglish ? '✓ EnzoIA is online!' : '✓ EnzoIA está online!'}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {codeComplete && !showCodeAnimation && (
              <motion.div
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-dark-secondary shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold">EA</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">EnzoIA</h3>
                      <p className="text-xs text-gray-400">Online</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-dark rounded-full transition-colors"
                  >
                    <FiX className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && !streamingText && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2 mb-4"
                    >
                      <p className="text-sm text-gray-400 mb-3 font-medium">
                        {isEnglish ? 'Suggested questions:' : 'Perguntas sugeridas:'}
                      </p>
                      {SUGGESTED_QUESTIONS.map((question, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleQuestionClick(question)}
                          className="w-full text-left p-3 rounded-lg bg-dark hover:bg-dark-lighter transition-colors text-sm text-gray-300 border border-transparent hover:border-primary/20"
                        >
                          {question}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-dark text-white'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      </motion.div>
                    </motion.div>
                  ))}

                  {streamingText && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[80%] rounded-lg p-3 bg-dark text-white">
                        <p className="text-sm whitespace-pre-wrap">{streamingText}</p>
                      </div>
                    </motion.div>
                  )}

                  {isLoading && !streamingText && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-dark rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={isEnglish ? 'Type your message...' : 'Digite sua mensagem...'}
                      className="flex-1 px-4 py-2 border border-gray-600 rounded-lg bg-dark text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isLoading}
                      className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <FiSend className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
}
