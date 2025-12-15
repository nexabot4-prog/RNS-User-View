import React, { useEffect } from 'react'
import Header from './Header'
import Hero from './Hero'
import { BrandingShowcase } from './BrandingShowcase'
import Categories from './Categories'
import PopularProjects from './PopularProjects'
import WhyChooseUs from './WhyChooseUs'
import Contact from './Contact'
import Footer from './Footer'
import { useLayoutContext } from './Toast'

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
                <BrandingShowcase />
                <Categories />
                <PopularProjects />
                <WhyChooseUs />
                <Contact />
            </main>
            <Footer />
        </div>
    )
}
export default LandingPage
