import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Lazy load components
const LandingPage = lazy(() => import('./components/LandingPage'));
const ProjectDetails = lazy(() => import('./components/ProjectDetails'));

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, LayoutProvider } from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import LoadingFallback from './components/LoadingFallback';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <LayoutProvider>
                    <ToastProvider>
                        <BrowserRouter>
                            <ScrollToTop />
                            <Suspense fallback={<LoadingFallback />}>
                                <Routes>
                                    <Route path="/" element={<LandingPage />} />
                                    <Route path="/project/:id" element={<ProjectDetails />} />
                                </Routes>
                            </Suspense>
                        </BrowserRouter>
                    </ToastProvider>
                </LayoutProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
