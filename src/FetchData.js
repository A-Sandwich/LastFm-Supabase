import { create_supabase_client } from './SupabaseWrapper.js'

export const get_most_recent_track = async () => {
    const supabase = create_supabase_client()
    const { data, error } = await supabase
    .from('Tracks')
    .select('date')
    .order('id', {ascending: false})
    .limit(1)
    if (error) {
        console.log("🙃", error);
        return null;
    }
    return data;
}

export const get_most_recent_track_with_date = async () => {
    const supabase = create_supabase_client()
    const { data, error } = await supabase
    .from('Tracks')
    .select('date')
    .order('id', {ascending: false})
    .not('date', 'is', null)
    .limit(1)
    if (error) {
        console.log("🙃", error);
        return null;
    }
    return data;
}