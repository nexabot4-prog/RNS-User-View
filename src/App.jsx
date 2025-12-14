import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ProjectDetails from './components/ProjectDetails';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, LayoutProvider } from './components/Toast';
import ScrollToTop from './components/ScrollToTop';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <LayoutProvider>
                    <ToastProvider>
                        <BrowserRouter>
                            <ScrollToTop />
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/project/:id" element={<ProjectDetails />} />
                            </Routes>
                        </BrowserRouter>
                    </ToastProvider>
                </LayoutProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
