import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { ordersAPI } from '../utils/api';
import { supabase } from '../lib/supabase';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
    supabase: {
        from: vi.fn(),
        storage: { from: vi.fn() }
    }
}));

// Component to test XSS rendering
const DisplayUserInput = ({ content }) => {
    return <div data-testid="user-content">{content}</div>;
};

describe('Security Checks', () => {

    describe('XSS Prevention', () => {
        it('should escape malicious script tags in rendered output', () => {
            const maliciousInput = '<script>alert("XSS")</script>';
            render(<DisplayUserInput content={maliciousInput} />);

            const element = screen.getByTestId('user-content');
            // React should render the string literally, NOT execute it.
            // verifying innerHTML is escaped
            expect(element.innerHTML).toContain('&lt;script&gt;alert("XSS")&lt;/script&gt;');
            // OR checks text content matches input (meaning it was treated as text)
            expect(element.textContent).toBe(maliciousInput);
        });

        it('should escape image onerror events', () => {
            const maliciousInput = '<img src="x" onerror="alert(1)">';
            render(<DisplayUserInput content={maliciousInput} />);
            const element = screen.getByTestId('user-content');
            expect(element.textContent).toBe(maliciousInput);
            expect(screen.queryByAltText('x')).not.toBeInTheDocument(); // Tag should not be parsed as HTML
        });
    });

    describe('SQL Injection Prevention (Client Side)', () => {
        it('should pass inputs as parameterized objects to Supabase, not concatenated strings', async () => {
            // This test verifies that we are following the correct pattern of using the ORM 
            // instead of constructing raw SQL strings which would be vulnerable.
            const maliciousPayload = "'; DROP TABLE orders; --";
            const orderData = {
                customer_name: maliciousPayload,
                status: 'pending'
            };

            const insertMock = vi.fn().mockResolvedValue({ error: null });
            supabase.from.mockReturnValue({
                insert: insertMock
            });

            await ordersAPI.createOrder(orderData);

            // Verify that the payload is passed AS IS to the library. 
            // The library (supabase-js) is responsible for parameterization.
            // If we were concatenating, we might see calls like .query("INSERT ... " + name)
            expect(insertMock).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({
                    customer_name: maliciousPayload
                })
            ]));
        });
    });

    describe('Environment Security', () => {
        it('should not leak service role keys in frontend', () => {
            // Check if process.env or import.meta.env has any suspicious keys loaded in the test environment
            const envKeys = Object.keys(import.meta.env || {});
            const hasServiceKey = envKeys.some(key => key.toLowerCase().includes('service_role'));
            expect(hasServiceKey).toBe(false);
        });
    });
});
