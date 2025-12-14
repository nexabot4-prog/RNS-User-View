import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Play, Star, Plus, Settings2 } from 'lucide-react'
import { projectsAPI } from '../utils/api'
import { transformProject } from '../utils/projectTransform'
import { useToast } from './Toast'

import CustomizationModal from './CustomizationModal'

const ProjectDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { showToast } = useToast()

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true)
                const data = await projectsAPI.getProjectById(id)
                if (data) {
                    const transformed = transformProject(data, 0)
                    setProject(transformed)
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
        <div className="min-h-screen bg-[#0A0A0A] text-white pt-20 px-4 md:px-8 pb-12 overflow-x-hidden font-display">
            {/* Top Navigation / Breadcrumbs */}
            <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
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
                        className="relative bg-[#1A1A1A] rounded-[3rem] rounded-tl-[6rem] p-8 h-[400px] flex items-center justify-center overflow-hidden group"
                    >
                        <div className="absolute top-8 right-8">
                            <Plus className="text-gray-600" />
                        </div>
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover rounded-2xl opacity-90 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-6 left-8">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Featured Product</p>
                            <p className="text-xl font-bold">{project.price}</p>
                        </div>
                        {/* View in 3D Badge */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center border-4 border-[#0A0A0A]">
                            <span className="text-[10px] text-center font-bold text-gray-400">VIEW IN<br />3D</span>
                        </div>
                    </motion.div>

                    {/* Secondary Image Card */}
                    <div className="grid grid-cols-2 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#1A1A1A] rounded-[2rem] p-6 h-48 relative overflow-hidden group"
                        >
                            <div className="absolute top-4 left-4">
                                <Plus className="text-gray-600 w-4 h-4" />
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <p className="text-[10px] text-gray-400 uppercase">Priority Rating</p>
                                <p className="text-sm font-bold text-white">{project.priority ? project.priority.toUpperCase() : 'STANDARD'}</p>
                            </div>
                            <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-transparent absolute top-0 left-0" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-[#1A1A1A] rounded-full flex items-center justify-center h-48 border border-white/5 relative group cursor-pointer hover:bg-white/5 transition-colors"
                        >
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-2 group-hover:bg-white group-hover:text-black transition-colors">
                                    <ArrowUpRight size={20} />
                                </div>
                                <span className="text-xs tracking-widest text-gray-400">MORE DETAILS</span>
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
                        className="text-gray-400 text-lg mb-8 max-w-xl"
                    >
                        {project.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-6 mb-16"
                    >
                        <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-gray-200 transition-colors">
                            ADD TO CART
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                            <Settings2 size={16} />
                            CUSTOMIZE
                        </button>
                        <div className="h-14 w-32 bg-[#1A1A1A] rounded-full flex items-center px-4 gap-3 cursor-pointer hover:bg-[#252525] transition-colors">
                            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                <Play size={12} fill="white" />
                            </div>
                            <span className="text-xs text-gray-400">Watch<br />Demo</span>
                        </div>
                    </motion.div>

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
                                <div className="flex items-baseline gap-8 py-4 border-b border-white/10 group-hover:border-white/40 transition-colors">
                                    <span className="text-2xl font-light text-gray-600 group-hover:text-white transition-colors">
                                        0{idx + 1}
                                    </span>
                                    <div className="flex-1 flex justify-between items-baseline">
                                        <p className="text-sm font-medium tracking-wide text-gray-300 group-hover:text-white transition-colors uppercase">
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

            <CustomizationModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                projectTitle={project.title}
            />
        </div>
    )
}

export default ProjectDetails
