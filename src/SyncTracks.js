import { get_most_recent_track, get_most_recent_track_with_date } from './FetchData.js'
import { getRecentTracks } from './LastFmAPI.js'
import { insert_tracks } from './SupabaseWrapper.js'

export async function sync_tracks(){
    // get most recent tracks
    const most_recent_track = await get_most_recent_track()
    const most_recent_track_with_date = await get_most_recent_track_with_date()

    // get lastFM data
    const starting_epoch_time = most_recent_track.at(0)?.date ?? most_recent_track_with_date.at(0)?.date ?? 0
    
    let recent_tracks = await getRecentTracks(starting_epoch_time)
    let insertable_tracks = get_insertable_tracks(recent_tracks, starting_epoch_time)

    // persist data
    insert_tracks(insertable_tracks)
    // sleep / terminate
}

const get_insertable_tracks = (tracks, starting_epoch_time) => {
    if (starting_epoch_time == null) {
        starting_epoch_time = 0
    }

    let filtered = tracks
    .filter((track) => Number(track.date.uts) > starting_epoch_time)
    return filtered
    .map((track) => {
        return {
            "artist": track.artist["#text"],
            "album": track.album["#text"],
            "name": track.name,
            "date": Number(track.date.uts),
            "album_art_url": track.image[0]["#text"],
        }
    })
}