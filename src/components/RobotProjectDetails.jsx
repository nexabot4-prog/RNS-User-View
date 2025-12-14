import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    ChevronDown,
    Zap,
    Wind,
    ArrowRight,
    Cpu,
    Box
} from 'lucide-react';
import { useToast } from './Toast';
import CustomizationModal from './CustomizationModal';
import ProjectFullDetailsModal from './ProjectFullDetailsModal';
import { WobbleCard } from './ui/wobble-card';
import CheckoutModal from './CheckoutModal';
import { BackgroundBeams } from "@/components/ui/background-beams";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { ordersAPI } from '../utils/api';

const RobotProjectDetails = ({ project }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const { showToast } = useToast();
    const [activeSection, setActiveSection] = useState('Overview');

    const scrollToSection = (id) => {
        setActiveSection(id);
        let targetId = id;
        if (id === 'Applications' || id === 'Deliverables') {
            targetId = 'Specs';
        }
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleModalClose = (success) => {
        setIsModalOpen(false);
        if (success) {
            showToast('Customization request submitted successfully!', 'success');
        }
    };

    const slideInLeft = {
        hidden: { x: -50, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const slideInRight = {
        hidden: { x: 50, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#f2f2f2] dark:bg-[#0A0A0A] overflow-hidden font-display selection:bg-gray-300 dark:selection:bg-gray-700 transition-colors duration-300">

            {/* Top Navigation Bar */}
            <nav className="relative z-50 flex justify-between items-center px-8 py-6 max-w-[1600px] mx-auto">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center rounded-full font-bold text-xl hover:scale-105 transition-transform">
                            <ArrowLeft size={20} />
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {['Overview'].map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(item)}
                            className={`transition-colors hover:text-black dark:hover:text-white ${activeSection === item ? 'text-black dark:text-white font-bold' : ''}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {/* Login removed */}
                </div>
            </nav>

            {/* Hero Section - The "Robot" Display */}
            <div id="Overview" className="relative pt-8 pb-40 lg:pb-52 overflow-hidden bg-[#F0F2F5] dark:bg-[#0A0A0A] transition-colors duration-500">
                {/* Background Beams */}
                <div className="absolute inset-0 z-0">
                    <BackgroundBeams />
                </div>
                <main className="relative z-30 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 px-8 items-center">

                    {/* Left Column: Typography & CTA */}
                    <div className="md:col-span-6 lg:col-span-5 flex flex-col z-20 pt-10">
                        {/* Brand Tag */}
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Gen-V Robotics</span>
                        </div>

                        {/* Headline */}
                        <motion.div
                            initial="hidden" animate="visible" variants={slideInLeft}
                            className="relative"
                        >
                            <h1 className="text-5xl lg:text-7xl leading-[1.1] font-bold text-gray-900 dark:text-white tracking-tighter mb-6 text-balance">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                    {project.title}
                                </span>
                                <span className="text-gray-400 dark:text-gray-600 font-light ml-2">/</span>
                            </h1>
                        </motion.div>

                        {/* Discover Button & Avatars */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-6 mt-12"
                        >
                            <button
                                onClick={() => setIsCheckoutModalOpen(true)}
                                className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-600/25 hover:scale-105"
                            >
                                Buy Now
                            </button>

                            <HoverBorderGradient
                                containerClassName="rounded-full"
                                as="button"
                                className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-8 py-3"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <span className="font-bold">Customize</span>
                            </HoverBorderGradient>

                            <button
                                onClick={() => setIsDetailsModalOpen(true)}
                                className="flex items-center gap-4 px-2 py-2 pr-6 bg-white dark:bg-zinc-800 rounded-full shadow-2xl border border-white/50 dark:border-white/10 hover:scale-105 transition-transform group"
                            >
                                <span className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold text-sm">More Details</span>
                                <div className="flex -space-x-3">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" loading="lazy" className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 bg-gray-200" alt="user" />
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" loading="lazy" className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 bg-gray-200" alt="user2" />
                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                                        <ArrowRight size={12} />
                                    </div>
                                </div>
                            </button>


                        </motion.div>
                    </div>

                    <div className="md:col-span-6 lg:col-span-7 relative flex justify-center lg:justify-end z-10 h-[50vh] lg:h-[70vh] items-center">
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{
                                x: 0,
                                opacity: 1,
                                y: [0, -20, 0] // Floating animation
                            }}
                            transition={{
                                duration: 0.8,
                                ease: "easeOut",
                                y: {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                            className="relative w-full h-full"
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(59,130,246,0.5)]"
                            />
                        </motion.div>
                    </div>
                </main>


            </div>

            {/* Specs Section Removed */}

            {/* Gallery Section - Kept separate as it doesn't fit the wobble grid slightly */}
            {/* Gallery Section Removed */}

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
            />
        </div >
    );
};

export default RobotProjectDetails;
