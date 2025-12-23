import React from 'react'
import { motion } from 'framer-motion'
import { Zap, MapPin, Mail, Phone, Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react'
const Footer = () => {
    const quickLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Projects', href: '#projects' },
        { name: 'Categories', href: '#categories' },
        { name: 'Why Us', href: '#about' },
        { name: 'Contact', href: '#contact' }
    ]
    const supportLinks = [
        { name: 'Contact Us', href: '#contact' },
        { name: 'FAQ', href: '#' },
        { name: 'Shipping & Returns', href: '#' },
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms & Conditions', href: '/terms-and-conditions' }
    ]
    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: MessageCircle, href: 'https://wa.me/918884329358', label: 'WhatsApp' }
    ]
    return (
        <footer id="contact" className="bg-gray-100 dark:bg-black">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="md:col-span-1"
                    >
                        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                            <Zap className="text-primary text-3xl" />
                            <h2 className="text-xl font-bold">RNS INNOBOTICS Private Ltd</h2>
                        </div>
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            Empowering the next generation of innovators with hands-on learning kits.
                        </p>
                    </motion.div>
                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="font-bold text-gray-900 dark:text-white">Quick Links</h4>
                        <ul className="mt-4 space-y-2 text-sm">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <motion.a
                                        whileHover={{ x: 5 }}
                                        className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                                        href={link.href}
                                    >
                                        {link.name}
                                    </motion.a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    {/* Support Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="font-bold text-gray-900 dark:text-white">Support</h4>
                        <ul className="mt-4 space-y-2 text-sm">
                            {supportLinks.map((link) => (
                                <li key={link.name}>
                                    <motion.a
                                        whileHover={{ x: 5 }}
                                        className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                                        href={link.href}
                                    >
                                        {link.name}
                                    </motion.a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="font-bold text-gray-900 dark:text-white">Contact Info</h4>
                        <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <MapPin className="mt-0.5 w-4 h-4 flex-shrink-0" />
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=Yelahanka,Bengaluru"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    Yelahanka, Bengaluru
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <Mail className="mt-0.5 w-4 h-4 flex-shrink-0" />
                                <a href="mailto:rnsinnobotics@gmail.com" className="hover:text-primary transition-colors">
                                    rnsinnobotics@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <Phone className="mt-0.5 w-4 h-4 flex-shrink-0" />
                                <a href="tel:8884329358" className="hover:text-primary transition-colors">
                                    8884329358
                                </a>
                            </li>
                        </ul>
                    </motion.div>
                </div>
                {/* Bottom Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-12 border-t border-gray-200/80 dark:border-gray-700/50 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        © 2025 RNS INNOBOTICS Private Ltd. All rights reserved.
                    </p>

                    <div className="flex space-x-4">
                        {socialLinks.map((social) => {
                            const IconComponent = social.icon
                            return (
                                <motion.a
                                    key={social.label}
                                    whileHover={{ scale: 1.2, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                                    href={social.href}
                                    aria-label={social.label}
                                >
                                    <IconComponent className="h-6 w-6" />
                                </motion.a>
                            )
                        })}
                    </div>
                </motion.div>
            </div>
        </footer>
    )
}
export default Footer
