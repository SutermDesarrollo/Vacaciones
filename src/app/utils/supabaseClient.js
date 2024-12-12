import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eiunmwvhvmmmrqyiktsx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdW5td3Zodm1tbXJxeWlrdHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NjAzMTEsImV4cCI6MjA0OTQzNjMxMX0.ZwjqmgeIcoJzU_5Gz36ZvAkujek1Nc1fszDoAQbRnp0";

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
