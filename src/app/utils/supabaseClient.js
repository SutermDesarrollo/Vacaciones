import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ykrlfoqbghvresvjzqqg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrcmxmb3FiZ2h2cmVzdmp6cXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMzY4OTMsImV4cCI6MjA0OTYxMjg5M30.WQOW3LqmCnLGYh4PtlBSz1OYgctTQx-SpD9FV4AEOYg";

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
