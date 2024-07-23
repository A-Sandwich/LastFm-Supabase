import { get_most_recent_track, get_most_recent_track_with_date } from './FetchData.js'
import { getRecentTracks, get_all_tracks } from './LastFmAPI.js'
import { insert_tracks } from './SupabaseWrapper.js'

export const sync_historical_data = async () => {
    // get most recent tracks
    const all_tracks = await get_all_tracks()
    
    // persist data
    let insertable_tracks = get_insertable_tracks(all_tracks)
    insert_tracks(insertable_tracks)
    // sleep / terminate
}
