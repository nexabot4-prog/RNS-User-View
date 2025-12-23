import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Hero from '../Hero';

// 1. Mock heavy/animated components
vi.mock('../SplineRobot', () => ({
    default: () => <div data-testid="mock-spline-robot" />
}));

vi.mock('@/components/ui/background-beams', () => ({
    BackgroundBeams: () => <div data-testid="mock-background-beams" />
}));

vi.mock('@/components/ui/typewriter-effect', () => ({
    TypewriterEffectSmooth: ({ words }) => (
        <div data-testid="mock-typewriter">
            {words.map(w => w.text).join('')}
        </div>
    )
}));

vi.mock('@/components/ui/hover-border-gradient', () => ({
    HoverBorderGradient: ({ children, onClick, className }) => (
        <button onClick={onClick} className={className} type="button">
            {children}
        </button>
    )
}));

// 2. Mock Framer Motion to avoid animation delays
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }) => <div className={className} {...props}>{children}</div>,
        p: ({ children, className, ...props }) => <p className={className} {...props}>{children}</p>,
    }
}));

describe('Hero Component', () => {
    // Setup scrollIntoView mock for JSDOM
    beforeAll(() => {
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
    });

    it('renders without crashing', () => {
        render(<Hero />);
        // Implicitly passes if render doesn't throw
    });

    it('renders main text content via mocked typewriter', () => {
        render(<Hero />);
        // Words1: "Build the Future, One"
        expect(screen.getByText(/Build/i)).toBeInTheDocument();
        // "Project" appears in title and description, so strictly check for existence
        const projectTexts = screen.getAllByText(/Project/i);
        expect(projectTexts.length).toBeGreaterThan(0);
    });

    it('renders the description paragraph', () => {
        render(<Hero />);
        // Matching a substantial part of the description
        expect(screen.getByText(/End-to-end Arduino, IoT, and Robotics projects/i)).toBeInTheDocument();
    });

    it('renders "Explore Projects" button and is clickable', () => {
        render(<Hero />);
        const button = screen.getByText(/Explore Projects/i).closest('button');
        expect(button).toBeInTheDocument();

        // Mock the target section for scroll logic
        const projectSection = document.createElement('div');
        projectSection.id = 'projects';
        document.body.appendChild(projectSection);
        const scrollSpy = vi.spyOn(projectSection, 'scrollIntoView');

        fireEvent.click(button);

        expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' });

        // Cleanup
        document.body.removeChild(projectSection);
    });

    it('renders "Get in Touch" button', () => {
        render(<Hero />);
        const button = screen.getByRole('button', { name: /Get in Touch/i });
        expect(button).toBeInTheDocument();
    });

    it('mocks background visuals correctly', () => {
        render(<Hero />);
        expect(screen.getByTestId('mock-background-beams')).toBeInTheDocument();
    });
});
