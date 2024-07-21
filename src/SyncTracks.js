import { get_most_recent_track, get_most_recent_track_with_date } from './FetchData.js'
import { getRecentTracks } from './LastFmAPI.js'

export async function sync_tracks(){
    // get most recent tracks
    const most_recent_track = get_most_recent_track()
    const most_recent_track_with_date = get_most_recent_track_with_date()

    // get lastFM data
    let starting_epoch_time = null
    if (most_recent_track && most_recent_track.date) {
        starting_epoch_time = most_recent_track.created_at
    } else if (most_recent_track_with_date && most_recent_track_with_date) {
        starting_epoch_time = most_recent_track_with_date.date
    }

    let recent_tracks = await getRecentTracks(starting_epoch_time)
    console.log("🚨", recent_tracks)

    // parse difference

    // persist data

    // sleep / terminate
}