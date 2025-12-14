import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Check, Clock, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from './Toast'
import { projectsAPI } from '../utils/api'
import { transformProject } from '../utils/projectTransform'
import CustomizationModal from './CustomizationModal'
import { Link, Plus } from 'lucide-react'

import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { useFollowerPointer } from "@/components/ui/following-pointer";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

const ProjectCard = ({ project, navigate, addedToCart, handleAddToCart }) => {
    const { setTitle } = useFollowerPointer();

    return (
        <motion.div
            onClick={() => navigate(`/project/${project.id}`)}
            onMouseEnter={() => setTitle(project.title)}
            onMouseLeave={() => setTitle(null)}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{
                duration: 0.6,
                delay: project.delay,
                hover: { duration: 0.3 }
            }}
            viewport={{ once: true }}
            className="product-card group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-none h-full"
        >
            {/* Priority Badge */}
            {project.isHighPriority && (
                <div className="absolute top-4 right-4 z-10">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${project.priorityColor.bg} ${project.priorityColor.text}`}>
                        <Star className="w-3 h-3" />
                        HIGH PRIORITY
                    </span>
                </div>
            )}

            <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="aspect-video w-full bg-gray-200 bg-cover bg-center overflow-hidden"
                style={{ backgroundImage: `url("${project.image}")` }}
            />

            <div className="flex flex-1 flex-col p-6">
                <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: project.delay + 0.2 }}
                    viewport={{ once: true }}
                    className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors"
                >
                    {project.title}
                </motion.h3>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: project.delay + 0.3 }}
                    viewport={{ once: true }}
                    className="mt-2 flex-grow text-sm text-gray-600 dark:text-gray-400"
                >
                    {project.description}
                </motion.p>

                {/* Features Preview */}
                {project.hasFeatures && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: project.delay + 0.4 }}
                        viewport={{ once: true }}
                        className="mt-3"
                    >
                        <div className="flex flex-wrap gap-1">
                            {project.features.slice(0, 3).map((feature, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full"
                                >
                                    {feature}
                                </span>
                            ))}
                            {project.features.length > 3 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                                    +{project.features.length - 3} more
                                </span>
                            )}
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: project.delay + 0.4 }}
                    viewport={{ once: true }}
                    className="mt-6"
                >
                    {/* Price Section */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <p className="text-xl font-bold text-primary">{project.formattedPrice || `₹${project.price}`}</p>
                            {project.spent > 0 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Spent: {project.spent}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            {project.priority && (
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${project.priorityColor.bg} ${project.priorityColor.text}`}>
                                    {project.priority.toUpperCase()}
                                </span>
                            )}
                            {project.progressPercentage > 0 && (
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {project.progressPercentage.toFixed(0)}% spent
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Add to Cart Button with Moving Border */}
                    <MovingBorderButton
                        borderRadius="0.5rem"
                        onClick={(e) => handleAddToCart(e, project.id, project.title, project.price)}
                        containerClassName="w-full h-12"
                        className={`flex items-center justify-center gap-2 text-sm font-bold ${addedToCart[project.id]
                            ? 'bg-green-500 text-white border-none'
                            : 'bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800'
                            }`}
                        disabled={addedToCart[project.id]}
                    >
                        {addedToCart[project.id] ? (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Added to Cart!</span>
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-4 h-4" />
                                <span>Add to Cart</span>
                            </>
                        )}
                    </MovingBorderButton>
                </motion.div>
            </div>
        </motion.div>
    );
};

const RequestProjectCard = ({ setIsModalOpen }) => {
    const { setTitle } = useFollowerPointer();

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsModalOpen(true)}
            onMouseEnter={() => setTitle("New Request")}
            onMouseLeave={() => setTitle(null)}
            className="product-card group relative bg-white/5 dark:bg-white/5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center p-8 cursor-none hover:border-primary/50 hover:bg-primary/5 transition-all text-center min-h-[400px]"
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
            <button className="px-6 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all cursor-none">
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
    const { showToast } = useToast()
    const navigate = useNavigate()

    const searchPlaceholders = [
        "Search popular projects...",
        "Find robotics kits...",
        "Look for IoT devices...",
        "Search by price or name..."
    ];

    const categories = [
        { id: 'all', label: 'All Projects', buttonLabel: 'All' },
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
                const featuredProjects = await projectsAPI.getFeatured(6)
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

    const handleAddToCart = (e, projectId, projectTitle, price) => {
        e.stopPropagation() // Prevent card click when clicking add to cart
        console.log(`Added to cart: ${projectTitle} - ${price}`)
        setAddedToCart(prev => ({ ...prev, [projectId]: true }))

        showToast(
            `🛒 ${projectTitle} added to cart!\nPrice: ₹${price}`,
            'success',
            3000
        )

        setTimeout(() => {
            setAddedToCart(prev => ({ ...prev, [projectId]: false }))
        }, 2000)
    }

    // handleCardClick is now passed to ProjectCard

    return (
        <section id="projects" className="bg-primary/5 dark:bg-black py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8"
                >
                    Popular Projects
                </motion.h2>

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
                                const categoryProjects = filteredProjects.filter(p => p.category === category.id);

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
                                            {categoryProjects.map((project, index) => {
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
        </section >
    )
}

export default PopularProjects
