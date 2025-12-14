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
import { WobbleCard } from './ui/wobble-card';

const RobotProjectDetails = ({ project }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                    {['Overview', 'Specs', 'Applications', 'Deliverables', 'Gallery'].map((item) => (
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
                                {project.title}
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
                                onClick={() => setIsModalOpen(true)}
                                className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-sm shadow-xl hover:bg-blue-700 hover:scale-105 transition-all border border-blue-400/30"
                            >
                                Customize
                            </button>

                            <button
                                onClick={() => scrollToSection('Specs')}
                                className="flex items-center gap-4 px-2 py-2 pr-6 bg-white dark:bg-zinc-800 rounded-full shadow-2xl border border-white/50 dark:border-white/10 hover:scale-105 transition-transform group"
                            >
                                <span className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold text-sm">Discover</span>
                                <div className="flex -space-x-3">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 bg-gray-200" alt="user" />
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 bg-gray-200" alt="user2" />
                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                                        <ArrowRight size={12} />
                                    </div>
                                </div>
                            </button>

                            <div
                                onClick={() => scrollToSection('Specs')}
                                className="hidden lg:flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 transition-colors"
                            >
                                <div className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-sm">
                                    <ChevronDown size={16} />
                                </div>
                                <span>Scroll for Specs</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Hero Image - The "Robot" */}
                    <div className="md:col-span-6 lg:col-span-7 relative flex justify-center lg:justify-end z-10 h-[50vh] lg:h-[70vh] items-center">
                        <motion.img
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            src={project.image}
                            alt={project.title}
                            className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                        />

                        {/* Floating Stats removed */}
                    </div>
                </main>

                {/* Custom Shaped Divider - "The Tab" */}
                {/* This replicates the specific curve from the reference image where the black section rises up with rounded corners */}
                <div className="absolute bottom-[-1px] left-0 w-full">
                    <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block align-middle" preserveAspectRatio="none">
                        <path d="M0 100H1440V60C1440 60 1100 60 1050 60C1000 60 950 0 720 0C490 0 440 60 390 60C340 60 0 60 0 60V100Z" fill="#111111" className="dark:fill-[#111111]" />
                    </svg>
                </div>

                {/* Little downward arrow connector */}
                <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 z-40 text-gray-400 animate-bounce">
                    <ArrowRight size={24} className="rotate-90" />
                </div>
            </div>

            {/* Dark Section - The "Information" with Wobble Cards */}
            <div id="Specs" className="bg-[#111111] pt-32 pb-32 px-8 min-h-screen text-white relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">

                    {/* Card 1: Tech Specs (Replaces Applications) */}
                    <WobbleCard
                        containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
                        className=""
                    >
                        <div className="max-w-xs">
                            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                Technical Specifications
                            </h2>
                            <div className="mt-4 text-left text-base/6 text-neutral-200">
                                {project.tech_specs && Object.keys(project.tech_specs).length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {Object.entries(project.tech_specs).slice(0, 5).map(([key, value]) => (
                                            <div key={key} className="flex justify-between items-center border-b border-white/10 pb-1">
                                                <span className="capitalize opacity-80 text-sm">{key.replace(/_/g, ' ')}</span>
                                                <span className="font-mono font-bold">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No specifications available.</p>
                                )}
                            </div>
                        </div>
                        <div className="absolute -right-4 lg:-right-[40%] text-white/10 -bottom-10 object-contain rounded-2xl">
                            <Zap size={300} />
                        </div>
                    </WobbleCard>

                    {/* Card 2: Deliverables List */}
                    <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-neutral-800">
                        <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                            Included Deliverables
                        </h2>
                        <div className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200 space-y-2">
                            {project.deliverables && project.deliverables.length > 0 ? (
                                project.deliverables.slice(0, 4).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 border-b border-white/10 pb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        <span className="text-sm">{item}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">No specific deliverables listed.</p>
                            )}
                        </div>
                    </WobbleCard>

                    {/* Card 3: Deployment Package */}
                    <WobbleCard
                        containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]"
                    >
                        <div className="max-w-sm">
                            <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                Deployment Package
                            </h2>
                            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                                {project.deliverables && project.deliverables.length > 0
                                    ? `Includes: ${project.deliverables.join(', ')}.`
                                    : "Standard deployment package."}
                            </p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="mt-6 px-6 py-2 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Customize & Request
                            </button>
                        </div>
                        <div className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl text-blue-950/40">
                            <Box size={400} />
                        </div>
                    </WobbleCard>

                    {/* Card 4: Working Principle */}
                    <WobbleCard
                        containerClassName="col-span-1 lg:col-span-3 bg-violet-900 min-h-[300px]"
                    >
                        <div className="max-w-4xl">
                            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                Working Principle
                            </h2>
                            <p className="mt-4 text-left text-base/6 text-neutral-200 whitespace-pre-line">
                                {project.working_principle || "No working principle details provided."}
                            </p>
                        </div>
                        <div className="absolute -right-10 -bottom-10 text-violet-950/40">
                            <Cpu size={300} />
                        </div>
                    </WobbleCard>
                </div>
            </div>

            {/* Gallery Section - Kept separate as it doesn't fit the wobble grid slightly */}
            <div id="Gallery" className="max-w-7xl mx-auto mt-32 mb-12">
                <div className="flex items-end justify-between mb-12 px-8">
                    <h2 className="text-5xl font-bold text-white">Visual<br />Intelligence</h2>
                    <p className="text-gray-500 max-w-xs text-right hidden md:block"> captured by on-board <br />4K multispectral cameras.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
                    {project.project_images && project.project_images.length > 0 ? (
                        project.project_images.map((img, idx) => (
                            <div key={idx} className="group relative rounded-3xl overflow-hidden h-80 border border-white/10 cursor-pointer">
                                <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                                <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/20">CAM 0{idx + 1}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No gallery images available.
                        </div>
                    )}
                </div>
            </div>

            <CustomizationModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                projectTitle={project.title}
            />
        </div >
    );
};

export default RobotProjectDetails;
