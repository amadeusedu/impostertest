const rawSupabaseUrl = process.env.https://gdretwuorshlcgwpxzkr.supabase.co ?? '';
const rawSupabaseAnonKey = process.env.sb_publishable_QHRQlKwoPFevLmEzh7OG_g_oaIPIaop ?? '';

export const missingSupabaseConfig = !rawSupabaseUrl || !rawSupabaseAnonKey;

if (missingSupabaseConfig) {
  console.warn(
    'Supabase env vars missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

export const supabaseUrl = rawSupabaseUrl || 'https://placeholder.supabase.co';
export const supabaseAnonKey = rawSupabaseAnonKey || 'public-anon-key';
