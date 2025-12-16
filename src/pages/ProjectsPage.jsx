import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowRight, Star } from 'lucide-react';
import { projectsAPI } from '../utils/api';
import CheckoutModal from '../components/CheckoutModal';
import CustomizationModal from '../components/CustomizationModal';
import { useNavigate } from 'react-router-dom';
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
import { transformProject } from '../utils/projectTransform';

const ProjectsPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [selectedProject, setSelectedProject] = useState(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Categories based on common RNS project types
    const categories = [
        { label: 'All Projects', value: 'All' },
        { label: 'Hardware', value: 'Hardware' },
        { label: 'Software', value: 'Software' },
        { label: 'IoT & Smart Automation Projects', value: 'IOT' },
        { label: 'Embedded Systems', value: 'Embedded' },
        { label: 'AI & Computer Vision', value: 'AI' },
        { label: 'Full-Stack Projects', value: 'Full-Stack' },
        { label: 'Robotics & Autonomous Systems', value: 'Robotics' }
    ];

    const searchPlaceholders = [
        "Search all projects...",
        "Find hardware kits...",
        "Look for IoT solutions...",
        "Search by technology...",
        "Find robotics components..."
    ];

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await projectsAPI.getAll();
            // Transform data to ensure consistency (maps 'budget' to 'price', adds fallbacks)
            const transformedData = data.map((p, index) => transformProject(p, index));
            setProjects(transformedData);
        } catch (error) {
            console.error("Failed to load projects", error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setActiveTab('All'); // Reset category filter
        setSearchQuery('');  // Reset search query
        fetchProjects();
    };

    const filteredProjects = projects.filter(project => {
        const normalizedCategory = (project.category || '').toLowerCase();
        const normalizedTitle = (project.title || '').toLowerCase();
        const normalizedDesc = (project.description || '').toLowerCase();
        const filterValue = activeTab.toLowerCase();

        const matchesCategory = activeTab === 'All' ||
            normalizedCategory.includes(filterValue) ||
            normalizedTitle.includes(filterValue) ||
            (filterValue === 'full-stack' && (normalizedCategory.includes('integration') || normalizedCategory.includes('web'))) ||
            (filterValue === 'ai' && (normalizedCategory.includes('software') && normalizedTitle.includes('ai'))) ||
            (filterValue === 'hardware' && (normalizedCategory.includes('hardware') || normalizedCategory.includes('iot') || normalizedCategory.includes('embedded') || normalizedCategory.includes('robotics'))) ||
            (filterValue === 'software' && (normalizedCategory.includes('software') || normalizedCategory.includes('ai') || normalizedCategory.includes('app')));

        const query = searchQuery.toLowerCase();
        const matchesSearch =
            normalizedTitle.includes(query) ||
            normalizedDesc.includes(query) ||
            normalizedCategory.includes(query);

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4 relative">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400"
                    >
                        Explore Our Projects
                    </motion.h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Discover our comprehensive collection of innovative solutions across various domains.
                    </p>

                    {/* Refresh Button */}
                    <button
                        onClick={handleRefresh}
                        className="absolute right-0 top-0 p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-lg transition-colors border border-black/5 dark:border-white/5 hidden md:block"
                        title="Refresh Projects"
                    >
                        <div className={isRefreshing ? "animate-spin" : ""}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
                        </div>
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-20 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none">
                    {/* Search Bar */}
                    <div className="w-full md:w-96 relative top-0 md:-top-1">
                        <PlaceholdersAndVanishInput
                            placeholders={searchPlaceholders}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onSubmit={(e) => e.preventDefault()}
                        />
                    </div>

                    {/* Mobile Refresh Button - visible only on small screens next to filters */}
                    <button
                        onClick={handleRefresh}
                        className="md:hidden p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-lg transition-colors border border-black/5 dark:border-white/5 self-end"
                    >
                        <div className={isRefreshing ? "animate-spin" : ""}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
                        </div>
                    </button>

                    {/* Filter Dropdown */}
                    <div className="relative w-full md:w-72 z-40">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 flex items-center justify-between text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
                        >
                            <span className="truncate mr-2 font-medium">
                                {categories.find(c => c.value === activeTab)?.label || 'All Projects'}
                            </span>
                            <div className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden py-2 z-50"
                                >
                                    {categories.map((category) => (
                                        <button
                                            key={category.value}
                                            onClick={() => {
                                                setActiveTab(category.value);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${activeTab === category.value
                                                ? 'bg-primary/20 text-primary font-bold'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                                }`}
                                        >
                                            {category.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode='popLayout'>
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 dark:hover:border-primary/30 transition-all group flex flex-col h-full shadow-lg dark:shadow-none"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#121212] to-transparent z-10" />
                                            <img
                                                src={project.image_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80"}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 right-4 z-20">
                                                <span className="bg-white/90 dark:bg-black/60 backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm">
                                                    {project.category || 'Project'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-1 space-y-4">
                                            <div className="flex-1 space-y-2">
                                                <h3
                                                    onClick={() => navigate(`/project/${project.id}`)}
                                                    className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors duration-300 line-clamp-1 cursor-pointer"
                                                >
                                                    {project.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                                                    {project.description}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                                                <div className="text-primary font-bold">
                                                    ₹{(project.price || 0).toLocaleString()}
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/project/${project.id}`)}
                                                    className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-1 transition-colors"
                                                >
                                                    Details <ArrowRight size={14} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 pt-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedProject(project);
                                                        setIsCheckoutOpen(true);
                                                    }}
                                                    className="bg-black dark:bg-white text-white dark:text-black font-bold py-2.5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm shadow-md"
                                                >
                                                    Buy Now
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedProject(project);
                                                        setIsCustomizationOpen(true);
                                                    }}
                                                    className="bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium py-2.5 rounded-xl transition-all text-sm"
                                                >
                                                    Customize
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400">
                                    <p className="text-xl">No projects found in this category.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Modals */}
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={setIsCheckoutOpen}
                project={selectedProject}
            />

            <CustomizationModal
                isOpen={isCustomizationOpen}
                onClose={setIsCustomizationOpen}
                projectTitle={selectedProject?.title}
            />
        </div>
    );
};

export default ProjectsPage;
