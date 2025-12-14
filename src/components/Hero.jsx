import React from 'react'
import { motion } from 'framer-motion'
import SplineRobot from './SplineRobot'
import { BackgroundBeams } from "@/components/ui/background-beams"
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"

const Hero = () => {
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
        <section id="home" className="relative w-full bg-gradient-to-b from-primary/10 via-background-light to-background-light dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-950 py-16 sm:py-24 pt-24 overflow-hidden">

            {/* Background Beams - Visible only in dark mode */}
            <div className="absolute inset-0 z-0 hidden dark:block">
                <BackgroundBeams />
            </div>

            <div className="container relative z-10 mx-auto px-4">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start"
                    >
                        <div className="flex flex-col items-center lg:items-start -space-y-4">
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
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="text-lg text-gray-600 dark:text-gray-300"
                        >
                            End-to-end Arduino, IoT, and Robotics projects designed, developed, and delivered with precision. From student kits to advanced industrial integrations, we turn ideas into working solutions.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1 }}
                            className="flex justify-center lg:justify-start"
                        >
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
                                <span>Explore Projects</span>
                            </HoverBorderGradient>
                        </motion.div>
                    </motion.div>
                    {/* Right 3D Robot */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="w-full h-[500px] md:h-[600px] relative flex md:block items-center justify-center pointer-events-none"
                    >
                        <SplineRobot />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
export default Hero
