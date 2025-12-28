import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Zap, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './Toast';
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { showToast } = useToast();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            showToast('Logged out successfully', 'success');
            setIsOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const navItems = [
        { name: 'Home', href: '#home' },
        {
            name: 'Projects',
            href: '#projects',
            dropdown: [
                { name: 'Hardware', href: '#projects' },
                { name: 'Software', href: '#projects' },
                { name: 'Integration', href: '#projects' }
            ]
        },
        {
            name: 'Categories',
            href: '#categories',
            dropdown: [
                { name: 'IoT & Automation', href: '#categories' },
                { name: 'Robotics', href: '#categories' },
                { name: 'Embedded Systems', href: '#categories' },
                { name: 'AI & ML', href: '#categories' },
                { name: 'Cloud Projects', href: '#categories' }
            ]
        },
        {
            name: 'Why Us',
            href: '#about',
            dropdown: [
                { name: 'Curriculum-Ready', href: '#about' },
                { name: 'Step-by-Step Guides', href: '#about' },
                { name: 'Quality Components', href: '#about' },
                { name: 'Community Support', href: '#about' }
            ]
        },
        { name: 'Contact', href: '#contact' }
    ];

    const handleNavClick = (href) => {
        setIsOpen(false);
        setActiveDropdown(null);
        if (href.startsWith('#')) {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const placeholders = [
        "Search Robotics Kits...",
        "Find IoT Systems...",
        "Looking for Arduino Bundles?",
        "Explore AI Modules...",
        "Discover Embedded Projects..."
    ];

    const handleSearchChange = (e) => {
        console.log("Search:", e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Search Submitted");
    };

    // Handle body scroll lock when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <div className="relative w-full z-50">
            <Navbar className="fixed top-2">
                {/* Desktop Navigation */}
                <NavBody className="justify-between">
                    {/* Logo */}
                    <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }} className="flex items-center gap-2 z-20">
                        <span className="font-bold text-xl text-black dark:text-white whitespace-nowrap">
                            RNS INNOBOTICS
                        </span>
                    </a>

                    {/* Custom Nav Items with Dropdowns */}
                    <div className="hidden lg:flex items-center justify-center space-x-6">
                        {navItems.map((item) => (
                            <div
                                key={item.name}
                                className="relative group"
                                onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <a
                                    href={item.href}
                                    className="flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors py-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick(item.href);
                                    }}
                                >
                                    {item.name}
                                    {item.dropdown && <ChevronDown className="w-4 h-4" />}
                                </a>

                                {/* Dropdown Menu */}
                                {item.dropdown && activeDropdown === item.name && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-2 overflow-hidden"
                                    >
                                        {item.dropdown.map((dropItem) => (
                                            <a
                                                key={dropItem.name}
                                                href={dropItem.href}
                                                className="block px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white rounded-lg transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleNavClick(dropItem.href);
                                                    const category = dropItem.name.toLowerCase();
                                                    if (['hardware', 'software', 'integration'].includes(category)) {
                                                        setTimeout(() => {
                                                            window.dispatchEvent(new CustomEvent('filter-category', { detail: category }));
                                                        }, 100);
                                                    }
                                                }}
                                            >
                                                {dropItem.name}
                                            </a>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4 z-20">
                        {/* Search Bar - Hidden on small screens, shown on large */}
                        <div className="hidden xl:block w-[250px]">
                            <PlaceholdersAndVanishInput
                                placeholders={placeholders}
                                onChange={handleSearchChange}
                                onSubmit={handleSearchSubmit}
                            />
                        </div>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-neutral-700" />}
                        </button>

                        {isAuthenticated && (
                            <NavbarButton variant="secondary" onClick={handleLogout} className="text-xs">
                                Sign Out
                            </NavbarButton>
                        )}


                    </div>
                </NavBody>

                {/* Mobile Navigation */}
                <MobileNav>
                    <MobileNavHeader>
                        <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }} className="font-bold text-lg text-black dark:text-white">
                            RNS INNOBOTICS
                        </a>
                        <MobileNavToggle
                            isOpen={isOpen}
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle mobile menu"
                        />
                    </MobileNavHeader>

                    <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
                        <div className="flex flex-col gap-4 w-full">
                            {navItems.map((item, idx) => (
                                <div key={idx} className="w-full">
                                    <div className="flex items-center justify-between w-full">
                                        <a
                                            href={item.href}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (!item.dropdown) handleNavClick(item.href);
                                            }}
                                            className="text-lg font-medium text-neutral-800 dark:text-neutral-200"
                                        >
                                            {item.name}
                                        </a>
                                    </div>

                                    {/* Mobile Submenu */}
                                    {item.dropdown && (
                                        <div className="pl-4 mt-2 flex flex-col gap-2 border-l-2 border-neutral-100 dark:border-neutral-800">
                                            {item.dropdown.map((dropItem, dIdx) => (
                                                <a
                                                    key={dIdx}
                                                    href={dropItem.href}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleNavClick(dropItem.href);
                                                    }}
                                                    className="text-sm text-neutral-500 dark:text-neutral-400 py-1"
                                                >
                                                    {dropItem.name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="border-t border-neutral-200 dark:border-neutral-800 my-2 pt-4 flex flex-col gap-4">
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300"
                                >
                                    {theme === 'dark' ? (
                                        <>
                                            <Sun size={18} /> Light Mode
                                        </>
                                    ) : (
                                        <>
                                            <Moon size={18} /> Dark Mode
                                        </>
                                    )}
                                </button>

                                {isAuthenticated && (
                                    <NavbarButton onClick={handleLogout} variant="secondary" className="w-full justify-center">
                                        Sign Out ({user?.name})
                                    </NavbarButton>
                                )}
                            </div>
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </div>
    );
};

export default Header;
