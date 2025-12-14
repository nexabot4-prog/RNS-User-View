import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Zap, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './Toast';
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

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
                { name: 'Robotics Kits', href: '#projects' },
                { name: 'IoT Systems', href: '#projects' },
                { name: 'Arduino Bundles', href: '#projects' }
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

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`} role="navigation">
            <div className="navbar-container">
                {/* Logo Section */}
                <div className="navbar-logo">
                    <a href="#home" className="logo-link" onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}>
                        <span
                            className="brand-logo-text font-bold text-xl"
                            style={{
                                color: theme === 'dark' ? '#FFFFFF' : '#000000',
                                background: 'none',
                                WebkitTextFillColor: 'initial'
                            }}
                        >
                            RNS INNOBOTICS
                        </span>
                    </a>
                </div>

                {/* Desktop Navigation */}
                <div className="navbar-menu">
                    {navItems.map((item) => (
                        <div
                            key={item.name}
                            className="navbar-item"
                            onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <a
                                href={item.href}
                                className="navbar-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavClick(item.href);
                                }}
                                aria-haspopup={item.dropdown ? 'true' : 'false'}
                                aria-expanded={activeDropdown === item.name}
                            >
                                {item.name}
                                {item.dropdown && <ChevronDown className="dropdown-icon" />}
                            </a>

                            {/* Dropdown Menu */}
                            {item.dropdown && (
                                <div className="dropdown-menu">
                                    {item.dropdown.map((dropItem) => (
                                        <a
                                            key={dropItem.name}
                                            href={dropItem.href}
                                            className="dropdown-link"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleNavClick(dropItem.href);
                                            }}
                                        >
                                            {dropItem.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Navbar Search - Visible on Large Screens */}
                <div className="hidden xl:block w-[300px] mx-4">
                    <PlaceholdersAndVanishInput
                        placeholders={placeholders}
                        onChange={handleSearchChange}
                        onSubmit={handleSearchSubmit}
                    />
                </div>

                {/* Action Buttons */}
                <div className="navbar-actions">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-700" />}
                    </button>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <span className="text-gray-300 text-sm hidden lg:block">Hi, {user?.name}</span>
                            <button onClick={handleLogout} className="btn-secondary">
                                Sign Out
                            </button>
                        </div>
                    ) : null}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isOpen}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isOpen ? 'mobile-menu-open' : ''}`}>
                <div className="mobile-menu-content">
                    {navItems.map((item) => (
                        <div key={item.name} className="mobile-menu-item">
                            <a
                                href={item.href}
                                className="mobile-menu-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!item.dropdown) handleNavClick(item.href);
                                }}
                            >
                                {item.name}
                            </a>
                            {item.dropdown && (
                                <div className="mobile-dropdown">
                                    {item.dropdown.map((dropItem) => (
                                        <a
                                            key={dropItem.name}
                                            href={dropItem.href}
                                            className="mobile-dropdown-link"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleNavClick(dropItem.href);
                                            }}
                                        >
                                            {dropItem.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Mobile Actions */}
                    <div className="mobile-actions">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-2 p-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-4"
                        >
                            {theme === 'dark' ? (
                                <>
                                    <Sun size={20} className="text-yellow-500" />
                                    <span className="text-gray-200">Light Mode</span>
                                </>
                            ) : (
                                <>
                                    <Moon size={20} className="text-gray-700" />
                                    <span className="text-gray-700">Dark Mode</span>
                                </>
                            )}
                        </button>
                        {isAuthenticated ? (
                            <button onClick={handleLogout} className="btn-secondary-mobile w-full">
                                Sign Out ({user?.name})
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
