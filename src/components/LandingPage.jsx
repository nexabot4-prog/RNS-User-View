import React, { useEffect, Suspense, lazy } from 'react'
import Header from './Header'
import Hero from './Hero'
import { useLayoutContext } from './Toast'

// Lazy load non-critical sections
const BrandingShowcase = lazy(() => import('./BrandingShowcase').then(module => ({ default: module.BrandingShowcase })))
const Categories = lazy(() => import('./Categories'))
const PopularProjects = lazy(() => import('./PopularProjects'))
const WhyChooseUs = lazy(() => import('./WhyChooseUs'))
const CustomerReviews = lazy(() => import('./CustomerReviews'))
const Contact = lazy(() => import('./Contact'))
const Footer = lazy(() => import('./Footer'))

// Loading Fallback Component
const SectionLoader = () => (
    <div className="w-full h-96 flex items-center justify-center bg-gray-50 dark:bg-neutral-900/50">
        <div className="animate-pulse w-32 h-2 bg-gray-200 dark:bg-gray-800 rounded"></div>
    </div>
)

const LandingPage = ({ onNavigate }) => {
    const setLayoutContext = useLayoutContext()
    // Set layout context when landing page mounts
    useEffect(() => {
        setLayoutContext(false) // Landing page has no sidebar
    }, [])
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-neutral-950 text-gray-800 dark:text-gray-200">
            <Header onNavigate={onNavigate} />
            <main className="flex-grow w-full">
                <Hero />
                <Suspense fallback={<SectionLoader />}>
                    <BrandingShowcase />
                    <Categories />
                    <PopularProjects />
                    <WhyChooseUs />
                    <CustomerReviews />
                    <Contact />
                </Suspense>
            </main>
            <Suspense fallback={<div className="h-24" />}>
                <Footer />
            </Suspense>
        </div >
    )
}
export default LandingPage
