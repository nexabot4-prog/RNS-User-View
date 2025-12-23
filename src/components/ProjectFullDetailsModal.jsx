import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Activity, Database, Cpu, Layers, Box, CheckCircle } from 'lucide-react';

const DetailSection = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-100 dark:border-white/10 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Icon size={20} />
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
        </div>
        {children}
    </div>
);

const ProjectFullDetailsModal = ({ isOpen, onClose, project }) => {
    if (!isOpen || !project) return null;

    // Helper to format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-10 z-[70] bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-[#0A0A0A] z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400"> comprehensive Project Blueprint</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

                                {/* 1. Overview & Status */}
                                <DetailSection title="Project Status" icon={Activity} className="col-span-1">
                                    <div className="space-y-4">
                                        <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-700 pb-2">
                                            <span className="text-gray-500 text-sm">Status</span>
                                            <span className="font-medium capitalize">-</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-700 pb-2">
                                            <span className="text-gray-500 text-sm">Priority</span>
                                            <span className={`font-medium px-2 py-0.5 rounded text-xs uppercase ${project.priorityColor?.bg} ${project.priorityColor?.text}`}>
                                                {project.priority || 'Standard'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-700 pb-2">
                                            <span className="text-gray-500 text-sm">Budget</span>
                                            <span className="font-medium text-green-600 dark:text-green-400">{project.formattedPrice}</span>
                                        </div>
                                    </div>
                                </DetailSection>

                                {/* 2. Timeline */}
                                <DetailSection title="Timeline" icon={Calendar} className="col-span-1">
                                    <div className="space-y-4">
                                        <div className="flex justify-between border-b border-dashed border-gray-200 dark:border-gray-700 pb-2">
                                            <span className="text-gray-500 text-sm">Est. Duration</span>
                                            <span className="font-medium">15 - 20 Days</span>
                                        </div>
                                    </div>
                                </DetailSection>

                                {/* 3. Tech Specs */}
                                <DetailSection title="Technical Specs" icon={Cpu} className="col-span-1 lg:col-span-1 row-span-2">
                                    {project.tech_specs && Object.keys(project.tech_specs).length > 0 ? (
                                        <div className="space-y-3">
                                            {Object.entries(project.tech_specs).map(([key, value]) => (
                                                <div key={key} className="bg-white dark:bg-black/20 p-3 rounded-lg border border-gray-100 dark:border-white/5">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{key.replace(/_/g, ' ')}</p>
                                                    <p className="font-medium text-sm text-gray-700 dark:text-gray-200 break-words">{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic text-sm">No detailed technical specifications uploaded.</p>
                                    )}
                                </DetailSection>

                                {/* 4. Hardware/Components */}
                                <DetailSection title="Core Components" icon={Box} className="col-span-1 lg:col-span-2">
                                    {project.components && project.components.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {project.components.map((comp, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full border border-blue-100 dark:border-blue-800/30">
                                                    {comp}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic text-sm">No component list available.</p>
                                    )}
                                </DetailSection>

                                {/* 5. Working Principle */}
                                <DetailSection title="Working Principle" icon={Database} className="col-span-1 lg:col-span-2">
                                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-line">
                                        {project.working_principle || "No working principle description available for this project."}
                                    </p>
                                </DetailSection>

                                {/* 6. Deliverables & Apps */}
                                <DetailSection title="Deliverables" icon={CheckCircle} className="col-span-1">
                                    <ul className="space-y-2">
                                        {project.deliverables && project.deliverables.length > 0 ? (
                                            project.deliverables.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                                    {item}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-gray-500 italic text-sm">Standard Project Report & Code</li>
                                        )}
                                    </ul>
                                </DetailSection>
                                <DetailSection title="Applications" icon={Layers} className="col-span-1 md:col-span-2">
                                    <div className="flex flex-wrap gap-2">
                                        {project.applications && project.applications.length > 0 ? (
                                            project.applications.map((app, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm rounded-full border border-purple-100 dark:border-purple-800/30">
                                                    {app}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 italic text-sm">General Purpose</span>
                                        )}
                                    </div>
                                </DetailSection>


                            </div>

                            {/* Footer / CTA */}
                            <div className="mt-10 flex justify-end gap-4">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        onClose();
                                    }}
                                    className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProjectFullDetailsModal;
