import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Play, Star, Plus, Settings2, X } from 'lucide-react'
import { projectsAPI, ordersAPI, reviewsAPI } from '../utils/api'
import { transformProject } from '../utils/projectTransform'
import { useToast } from './Toast'

import CustomizationModal from './CustomizationModal'
import ProjectFullDetailsModal from './ProjectFullDetailsModal'
import CheckoutModal from './CheckoutModal'
import TermsModal from './TermsModal'



const ProjectDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
    const [pendingAction, setPendingAction] = useState(null) // 'checkout' or 'customize'
    const [selectedPackageForModal, setSelectedPackageForModal] = useState(null)
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [reviews, setReviews] = useState([])
    const { showToast } = useToast()

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true)
                const data = await projectsAPI.getProjectById(id)
                if (data) {
                    const transformed = transformProject(data, 0)
                    setProject(transformed)

                    const reviewsData = await reviewsAPI.getProjectReviews(id)
                    setReviews(reviewsData)
                } else {
                    showToast('Project not found', 'error')
                    navigate('/')
                }
            } catch (error) {
                console.error('Error fetching project:', error)
                showToast('Failed to load project details', 'error')
            } finally {
                setLoading(false)
            }
        }
        fetchProject()
    }, [id, navigate, showToast])

    const handleModalClose = (success) => {
        setIsModalOpen(false);
        if (success) {
            showToast('Customization request submitted details successfully!', 'success');
        }
    };

    if (loading) return <div className="min-h-screen bg-black" />
    if (!project) return null

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white pt-20 px-4 md:px-8 pb-12 overflow-x-hidden font-display">
            {/* Top Navigation / Breadcrumbs */}
            <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} /> Back
                </button>

            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Collage/Gallery Layout */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    {/* Main Image Card with top-left rounded corner */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative bg-white dark:bg-[#1A1A1A] rounded-[3rem] rounded-tl-[6rem] p-8 h-[400px] flex items-center justify-center overflow-hidden group shadow-lg dark:shadow-none"
                    >
                        <div className="absolute top-8 right-8">
                            <Plus className="text-gray-600" />
                        </div>
                        <img
                            src={project.image}
                            alt={project.title}
                            loading="lazy"
                            className="w-full h-full object-cover rounded-2xl opacity-90 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-6 left-8">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Featured Product</p>
                            <p className="text-xl font-bold">{project.formattedPrice}</p>
                        </div>
                        {/* View in 3D Badge */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white dark:bg-[#1A1A1A] rounded-full flex items-center justify-center border-4 border-gray-50 dark:border-[#0A0A0A]">
                            <span className="text-[10px] text-center font-bold text-gray-400">VIEW IN<br />3D</span>
                        </div>
                    </motion.div>

                    {/* Secondary Image Card */}
                    <div className="grid grid-cols-2 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-[2rem] p-4 md:p-6 h-20 md:h-36 relative overflow-hidden group shadow-lg"
                        >
                            <div className="absolute top-2 md:top-4 left-4">
                                <Plus className="text-gray-600 dark:text-gray-300 w-3 h-3 md:w-4 md:h-4" />
                            </div>
                            <div className="absolute bottom-2 md:bottom-4 left-4">
                                <p className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority Rating</p>
                                <p className="text-base md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                                    {project.priority ? project.priority.toUpperCase() : 'STANDARD'}
                                </p>
                            </div>
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-colors" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            onClick={() => setIsDetailsModalOpen(true)}
                            className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center h-20 md:h-36 relative group cursor-pointer hover:bg-white/20 transition-all shadow-lg overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="text-center z-10">
                                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-purple-500/30 flex items-center justify-center mx-auto mb-1 md:mb-2 bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                                    <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-[9px] md:text-xs tracking-widest text-gray-600 dark:text-gray-300 font-bold group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">MORE DETAILS</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Column: Content & Description */}
                <div className="lg:col-span-7 flex flex-col justify-center lg:pl-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl md:text-6xl font-bold leading-tight mb-6 uppercase"
                    >
                        {project.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-xl"
                    >
                        {project.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap items-center gap-4 mb-12"
                    >
                        <button
                            onClick={() => {
                                // Default buy now (no package selected yet, or default one)
                                // We'll open Terms Modal first
                                setSelectedPackageForModal(project.packages && project.packages.length > 0 ? project.packages[0] : null);
                                setPendingAction('checkout');
                                setIsTermsModalOpen(true);
                            }}
                            className="flex-1 md:flex-none bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-xs md:text-sm tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors whitespace-nowrap text-center"
                        >
                            Buy Now
                        </button>
                        <button
                            onClick={() => {
                                setPendingAction('customize');
                                setIsTermsModalOpen(true);
                            }}
                            className="flex-1 md:flex-none bg-transparent border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-xs md:text-sm tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <Settings2 size={16} />
                            Customize
                        </button>
                        <a
                            href={project.demo_video_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-1 md:flex-none h-12 md:h-14 min-w-[140px] md:w-32 bg-white dark:bg-[#1A1A1A] rounded-full flex items-center justify-center md:justify-start px-4 gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors shadow-md dark:shadow-none ${!project.demo_video_url && 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                        >
                            <div className="w-8 h-8 bg-gray-900 dark:bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                <Play size={12} fill="white" />
                            </div>
                            <span className="text-xs text-gray-400 leading-tight">Watch<br className="hidden md:block" /> Demo</span>
                        </a>
                    </motion.div>

                    {/* Packages Section */}
                    {(() => {
                        const validPackages = project.packages?.filter(pkg => pkg.price && pkg.price !== 'TBD');
                        if (!validPackages || validPackages.length === 0) return null;

                        return (
                            <div className="mb-12">
                                <h3 className="text-2xl font-bold mb-6">Available Packages</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {validPackages.map((pkg, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + (idx * 0.1) }}
                                            className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-bold text-lg">{pkg.name || `Package ${idx + 1}`}</h4>
                                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                                                    ₹{Number(pkg.price).toLocaleString()}
                                                </span>
                                            </div>
                                            {pkg.description && (
                                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{pkg.description}</p>
                                            )}
                                            {pkg.features && (
                                                <ul className="space-y-2">
                                                    {pkg.features.map((feature, fIdx) => (
                                                        <li key={fIdx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setSelectedPackageForModal(pkg);
                                                    setIsCheckoutModalOpen(true);
                                                }}
                                                className="w-full mt-6 py-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors text-sm font-medium"
                                            >
                                                Select Package
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}

                    {/* Numbered Feature List */}
                    <div className="space-y-6">
                        {project.features.slice(0, 3).map((feature, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + (idx * 0.1) }}
                                key={idx}
                                className="group cursor-pointer"
                            >
                                <div className="flex items-baseline gap-8 py-4 border-b border-gray-200 dark:border-white/10 group-hover:border-gray-400 dark:group-hover:border-white/40 transition-colors">
                                    <span className="text-2xl font-light text-gray-400 dark:text-gray-600 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                        0{idx + 1}
                                    </span>
                                    <div className="flex-1 flex justify-between items-baseline">
                                        <p className="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors uppercase">
                                            {feature}
                                        </p>
                                        <span className="text-xs text-gray-600 font-mono">/2025</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Project Gallery Section */}
            {
                project.project_images && project.project_images.length > 0 && (
                    <div className="max-w-7xl mx-auto mt-20">
                        <h3 className="text-2xl font-bold mb-8 pl-4 border-l-4 border-black dark:border-white">Project Gallery</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-0">
                            {project.project_images.map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="aspect-square relative group overflow-hidden rounded-2xl cursor-pointer"
                                >
                                    <img
                                        src={typeof img === 'string' ? img : img.url}
                                        alt={`Gallery ${idx}`}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Plus className="text-white w-8 h-8" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )
            }

            {/* Customer Reviews Section */}
            <div className="max-w-7xl mx-auto mt-20 mb-20 px-4 sm:px-0">
                <div className="flex justify-between items-center mb-8 pl-4 pr-4 sm:pr-0">
                    <h3 className="text-2xl font-bold border-l-4 border-black dark:border-white pl-4">Customer Reviews</h3>
                    <button
                        onClick={() => setIsReviewModalOpen(true)}
                        className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                    >
                        Write a Review
                    </button>
                </div>

                {/* Review Summary */}
                <div className="flex items-center gap-4 mb-8 pl-4">
                    <div className="flex items-center gap-1">
                        <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                            {reviews && reviews.length > 0
                                ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
                                : '0.0'
                            }
                        </span>
                    </div>
                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {reviews && reviews.length > 0 ? 'Verified Reviews' : 'No reviews yet'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Based on {reviews ? reviews.length : 0} reviews
                        </span>
                    </div>
                </div>

                {/* Reviews Grid */}
                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review, idx) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{review.user_name}</h4>
                                        <div className="flex gap-0.5 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-full">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    "{review.comment}"
                                </p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 dark:bg-white/5 rounded-2xl">
                        <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
                    </div>
                )}
            </div>

            <CustomizationModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                projectTitle={project.title}
            />

            <ProjectFullDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                project={project}
            />
            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                project={project}
                initialPackage={selectedPackageForModal}
            />
            {/* Terms Modal */}
            {/* Terms Modal */}
            <TermsModal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
                onAccept={() => {
                    setIsTermsModalOpen(false);
                    if (pendingAction === 'checkout') {
                        setIsCheckoutModalOpen(true);
                    } else if (pendingAction === 'customize') {
                        setIsModalOpen(true);
                    }
                    setPendingAction(null);
                }}
            />

            {/* Write Review Modal and Success Refresh */}
            <WriteReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                projectId={project.id}
                onSuccess={() => {
                    const fetchReviews = async () => {
                        const data = await reviewsAPI.getProjectReviews(project.id);
                        if (data) {
                            setReviews(data);
                            showToast('Review submitted successfully!', 'success');
                        }
                    }
                    fetchReviews();
                }}
            />
        </div >
    )
}

// Simple Write Review Modal Component
const WriteReviewModal = ({ isOpen, onClose, projectId, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useToast();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !comment.trim()) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        setSubmitting(true);
        // import reviewsAPI inside or utilize the one from parent? 
        // to avoid import issues, I'll assume reviewsAPI is imported in the file.
        // It is imported as 'reviewsAPI' from '../utils/api'.

        const { success } = await reviewsAPI.createReview({
            project_id: projectId,
            user_name: name,
            rating,
            comment
        });

        setSubmitting(false);

        if (success) {
            onSuccess();
            onClose();
            setName('');
            setComment('');
            setRating(5);
        } else {
            showToast('Failed to submit review', 'error');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white dark:bg-[#1A1A1A] w-full max-w-md rounded-2xl p-6 shadow-xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Write a Review</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Your Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-2xl transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-700'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Comment</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 h-32 resize-none"
                            placeholder="Share your experience..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ProjectDetails;
