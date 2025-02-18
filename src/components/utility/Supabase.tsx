import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.APP_REACT_APP_SUPABASE_URL,
  import.meta.env.APP_REACT_APP_SUPABASE_ANON_KEY
);

export default supabase;

// ✅ READ DATA
export const fetchData = async (table: string) => {
    const { data, error } = await supabase.from(table).select("*");
    if (error) throw new Error(error.message);
    return data;
};

// ✅ ADD DATA
export const addData = async (table: string, newData: any) => {
    const { data, error } = await supabase.from(table).insert(newData).select();
    if (error) throw new Error(error.message);
    return data;
};

// ✅ UPDATE DATA
export const updateData = async (table: string, id: string, updatedData: any) => {
    const { data, error } = await supabase.from(table).update(updatedData).eq("id", id).select();
    if (error) throw new Error(error.message);
    return data;
};

// ✅ DELETE DATA
export const deleteData = async (table: string, id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw new Error(error.message);
};
