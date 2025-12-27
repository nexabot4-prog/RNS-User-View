import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { projectsAPI, ordersAPI, reviewsAPI } from '../utils/api';
import { supabase } from '../lib/supabase';

// Mock Supabase Client
vi.mock('../lib/supabase', () => ({
    supabase: {
        from: vi.fn(),
        storage: {
            from: vi.fn()
        },
        functions: {
            invoke: vi.fn()
        }
    }
}));

describe('Service Layer / API Tests', () => {
    // Console error spy to suppress noise and verify error logging
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    beforeEach(() => {
        vi.clearAllMocks();
        consoleErrorSpy.mockClear();
    });

    afterEach(() => {
        // consoleErrorSpy.mockRestore(); // Keep mocked to avoid noise in test output
    });

    describe('Supabase Fetch API (projectsAPI)', () => {
        it('should fetch all projects successfully', async () => {
            const mockData = [{ id: 1, title: 'Project 1' }];
            // Mock chain: from -> select -> order -> data
            const selectMock = vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: mockData, error: null })
            });
            supabase.from.mockReturnValue({
                select: selectMock
            });

            const result = await projectsAPI.getAll();

            expect(supabase.from).toHaveBeenCalledWith('projects');
            expect(result).toEqual(mockData);
        });

        it('should handle fetch errors gracefully', async () => {
            // Mock error
            const selectMock = vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Network error' } })
            });
            supabase.from.mockReturnValue({
                select: selectMock
            });

            const result = await projectsAPI.getAll();

            expect(result).toEqual([]); // Should return empty array on failure
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching all projects:', expect.objectContaining({ message: 'Network error' }));
        });
    });

    describe('Supabase Insert API (ordersAPI)', () => {
        it('should create an order successfully', async () => {
            const orderData = { id: '123', total: 100 };

            // Mock insert success
            const insertMock = vi.fn().mockResolvedValue({ error: null });
            supabase.from.mockReturnValue({
                insert: insertMock
            });

            const result = await ordersAPI.createOrder(orderData);

            expect(supabase.from).toHaveBeenCalledWith('orders');
            expect(insertMock).toHaveBeenCalled();
            expect(result).toEqual({ success: true });
        });

        it('should handle insert errors', async () => {
            // Mock insert failure
            const insertMock = vi.fn().mockResolvedValue({ error: { message: 'Insert failed' } });
            supabase.from.mockReturnValue({
                insert: insertMock
            });

            const result = await ordersAPI.createOrder({ id: '123' });

            expect(result.success).toBe(false);
            expect(result.error).toEqual({ message: 'Insert failed' });
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating order:', expect.objectContaining({ message: 'Insert failed' }));
        });
    });

    describe('Email API (Resend via Edge Function)', () => {
        it('should send email successfully via function invoke', async () => {
            // Mock successful invoke
            supabase.functions.invoke.mockResolvedValue({ data: { message: 'Sent' }, error: null });

            const result = await ordersAPI.sendOrderEmail({ id: '123', user_email: 'test@example.com' });

            expect(supabase.functions.invoke).toHaveBeenCalledWith('send-order-email', expect.any(Object));
            expect(result).toEqual({ success: true, data: { message: 'Sent' } });
        });

        it('should handle email sending errors', async () => {
            // Mock failed invoke
            supabase.functions.invoke.mockResolvedValue({ data: null, error: { message: 'Function error' } });

            const result = await ordersAPI.sendOrderEmail({ id: '123' });

            expect(result.success).toBe(false);
            expect(result.error).toEqual({ message: 'Function error' });
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending email:', expect.objectContaining({ message: 'Function error' }));
        });
    });
});
