window.diveSupabase = window.supabase.createClient(
    window.DIVE_SUPABASE_URL,
    window.DIVE_SUPABASE_PUBLISHABLE_KEY
);

console.log("DIVE Supabase connection initialized");