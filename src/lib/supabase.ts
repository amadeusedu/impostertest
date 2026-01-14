import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseUrl } from '../config/supabase';
import { createSecureStoreAdapter } from './secureStoreAdapter';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createSecureStoreAdapter(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
