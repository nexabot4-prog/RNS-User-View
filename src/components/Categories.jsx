import React from 'react'
import { motion } from 'framer-motion'
import { Cpu, Wifi, Bot, ScanFace, Cloud } from 'lucide-react'
import { GlowingEffect } from "@/components/ui/glowing-effect"

const Categories = () => {
    const handleCategoryClick = (categoryTitle) => {
        // Map Titles to IDs used in PopularProjects
        const categoryMap = {
            'IoT': 'hardware',
            'Robotics': 'hardware',
            'Embedded': 'hardware',
            'AI': 'software',
            'Cloud': 'software',
            'Full-Stack': 'integration'
        };
        const activeId = categoryMap[categoryTitle] || 'all';

        const event = new CustomEvent('filter-category', { detail: activeId });
        window.dispatchEvent(event);

        const projectsSection = document.querySelector('#projects');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <section id="categories" className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12"
                >
                    Browse by Category
                </motion.h2>

                <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
                    <GridItem
                        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                        icon={<Wifi className="h-6 w-6 text-black dark:text-neutral-400" />}
                        title="IoT & Smart Automation Projects"
                        description="Sensors, microcontrollers, cloud dashboards, and mobile/web apps."
                        onClick={() => handleCategoryClick('IoT')}
                    />
                    <GridItem
                        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                        icon={<Bot className="h-6 w-6 text-black dark:text-neutral-400" />}
                        title="Robotics & Autonomous Systems"
                        description="Hardware movement, intelligent control, and software logic for autonomous units."
                        onClick={() => handleCategoryClick('Robotics')}
                    />
                    <GridItem
                        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                        icon={<Cpu className="h-6 w-6 text-black dark:text-neutral-400" />}
                        title="Embedded Systems"
                        description="Microcontrollers, sensors, actuators, firmware, and user interface."
                        onClick={() => handleCategoryClick('Embedded')}
                    />
                    <GridItem
                        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                        icon={<ScanFace className="h-6 w-6 text-black dark:text-neutral-400" />}
                        title="AI & Computer Vision"
                        description="Hardware with AI processing, image-based automation, and cloud services."
                        onClick={() => handleCategoryClick('AI')}
                    />
                    <GridItem
                        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                        icon={<Cloud className="h-6 w-6 text-black dark:text-neutral-400" />}
                        title="Full-Stack Projects"
                        description="Hardware devices integrated with cloud backend, dashboards, and admin panels."
                        onClick={() => handleCategoryClick('Cloud')}
                    />
                </ul>
            </div>
        </section>
    )
}

const GridItem = ({
    area,
    icon,
    title,
    description,
    onClick
}) => {
    return (
        <li className={`min-h-[14rem] list-none ${area}`}>
            <div
                className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3 cursor-pointer group hover:scale-[1.01] transition-transform duration-200"
                onClick={onClick}
            >
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                />
                <div
                    className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D] bg-white dark:bg-black/20">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                        <div className="w-fit rounded-lg border border-gray-200 dark:border-gray-600 p-2">
                            {icon}
                        </div>
                        <div className="space-y-3">
                            <h3
                                className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                                {title}
                            </h3>
                            <h2
                                className="font-sans text-sm/[1.125rem] text-gray-600 md:text-base/[1.375rem] dark:text-neutral-400">
                                {description}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    )
}

export default Categories
