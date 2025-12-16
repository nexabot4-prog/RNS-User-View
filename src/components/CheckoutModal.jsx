import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, School, Phone, ShoppingCart, Loader2 } from 'lucide-react';
import { useToast } from './Toast';
import { ordersAPI } from '../utils/api';

import OrderSuccessModal from './OrderSuccessModal';

const CheckoutModal = ({ isOpen, onClose, project }) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successDetails, setSuccessDetails] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        if (!formData.phone.match(/^\d{10}$/)) {
            showToast('Please enter a valid 10-digit phone number.', 'error');
            return;
        }

        setLoading(true);

        const { success, error } = await ordersAPI.createOrder({
            project_id: project.id,
            project_title: project.title,
            price: project.price,
            status: 'pending',
            customer_name: formData.name,
            phone_number: formData.phone,
            college_name: formData.college,
            user_email: formData.email
        });

        if (success) {
            const orderDetailsForModal = {
                project_title: project.title,
                customer_name: formData.name,
                user_email: formData.email,
                phone_number: formData.phone,
                id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase()
            };

            setSuccessDetails(orderDetailsForModal);
            setShowSuccess(true);

            // Send Email in background
            ordersAPI.sendOrderEmail(orderDetailsForModal);

            setFormData({ name: '', email: '', phone: '', college: '' });
        } else {
            showToast('Failed to place order. Please try again.', 'error');
        }
        setLoading(false);
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        onClose(true);
    };

    return (
        <AnimatePresence>
            {showSuccess && (
                <OrderSuccessModal
                    isOpen={showSuccess}
                    onClose={handleSuccessClose}
                    orderDetails={successDetails}
                    type="buy_now"
                />
            )}
            {isOpen && !showSuccess && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onClose(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 text-left"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none text-left"
                    >
                        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 w-full max-w-lg rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-[#1A1A1A] flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">Checkout</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Buying <span className="text-gray-900 dark:text-white font-medium">{project?.title}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => onClose(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors group"
                                >
                                    <X className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" size={20} />
                                </button>
                            </div>

                            {/* Form Content */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <User size={16} className="text-blue-500" />
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <Mail size={16} className="text-blue-500" />
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <Phone size={16} className="text-blue-500" />
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setFormData({ ...formData, phone: val });
                                        }}
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600"
                                        placeholder="10-digit mobile number"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <School size={16} className="text-blue-500" />
                                        College / Organization (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.college}
                                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600"
                                        placeholder="Enter college name"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Place Order <ShoppingCart size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CheckoutModal;
