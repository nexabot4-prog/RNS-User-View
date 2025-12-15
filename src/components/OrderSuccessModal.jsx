import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Download, Share2, FileText, Clock, ShieldCheck, MessageCircle, Mail } from 'lucide-react';
import { useToast } from './Toast';

const OrderSuccessModal = ({ isOpen, onClose, orderDetails, type = 'customization' }) => {
    const { showToast } = useToast();

    if (!isOpen) return null;

    const handleDownload = () => {
        const content = `
RNS INNOBOTICS - ORDER SUMMARY
================================================
Order ID: ${orderDetails?.id || 'PENDING'}
Date: ${new Date().toLocaleDateString()}
Status: Pending Invoice Generation
------------------------------------------------
Project: ${orderDetails?.project_title || 'Custom Project'}
Type: ${type === 'buy_now' ? 'Direct Purchase' : 'Customization Request'}
Customer: ${orderDetails?.customer_name || 'Valued Customer'}
Email: ${orderDetails?.user_email || 'N/A'}
Phone: ${orderDetails?.phone_number || 'N/A'}
------------------------------------------------
NEXT STEPS:
1. Our team will review your request.
2. An invoice will be generated within 24-48 hours.
3. We will contact you via email/phone for confirmation.

For urgent queries, contact: rnsinnobotics@gmail.com
================================================
`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `RNS_Order_${orderDetails?.id || 'Summary'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showToast('Order summary downloaded successfully!', 'success');
    };

    const handleShare = async () => {
        const text = `I just placed an order for "${orderDetails?.project_title}" at RNS Innobotics! Order ID: ${orderDetails?.id}`;
        try {
            await navigator.clipboard.writeText(text);
            showToast('Order details copied to clipboard!', 'success');
        } catch (err) {
            showToast('Failed to copy. Please try again.', 'error');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none"
                    >
                        <div className="bg-[#121212] border border-primary/20 w-full max-w-lg rounded-2xl shadow-2xl pointer-events-auto overflow-hidden relative">
                            {/* Confetti / Decoration */}
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                            <div className="p-8 flex flex-col items-center text-center space-y-6">
                                {/* Success Icon */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", duration: 0.8 }}
                                    className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-2 ring-1 ring-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                                >
                                    <Check size={40} className="text-green-500" strokeWidth={3} />
                                </motion.div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold text-white tracking-tight">Request Received!</h2>
                                    <p className="text-gray-400">
                                        Thank you, <span className="text-primary font-medium">{orderDetails?.customer_name}</span>.
                                        We have received your <span className="text-white">{type === 'buy_now' ? 'order' : 'customization request'}</span>.
                                    </p>
                                </div>

                                {/* Status Card */}
                                <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-yellow-500/20 p-2 rounded-lg">
                                            <Clock size={20} className="text-yellow-500" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Current Status</p>
                                            <p className="text-white font-medium">Pending Invoice</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                                            In Review
                                        </span>
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-200 flex gap-3 text-left">
                                    <ShieldCheck className="shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <p className="font-semibold mb-1">What happens next?</p>
                                        <p className="opacity-80">
                                            Our team will review your requirements and generate a detailed invoice within <span className="font-bold text-white">24-48 hours</span>. You will receive an update via email or phone.
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 w-full pt-2">
                                    <button
                                        onClick={handleDownload}
                                        className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all group"
                                    >
                                        <Download size={18} className="group-hover:scale-110 transition-transform" />
                                        Save Info
                                    </button>
                                    <button
                                        onClick={() => {
                                            const text = `Hi, I just placed an order for "${orderDetails?.project_title}". Order ID: ${orderDetails?.id}. Status: Pending Invoice.`;
                                            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                        }}
                                        className="flex-1 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 text-[#25D366] py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all group"
                                    >
                                        <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                                        WhatsApp
                                    </button>
                                    <button
                                        onClick={() => {
                                            const subject = `Order Details: ${orderDetails?.project_title}`;
                                            const body = `Here are the details of my order:\n\nOrder ID: ${orderDetails?.id}\nProject: ${orderDetails?.project_title}\nStatus: Pending Invoice`;
                                            window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                                        }}
                                        className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all group"
                                    >
                                        <Mail size={18} className="group-hover:scale-110 transition-transform" />
                                        Email
                                    </button>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-white text-sm mt-4 hover:underline transition-all"
                                >
                                    Close Window
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default OrderSuccessModal;
