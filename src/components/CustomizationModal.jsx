import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Calendar, FileText, Type, ChevronRight, ChevronLeft, Upload, File, User, Mail, School, Star } from 'lucide-react';
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/components/Toast";
import { ordersAPI } from '../utils/api';

import OrderSuccessModal from './OrderSuccessModal';

const CustomizationModal = ({ isOpen, onClose, projectTitle }) => {
    const { showToast } = useToast();
    const [step, setStep] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successDetails, setSuccessDetails] = useState(null);
    const [formData, setFormData] = useState({
        // Step 1: Basic Details
        title: projectTitle || '',
        abstract: '',
        deadline: '',

        // Step 2: Technical Specs
        requirements: '',
        specifications: '',
        features: '',
        file: null,

        // Step 3: Personal Details
        name: '',
        email: '',
        phone: '',
        college: ''
    });

    const ABSTRACT_CHAR_LIMIT = 500;
    const MAX_FILE_SIZE_MB = 10;

    const handleFileUpload = (files) => {
        if (files && files.length > 0) {
            const file = files[0];
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                showToast(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`, 'error');
                return;
            }
            if (file.type !== 'application/pdf') {
                showToast('Only PDF files are allowed.', 'error');
                return;
            }

            setFormData({ ...formData, file: file });
        }
    };

    const validateStep = (currentStep) => {
        switch (currentStep) {
            case 1:
                if (!formData.title.trim()) return "Please enter a Project Title.";
                if (!formData.abstract.trim()) return "Please provide a Project Abstract.";
                if (!formData.deadline) return "Please select a Deadline.";
                return null;
            case 2:
                if (!formData.requirements.trim()) return "Please specify your Requirements.";
                if (!formData.features.trim()) return "Please list the Key Features.";
                return null;
            case 3:
                if (!formData.name.trim()) return "Please enter your Name.";
                if (!formData.email.trim()) return "Please enter your Email.";
                if (!formData.phone.trim()) return "Please enter your Phone Number.";
                if (!formData.phone.match(/^\d{10}$/)) return "Please enter a valid 10-digit Phone Number.";
                if (!formData.college.trim()) return "Please enter your College/Organization.";
                return null;
            default:
                return null;
        }
    };

    const nextStep = (e) => {
        e.preventDefault();
        const error = validateStep(step);
        if (error) {
            showToast(error, 'error');
            return;
        }
        if (step < 3) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validateStep(3);
        if (error) {
            showToast(error, 'error');
            return;
        }

        showToast('Submitting request...', 'info');

        let fileUrl = null;
        if (formData.file) {
            showToast('Uploading file...', 'info');
            const { success, publicUrl, error: uploadError } = await ordersAPI.uploadFile(formData.file);
            if (!success) {
                showToast(uploadError || 'File upload failed. Please try again.', 'error');
                return;
            }
            fileUrl = publicUrl;
        }

        try {
            const { success, error: apiError } = await ordersAPI.createOrder({
                project_title: formData.title,
                // Use 0 or a base price if available, or null if schema allows (we made it nullable)
                price: 0,
                status: 'customization_requested',
                // Customer Details
                customer_name: formData.name,
                phone_number: formData.phone,
                college_name: formData.college,
                user_email: formData.email,
                // Custom Fields
                is_custom: true,
                custom_abstract: formData.abstract,
                custom_deadline: formData.deadline,
                custom_requirements: formData.requirements,
                custom_features: formData.features,
                file_url: fileUrl
                // Note: File upload logic would go here if API supported storage
            });

            if (success) {
                // showToast('Customization request submitted!', 'success');
                // Trigger Success Modal instead of closing immediately
                const orderDetailsForModal = {
                    project_title: formData.title,
                    customer_name: formData.name,
                    user_email: formData.email,
                    phone_number: formData.phone,
                    id: 'REF-' + Math.random().toString(36).substr(2, 6).toUpperCase() // Placeholder ID until API returns real one
                };
                setSuccessDetails(orderDetailsForModal);
                setShowSuccess(true);

                // Send Email in background
                ordersAPI.sendOrderEmail(orderDetailsForModal);

                // Reset form in background
                setTimeout(() => setStep(1), 500);
                setFormData({
                    title: projectTitle || '',
                    abstract: '',
                    deadline: '',
                    requirements: '',
                    specifications: '',
                    features: '',
                    file: null,
                    name: '',
                    email: '',
                    phone: '',
                    college: ''
                });
            } else {
                console.error("Order creation failed:", apiError);
                if (apiError && apiError.code === '400') {
                    showToast('Database Schema mismatch. Please run migration.', 'error');
                } else {
                    showToast('Failed to submit request. Please try again.', 'error');
                }
            }
        } catch (err) {
            console.error("Unexpected error in CustomizationModal:", err);
            showToast('An unexpected error occurred.', 'error');
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        onClose(true); // Close parent modal
    };

    const renderStep1 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
        >
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Type size={16} className="text-primary" />
                    Project Title (Custom)
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600"
                    placeholder="e.g. Advanced IOT Surveillance System"
                    required
                />
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FileText size={16} className="text-primary" />
                    Project Abstract / Description
                    <span className="ml-auto text-xs text-gray-500">
                        {formData.abstract.length}/{ABSTRACT_CHAR_LIMIT}
                    </span>
                </label>
                <textarea
                    value={formData.abstract}
                    onChange={(e) => {
                        if (e.target.value.length <= ABSTRACT_CHAR_LIMIT) {
                            setFormData({ ...formData, abstract: e.target.value });
                        }
                    }}
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all h-32 resize-none placeholder:text-gray-500 dark:placeholder:text-gray-600 custom-scrollbar"
                    placeholder="Describe your project idea, core features, and specific goals..."
                    required
                />
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar size={16} className="text-primary" />
                    Preferred Deadline
                </label>
                <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [color-scheme:light] dark:[color-scheme:dark]"
                    required
                />
            </div>
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
        >
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Type size={16} className="text-primary" />
                    Project Requirements & Specs
                </label>
                <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all h-24 resize-none placeholder:text-gray-500 dark:placeholder:text-gray-600 custom-scrollbar"
                    placeholder="Hardware specs, microcontroller preferences, specific sensors..."
                    required
                />
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Star size={16} className="text-primary" />
                    Key Features
                </label>
                <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all h-24 resize-none placeholder:text-gray-500 dark:placeholder:text-gray-600 custom-scrollbar"
                    placeholder="List the must-have features..."
                    required
                />
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Upload size={16} className="text-primary" />
                    Reference Documents (PDF)
                    <span className="ml-auto text-xs text-gray-500">Max {MAX_FILE_SIZE_MB}MB</span>
                </label>
                <div className="w-full border border-dashed bg-gray-50 dark:bg-black/40 border-gray-300 dark:border-white/10 rounded-lg overflow-hidden">
                    <FileUpload onChange={handleFileUpload} description="Upload Synopsis or Basic Report (PDF format)" />
                </div>
            </div>
        </motion.div>
    );

    const renderStep3 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
        >
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User size={16} className="text-primary" />
                    Full Name
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600"
                    placeholder="Your Name"
                    required
                />
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail size={16} className="text-primary" />
                    Email Address
                </label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600"
                    placeholder="your.email@example.com"
                    required
                />
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Type size={16} className="text-primary" />
                    Phone Number
                </label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, phone: val });
                    }}
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600"
                    placeholder="10-digit Phone Number"
                    required
                />
            </div>

            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <School size={16} className="text-primary" />
                    College / Organization Name
                </label>
                <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600"
                    placeholder="University Name"
                    required
                />
            </div>
        </motion.div>
    );

    const getStepTitle = () => {
        switch (step) {
            case 1: return "Basic Project Details";
            case 2: return "Technical Requirements";
            case 3: return "Personal Information";
            default: return "";
        }
    };

    const Star = ({ size = 24, className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
    )

    return (
        <AnimatePresence>
            {showSuccess && (
                <OrderSuccessModal
                    isOpen={showSuccess}
                    onClose={handleSuccessClose}
                    orderDetails={successDetails}
                    type="customization"
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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 w-full max-w-xl rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]">
                            {/* Header */}
                            <div className="relative p-6 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-[#1A1A1A] flex justify-center items-center">
                                <div className="flex flex-col items-center space-y-2">
                                    <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase border border-primary/20">
                                        Step {step} of 3
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">{getStepTitle()}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {projectTitle ? (
                                            <>Customizing <span className="text-gray-900 dark:text-white italic">"{projectTitle}"</span></>
                                        ) : (
                                            <span className="text-primary font-medium">New Project Request</span>
                                        )}
                                    </p>
                                </div>
                                <button
                                    onClick={() => onClose(false)}
                                    className="absolute right-6 top-6 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors group"
                                >
                                    <X className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" size={20} />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-100 dark:bg-white/5 h-1">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: '33%' }}
                                    animate={{ width: `${(step / 3) * 100}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>

                            {/* Form Content */}
                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative">
                                <form id="customization-form" onSubmit={handleSubmit}>
                                    <AnimatePresence mode="wait">
                                        {step === 1 && <motion.div key="step1">{renderStep1()}</motion.div>}
                                        {step === 2 && <motion.div key="step2">{renderStep2()}</motion.div>}
                                        {step === 3 && <motion.div key="step3">{renderStep3()}</motion.div>}
                                    </AnimatePresence>
                                </form>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#1A1A1A] flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className={`flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors ${step === 1 ? 'invisible' : ''}`}
                                >
                                    <ChevronLeft size={16} /> Back
                                </button>

                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-black dark:bg-white text-white dark:text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg"
                                    >
                                        Next <ChevronRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        form="customization-form"
                                        type="submit"
                                        className="bg-black dark:bg-white text-white dark:text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg"
                                    >
                                        Submit Request <Send size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CustomizationModal;
