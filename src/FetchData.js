import { CreateSupabaseClient } from './SupabaseWrapper.js'

export const get_most_recent_track = async () => {
    const supabase = CreateSupabaseClient()
    const { data, error } = await supabase
    .from('Tracks')
    .select('artist')
    .order('created_at', {ascending: false})
    .limit(1)
    if (error) {
        console.log("🙃", error);
        return null;
    }
    return data;
}

export const get_most_recent_track_with_date = async () => {
    const supabase = CreateSupabaseClient()
    const { data, error } = await supabase
    .from('Tracks')
    .select('artist')
    .order('created_at', {ascending: false})
    .neq('date', null)
    .limit(1)
    if (error) {
        console.log("🙃", error);
        return null;
    }
    return data;
}