export function getSupabaseEnv() {
  return {
    url: import.meta.env.VITE_SUPABASE_URL?.trim() ?? "",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ""
  };
}

export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseEnv();
  return url.length > 0 && anonKey.length > 0;
}
