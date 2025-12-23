import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import TermsAndConditions from './TermsAndConditions';

const TermsModal = ({ isOpen, onClose, onAccept }) => {
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 z-10">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                    📜
                                </span>
                                Terms & Conditions
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                            <TermsAndConditions />
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-neutral-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                                By clicking "Accept & Proceed", you agree to the terms above.
                            </p>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={onClose}
                                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onAccept}
                                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-primary text-white dark:text-black font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <span>Accept & Proceed</span>
                                    <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TermsModal;
