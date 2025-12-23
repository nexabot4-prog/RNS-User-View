import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Lazy load components
const LandingPage = lazy(() => import('./components/LandingPage'));
const ProjectDetails = lazy(() => import('./components/ProjectDetails'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const TermsAndConditions = lazy(() => import('./components/TermsAndConditions'));

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, LayoutProvider } from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import LoadingFallback from './components/LoadingFallback';
import ErrorBoundary from './components/ErrorBoundary';
import Chatbot from './components/Chatbot';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <LayoutProvider>
                    <ToastProvider>
                        <BrowserRouter>
                            <ScrollToTop />
                            <Chatbot />
                            <Suspense fallback={<LoadingFallback />}>
                                <ErrorBoundary>
                                    <Routes>
                                        <Route path="/" element={<LandingPage />} />
                                        <Route path="/projects" element={<ProjectsPage />} />
                                        <Route path="/project/:id" element={<ProjectDetails />} />
                                        <Route path="/terms-and-conditions" element={
                                            <div className="pt-24 pb-12 container mx-auto px-4 min-h-screen">
                                                <TermsAndConditions />
                                            </div>
                                        } />
                                    </Routes>
                                </ErrorBoundary>
                            </Suspense>
                        </BrowserRouter >
                    </ToastProvider >
                </LayoutProvider >
            </ThemeProvider >
        </AuthProvider >
    );
}

export default App;
