import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Hero from '../Hero';

// 1. Mock heavy/animated components


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

    it('renders main text content via mocked typewriter', async () => {
        render(<Hero />);
        // Words1: "Build the Future, One"
        // Since TypewriterEffectSmooth is lazy loaded, we must await its appearance
        expect(await screen.findByText(/Build/i)).toBeInTheDocument();

        // "Project" appears in title and description, so strictly check for existence
        // findAllByText handles multiple occurrences
        const projectTexts = await screen.findAllByText(/Project/i);
        expect(projectTexts.length).toBeGreaterThan(0);
    });

    it('renders the description paragraph', async () => {
        render(<Hero />);
        // Matching a substantial part of the description
        expect(await screen.findByText(/End-to-end Arduino, IoT, and Robotics projects/i)).toBeInTheDocument();
    });

    it('renders "Buy Now" button and is clickable', async () => {
        render(<Hero />);
        // Wait for lazy loaded button
        const span = await screen.findByText(/Buy Now/i);
        const button = span.closest('button');
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

    it('renders "New Start – New Request" button', async () => {
        render(<Hero />);
        // Use findBy for lazy loaded components if needed, or getByText content
        // ShimmerButton renders the text.
        const button = await screen.findByText(/New Start – New Request/i);
        expect(button).toBeInTheDocument();
    });

    it('mocks background visuals correctly', async () => {
        render(<Hero />);
        // BackgroundBeams is lazy loaded and inside Suspense
        expect(await screen.findByTestId('mock-background-beams')).toBeInTheDocument();
    });
});
