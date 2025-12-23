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
                            className="flex flex-wrap items-center gap-4 mt-12 justify-start"
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

                            {project.demo_video_url && (
                                <a
                                    href={project.demo_video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-lg hover:scale-110 transition-transform group"
                                    title="Watch Demo"
                                >
                                    <Zap size={20} className="text-yellow-500 fill-yellow-500" />
                                </a>
                            )}


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
            {/* Packages Section */}
            {project.packages && project.packages.length > 0 && (
                <section className="py-20 bg-white dark:bg-[#0A0A0A] relative z-20">
                    <div className="max-w-[1600px] mx-auto px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <h2 className="text-4xl font-bold mb-4 text-black dark:text-white">Project Packages</h2>
                            <p className="text-gray-500 dark:text-gray-400 max-w-2xl">Choose the configuration that best suits your needs.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {project.packages.map((pkg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="group relative bg-[#F2F2F2] dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-3xl p-8 hover:border-blue-500/50 transition-colors overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Box size={100} />
                                    </div>

                                    <h3 className="text-2xl font-bold mb-2 text-black dark:text-white">{pkg.name || `Package ${idx + 1}`}</h3>
                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                                        ₹{pkg.price ? Number(pkg.price).toLocaleString() : 'TBD'}
                                    </div>

                                    {pkg.description && (
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">{pkg.description}</p>
                                    )}

                                    <div className="space-y-4 mb-8">
                                        {pkg.features && pkg.features.map((feature, fIdx) => (
                                            <div key={fIdx} className="flex items-start gap-3">
                                                <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                                    <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                                                </div>
                                                <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setIsCheckoutModalOpen(true)}
                                        className="w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white dark:hover:text-black transition-all"
                                    >
                                        Select Package
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Project Gallery & Technical Resources */}
            {(project.project_images?.length > 0 || project.block_diagrams?.length > 0) && (
                <section className="py-20 bg-[#F0F2F5] dark:bg-[#050505] relative z-20">
                    <div className="max-w-[1600px] mx-auto px-8">
                        {project.project_images?.length > 0 && (
                            <div className="mb-20">
                                <h2 className="text-4xl font-bold mb-12 text-black dark:text-white">Visual Gallery</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {project.project_images.map((img, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 group relative"
                                        >
                                            <img
                                                src={typeof img === 'string' ? img : img.url}
                                                alt={`Gallery ${idx}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(project.block_diagrams?.length > 0 || project.project_documents?.length > 0) && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {project.block_diagrams?.length > 0 && (
                                    <div>
                                        <h3 className="text-2xl font-bold mb-6 text-black dark:text-white flex items-center gap-3">
                                            <Layers className="text-blue-600" /> Block Diagrams
                                        </h3>
                                        <div className="space-y-4">
                                            {project.block_diagrams.map((bd, idx) => (
                                                <div key={idx} className="bg-white dark:bg-[#111] p-4 rounded-xl border border-gray-200 dark:border-white/5 flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">{bd.title || `System Diagram ${idx + 1}`}</span>
                                                    <a href={bd.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:underline">View</a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {project.project_documents?.length > 0 && (
                                    <div>
                                        <h3 className="text-2xl font-bold mb-6 text-black dark:text-white flex items-center gap-3">
                                            <Database className="text-purple-600" /> Documentation
                                        </h3>
                                        <div className="space-y-4">
                                            {project.project_documents.map((doc, idx) => (
                                                <a
                                                    key={idx}
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-white dark:bg-[#111] p-4 rounded-xl border border-gray-200 dark:border-white/5 flex items-center justify-between group hover:border-purple-500/30 transition-colors"
                                                >
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">{doc.title || `Tech Spec ${idx + 1}`}</span>
                                                    <div className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold">PDF</div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            )}

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
