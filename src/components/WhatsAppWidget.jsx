import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WhatsAppWidget = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Show widget after brief delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const phoneNumber = "919361099180"; // Using specific number if known, otherwise generic
    const message = encodeURIComponent("Hi! I'm interested in a custom project.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    const handleChatClick = () => {
        window.open(whatsappUrl, '_blank');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
                    {/* Tooltip / Greeting Bubble */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                className="bg-white dark:bg-neutral-900 shadow-xl rounded-2xl p-4 mb-2 max-w-[250px] border border-neutral-100 dark:border-neutral-800"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Chat with us! 👋</h4>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                    Need help with a project? We're online and ready to assist!
                                </p>
                                <button
                                    onClick={handleChatClick}
                                    className="w-full py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-bold transition-colors"
                                >
                                    Start Chat
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Button */}
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] rounded-full flex items-center justify-center text-white relative group"
                    >
                        {isExpanded ? <X size={28} /> : (
                            <svg
                                viewBox="0 0 24 24"
                                width="28"
                                height="28"
                                fill="currentColor"
                                className="text-white"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        )}




                    </motion.button>
                </div>
            )}
        </AnimatePresence>
    );
};

export default WhatsAppWidget;
