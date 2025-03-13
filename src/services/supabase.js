import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oxqkngqcryotdkqcdnix.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94cWtuZ3FjcnlvdGRrcWNkbml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY0MjQwMDIsImV4cCI6MjAxMTk5NjAwMn0.0Qw0ZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export const fetchData = async (table) => {
  const { data, error } = await supabase.from(table).select('*');
  if (error) throw error;
  return data;
};

export const insertData = async (table, data) => {
  const { error } = await supabase.from(table).insert(data);
  if (error) throw error;
};

export const updateData = async (table, id, data) => {
  const { error } = await supabase.from(table).update(data).eq('id', id);
  if (error) throw error;
};

export const deleteData = async (table, id) => {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
};

export default supabase;
