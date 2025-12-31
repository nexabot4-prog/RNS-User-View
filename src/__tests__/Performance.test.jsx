import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProjectsPage from '../pages/ProjectsPage';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider, LayoutProvider } from '../components/Toast';
import React from 'react';

// Create a large dataset for performance testing
const generateProjects = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        title: `Perf Project ${i}`,
        category: i % 3 === 0 ? 'Robotics' : (i % 3 === 1 ? 'IoT' : 'AI'),
        price: 1000 + i * 10,
        description: `High performance test description for project ${i}`,
        image: 'https://via.placeholder.com/150', // Use 'image' as per other components, or 'image_url' based on API. AppIntegration used 'image_url' in one mock and 'image' in another? ProjectDetails uses 'image'.
        formattedPrice: `₹${1000 + i * 10}`
    }));
};

const largeDataset = generateProjects(50);

// Mock API
vi.mock('../utils/api', () => ({
    projectsAPI: {
        getAll: vi.fn(),
        getProjectById: vi.fn()
    }
}));

import { projectsAPI } from '../utils/api';

describe('Performance Tests', () => {
    it('ProjectsPage renders 50 items within 1500ms', async () => {
        // Setup mock return
        projectsAPI.getAll.mockResolvedValue(largeDataset);

        const start = performance.now();

        render(
            <AuthProvider>
                <ThemeProvider>
                    <LayoutProvider>
                        <ToastProvider>
                            <MemoryRouter>
                                <ProjectsPage />
                            </MemoryRouter>
                        </ToastProvider>
                    </LayoutProvider>
                </ThemeProvider>
            </AuthProvider>
        );

        // Wait for the last item to appear
        await waitFor(() => {
            expect(screen.getByText('Perf Project 49')).toBeInTheDocument();
        }, { timeout: 3000 });

        const end = performance.now();
        const duration = end - start;

        console.log(`\nPERFORMANCE METRIC: ProjectsPage render time (50 items): ${duration.toFixed(2)}ms`);

        // Assert that it renders reasonably fast (threshold adjusted for environments)
        expect(duration).toBeLessThan(1500);
    });
});
