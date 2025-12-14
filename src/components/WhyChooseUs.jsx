import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, FileText, CheckCircle, Users } from 'lucide-react'
const WhyChooseUs = () => {
    const features = [
        {
            icon: BookOpen,
            title: 'Curriculum-Ready',
            description: 'Aligned with academic standards and engineering principles. Perfect for student submissions and labs.',
            delay: 0.1
        },
        {
            icon: FileText,
            title: 'Step-by-Step Guides',
            description: 'Beginner-friendly documentation with wiring diagrams and code explanations to ensure success.',
            delay: 0.2
        },
        {
            icon: CheckCircle,
            title: 'Quality Components',
            description: 'Premium, branded sensors and modules guaranteed for reliability and long-lasting performance.',
            delay: 0.3
        },
        {
            icon: Users,
            title: 'Community Support',
            description: 'Join our growing expert community for guidance, shared resources, and peer collaboration.',
            delay: 0.4
        }
    ]
    return (
        <section id="about" className="py-16 sm:py-24 bg-gray-50/50 dark:bg-white/5">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
                >
                    Why Choose Us?
                </motion.h2>

                <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5 }}
                                transition={{
                                    duration: 0.6,
                                    delay: feature.delay,
                                    hover: { duration: 0.2 }
                                }}
                                viewport={{ once: true }}
                                className="product-card flex flex-col items-center gap-4 text-center group p-6"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300"
                                >
                                    <IconComponent className="w-8 h-8" />
                                </motion.div>

                                <motion.h3
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: feature.delay + 0.2 }}
                                    viewport={{ once: true }}
                                    className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors"
                                >
                                    {feature.title}
                                </motion.h3>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: feature.delay + 0.3 }}
                                    viewport={{ once: true }}
                                    className="text-sm text-gray-600 dark:text-gray-400"
                                >
                                    {feature.description}
                                </motion.p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )

}
export default WhyChooseUs
