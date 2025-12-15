import { supabase } from '../lib/supabase';

export const projectsAPI = {
    getFeatured: async (limit = 6) => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching featured projects:', error);
            return [];
        }
    },
    getAll: async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching all projects:', error);
            return [];
        }
    },
    getProjectById: async (id) => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching project details:', error);
            return null;
        }
    }
};

export const ordersAPI = {
    async createOrder(orderData) {
        try {
            // Generate ID client-side if DB doesn't have default
            const payload = {
                id: crypto.randomUUID(),
                ...orderData
            };

            const { error } = await supabase
                .from('orders')
                .insert([payload]);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error creating order:', error);
            return { success: false, error };
        }
    },

    async uploadFile(file) {
        try {
            const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            // await supabase.storage.createBucket('customer-files', { public: true }).catch(() => {});
            const { data, error } = await supabase.storage
                .from('customer-files')
                .upload(fileName, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('customer-files')
                .getPublicUrl(fileName);

            return { success: true, publicUrl };
        } catch (error) {
            console.error('Error uploading file:', error);
            // Check for RLS error specifically
            if (error.message && error.message.includes('row-level security')) {
                return { success: false, error: 'Permission denied: Please ensure RLS policies are set for "customer-files" bucket.' };
            }
            return { success: false, error: error.message || error };
        }
    },

    async sendOrderEmail(orderDetails) {
        try {
            const { data, error } = await supabase.functions.invoke('send-order-email', {
                body: {
                    orderDetails: orderDetails,
                    userEmail: orderDetails.user_email,
                    userName: orderDetails.customer_name
                },
            });
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error sending email:', error);
            // Don't block the UI if email fails
            return { success: false, error };
        }
    }
};
