import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../components/LandingPage'; // Using direct imports for test simpler than lazy for now, or just handle lazy
import ProjectsPage from '../pages/ProjectsPage';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider, LayoutProvider } from '../components/Toast';
import React, { Suspense } from 'react';

// Mock dependencies
vi.mock('../utils/api', () => ({
    projectsAPI: {
        getAll: vi.fn().mockResolvedValue([
            { id: 1, title: 'Test Project 1', category: 'Robotics', price: 1000, description: 'Desc', image_url: 'test.jpg' },
            { id: 2, title: 'Test Project 2', category: 'IoT', price: 2000, description: 'Desc 2', image_url: 'test2.jpg' }
        ]),
        getTopProjects: vi.fn().mockResolvedValue([
            { id: 1, title: 'Test Project 1', image: 'test.jpg' }
        ]),
        getProjectById: vi.fn()
    },
    reviewsAPI: {
        getTopReviews: vi.fn().mockResolvedValue([])
    }
}));

// ... (existing mocks for observers etc.)

describe('App Integration Flow', () => {
    it('Integration: Projects Page loads data from API', async () => {
        render(
            <AuthProvider>
                <ThemeProvider>
                    <LayoutProvider>
                        <ToastProvider>
                            <MemoryRouter initialEntries={['/projects']}>
                                <Routes>
                                    <Route path="/projects" element={<ProjectsPage />} />
                                </Routes>
                            </MemoryRouter>
                        </ToastProvider>
                    </LayoutProvider>
                </ThemeProvider>
            </AuthProvider>
        );
        // Wait for ProjectsPage to load and fetch
        expect(await screen.findByText('Test Project 1', {}, { timeout: 5000 })).toBeInTheDocument();
        expect(await screen.findByText('Test Project 2', {}, { timeout: 5000 })).toBeInTheDocument();
    });
});
