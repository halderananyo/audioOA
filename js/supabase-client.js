/*
  SUPABASE CONNECTION
  --------------------
  This is the only file that needs your project's URL and key.
  Both values are safe to have visible in a public website's code —
  they only grant the access you configured with table permissions
  (Row Level Security policies) in the Supabase dashboard.
*/
const SUPABASE_URL = "https://xmxrobadstnfldhojlgg.supabase.co";
const SUPABASE_KEY = "sb_publishable_5lvCeVjExlY-nPa9IcQs6w_QyUpTkcC";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
