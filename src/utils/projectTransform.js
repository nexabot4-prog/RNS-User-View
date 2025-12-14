export const transformProject = (project, index) => {
    return {
        ...project,
        delay: index * 0.1,
        priorityColor: project.priority === 'high' ? { bg: 'bg-red-100', text: 'text-red-700' } :
            project.priority === 'medium' ? { bg: 'bg-yellow-100', text: 'text-yellow-700' } :
                { bg: 'bg-green-100', text: 'text-green-700' },
        isHighPriority: project.priority === 'high',
        hasFeatures: project.features && project.features.length > 0,
        hasComponents: project.components && project.components.length > 0,
        spent: 0, // Mock data
        progressPercentage: Math.random() * 100, // Mock data
        price: `₹${project.price}`
    };
};
