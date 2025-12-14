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
