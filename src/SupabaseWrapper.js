import { createClient } from '@supabase/supabase-js'

const supabase_url = process.env.supabase_url;
const default_service_role_key = process.env.default_service_role_key;

export  function CreateSupabaseClient(url, service_role_key) {
    if (url == null) {
        url = supabase_url
    }
    if (service_role_key == null) {
        service_role_key = default_service_role_key
    }

    return createClient(url, service_role_key, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
    })
}