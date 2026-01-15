const rawSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const rawSupabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const missingSupabaseConfig = !rawSupabaseUrl || !rawSupabaseAnonKey;

if (missingSupabaseConfig) {
  console.warn(
    'Supabase env vars missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

export const supabaseUrl = rawSupabaseUrl || 'https://placeholder.supabase.co';
export const supabaseAnonKey = rawSupabaseAnonKey || 'public-anon-key';