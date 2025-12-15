import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Play, Star, Plus, Settings2 } from 'lucide-react'
import { projectsAPI, ordersAPI } from '../utils/api'
import { transformProject } from '../utils/projectTransform'
import { useToast } from './Toast'

import CustomizationModal from './CustomizationModal'
import ProjectFullDetailsModal from './ProjectFullDetailsModal'
import CheckoutModal from './CheckoutModal'



const ProjectDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
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
                            className="w-full h-full object-cover rounded-2xl opacity-90 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-6 left-8">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Featured Product</p>
                            <p className="text-xl font-bold">{project.price}</p>
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
                            className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 h-36 relative overflow-hidden group shadow-lg"
                        >
                            <div className="absolute top-4 left-4">
                                <Plus className="text-gray-600 dark:text-gray-300 w-4 h-4" />
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority Rating</p>
                                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
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
                            className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center h-36 relative group cursor-pointer hover:bg-white/20 transition-all shadow-lg overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="text-center z-10">
                                <div className="w-12 h-12 rounded-full border border-purple-500/30 flex items-center justify-center mx-auto mb-2 bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                                    <ArrowUpRight size={20} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-xs tracking-widest text-gray-600 dark:text-gray-300 font-bold group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">MORE DETAILS</span>
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
                        className="flex items-center gap-6 mb-16"
                    >
                        <button
                            onClick={() => setIsCheckoutModalOpen(true)}
                            className="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                        >
                            BUY NOW
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-transparent border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                            <Settings2 size={16} />
                            CUSTOMIZE
                        </button>
                        <a
                            href={project.demo_video_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`h-14 w-32 bg-white dark:bg-[#1A1A1A] rounded-full flex items-center px-4 gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors shadow-md dark:shadow-none ${!project.demo_video_url && 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                        >
                            <div className="w-8 h-8 bg-gray-900 dark:bg-black rounded-full flex items-center justify-center">
                                <Play size={12} fill="white" />
                            </div>
                            <span className="text-xs text-gray-400">Watch<br />Demo</span>
                        </a>
                    </motion.div>

                    {/* Packages Section */}
                    {project.packages && project.packages.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold mb-6">Available Packages</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {project.packages.map((pkg, idx) => (
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
                                                ₹{pkg.price ? Number(pkg.price).toLocaleString() : 'TBD'}
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
                                            onClick={() => setIsCheckoutModalOpen(true)}
                                            className="w-full mt-6 py-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors text-sm font-medium"
                                        >
                                            Select Package
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

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
            {project.project_images && project.project_images.length > 0 && (
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
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Plus className="text-white w-8 h-8" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

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
    )
}

export default ProjectDetails
