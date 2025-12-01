import { createClient } from "@supabase/supabase-js";

// This tells Vite to read the variables you just put in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Safety check: warns you in the console if keys are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase Environment Variables! Check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
