import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Check, Clock, Star, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from './Toast'
import { projectsAPI, ordersAPI } from '../utils/api'
import { transformProject } from '../utils/projectTransform'
import CustomizationModal from './CustomizationModal'
import CheckoutModal from './CheckoutModal'
import { Link, Plus } from 'lucide-react'

import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

const ProjectCard = ({ project, navigate, addedToCart, handleAddToCart }) => {
    return (
        <motion.div
            onClick={() => navigate(`/project/${project.id}`)}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            viewport={{ once: true }}
            className="product-card group relative bg-white dark:bg-neutral-900 rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden h-full border border-neutral-100 dark:border-neutral-800 flex flex-col"
        >
            {/* Image Container with Overlay Action */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-neutral-800">
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url("${project.image}")` }}
                />

                {/* Priority Badge */}
                {project.isHighPriority && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm ${project.priorityColor.bg} ${project.priorityColor.text} backdrop-blur-md bg-opacity-90`}>
                            <Star className="w-3 h-3 fill-current" />
                            Premium
                        </span>
                    </div>
                )}

                {/* Hover Overlay with Quick Action */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <button
                        className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 active:scale-95 shadow-xl"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/project/${project.id}`);
                        }}
                    >
                        View Details
                    </button>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
                {/* Category Tag */}
                <div className="mb-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{project.category || 'Engineering'}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 line-clamp-2 min-h-[3rem]">
                    {project.title}
                </h3>

                {project.hasFeatures && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.features.slice(0, 2).map((feature, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 rounded-md">
                                {feature}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Price</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{project.formattedPrice || `₹${project.price}`}</p>
                    </div>

                    <button
                        onClick={(e) => handleAddToCart(e, project.id, project.title, project.price)}
                        disabled={addedToCart[project.id]}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${addedToCart[project.id]
                                ? 'bg-green-500 text-white'
                                : 'bg-primary text-white hover:bg-primary/90 hover:scale-110 active:scale-90'
                            }`}
                        aria-label={addedToCart[project.id] ? "Added to cart" : "Add to cart"}
                    >
                        {addedToCart[project.id] ? <Check size={18} /> : <ShoppingCart size={18} />}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const RequestProjectCard = ({ setIsModalOpen }) => {

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsModalOpen(true)}
            className="product-card group relative bg-white/5 dark:bg-white/5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center p-8 hover:border-primary/50 hover:bg-primary/5 transition-all text-center min-h-[400px]"
        >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
                Request Custom Project
            </h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
                Can't find what you're looking for? Start a new project from scratch with your specific requirements.
            </p>
            <button className="px-6 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                Start New Request
            </button>
        </motion.div>
    );
};

const PopularProjects = () => {
    const [addedToCart, setAddedToCart] = useState({})
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState("all")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
    const [selectedProjectForCheckout, setSelectedProjectForCheckout] = useState(null)
    const { showToast } = useToast()
    const navigate = useNavigate()

    const searchPlaceholders = [
        "Search popular projects...",
        "Find robotics kits...",
        "Look for IoT devices...",
        "Search by price or name..."
    ];

    const categories = [
        { id: 'hardware', label: 'Hardware Projects', buttonLabel: 'Hardware' },
        { id: 'software', label: 'Software Solutions', buttonLabel: 'Software' },
        { id: 'integration', label: 'Hardware & Software Integration', buttonLabel: 'Integration' }
    ];

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Fetch featured projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true)
                const featuredProjects = await projectsAPI.getFeatured(12)
                // Transform data immediately so categories and other fields are available for filtering
                const transformed = featuredProjects.map((p, index) => transformProject(p, index));
                setProjects(transformed)
            } catch (error) {
                console.error('Error fetching popular projects:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProjects()
    }, [])

    // Listen for custom filter events (from Categories section)
    useEffect(() => {
        const handleFilterEvent = (e) => {
            if (e.detail && categories.find(c => c.id === e.detail)) {
                setActiveCategory(e.detail);
            }
        };

        window.addEventListener('filter-category', handleFilterEvent);
        return () => window.removeEventListener('filter-category', handleFilterEvent);
    }, []);

    const handleAddToCart = async (e, projectId, projectTitle, price) => {
        e.stopPropagation() // Prevent card click when clicking add to cart
        setSelectedProjectForCheckout({ id: projectId, title: projectTitle, price: price })
        setIsCheckoutModalOpen(true)
    }

    // handleCardClick is now passed to ProjectCard

    return (
        <section id="projects" className="bg-primary/5 dark:bg-black py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="relative mb-12 flex items-center justify-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl text-center"
                    >
                        Popular Projects
                    </motion.h2>
                    <button
                        onClick={() => navigate('/projects')}
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-all shadow-lg hover:shadow-primary/25"
                    >
                        View all projects <ArrowRight size={18} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="w-full max-w-xl mx-auto mb-8">
                    <PlaceholdersAndVanishInput
                        placeholders={searchPlaceholders}
                        onChange={handleSearchChange}
                        onSubmit={handleSearchSubmit}
                    />
                </div>

                {/* Category Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category.id
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                }`}
                        >
                            {category.buttonLabel}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500 dark:text-gray-400">No projects found. Please add some projects to the database.</p>
                    </div>
                ) : (
                    <div className="space-y-20 mt-12">
                        {categories
                            .filter(c => c.id !== 'all' && (activeCategory === 'all' || activeCategory === c.id))
                            .map((category, index, array) => {
                                // Filter projects based on category mapping
                                const categoryProjects = filteredProjects.filter(p => {
                                    const cat = (p.category || '').toLowerCase();
                                    if (category.id === 'hardware') {
                                        return cat.includes('hardware') || cat.includes('kit');
                                    }
                                    if (category.id === 'software') {
                                        return cat.includes('software') || cat.includes('app') || cat.includes('cloud');
                                    }
                                    if (category.id === 'integration') {
                                        return cat.includes('integration') || cat.includes('full-stack') || cat.includes('web') ||
                                            cat.includes('iot') || cat.includes('robotics') || cat.includes('embedded') || cat.includes('automation') ||
                                            cat.includes('ai') || cat.includes('vision') || cat.includes('intelligence');
                                    }
                                    return false;
                                });

                                if (categoryProjects.length === 0) return null;

                                return (
                                    <motion.div
                                        key={category.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="h-8 w-1 bg-primary rounded-full" />
                                            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                                                {category.label}
                                            </h3>
                                            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                                        </div>

                                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                            {categoryProjects.slice(0, 3).map((project, index) => {
                                                return (
                                                    <ProjectCard
                                                        key={project.id}
                                                        project={project}
                                                        navigate={navigate}
                                                        addedToCart={addedToCart}
                                                        handleAddToCart={handleAddToCart}
                                                    />
                                                );
                                            })}

                                            {/* Show "Request Custom Project" card only in the last visible category */}
                                            {index === array.length - 1 ? (
                                                <RequestProjectCard setIsModalOpen={setIsModalOpen} />
                                            ) : null}
                                        </div>
                                    </motion.div>
                                );
                            })}
                    </div>
                )}
            </div>

            <CustomizationModal
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                projectTitle=""
            />
            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                project={selectedProjectForCheckout}
            />
        </section >
    )
}

export default PopularProjects
