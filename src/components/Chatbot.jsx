import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { processUserMessage } from '../lib/localChatLogic';
import { projectsAPI } from '../utils/api';
import lumoLogo from '../assets/lumo_logo.jpg';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hey 👋 I’m Lumo.\n\nLooking for a cool project? Ask me about IoT, Robotics, or AI!", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize: Fetch projects to "train" the local bot
    useEffect(() => {
        const loadProjects = async () => {
            const data = await projectsAPI.getAll();
            setProjects(data);
        };
        loadProjects();
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userText = inputText;
        const userMessage = {
            id: Date.now(),
            text: userText,
            sender: 'user'
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText("");
        setIsLoading(true);

        // Simulate "thinking" delay for realism
        setTimeout(() => {
            try {
                const response = processUserMessage(userText, projects);

                const botMessage = {
                    id: Date.now() + 1,
                    text: response.text,
                    sender: 'bot',
                    relatedProjects: response.projects // Save related projects if any (for future clicks)
                };
                setMessages(prev => [...prev, botMessage]);
            } catch (error) {
                console.error("Local Lumo error:", error);
                const errorMessage = {
                    id: Date.now() + 1,
                    text: "I'm having a little trouble connecting to my database. Try again in a moment!",
                    sender: 'bot'
                };
                setMessages(prev => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        }, 600);
    };

    // Helper to render message text with bolding
    const renderMessageText = (text) => {
        return text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
                {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}
                <br />
            </React.Fragment>
        ));
    };

    return (
        <>
            {/* Toggle Button */}
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.button
                        key="pill"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white dark:bg-zinc-800 p-2 pr-6 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-white/10 group cursor-pointer"
                    >
                        <div className="relative">
                            <img src={lumoLogo} alt="Lumo" className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-zinc-700" />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-800 rounded-full animate-pulse"></span>
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">Chat with Lumo</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Ask about projects!</p>
                        </div>
                    </motion.button>
                ) : (
                    <motion.button
                        key="close-btn"
                        initial={{ rotate: -90, scale: 0, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 90, scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center"
                    >
                        <X className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[80vh] flex flex-col bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-violet-600/90 to-indigo-600/90 backdrop-blur-md flex items-center gap-3 border-b border-white/10">
                            <div className="relative">
                                <img src={lumoLogo} alt="Lumo" className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-transparent rounded-full animate-pulse"></span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Lumo (Local)</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    <span className="text-xs text-indigo-100">Online • Project Assistant</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                            ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-br-none'
                                            : 'bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-100 border border-white/20 rounded-bl-none'
                                            }`}
                                    >
                                        {renderMessageText(msg.text)}

                                        {/* Suggestion Chips / Project Links could go here if we wanted clickable cards */}
                                        {msg.relatedProjects && msg.relatedProjects.length > 0 && (
                                            <div className="mt-3 flex flex-col gap-2">
                                                {msg.relatedProjects.map(p => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            navigate(`/project/${p.id}`);
                                                        }}
                                                        className="text-xs text-left bg-indigo-50 dark:bg-white/10 hover:bg-indigo-100 dark:hover:bg-white/20 p-2 rounded-lg transition-colors border border-indigo-100 dark:border-white/10"
                                                    >
                                                        <span className="font-bold block text-indigo-700 dark:text-indigo-300">{p.title}</span>
                                                        <span className="opacity-70 truncate block">{p.category}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-3.5 rounded-2xl rounded-bl-none border border-white/20 shadow-sm flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Lumo is thinking...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/5 dark:bg-black/20 backdrop-blur-md border-t border-white/10">
                            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Ask Lumo anything..."
                                    className="w-full bg-white/10 dark:bg-black/20 border border-white/10 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isLoading}
                                    className="absolute right-2 p-2 rounded-lg bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 text-center">
                                NOTE: We are working on Lumo. It may provide incorrect answers or miss some projects.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
