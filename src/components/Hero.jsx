import React, { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
// import { ShimmerButton } from "@/components/ui/shimmer-button"
// import { BackgroundBeams } from "@/components/ui/background-beams"
// import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect"
// import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import TermsModal from './TermsModal'

// Lazy loaded components
const ShimmerButton = lazy(() => import("@/components/ui/shimmer-button").then(module => ({ default: module.ShimmerButton })))
const BackgroundBeams = lazy(() => import("@/components/ui/background-beams").then(module => ({ default: module.BackgroundBeams })))
const TypewriterEffectSmooth = lazy(() => import("@/components/ui/typewriter-effect").then(module => ({ default: module.TypewriterEffectSmooth })))
const HoverBorderGradient = lazy(() => import("@/components/ui/hover-border-gradient").then(module => ({ default: module.HoverBorderGradient })))

const Hero = () => {
    // const [isTermsModalOpen, setIsTermsModalOpen] = React.useState(false); // Removed
    const words1 = [
        {
            text: "Build\u00A0",
            className: "text-gray-900 dark:text-white",
        },
        {
            text: "the\u00A0",
            className: "text-gray-900 dark:text-white",
        },
        {
            text: "Future,\u00A0",
            className: "text-gray-900 dark:text-white",
        },
        {
            text: "One",
            className: "text-primary dark:text-primary",
        },
    ];

    const words2 = [
        {
            text: "Project\u00A0",
            className: "text-primary dark:text-primary",
        },
        {
            text: "at\u00A0",
            className: "text-primary dark:text-primary",
        },
        {
            text: "a\u00A0",
            className: "text-primary dark:text-primary",
        },
        {
            text: "Time.",
            className: "text-primary dark:text-primary",
        },
    ];

    return (
        <section id="home" className="relative w-full bg-gradient-to-b from-primary/10 via-background-light to-background-light dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-950 py-16 sm:py-24 pt-24 overflow-hidden min-h-[80vh] flex items-center justify-center">

            {/* Background Beams - Visible only in dark mode */}
            <Suspense fallback={null}>
                <div className="absolute inset-0 z-0 hidden dark:block">
                    <BackgroundBeams />
                </div>
            </Suspense>

            <div className="container relative z-10 mx-auto px-4">
                <div className="flex flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col gap-6 items-center max-w-4xl"
                    >
                        <div className="flex flex-col items-center -space-y-4 scale-90 sm:scale-100 min-h-[100px] justify-center">
                            <Suspense fallback={<div className="h-12 w-full" />}>
                                <TypewriterEffectSmooth
                                    words={words1}
                                    className="my-2"
                                    cursorClassName="hidden"
                                    delay={0.5}
                                />
                                <TypewriterEffectSmooth
                                    words={words2}
                                    className="my-2"
                                    cursorClassName="bg-primary"
                                    delay={2.5}
                                />
                            </Suspense>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl"
                        >
                            End-to-end Arduino, IoT, and Robotics projects designed, developed, and delivered with precision. From student kits to advanced industrial integrations, we turn ideas into working solutions.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4"
                        >
                            <Suspense fallback={<div className="h-12 w-32 bg-gray-200 dark:bg-gray-800 rounded-full" />}>
                                <HoverBorderGradient
                                    containerClassName="rounded-full"
                                    as="button"
                                    className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
                                    onClick={() => {
                                        const projectsSection = document.querySelector('#projects')
                                        if (projectsSection) {
                                            projectsSection.scrollIntoView({ behavior: 'smooth' })
                                        }
                                    }}
                                >
                                    <span>Buy Now</span>
                                </HoverBorderGradient>

                                <ShimmerButton
                                    onClick={() => {
                                        const contactSection = document.querySelector('#contact');
                                        if (contactSection) {
                                            contactSection.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                    className="shadow-2xl"
                                >
                                    <span className="text-center text-sm leading-none font-medium tracking-tight whitespace-pre-wrap text-white lg:text-lg dark:from-white dark:to-slate-900/10">
                                        New Start – New Request
                                    </span>
                                </ShimmerButton>
                            </Suspense>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
export default Hero
