import { createClient } from '@supabase/supabase-js';

// Supplied at build time. There is deliberately no hardcoded fallback: an earlier
// fallback pointed at a Supabase project that no longer exists, and because the
// `||` chain always produced a value the guard below could never fire, so a build
// with missing env vars shipped silently against a dead backend.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase environment variables: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY at build time.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
