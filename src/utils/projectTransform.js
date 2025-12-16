export const transformProject = (project, index) => {
    // Basic heuristics to guess category if missing
    let category = project.category;
    if (!category) {
        const lowerTitle = (project.title || '').toLowerCase();
        const lowerDesc = (project.description || '').toLowerCase();

        if (lowerTitle.includes('software') || lowerTitle.includes('app') || lowerDesc.includes('app') ||
            lowerTitle.includes('ai') || lowerTitle.includes('vision') || lowerTitle.includes('detection') || lowerTitle.includes('web')) {
            category = 'software';
        } else if (lowerTitle.includes('kit') || lowerTitle.includes('hardware') || lowerTitle.includes('arm') ||
            lowerTitle.includes('robot') || lowerTitle.includes('iot') || lowerTitle.includes('embedded') ||
            lowerTitle.includes('automation') || lowerTitle.includes('system') || lowerTitle.includes('vehicle')) {
            category = 'hardware';
        } else {
            category = 'integration';
        }
    }

    const mapped = {
        ...project,
        id: project.id,
        title: project.title || 'Untitled Project',
        description: project.description || '', // Prevent crash in search filter
        // Explicitly prioritize image_url from the database, then fallbacks
        image: project.image_url || project.imageUrl || project.image || 'https://images.unsplash.com/photo-1555664424-778a69d25679?auto=format&fit=crop&q=80',
        price: (() => {
            const b = project.budget;
            if (b === undefined || b === null) return project.price || 0;
            if (typeof b === 'number') return b;
            if (typeof b === 'string') return isNaN(Number(b)) ? 0 : Number(b);
            // Handle if it's a JSON object wrapper (e.g. { min: 9500, max: 12000 })
            if (typeof b === 'object') {
                return Number(b.max) || Number(b.min) || 0;
            }
            return 0;
        })(),
        category: category,
        features: project.features || [],
        components: project.components || [],
        priority: project.priority || 'medium',
        applications: project.applications || [],
        deliverables: project.deliverables || [],
        tech_specs: project.tech_specs || {},
        packages: project.packages || [],
        project_images: project.project_images || [],
        block_diagrams: project.block_diagrams || [],
        project_documents: project.project_documents || [],
        working_principle: project.working_principle || '',
        demo_video_url: project.demo_video_url || ''
    };

    return {
        ...mapped,
        delay: index * 0.1,
        priorityColor: mapped.priority === 'high' ? { bg: 'bg-red-100', text: 'text-red-700' } :
            mapped.priority === 'medium' ? { bg: 'bg-yellow-100', text: 'text-yellow-700' } :
                { bg: 'bg-green-100', text: 'text-green-700' },
        isHighPriority: mapped.priority === 'high',
        hasFeatures: mapped.features && mapped.features.length > 0,
        hasComponents: mapped.components && mapped.components.length > 0,
        spent: project.spent || 0,
        progressPercentage: project.spent && mapped.price
            ? (project.spent / mapped.price) * 100
            : Math.random() * 100,
        formattedPrice: (() => {
            const b = project.budget;
            if (b && typeof b === 'object' && (b.min || b.max)) {
                return `₹${b.min || 0} - ₹${b.max || 0}`;
            }
            return `₹${mapped.price}`;
        })()
    };
};
