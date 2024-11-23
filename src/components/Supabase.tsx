import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.APP_REACT_APP_SUPABASE_URL,
  import.meta.env.APP_REACT_APP_SUPABASE_ANON_KEY
);

export default supabase;
