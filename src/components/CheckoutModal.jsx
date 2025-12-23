import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, School, Phone, ShoppingCart, Loader2, Package, Check, ChevronDown } from 'lucide-react';
import { useToast } from './Toast';
import { ordersAPI } from '../utils/api';

import OrderSuccessModal from './OrderSuccessModal';

const CheckoutModal = ({ isOpen, onClose, project, initialPackage }) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successDetails, setSuccessDetails] = useState(null);

    const [selectedPackage, setSelectedPackage] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college: ''
    });

    // Reset state and set default package when modal opens
    useEffect(() => {
        if (isOpen && project) {
            if (initialPackage) {
                setSelectedPackage(initialPackage);
            } else if (project.packages && project.packages.length > 0) {
                // Auto-select the first package if none provided
                setSelectedPackage(project.packages[0]);
            } else {
                setSelectedPackage(null);
            }
            setFormData({ name: '', email: '', phone: '', college: '' });
        }
    }, [isOpen, project, initialPackage]);

    // Prevent background scrolling
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);


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

        // Append package info to project title if selected
        const finalProjectTitle = selectedPackage
            ? `${project.title} - ${selectedPackage.name}`
            : project.title;

        const finalPrice = selectedPackage
            ? selectedPackage.price
            : project.price;

        const { success, error } = await ordersAPI.createOrder({
            project_id: project.id,
            project_title: finalProjectTitle,
            price: finalPrice,
            status: 'pending',
            customer_name: formData.name,
            phone_number: formData.phone,
            college_name: formData.college,
            user_email: formData.email
            // You might want to pass package details specifically if backend supports it
            // package_details: selectedPackage 
        });

        if (success) {
            const orderDetailsForModal = {
                project_title: finalProjectTitle,
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
                        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 w-full max-w-lg rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]">

                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-[#1A1A1A] flex justify-between items-center shrink-0">
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

                            {/* Content */}
                            <div className="overflow-y-auto custom-scrollbar">
                                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                                    {/* Package Selection Dropdown */}
                                    {project?.packages?.length > 0 && (
                                        <div className="mb-6">
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <Package size={16} className="text-blue-500" />
                                                Select Package
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={selectedPackage?.name || ''}
                                                    onChange={(e) => {
                                                        const pkg = project.packages.find(p => p.name === e.target.value);
                                                        setSelectedPackage(pkg);
                                                    }}
                                                    className="w-full appearance-none bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 pr-10 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer font-medium"
                                                >
                                                    {project.packages.map((pkg, idx) => (
                                                        <option key={idx} value={pkg.name}>
                                                            {pkg.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                                            </div>

                                            {/* Selected Package Details Preview */}
                                            {selectedPackage && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    key={selectedPackage.name}
                                                    className="mt-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedPackage.name}</span>
                                                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                            ₹{selectedPackage.price ? Number(selectedPackage.price).toLocaleString() : 'TBD'}
                                                        </span>
                                                    </div>

                                                    {selectedPackage.description && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 italic">
                                                            {selectedPackage.description}
                                                        </p>
                                                    )}

                                                    {selectedPackage.features && selectedPackage.features.length > 0 && (
                                                        <>
                                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Includes:</p>
                                                            <ul className="space-y-2">
                                                                {selectedPackage.features.map((feat, i) => (
                                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
                                                                        <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                                                                        <span>{feat}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </>
                                                    )}
                                                </motion.div>
                                            )}
                                        </div>
                                    )}

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
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CheckoutModal;
